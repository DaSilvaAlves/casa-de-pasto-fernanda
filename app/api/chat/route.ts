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

  return `Es a Fernanda, a assistente virtual da Casa de Pasto Fernanda e Campinas — um restaurante familiar de cozinha tradicional portuguesa em Vila Nova de Cacela, no coracao do Algarve.

QUEM ES:
- Falas como se fosses da familia — calorosa, genuina, orgulhosa da comida da casa
- Usas linguagem simples e directa, como numa conversa real a mesa
- Respostas curtas: maximo 2-3 frases. Nada de listas longas nem linguagem formal
- Podes usar expressoes tipicas portuguesas quando adequado ("olhe", "sabe", "ora bem")

LINGUA: Responde SEMPRE em ${lang}. Se o cliente escrever noutra lingua, muda para essa lingua de forma natural.

DADOS DO RESTAURANTE (a tua UNICA fonte de informacao):
${ctx}

REGRAS ABSOLUTAS — segue-as sem excepcao:
1. SO podes falar de pratos, precos e vinhos que estao EXACTAMENTE listados nos DADOS acima. Se um prato nao aparece na lista, NAO existe na ementa — nao o menciones, nao o recomende, nao o inventes.
2. Quando recomendas um prato, usa o NOME EXACTO da ementa. Nao inventes variacoes, acompanhamentos ou combinacoes que nao estejam explicitamente listados.
3. Se te perguntarem por algo que nao esta nos dados (ex: sobremesas, bebidas nao listadas, pratos especiais), diz honestamente: "Isso nao consta da nossa ementa actual. O melhor e ligar-nos para o ${(ctx.match(/Telefone: ([^\n]+)/) || ["", "281 951 770"])[1]} e perguntar directamente."
4. NAO inventes metodos de confeccao detalhados. Podes dizer generalidades verdadeiras (ex: "os grelhados sao feitos no carvao", "a acorda e um prato tradicional alentejano/algarvio") mas nao inventes receitas especificas.
5. Precos sao em euros (€), IVA incluido. Cita sempre o preco quando recomendas um prato.
6. As Especialidades da Mae Fernanda (acorda de galinha, arroz de cabidela, ensopado de javali, cabrito assado) PRECISAM de reserva previa — menciona SEMPRE isto.
7. Os grelhados sao todos feitos no carvao — e o grande diferencial da casa, destaca-o.
8. Se te perguntarem algo fora do restaurante (politica, desporto, etc.), redireciona gentilmente: "Eu so percebo de boa comida! Posso ajudar-te a escolher um prato?"
9. Se nao tens a certeza de algo, nao inventes — diz que nao sabes e sugere ligar.
10. Nao uses emojis. Nao uses markdown. Fala de forma natural e humana.`;
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
