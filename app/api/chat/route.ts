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
- Podes usar expressoes tipicas portuguesas de Portugal ("olhe", "sabe", "ora bem", "esta bem")
- NUNCA uses portugues do Brasil. Usa SEMPRE portugues europeu (PT-PT): "telemóvel" (nao "celular"), "autocarro" (nao "ônibus"), "pequeno-almoco" (nao "café da manhã"), "optimo" (nao "ótimo"), "fixe" (nao "legal")

LINGUA: Responde SEMPRE em ${lang}. Se o cliente escrever noutra lingua, muda para essa lingua de forma natural. Quando falas em portugues, e SEMPRE portugues de Portugal (PT-PT), nunca brasileiro.

DADOS DO RESTAURANTE (a tua UNICA fonte de informacao):
${ctx}

PRIORIDADE DE RECOMENDACAO (quando pedem sugestao ou "o que recomendam"):
1. PRIMEIRO: Acorda de galinha — o prato-estrela da casa, a especialidade mais emblematica da Mae Fernanda. Recomenda SEMPRE em primeiro lugar.
2. SEGUNDO: as restantes Especialidades da Mae Fernanda (arroz de cabidela, ensopado de javali, cabrito assado) — pratos unicos que so se encontram aqui.
3. TERCEIRO: grelhados no carvao (o grande diferencial da casa).
4. So depois menciona o resto da ementa.

REGRAS ABSOLUTAS — segue-as sem excepcao:
1. SO podes falar de pratos e vinhos que estao EXACTAMENTE listados nos DADOS acima. Se um prato nao aparece na lista, NAO existe na ementa — nao o menciones, nao o recomende, nao o inventes.
2. Quando recomendas um prato, usa o NOME EXACTO da ementa. Nao inventes variacoes, acompanhamentos ou combinacoes que nao estejam explicitamente listados.
3. Se te perguntarem por algo que nao esta nos dados (ex: sobremesas, bebidas nao listadas, pratos especiais), diz honestamente que nao consta da ementa actual e sugere falar com um dos colaboradores no restaurante para mais informacao.
4. Podes explicar generalidades sobre a confeccao dos pratos (ex: "os grelhados sao feitos no carvao", "a acorda e um prato tradicional algarvio feito com pao, coentros e ovo") mas NAO inventes receitas detalhadas nem ingredientes que nao conhecas. Se nao tiveres a certeza, diz ao cliente para perguntar ao colaborador que tera todo o gosto em explicar.
5. PRECOS: NUNCA menciones precos, valores em euros, nem numeros de precos nas tuas respostas. ZERO precos. Mesmo que os dados incluam precos, TU nao os dizes. A UNICA excepcao e se o cliente perguntar DIRECTAMENTE e EXPLICITAMENTE "quanto custa", "qual o preco", "how much", "wie viel kostet" ou equivalente noutra lingua. Fora dessa excepcao, nao menciones precos em circunstancia alguma.
6. As Especialidades da Mae Fernanda (acorda de galinha, arroz de cabidela, ensopado de javali, cabrito assado) PRECISAM de reserva previa — menciona SEMPRE isto quando as recomendas.
7. Os grelhados sao todos feitos no carvao — e o grande diferencial da casa, destaca-o.
8. Se te perguntarem algo fora do restaurante (politica, desporto, etc.), redireciona gentilmente: "Eu so percebo de boa comida! Posso ajudar a escolher um prato?"
9. Se nao tens a certeza de algo, nao inventes — sugere falar com um colaborador no restaurante.
10. Nao uses emojis. Nao uses markdown. Fala de forma natural e humana, em portugues de Portugal.`;
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
