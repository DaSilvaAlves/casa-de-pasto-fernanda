import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { locales, isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { info } from "@/lib/content";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { CartProvider } from "@/components/cart/CartContext";
import CartBar from "@/components/cart/CartBar";
import CartDrawer from "@/components/cart/CartDrawer";

const SITE_URL = "https://dasilvaalves.github.io/casa-de-pasto-fernanda";

export const viewport = {
  themeColor: "#16100d",
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = getDictionary(isLocale(locale) ? locale : "pt");
  return {
    metadataBase: new URL(SITE_URL),
    title: dict.meta.title,
    description: dict.meta.description,
    alternates: {
      canonical: `/${locale}`,
      languages: {
        pt: "/pt",
        en: "/en",
        es: "/es",
        fr: "/fr",
        it: "/it",
        de: "/de",
        "x-default": "/pt",
      },
    },
    openGraph: {
      type: "website",
      siteName: info.nome,
      title: dict.meta.title,
      description: dict.meta.description,
      locale,
      images: [{ url: "/fotos/grelhada-mista.jpg", width: 1200, height: 900, alt: info.nome }],
    },
    icons: { icon: "/favicon.svg" },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const typedLocale = locale as Locale;
  const dict = getDictionary(typedLocale);

  return (
    <>
      <JsonLd locale={typedLocale} />
      <CartProvider>
        <Header locale={typedLocale} dict={dict} />
        <main>{children}</main>
        <Footer locale={typedLocale} dict={dict} />
        <CartBar locale={typedLocale} dict={dict} />
        <CartDrawer locale={typedLocale} dict={dict} />
      </CartProvider>
    </>
  );
}
