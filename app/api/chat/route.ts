import OpenAI from "openai";
import { NextRequest } from "next/server";
import menuData from "@/content/menu.json";
import infoData from "@/content/info.json";

function getClient() {
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

/* ── Mapeamento de locale para nome da língua ────── */
const langNames: Record<string, string> = {
  pt: "Português (PT-PT)",
  en: "English",
  es: "Español",
  fr: "Français",
  it: "Italiano",
  de: "Deutsch",
};

/* ── Construir contexto do restaurante a partir dos JSON ── */
function buildRestaurantContext(): string {
  const info = infoData as Record<string, unknown>;
  const menu = menuData as Record<string, unknown>;

  // Horarios
  const horario = info.horario as Record<string, unknown>;
  const diasSemana = ["segunda", "terca", "quarta", "quinta", "sexta", "sabado", "domingo"];
  const diasDisplay = ["Segunda", "Terca", "Quarta", "Quinta", "Sexta", "Sabado", "Domingo"];
  const notas = (horario._notas ?? {}) as Record<string, string>;
  const horarioStr = diasSemana
    .map((d, i) => {
      const slots = horario[d] as Array<{ abre: string; fecha: string }>;
      if (!slots || slots.length === 0) return `  ${diasDisplay[i]}: Encerrado`;
      const s = slots.map((sl) => `${sl.abre}-${sl.fecha}`).join(" e ");
      const nota = notas[d] ? ` (${notas[d]})` : "";
      return `  ${diasDisplay[i]}: ${s}${nota}`;
    })
    .join("\n");

  // Menu — versao compacta (nomes PT + precos)
  const categorias = (menu.categorias ?? []) as Array<{
    nome: Record<string, string>;
    nota?: Record<string, string>;
    itens: Array<{ nome: Record<string, string>; preco: number }>;
  }>;
  const menuStr = categorias
    .map((cat) => {
      const header = cat.nome.pt;
      const nota = cat.nota?.pt ? ` (${cat.nota.pt})` : "";
      const items = cat.itens
        .map((it) => `  - ${it.nome.pt}: ${it.preco.toFixed(2)}€`)
        .join("\n");
      return `${header}${nota}:\n${items}`;
    })
    .join("\n\n");

  // Vinhos
  const vinhos = (menu.vinhos ?? []) as Array<{
    nome: Record<string, string>;
    itens: Array<{ nome: string; regiao: string | null; preco: number }>;
  }>;
  const vinhosStr = vinhos
    .map((cat) => {
      const items = cat.itens
        .map((v) => `  - ${v.nome}${v.regiao ? ` (${v.regiao})` : ""}: ${v.preco.toFixed(2)}€`)
        .join("\n");
      return `${cat.nome.pt}:\n${items}`;
    })
    .join("\n\n");

  const loc = info.localizacao as Record<string, unknown>;
  const contactos = info.contactos as Record<string, unknown>;
  const servicos = info.servicos as Record<string, unknown>;

  return `
RESTAURANTE: ${info.nome}
TIPO: ${info.tipo}

CONTACTO:
  Telefone: ${(contactos.telefoneDisplay as string) ?? ""}
  Facebook: ${(contactos.redesSociais as Record<string, unknown>)?.facebook ?? "N/A"}

MORADA: ${(loc.moradaCompleta as string) ?? ""}
REGIAO: Algarve, Portugal
GOOGLE MAPS: ${(loc.googleMapsUrl as string) ?? ""}

SERVICOS: Comer no local: ${servicos.comerNoLocal ? "Sim" : "Nao"} | Takeaway: ${servicos.takeaway ? "Sim" : "Nao"} | Entrega: ${servicos.entrega ? "Sim" : "Nao"}

HORARIO:
${horarioStr}

EMENTA:
${menuStr}

CARTA DE VINHOS:
${vinhosStr}

NOTA LEGAL: ${(menu.notaLegal as Record<string, string>)?.pt ?? ""}
`.trim();
}

/* ── System prompt ────────────────────────────────── */
function buildSystemPrompt(locale: string): string {
  const lang = langNames[locale] ?? langNames.pt;
  const ctx = buildRestaurantContext();

  return `Tu es a assistente virtual da Casa de Pasto Fernanda e Campinas, um restaurante de cozinha tradicional portuguesa no Algarve (Vila Nova de Cacela).

PERSONALIDADE:
- Simpatica, calorosa e acolhedora, como quem recebe em casa
- Conhecedora da cozinha algarvia e portuguesa
- Respostas curtas e naturais (maximo 2-3 frases), como uma conversa real
- Podes recomendar pratos, explicar como sao confeccionados, falar de ingredientes, alergenos, precos, horarios, como chegar
- Se te perguntarem algo fora do ambito do restaurante, redireciona gentilmente

LINGUA: Responde SEMPRE em ${lang}. Se o cliente escrever noutra lingua, responde nessa lingua.

DADOS DO RESTAURANTE:
${ctx}

REGRAS:
- Nunca inventes informacao que nao esteja nos dados acima
- Se nao souberes algo, diz que nao tens essa informacao e sugere ligar para o restaurante
- Precos sao em euros (€) e incluem IVA
- As especialidades da Mae Fernanda precisam de reserva previa — menciona isto se relevante
- Grelhados sao no carvao — destaca isto como diferencial
- Os vinhos da carta sao maioritariamente do Alentejo e Algarve`;
}

/* ── POST handler ─────────────────────────────────── */
export async function POST(req: NextRequest) {
  if (!process.env.OPENAI_API_KEY) {
    return new Response(
      JSON.stringify({ error: "API key not configured" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const { message, locale, history } = (await req.json()) as {
      message: string;
      locale: string;
      history: Array<{ role: "user" | "assistant"; content: string }>;
    };

    if (!message?.trim()) {
      return new Response(
        JSON.stringify({ error: "Message is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const messages: OpenAI.ChatCompletionMessageParam[] = [
      { role: "system", content: buildSystemPrompt(locale || "pt") },
      ...history.slice(-20).map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
      { role: "user", content: message },
    ];

    const stream = await getClient().chat.completions.create({
      model: "gpt-4o-mini",
      max_tokens: 300,
      messages,
      stream: true,
    });

    // Streaming via ReadableStream
    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const text = chunk.choices[0]?.delta?.content;
            if (text) {
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ text })}\n\n`)
              );
            }
          }
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } catch {
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ error: "Stream error" })}\n\n`
            )
          );
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch {
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
