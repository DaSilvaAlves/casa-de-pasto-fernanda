import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { info, weekOrder } from "@/lib/content";
import Reveal from "./Reveal";

function formatRanges(ranges: { abre: string; fecha: string }[], closedLabel: string): string {
  if (!ranges || ranges.length === 0) return closedLabel;
  return ranges.map((r) => `${r.abre}–${r.fecha}`).join(" · ");
}

export default function Location({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const { localizacao, contactos, servicos } = info;

  const services: string[] = [];
  if (servicos.comerNoLocal) services.push(dict.location.services.dineIn);
  if (servicos.takeaway) services.push(dict.location.services.takeaway);

  return (
    <section id="location" className="bg-bg-2 px-5 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">{dict.nav.location}</p>
          <h2 className="mt-3 text-3xl font-extrabold text-cream sm:text-5xl">{dict.location.title}</h2>
          <div className="ornament mt-5">
            <span>✦</span>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          <Reveal className="overflow-hidden rounded-2xl ring-1 ring-line">
            <iframe
              src={localizacao.googleMapsEmbedSrc}
              title={info.nome}
              className="h-full min-h-[340px] w-full border-0 grayscale-[0.2]"
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </Reveal>

          <Reveal className="flex flex-col gap-7 rounded-2xl bg-surface p-7 ring-1 ring-line">
            <div>
              <h3 className="font-serif text-lg font-bold text-gold-soft">{dict.location.addressTitle}</h3>
              <p className="mt-1.5 text-base leading-relaxed text-cream-dim">
                {localizacao.moradaCompleta}
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <a
                  href={localizacao.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-gold px-5 py-2.5 text-sm font-bold text-bg transition-transform hover:-translate-y-0.5"
                >
                  {dict.location.directions}
                </a>
                <a
                  href={`tel:${contactos.telefone}`}
                  className="rounded-full border border-gold/50 px-5 py-2.5 text-sm font-semibold text-gold transition-colors hover:bg-gold hover:text-bg"
                >
                  {dict.location.call}
                </a>
              </div>
            </div>

            <div>
              <h3 className="font-serif text-lg font-bold text-gold-soft">{dict.location.hoursTitle}</h3>
              <dl className="mt-2 divide-y divide-line">
                {weekOrder.map((day) => {
                  const ranges = info.horario[day] ?? [];
                  const closed = ranges.length === 0;
                  return (
                    <div key={day} className="flex items-center justify-between gap-4 py-2 text-sm">
                      <dt className="font-medium text-cream">{dict.days[day]}</dt>
                      <dd className={closed ? "font-semibold text-terracotta" : "tabular-nums text-cream-dim"}>
                        {formatRanges(ranges, dict.location.closed)}
                      </dd>
                    </div>
                  );
                })}
              </dl>
            </div>

            <div className="flex flex-wrap gap-x-8 gap-y-4">
              <div>
                <h3 className="font-serif text-lg font-bold text-gold-soft">
                  {dict.location.contactTitle}
                </h3>
                <a
                  href={`tel:${contactos.telefone}`}
                  className="mt-1.5 block text-base font-medium text-cream-dim hover:text-gold"
                >
                  {contactos.telefoneDisplay}
                </a>
                {contactos.email ? (
                  <a
                    href={`mailto:${contactos.email}`}
                    className="block text-base font-medium text-cream-dim hover:text-gold"
                  >
                    {contactos.email}
                  </a>
                ) : null}
              </div>

              <div>
                <h3 className="font-serif text-lg font-bold text-gold-soft">
                  {dict.location.servicesTitle}
                </h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {services.map((service) => (
                    <span
                      key={service}
                      className="rounded-full bg-bg px-3 py-1 text-xs font-semibold text-cream-dim ring-1 ring-line"
                    >
                      {service}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
