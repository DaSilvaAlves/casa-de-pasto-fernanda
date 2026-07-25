"use client";

import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { menu, t, formatPrice, type LocalizedString } from "@/lib/content";
import { useCart } from "./CartContext";

type Row = {
  key: string;
  nome: LocalizedString;
  sub?: string | null;
  preco: number;
};

type Group = {
  id: string;
  title: LocalizedString;
  note?: LocalizedString;
  rows: Row[];
};

function AddControl({ row }: { row: Row }) {
  const { add, inc, dec, qtyOf } = useCart();
  const qty = qtyOf(row.key);

  if (qty === 0) {
    return (
      <button
        type="button"
        aria-label={`+ ${t(row.nome, "pt")}`}
        onClick={() => add({ key: row.key, nome: row.nome, preco: row.preco })}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gold/40 text-gold transition-all hover:border-gold hover:bg-gold hover:text-bg active:scale-90"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M12 5v14M5 12h14" strokeLinecap="round" />
        </svg>
      </button>
    );
  }

  return (
    <div className="flex shrink-0 items-center gap-1 rounded-full bg-gold/15 p-1 ring-1 ring-gold/40">
      <button
        type="button"
        aria-label="−"
        onClick={() => dec(row.key)}
        className="flex h-7 w-7 items-center justify-center rounded-full text-gold transition-colors hover:bg-gold/20 active:scale-90"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M5 12h14" strokeLinecap="round" />
        </svg>
      </button>
      <span className="min-w-5 text-center text-sm font-bold tabular-nums text-gold-soft">{qty}</span>
      <button
        type="button"
        aria-label="+"
        onClick={() => inc(row.key)}
        className="flex h-7 w-7 items-center justify-center rounded-full text-gold transition-colors hover:bg-gold/20 active:scale-90"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M12 5v14M5 12h14" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}

function ItemRow({ row, locale }: { row: Row; locale: Locale }) {
  const { add, qtyOf } = useCart();
  const active = qtyOf(row.key) > 0;

  return (
    <li
      className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors ${
        active ? "bg-gold/[0.07]" : "hover:bg-white/[0.03]"
      }`}
    >
      <button
        type="button"
        onClick={() => add({ key: row.key, nome: row.nome, preco: row.preco })}
        className="flex flex-1 items-baseline gap-2 text-left"
      >
        <span className="font-medium text-cream">
          {t(row.nome, locale)}
          {row.sub ? <span className="ml-1.5 text-xs font-normal text-muted">{row.sub}</span> : null}
        </span>
        <span className="mb-1 hidden flex-1 border-b border-dotted border-line sm:block" />
        <span className="whitespace-nowrap text-sm font-semibold text-gold-soft">
          {formatPrice(row.preco, locale)}
        </span>
      </button>
      <AddControl row={row} />
    </li>
  );
}

export default function MenuInteractive({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const groups: Group[] = [
    ...menu.categorias.map((c) => ({
      id: c.id,
      title: c.nome,
      note: c.nota,
      rows: c.itens.map((it) => ({
        key: `${c.id}::${it.nome.pt}`,
        nome: it.nome,
        preco: it.preco,
      })),
    })),
    ...menu.vinhos.map((c) => ({
      id: c.id,
      title: c.nome,
      rows: c.itens.map((w) => ({
        key: `${c.id}::${w.nome}::${w.regiao ?? ""}`,
        nome: { pt: w.nome, en: w.nome, es: w.nome, fr: w.nome, it: w.nome, de: w.nome },
        sub: w.regiao,
        preco: w.preco,
      })),
    })),
  ];

  const [active, setActive] = useState(groups[0]?.id);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible?.target.id) setActive(visible.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
    );
    Object.values(sectionRefs.current).forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!active) return;
    tabRefs.current[active]?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [active]);

  function jumpTo(id: string) {
    sectionRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <section id="menu" className="relative bg-bg-2 px-5 py-20 sm:py-28">
      <div className="mx-auto max-w-4xl">
        <div className="text-center">
          <p className="eyebrow">{dict.footer.cuisine}</p>
          <h2 className="mt-3 text-4xl font-extrabold text-cream sm:text-5xl">{dict.menu.title}</h2>
          <div className="ornament mt-5">
            <span className="text-lg">✦</span>
          </div>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-cream-dim">
            {dict.menu.orderIntro}
          </p>
        </div>
      </div>

      {/* Barra de categorias */}
      <div className="sticky top-[3.75rem] z-30 -mx-5 mt-10 border-y border-line bg-bg/85 px-5 py-2.5 backdrop-blur">
        <div className="mx-auto flex max-w-4xl gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {groups.map((g) => (
            <button
              key={g.id}
              type="button"
              ref={(el) => {
                tabRefs.current[g.id] = el;
              }}
              onClick={() => jumpTo(g.id)}
              className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
                active === g.id
                  ? "bg-gold text-bg"
                  : "bg-surface text-cream-dim hover:text-cream"
              }`}
            >
              {t(g.title, locale)}
            </button>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-4xl space-y-12">
        {groups.map((g) => (
          <section
            key={g.id}
            id={g.id}
            ref={(el) => {
              sectionRefs.current[g.id] = el;
            }}
            className="scroll-mt-32"
          >
            <div className="mb-4 flex items-baseline gap-3">
              <h3 className="font-serif text-2xl font-bold text-gold-soft">{t(g.title, locale)}</h3>
              <span className="h-px flex-1 bg-line" />
            </div>
            {g.note ? (
              <p className="mb-3 text-xs font-medium italic text-terracotta">{t(g.note, locale)}</p>
            ) : null}
            <ul className="space-y-0.5">
              {g.rows.map((row) => (
                <ItemRow key={row.key} row={row} locale={locale} />
              ))}
            </ul>
          </section>
        ))}
      </div>

      <p className="mx-auto mt-12 max-w-4xl text-center text-xs text-muted">{dict.menu.priceNote}</p>
    </section>
  );
}
