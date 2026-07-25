"use client";

import { useState, useRef, useEffect, useCallback, type KeyboardEvent } from "react";

/* ── Tipos ──────────────────────────────────────── */
interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatBotProps {
  locale: string;
}

/* ── Mapeamento de locales para Speech API ──────── */
const speechLocales: Record<string, string> = {
  pt: "pt-PT",
  en: "en-US",
  es: "es-ES",
  fr: "fr-FR",
  it: "it-IT",
  de: "de-DE",
};

/* ── Labels i18n minimos ────────────────────────── */
const labels: Record<string, { title: string; placeholder: string; greeting: string; error: string; close: string }> = {
  pt: { title: "Assistente", placeholder: "Escreva a sua mensagem...", greeting: "Ola! Sou a assistente da Casa de Pasto Fernanda. Em que posso ajudar?", error: "Desculpe, ocorreu um erro. Tente novamente.", close: "Fechar" },
  en: { title: "Assistant", placeholder: "Type your message...", greeting: "Hello! I'm the Casa de Pasto Fernanda assistant. How can I help?", error: "Sorry, an error occurred. Please try again.", close: "Close" },
  es: { title: "Asistente", placeholder: "Escriba su mensaje...", greeting: "Hola! Soy la asistente de Casa de Pasto Fernanda. En que puedo ayudarle?", error: "Disculpe, ocurrio un error. Intentelo de nuevo.", close: "Cerrar" },
  fr: { title: "Assistant", placeholder: "Ecrivez votre message...", greeting: "Bonjour! Je suis l'assistante de Casa de Pasto Fernanda. Comment puis-je vous aider?", error: "Desole, une erreur est survenue. Reessayez.", close: "Fermer" },
  it: { title: "Assistente", placeholder: "Scrivi il tuo messaggio...", greeting: "Ciao! Sono l'assistente della Casa de Pasto Fernanda. Come posso aiutarti?", error: "Mi dispiace, si e verificato un errore. Riprova.", close: "Chiudi" },
  de: { title: "Assistent", placeholder: "Schreiben Sie Ihre Nachricht...", greeting: "Hallo! Ich bin die Assistentin der Casa de Pasto Fernanda. Wie kann ich helfen?", error: "Entschuldigung, ein Fehler ist aufgetreten. Versuchen Sie es erneut.", close: "Schliessen" },
};

/* ── Chave localStorage ─────────────────────────── */
const STORAGE_KEY = "cpf-chat-history";

function loadHistory(): Message[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveHistory(msgs: Message[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(msgs.slice(-50)));
  } catch { /* quota exceeded — ignorar */ }
}

