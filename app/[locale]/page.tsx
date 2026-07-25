import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import Hero from "@/components/Hero";
import Specialties from "@/components/Specialties";
import MenuInteractive from "@/components/cart/MenuInteractive";
import Gallery from "@/components/Gallery";
import Location from "@/components/Location";

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const typedLocale: Locale = isLocale(locale) ? locale : "pt";
  const dict = getDictionary(typedLocale);

  return (
    <>
      <Hero locale={typedLocale} dict={dict} />
      <Specialties locale={typedLocale} dict={dict} />
      <MenuInteractive locale={typedLocale} dict={dict} />
      <Gallery locale={typedLocale} dict={dict} />
      <Location locale={typedLocale} dict={dict} />
    </>
  );
}
