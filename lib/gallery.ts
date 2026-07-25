import type { LocalizedString } from "./content";

export type GalleryImage = {
  src: string;
  alt: LocalizedString;
};

/** Imagem de destaque usada no hero. */
export const heroImage = "/fotos/grelhada-mista.jpg";

export const gallery: GalleryImage[] = [
  { src: "/fotos/acorda-galinha.jpg", alt: { pt: "Açorda de galinha", en: "Chicken açorda", es: "Açorda de gallina", fr: "Açorda de poule", it: "Açorda di gallina", de: "Hühner-Açorda" } },
  { src: "/fotos/arroz-cabidela.jpg", alt: { pt: "Arroz de cabidela", en: "Cabidela rice", es: "Arroz de cabidela", fr: "Riz de cabidela", it: "Riso alla cabidela", de: "Cabidela-Reis" } },
  { src: "/fotos/ensopado-javali.jpg", alt: { pt: "Ensopado de javali", en: "Wild boar stew", es: "Estofado de jabalí", fr: "Ragoût de sanglier", it: "Spezzatino di cinghiale", de: "Wildschweineintopf" } },
  { src: "/fotos/porco-iberico-plumas.jpg", alt: { pt: "Plumas de porco ibérico", en: "Iberian pork pluma", es: "Pluma de cerdo ibérico", fr: "Pluma de porc ibérique", it: "Pluma di maiale iberico", de: "Pluma vom iberischen Schwein" } },
  { src: "/fotos/espetada-mista.jpg", alt: { pt: "Espetada mista", en: "Mixed skewer", es: "Brocheta mixta", fr: "Brochette mixte", it: "Spiedino misto", de: "Gemischter Spieß" } },
  { src: "/fotos/costeletas-borrego.jpg", alt: { pt: "Costeletas de borrego", en: "Lamb chops", es: "Chuletas de cordero", fr: "Côtelettes d'agneau", it: "Costolette d'agnello", de: "Lammkoteletts" } },
  { src: "/fotos/secreto.jpg", alt: { pt: "Secreto de porco ibérico", en: "Iberian pork secreto", es: "Secreto de cerdo ibérico", fr: "Secreto de porc ibérique", it: "Secreto di maiale iberico", de: "Secreto vom iberischen Schwein" } },
  { src: "/fotos/entrecosto.jpg", alt: { pt: "Entrecosto grelhado", en: "Grilled pork ribs", es: "Costillar a la brasa", fr: "Travers de porc grillés", it: "Costine alla griglia", de: "Gegrillte Schweinerippchen" } },
  { src: "/fotos/carapaus-fritos.jpg", alt: { pt: "Carapaus fritos", en: "Fried horse mackerel", es: "Jureles fritos", fr: "Chinchards frits", it: "Sugarelli fritti", de: "Gebratene Bastardmakrelen" } },
  { src: "/fotos/conquilhas.jpg", alt: { pt: "Conquilhas", en: "Wedge clams", es: "Coquinas", fr: "Tellines", it: "Telline", de: "Dreiecksmuscheln" } },
  { src: "/fotos/peru.jpg", alt: { pt: "Bife de perú", en: "Turkey steak", es: "Filete de pavo", fr: "Escalope de dinde", it: "Fettina di tacchino", de: "Putensteak" } },
  { src: "/fotos/queijo-fresco.jpg", alt: { pt: "Queijo fresco", en: "Fresh cheese", es: "Queso fresco", fr: "Fromage frais", it: "Formaggio fresco", de: "Frischkäse" } },
  { src: "/fotos/azeitonas.jpg", alt: { pt: "Azeitonas", en: "Olives", es: "Aceitunas", fr: "Olives", it: "Olive", de: "Oliven" } },
  { src: "/fotos/tarte-alfarroba.jpg", alt: { pt: "Tarte de alfarroba", en: "Carob tart", es: "Tarta de algarroba", fr: "Tarte à la caroube", it: "Torta di carrube", de: "Johannisbrot-Torte" } },
  { src: "/fotos/doce-torta-limao.jpg", alt: { pt: "Torta de limão", en: "Lemon roll cake", es: "Brazo de limón", fr: "Roulé au citron", it: "Rotolo al limone", de: "Zitronenrolle" } },
  { src: "/fotos/doce-folhado-merengue.jpg", alt: { pt: "Folhado de merengue", en: "Meringue pastry", es: "Hojaldre de merengue", fr: "Feuilleté à la meringue", it: "Sfoglia alla meringa", de: "Baiser-Blätterteig" } },
  { src: "/fotos/grelhada-mista.jpg", alt: { pt: "Grelhada mista", en: "Mixed grill", es: "Parrillada mixta", fr: "Assortiment grillé", it: "Grigliata mista", de: "Gemischte Grillplatte" } },
  { src: "/fotos/vitrine.jpg", alt: { pt: "A nossa montra", en: "Our display counter", es: "Nuestro mostrador", fr: "Notre vitrine", it: "La nostra vetrina", de: "Unsere Auslage" } }
];
