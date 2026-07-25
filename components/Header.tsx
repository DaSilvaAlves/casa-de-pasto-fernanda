"use client";

import { useEffect, useState } from "react";
import { locales, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { info } from "@/lib/content";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Header({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { href: "#specialties", label: dict.nav.specialties },
    { href: "#menu", label: dict.nav.menu },
    { href: "#gallery", label: dict.nav.gallery },
    { href: "#location", label: dict.nav.location },
  ];

  const solid = scrolled || open;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        solid ? "border-b border-line bg-bg/90 backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3.5">
        <a
          href={`/${locale}`}
          className="font-serif text-base font-bold leading-tight text-cream transition-colors hover:text-gold sm:text-lg"
        >
          Casa de Pasto Fernanda<span className="text-gold"> e</span> Campinas
        </a>

        <nav className="hidden items-center gap-7 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-semibold text-cream-dim transition-colors hover:text-gold"
            >
              {link.label}
            </a>
          ))}
          <LanguageSwitcher current={locale} />
          <a
            href={`tel:${info.contactos.telefone}`}
            className="rounded-full border border-gold/50 px-4 py-2 text-sm font-semibold text-gold transition-colors hover:bg-gold hover:text-bg"
          >
            {info.contactos.telefoneDisplay}
          </a>
        </nav>

        <button
          type="button"
          aria-label="Menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-md text-cream md:hidden"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? (
              <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
            ) : (
              <path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <div className="border-t border-line bg-bg px-5 pb-6 pt-2 md:hidden">
          <nav className="flex flex-col">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="border-b border-line py-3 text-base font-semibold text-cream"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {locales.map((l) => (
              <a
                key={l}
                href={`/${l}`}
                onClick={() => setOpen(false)}
                className={`rounded-full border px-3 py-1.5 text-xs font-bold uppercase tracking-wide transition-colors ${
                  l === locale
                    ? "border-gold bg-gold/10 text-gold"
                    : "border-line text-cream-dim hover:border-gold/50 hover:text-gold"
                }`}
              >
                {l}
              </a>
            ))}
          </div>
          <div className="mt-4">
            <a
              href={`tel:${info.contactos.telefone}`}
              className="inline-block rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-bg"
            >
              {dict.nav.call} · {info.contactos.telefoneDisplay}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
