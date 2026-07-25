import type { Locale } from "@/i18n/config";
import { info, weekOrder } from "@/lib/content";

const DAY_SCHEMA: Record<string, string> = {
  segunda: "Monday",
  terca: "Tuesday",
  quarta: "Wednesday",
  quinta: "Thursday",
  sexta: "Friday",
  sabado: "Saturday",
  domingo: "Sunday",
};

export default function JsonLd({ locale }: { locale: Locale }) {
  const { localizacao, contactos } = info;

  const openingHours = weekOrder.flatMap((day) =>
    (info.horario[day] ?? []).map((range) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: DAY_SCHEMA[day],
      opens: range.abre,
      closes: range.fecha,
    })),
  );

  const schema = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: info.nome,
    description: info.tipo,
    servesCuisine: "Portuguese",
    priceRange: "€€",
    telephone: contactos.telefone,
    url: `https://casadepastofernanda.vercel.app/${locale}`,
    image: "https://casadepastofernanda.vercel.app/fotos/grelhada-mista.jpg",
    address: localizacao.moradaPostal
      ? {
          "@type": "PostalAddress",
          streetAddress: localizacao.moradaPostal.rua,
          postalCode: localizacao.moradaPostal.codigoPostal,
          addressLocality: localizacao.moradaPostal.localidade,
          addressRegion: localizacao.moradaPostal.regiao,
          addressCountry: "PT",
        }
      : undefined,
    geo: {
      "@type": "GeoCoordinates",
      latitude: localizacao.coordenadas.latitude,
      longitude: localizacao.coordenadas.longitude,
    },
    hasMap: localizacao.googleMapsUrl,
    openingHoursSpecification: openingHours,
    sameAs: [contactos.redesSociais.facebook].filter(Boolean),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
