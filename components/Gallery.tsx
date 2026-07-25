"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { gallery } from "@/lib/gallery";
import { t } from "@/lib/content";

export default function Gallery({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const [active, setActive] = useState<number | null>(null);

  const close = useCallback(() => setActive(null), []);
  const next = useCallback(
    () => setActive((i) => (i === null ? null : (i + 1) % gallery.length)),
    [],
  );
  const prev = useCallback(
    () => setActive((i) => (i === null ? null : (i - 1 + gallery.length) % gallery.length)),
    [],
  );

  useEffect(() => {
    if (active === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [active, close, next, prev]);

  return (
    <section id="gallery" className="bg-bg px-5 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">{dict.gallery.title}</p>
          <h2 className="mt-3 text-3xl font-extrabold text-cream sm:text-5xl">
            {dict.gallery.subtitle}
          </h2>
          <div className="ornament mt-5">
            <span>✦</span>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4">
          {gallery.map((image, i) => (
            <button
              key={image.src}
              type="button"
              onClick={() => setActive(i)}
              className="group relative aspect-square overflow-hidden rounded-xl ring-1 ring-line transition-all hover:ring-gold/50 focus:outline-none focus:ring-2 focus:ring-gold"
            >
              <Image
                src={image.src}
                alt={t(image.alt, locale)}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                loading="lazy"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <span className="absolute inset-0 bg-gradient-to-t from-bg/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            </button>
          ))}
        </div>
      </div>

      {active !== null && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/92 p-4"
          onClick={close}
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            aria-label={dict.cart.close}
            className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-cream hover:bg-white/20"
            onClick={close}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
            </svg>
          </button>
          <button
            type="button"
            aria-label="←"
            className="absolute left-3 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-cream hover:bg-white/20 sm:left-6"
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m15 18-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            type="button"
            aria-label="→"
            className="absolute right-3 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-cream hover:bg-white/20 sm:right-6"
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m9 18 6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <figure className="relative max-h-[85vh] w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
            <div className="relative mx-auto aspect-[4/3] max-h-[80vh] w-full">
              <Image
                src={gallery[active].src}
                alt={t(gallery[active].alt, locale)}
                fill
                sizes="90vw"
                className="rounded-lg object-contain"
              />
            </div>
            <figcaption className="mt-3 text-center text-sm text-cream-dim">
              {t(gallery[active].alt, locale)}
            </figcaption>
          </figure>
        </div>
      )}
    </section>
  );
}
