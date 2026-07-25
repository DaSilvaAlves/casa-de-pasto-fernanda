import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { info } from "@/lib/content";

export default function Footer({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const year = 2026;
  const facebook = info.contactos.redesSociais.facebook;

  return (
    <footer className="border-t border-line bg-bg px-5 py-14 pb-28 text-cream sm:pb-14">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <p className="font-serif text-xl font-bold">
              Casa de Pasto Fernanda<span className="text-gold"> e</span> Campinas
            </p>
            <p className="mt-2 text-sm text-muted">{dict.footer.cuisine}</p>
          </div>

          <div className="text-sm text-cream-dim">
            <p>{info.localizacao.moradaCompleta}</p>
            <a href={`tel:${info.contactos.telefone}`} className="mt-2 block hover:text-gold">
              {info.contactos.telefoneDisplay}
            </a>
          </div>

          <div>
            {facebook ? (
              <>
                <p className="eyebrow">{dict.footer.followUs}</p>
                <a
                  href={facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-2 text-sm text-cream-dim hover:text-gold"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12Z" />
                  </svg>
                  Facebook
                </a>
              </>
            ) : null}
          </div>
        </div>

        <div className="mt-10 border-t border-line pt-6 text-center text-xs text-muted">
          © {year} Casa de Pasto Fernanda e Campinas. {dict.footer.rights}
        </div>
      </div>
    </footer>
  );
}
