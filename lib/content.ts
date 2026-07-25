import menuData from "@/content/menu.json";
import infoData from "@/content/info.json";
import type { Locale } from "@/i18n/config";

export type LocalizedString = {
  pt: string;
  en: string;
  es: string;
  fr: string;
  it: string;
  de: string;
};

export type MenuItem = {
  nome: LocalizedString;
  preco: number;
};

export type MenuCategory = {
  id: string;
  nome: LocalizedString;
  nota?: LocalizedString;
  itens: MenuItem[];
};

export type WineItem = {
  nome: string;
  regiao: string | null;
  preco: number;
};

export type WineCategory = {
  id: string;
  nome: LocalizedString;
  itens: WineItem[];
};

export const menu = menuData as unknown as {
  notaLegal: LocalizedString;
  categorias: MenuCategory[];
  vinhos: WineCategory[];
};

export const info = infoData as unknown as {
  nome: string;
  tipo: string;
  contactos: {
    telefone: string;
    telefoneDisplay: string;
    email: string | null;
    redesSociais: { facebook: string | null; instagram: string | null };
  };
  localizacao: {
    moradaPostal: {
      rua: string;
      codigoPostal: string;
      localidade: string;
      regiao: string;
      pais: string;
    } | null;
    moradaCompleta: string;
    coordenadas: { latitude: number; longitude: number };
    googleMapsUrl: string;
    googleMapsEmbedSrc: string;
  };
  servicos: { comerNoLocal: boolean; takeaway: boolean; entrega: boolean };
  horario: Record<string, { abre: string; fecha: string }[]>;
};

export function t(value: LocalizedString, locale: Locale): string {
  return value[locale] ?? value.pt;
}

const PRICE_LOCALE: Record<Locale, string> = {
  pt: "pt-PT",
  en: "en-IE",
  es: "es-ES",
  fr: "fr-FR",
  it: "it-IT",
  de: "de-DE",
};

export function formatPrice(price: number, locale: Locale): string {
  return new Intl.NumberFormat(PRICE_LOCALE[locale] ?? "pt-PT", {
    style: "currency",
    currency: "EUR",
  }).format(price);
}

export const weekOrder = [
  "segunda",
  "terca",
  "quarta",
  "quinta",
  "sexta",
  "sabado",
  "domingo",
] as const;