/* ── Componente principal ───────────────────────── */
export default function ChatBot({ locale }: ChatBotProps) {
  const l = labels[locale] ?? labels.pt;
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [listening, setListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Carregar historico do localStorage
  useEffect(() => {
    setMessages(loadHistory());
  }, []);

  // Persistir historico
  useEffect(() => {
    if (messages.length > 0) saveHistory(messages);
  }, [messages]);

  // Detectar suporte a Speech API
  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    setSpeechSupported(!!SR);
  }, []);

  // Scroll para o fim quando ha novas mensagens
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Focus no input quando abre
  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  /* ── TTS ────────────────────────────────────────── */
  const speak = useCallback(
    (text: string) => {
      if (!ttsEnabled || typeof window === "undefined" || !window.speechSynthesis) return;
      // Cancelar fala anterior
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = speechLocales[locale] ?? "pt-PT";
      utterance.rate = 1;
      utterance.pitch = 1;
      // Tentar encontrar voz adequada
      const voices = window.speechSynthesis.getVoices();
      const targetLang = speechLocales[locale] ?? "pt-PT";
      const voice = voices.find((v) => v.lang.startsWith(targetLang.split("-")[0]));
      if (voice) utterance.voice = voice;
      window.speechSynthesis.speak(utterance);
    },
    [locale, ttsEnabled]
  );

  /* ── Enviar mensagem ───────────────────────────── */
  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || loading) return;

      const userMsg: Message = { role: "user", content: trimmed };
      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setLoading(true);

      // Cancelar pedido anterior se existir
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const history = [...messages, userMsg].map(({ role, content }) => ({ role, content }));

        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: trimmed, locale, history: history.slice(-20) }),
          signal: controller.signal,
        });

        if (!res.ok) throw new Error("API error");

        const reader = res.body?.getReader();
        if (!reader) throw new Error("No reader");

        const decoder = new TextDecoder();
        let assistantContent = "";

        // Adicionar mensagem vazia do assistente para ir preenchendo
        setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n").filter((l) => l.startsWith("data: "));

          for (const line of lines) {
            const data = line.slice(6);
            if (data === "[DONE]") continue;
            try {
              const parsed = JSON.parse(data);
              if (parsed.text) {
                assistantContent += parsed.text;
                const content = assistantContent;
                setMessages((prev) => {
                  const updated = [...prev];
                  updated[updated.length - 1] = { role: "assistant", content };
                  return updated;
                });
              }
            } catch { /* ignorar linhas mal formadas */ }
          }
        }

        // TTS da resposta completa
        if (assistantContent) speak(assistantContent);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setMessages((prev) => [
          ...prev.filter((m) => m.content !== ""),
          { role: "assistant", content: l.error },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [loading, messages, locale, speak, l.error]
  );

  /* ── Speech-to-Text ────────────────────────────── */
  const toggleListening = useCallback(() => {
    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }

    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;

    const recognition = new SR();
    recognition.lang = speechLocales[locale] ?? "pt-PT";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.continuous = false;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0]?.[0]?.transcript;
      if (transcript) sendMessage(transcript);
      setListening(false);
    };

    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  }, [listening, locale, sendMessage]);

  /* ── Teclado ───────────────────────────────────── */
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  /* ── Render ────────────────────────────────────── */
  return (
    <>
      {/* Botao flutuante */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label={l.title}
          className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-transform hover:scale-110 active:scale-95"
          style={{ background: "var(--color-wine)", color: "var(--color-cream)" }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </button>
      )}

      {/* Painel de chat */}
      {open && (
        <div
          className="fixed z-50 flex flex-col overflow-hidden rounded-2xl shadow-2xl
            bottom-0 right-0 h-full w-full
            sm:bottom-6 sm:right-6 sm:h-[min(600px,85vh)] sm:w-[380px] sm:rounded-2xl"
          style={{
            background: "var(--color-bg-2)",
            border: "1px solid var(--color-line)",
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-4 py-3 shrink-0"
            style={{ background: "var(--color-surface)", borderBottom: "1px solid var(--color-line)" }}
          >
            <span className="font-semibold text-sm" style={{ color: "var(--color-gold)" }}>
              {l.title}
            </span>
            <div className="flex items-center gap-2">
              {/* Botao TTS on/off */}
              <button
                onClick={() => {
                  setTtsEnabled((v) => !v);
                  if (ttsEnabled) window.speechSynthesis?.cancel();
                }}
                aria-label={ttsEnabled ? "Mute" : "Unmute"}
                className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors"
                style={{ color: ttsEnabled ? "var(--color-gold)" : "var(--color-muted)" }}
              >
                {ttsEnabled ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                    <line x1="23" y1="9" x2="17" y2="15" />
                    <line x1="17" y1="9" x2="23" y2="15" />
                  </svg>
                )}
              </button>
              {/* Botao fechar */}
              <button
                onClick={() => setOpen(false)}
                aria-label={l.close}
                className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors"
                style={{ color: "var(--color-cream-dim)" }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </div>

          {/* Area de mensagens */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3" style={{ scrollbarWidth: "thin" }}>
            {/* Saudacao inicial */}
            {messages.length === 0 && !loading && (
              <div className="flex justify-start">
                <div
                  className="max-w-[85%] rounded-2xl rounded-bl-sm px-3.5 py-2.5 text-sm leading-relaxed"
                  style={{ background: "var(--color-surface)", color: "var(--color-cream)" }}
                >
                  {l.greeting}
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                    msg.role === "user" ? "rounded-br-sm" : "rounded-bl-sm"
                  }`}
                  style={
                    msg.role === "user"
                      ? { background: "var(--color-wine)", color: "var(--color-cream)" }
                      : { background: "var(--color-surface)", color: "var(--color-cream)" }
                  }
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {/* Indicador de loading */}
            {loading && messages[messages.length - 1]?.content === "" && (
              <div className="flex justify-start">
                <div
                  className="max-w-[85%] rounded-2xl rounded-bl-sm px-3.5 py-2.5 text-sm"
                  style={{ background: "var(--color-surface)", color: "var(--color-muted)" }}
                >
                  <span className="inline-flex gap-1">
                    <span className="animate-bounce" style={{ animationDelay: "0ms" }}>.</span>
                    <span className="animate-bounce" style={{ animationDelay: "150ms" }}>.</span>
                    <span className="animate-bounce" style={{ animationDelay: "300ms" }}>.</span>
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div
            className="flex items-end gap-2 px-3 py-3 shrink-0"
            style={{ borderTop: "1px solid var(--color-line)", background: "var(--color-surface)" }}
          >
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={l.placeholder}
              rows={1}
              className="flex-1 resize-none rounded-xl px-3 py-2.5 text-sm outline-none placeholder:opacity-50"
              style={{
                background: "var(--color-bg-2)",
                color: "var(--color-cream)",
                border: "1px solid var(--color-line)",
                maxHeight: "100px",
              }}
              disabled={loading}
            />

            {/* Botao microfone */}
            {speechSupported && (
              <button
                onClick={toggleListening}
                aria-label={listening ? "Stop" : "Microphone"}
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all ${
                  listening ? "animate-pulse" : ""
                }`}
                style={{
                  background: listening ? "#dc2626" : "var(--color-surface-2)",
                  color: listening ? "#fff" : "var(--color-cream-dim)",
                }}
                disabled={loading}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                  <line x1="12" y1="19" x2="12" y2="23" />
                  <line x1="8" y1="23" x2="16" y2="23" />
                </svg>
              </button>
            )}

            {/* Botao enviar */}
            <button
              onClick={() => sendMessage(input)}
              aria-label="Send"
              disabled={loading || !input.trim()}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all disabled:opacity-30"
              style={{ background: "var(--color-wine)", color: "var(--color-cream)" }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
