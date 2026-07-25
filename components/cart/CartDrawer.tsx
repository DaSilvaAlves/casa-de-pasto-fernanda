"use client";

import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { formatPrice, t } from "@/lib/content";
import { useCart, type CartLine } from "./CartContext";

function Line({ line, locale, dict }: { line: CartLine; locale: Locale; dict: Dictionary }) {
  const { inc, dec, setNote } = useCart();
  const [showNote, setShowNote] = useState(Boolean(line.nota));
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <li className="border-b border-line py-4">
      <div className="flex items-start gap-3">
        <div className="flex-1">
          <p className="font-medium leading-snug text-cream">{t(line.nome, locale)}</p>
          <p className="mt-0.5 text-sm text-muted">{formatPrice(line.preco, locale)}</p>
        </div>

        <div className="flex items-center gap-1 rounded-full bg-surface p-1 ring-1 ring-line">
          <button
            type="button"
            aria-label={dict.cart.remove}
            onClick={() => dec(line.key)}
            className="flex h-7 w-7 items-center justify-center rounded-full text-gold hover:bg-gold/15 active:scale-90"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14" strokeLinecap="round" />
            </svg>
          </button>
          <span className="min-w-5 text-center text-sm font-bold tabular-nums text-cream">{line.qty}</span>
          <button
            type="button"
            aria-label="+"
            onClick={() => inc(line.key)}
            className="flex h-7 w-7 items-center justify-center rounded-full text-gold hover:bg-gold/15 active:scale-90"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 5v14M5 12h14" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <span className="w-16 shrink-0 text-right text-sm font-semibold text-gold-soft">
          {formatPrice(line.preco * line.qty, locale)}
        </span>
      </div>

      {showNote ? (
        <input
          ref={inputRef}
          type="text"
          value={line.nota}
          onChange={(e) => setNote(line.key, e.target.value)}
          placeholder={dict.cart.notePlaceholder}
          className="mt-3 w-full rounded-lg border border-line bg-bg px-3 py-2 text-sm text-cream placeholder:text-muted focus:border-gold/60 focus:outline-none"
        />
      ) : (
        <button
          type="button"
          onClick={() => {
            setShowNote(true);
            requestAnimationFrame(() => inputRef.current?.focus());
          }}
          className="mt-2 text-xs font-semibold text-gold/80 hover:text-gold"
        >
          + {dict.cart.addNote}
        </button>
      )}
    </li>
  );
}

function ExtrasSection({ dict }: { dict: Dictionary }) {
  const { extras, addExtra, removeExtra } = useCart();
  const [draft, setDraft] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    addExtra(draft);
    setDraft("");
  }

  return (
    <div className="border-t border-line px-5 py-4">
      <h3 className="text-sm font-semibold text-cream-dim">{dict.cart.extrasTitle}</h3>

      {extras.length > 0 && (
        <ul className="mt-2.5 space-y-1.5">
          {extras.map((extra) => (
            <li
              key={extra.id}
              className="flex items-center justify-between gap-2 rounded-lg bg-surface px-3 py-2 ring-1 ring-line"
            >
              <span className="flex items-center gap-2 text-sm text-cream">
                <span className="text-gold">+</span>
                {extra.text}
              </span>
              <button
                type="button"
                aria-label={dict.cart.remove}
                onClick={() => removeExtra(extra.id)}
                className="flex h-6 w-6 items-center justify-center rounded-full text-muted hover:bg-bg hover:text-terracotta"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={submit} className="mt-2.5 flex gap-2">
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={dict.cart.extrasPlaceholder}
          className="min-w-0 flex-1 rounded-lg border border-line bg-bg px-3 py-2 text-sm text-cream placeholder:text-muted focus:border-gold/60 focus:outline-none"
        />
        <button
          type="submit"
          disabled={!draft.trim()}
          className="shrink-0 rounded-lg bg-gold/15 px-4 py-2 text-sm font-semibold text-gold ring-1 ring-gold/40 transition-colors hover:bg-gold hover:text-bg disabled:opacity-40 disabled:hover:bg-gold/15 disabled:hover:text-gold"
        >
          {dict.cart.extrasAdd}
        </button>
      </form>
    </div>
  );
}

export default function CartDrawer({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const { lines, extras, total, count, isOpen, closeCart, clear } = useCart();

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeCart();
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, closeCart]);

  if (!isOpen) return null;

  const hasContent = lines.length > 0 || extras.length > 0;
  const itemQty = lines.reduce((s, l) => s + l.qty, 0);

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={closeCart} />

      <div className="animate-slide-up relative flex max-h-[88vh] w-full max-w-lg flex-col rounded-t-3xl bg-bg-2 ring-1 ring-line sm:rounded-3xl">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="font-serif text-xl font-bold text-cream">
            {dict.cart.title}
            {itemQty > 0 ? (
              <span className="ml-2 text-sm font-normal text-muted">
                · {itemQty} {itemQty === 1 ? dict.cart.item : dict.cart.items}
              </span>
            ) : null}
          </h2>
          <button
            type="button"
            aria-label={dict.cart.close}
            onClick={closeCart}
            className="flex h-9 w-9 items-center justify-center rounded-full text-cream-dim hover:bg-surface hover:text-cream"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Conteúdo */}
        <div className="flex-1 overflow-y-auto">
          {lines.length > 0 ? (
            <ul className="px-5">
              {lines.map((line) => (
                <Line key={line.key} line={line} locale={locale} dict={dict} />
              ))}
            </ul>
          ) : extras.length === 0 ? (
            <div className="flex flex-col items-center gap-2 px-6 pb-6 pt-12 text-center">
              <span className="text-4xl">🍽️</span>
              <p className="font-medium text-cream">{dict.cart.empty}</p>
              <p className="max-w-xs text-sm text-muted">{dict.cart.emptyHint}</p>
            </div>
          ) : null}

          <ExtrasSection dict={dict} />
        </div>

        {/* Rodapé */}
        {hasContent ? (
          <div className="border-t border-line px-5 py-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-semibold uppercase tracking-wide text-cream-dim">
                {dict.cart.total}
              </span>
              <span className="font-serif text-2xl font-bold text-gold-soft">
                {formatPrice(total, locale)}
              </span>
            </div>

            <div className="rounded-xl bg-gold/10 px-4 py-3 text-center ring-1 ring-gold/25">
              <p className="text-sm font-bold text-gold-soft">{dict.cart.showStaff}</p>
              <p className="mt-0.5 text-xs text-cream-dim">{dict.cart.showStaffHint}</p>
            </div>

            <button
              type="button"
              onClick={clear}
              className="mt-3 w-full rounded-full py-2.5 text-sm font-semibold text-muted transition-colors hover:text-terracotta"
            >
              {dict.cart.clear}
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
