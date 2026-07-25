import Image from "next/image";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { info } from "@/lib/content";
import { heroImage } from "@/lib/gallery";

export default function Hero({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <section className="grain relative flex min-h-[100svh] items-center justify-center overflow-hidden">
      <div className="absolute inset-0 animate-kenburns">
        <Image src={heroImage} alt="" fill priority sizes="100vw" className="object-cover" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-bg/80 via-bg/60 to-bg" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,var(--color-bg)_100%)]" />

      <div className="relative z-10 mx-auto max-w-3xl px-5 text-center">
        <p className="eyebrow animate-slide-up" style={{ animationDelay: "0.1s" }}>
          {dict.hero.welcome}
        </p>

        <h1
          className="animate-slide-up mt-5 font-serif text-[2rem] font-extrabold leading-[1.08] text-cream sm:text-7xl"
          style={{ animationDelay: "0.2s" }}
        >
          Casa de Pasto
          <br />
          <span className="gold-text">Fernanda</span>
          <span className="mx-3 text-gold">✦</span>
          <span className="gold-text">Campinas</span>
        </h1>

        <div className="ornament animate-slide-up mt-7" style={{ animationDelay: "0.3s" }}>
          <span className="text-sm tracking-[0.3em] text-gold/90">{dict.hero.tagline}</span>
        </div>

        <p
          className="animate-slide-up mx-auto mt-6 max-w-xl text-base leading-relaxed text-cream-dim sm:text-lg"
          style={{ animationDelay: "0.4s" }}
        >
          {dict.hero.subtitle}
        </p>

        <div
          className="animate-slide-up mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
          style={{ animationDelay: "0.5s" }}
        >
          <a
            href="#menu"
            className="w-full rounded-full bg-gold px-8 py-3.5 text-sm font-bold text-bg shadow-[0_12px_40px_-10px_rgba(212,175,106,0.6)] transition-transform hover:-translate-y-0.5 sm:w-auto"
          >
            {dict.hero.ctaMenu}
          </a>
          <a
            href={info.localizacao.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full rounded-full border border-cream/30 px-8 py-3.5 text-sm font-semibold text-cream transition-colors hover:border-gold hover:text-gold sm:w-auto"
          >
            {dict.hero.ctaDirections}
          </a>
        </div>

        <p
          className="animate-slide-up mt-9 text-xs font-semibold uppercase tracking-[0.2em] text-muted"
          style={{ animationDelay: "0.6s" }}
        >
          {info.localizacao.moradaPostal?.rua.split(",")[0]} · {info.localizacao.moradaPostal?.localidade} ·{" "}
          {info.localizacao.moradaPostal?.regiao}
        </p>
      </div>

      <a
        href="#specialties"
        aria-hidden
        className="animate-float absolute bottom-7 left-1/2 z-10 -translate-x-1/2 text-gold/70"
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </a>
    </section>
  );
}
