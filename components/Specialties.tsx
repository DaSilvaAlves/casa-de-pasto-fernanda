import Image from "next/image";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { menu, info, t, formatPrice } from "@/lib/content";
import Reveal from "./Reveal";

const DISH_IMAGES: Record<string, string> = {
  "Açorda de galinha": "/fotos/acorda-galinha.jpg",
  "Arroz de cabidela": "/fotos/arroz-cabidela.jpg",
  "Ensopado de javali": "/fotos/ensopado-javali.jpg",
  "Cabrito assado no forno": "/fotos/ensopado.jpg",
};

const HERITAGE_IMAGE = "/menu/menu-capa.jpeg";

export default function Specialties({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const category = menu.categorias.find((c) => c.id === "especialidades-mae-fernanda");
  if (!category) return null;

  const featured = category.itens[0];
  const rest = category.itens.slice(1);
  const featuredImg = DISH_IMAGES[featured.nome.pt];

  return (
    <section id="specialties" className="grain relative bg-bg px-5 py-20 sm:py-28">
      <div className="relative z-10 mx-auto max-w-6xl">
        {/* A nossa casa — texto + herança da família */}
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <p className="eyebrow">{dict.about.title}</p>
            <h2 className="mt-3 text-3xl font-extrabold text-cream sm:text-4xl">
              <span className="gold-text">Casa de Pasto Fernanda</span>
            </h2>
            <div className="ornament mt-5 justify-start">
              <span>✦</span>
            </div>
            <p className="mt-6 text-base leading-relaxed text-cream-dim">{dict.about.body}</p>
          </Reveal>

          <Reveal className="flex justify-center lg:justify-end">
            <Image
              src={HERITAGE_IMAGE}
              alt={`${info.nome} — arquivo da família`}
              width={600}
              height={800}
              sizes="(max-width: 1024px) 256px, 320px"
              className="h-auto w-64 rotate-[-1.5deg] rounded-xl bg-cream/95 object-contain p-2.5 shadow-2xl ring-1 ring-gold/20 transition-transform duration-500 hover:rotate-0 sm:w-80"
            />
          </Reveal>
        </div>

        {/* Especialidades da Mãe Fernanda */}
        <div className="mt-20 text-center sm:mt-28">
          <p className="eyebrow">{dict.footer.cuisine}</p>
          <h2 className="mt-3 text-3xl font-extrabold text-cream sm:text-5xl">
            <span className="gold-text">{category.nome[locale]}</span>
          </h2>
          <div className="ornament mt-5">
            <span>✦</span>
          </div>
          <p className="mx-auto mt-5 max-w-xl text-sm font-medium italic text-terracotta">
            {category.nota?.[locale]}
          </p>
        </div>

        {/* Prato em destaque — Açorda de Galinha */}
        <Reveal className="group relative mt-12 overflow-hidden rounded-3xl ring-1 ring-gold/30 transition-all duration-500 hover:ring-gold/60 hover:shadow-[0_30px_70px_-25px_rgba(212,175,106,0.5)]">
          <div className="relative aspect-[16/11] sm:aspect-[16/7]">
            {featuredImg && (
              <Image
                src={featuredImg}
                alt={t(featured.nome, locale)}
                fill
                priority
                sizes="(max-width: 1152px) 100vw, 1152px"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/50 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-bg/70 to-transparent sm:w-2/3" />
          </div>

          <span className="absolute left-5 top-5 inline-flex items-center gap-1.5 rounded-full bg-gold px-3.5 py-1.5 text-xs font-bold uppercase tracking-wide text-bg shadow-lg">
            ✦ {dict.specialties.house}
          </span>

          <div className="absolute inset-x-0 bottom-0 p-6 sm:max-w-lg sm:p-9">
            <h3 className="font-serif text-3xl font-extrabold leading-tight text-cream sm:text-4xl">
              {t(featured.nome, locale)}
            </h3>
            <p className="mt-2 text-lg font-semibold text-gold-soft">
              {formatPrice(featured.preco, locale)}
              <span className="ml-2 text-sm font-normal text-cream-dim">· {dict.specialties.perDose}</span>
            </p>
          </div>
        </Reveal>

        {/* Restantes especialidades */}
        <div className="mt-6 grid gap-6 sm:grid-cols-3">
          {rest.map((item, i) => {
            const img = DISH_IMAGES[item.nome.pt];
            return (
              <Reveal
                key={item.nome.pt}
                className="group relative aspect-[4/5] overflow-hidden rounded-2xl ring-1 ring-line transition-all duration-500 hover:-translate-y-1.5 hover:ring-gold/50 hover:shadow-[0_20px_50px_-20px_rgba(212,175,106,0.4)]"
                style={{ transitionDelay: `${i * 80}ms` } as React.CSSProperties}
              >
                {img && (
                  <Image
                    src={img}
                    alt={t(item.nome, locale)}
                    fill
                    sizes="(max-width: 640px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/40 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <h3 className="font-serif text-lg font-bold leading-snug text-cream">
                    {t(item.nome, locale)}
                  </h3>
                  <p className="mt-1 text-sm font-semibold text-gold-soft">
                    {formatPrice(item.preco, locale)}
                    <span className="ml-1.5 text-xs font-normal text-cream-dim">· {dict.specialties.perDose}</span>
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
