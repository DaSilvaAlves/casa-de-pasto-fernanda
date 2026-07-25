import type { Locale } from "./config";
import pt from "./dictionaries/pt.json";
import en from "./dictionaries/en.json";
import es from "./dictionaries/es.json";
import fr from "./dictionaries/fr.json";
import it from "./dictionaries/it.json";
import de from "./dictionaries/de.json";

export type Dictionary = typeof pt;

const dictionaries: Record<Locale, Dictionary> = { pt, en, es, fr, it, de };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? dictionaries.pt;
}
