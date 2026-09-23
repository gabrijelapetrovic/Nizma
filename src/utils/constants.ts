import { type BusinessInfo, type EventItem, type FAQItem, type GalleryImage, type MenuCategory, type MenuItem, type Testimonial } from '../types';
import { createImage, unsplashPhoto } from './images';

export const BUSINESS_INFO: BusinessInfo = {
  name: 'Nokti & Trepavice',
  shortName: 'Nokti',
  tagline: 'Studio za nokte i trepavice u Užicu',
  description:
    'Studio za nokte i trepavice u Užicu. Gel, french, nail art i trepavice u mirnom ritmu, jedan termin — jedna pažnja.',
  address: {
    street: 'Užice',
    city: 'Užice',
    country: 'Srbija',
    full: 'Užice, Srbija',
  },
  phone: '069 159 6686',
  phoneRaw: '+381691596686',
  email: 'zakazivanje@noktitrepavice.rs',
  instagram: {
    handle: '@nokti_trepavice_uzice',
    url: 'https://www.instagram.com/nokti_trepavice_uzice/',
  },
  socials: [
    {
      name: 'Instagram',
      url: 'https://www.instagram.com/nokti_trepavice_uzice/',
      icon: 'Instagram',
    },
    {
      name: 'Facebook',
      url: 'https://facebook.com',
      icon: 'Facebook',
    },
  ],
  workingHours: [
    {
      id: 'monFri',
      days: 'Ponedeljak - Petak',
      hours: '09:00 - 20:00',
      weekdays: [1, 2, 3, 4, 5],
      openTime: '09:00',
      closeTime: '20:00',
    },
    {
      id: 'sat',
      days: 'Subota',
      hours: '09:00 - 15:00',
      weekdays: [6],
      openTime: '09:00',
      closeTime: '15:00',
    },
  ],
};

export const SITE_IMAGES = {
  hero: createImage(
    'https://images.unsplash.com/photo-1604654894610-df63bc536371',
    'Studio za nokte i trepavice',
    1600,
    900
  ),
  aboutMain: createImage(
    'https://images.unsplash.com/photo-1632345031435-8727f6897d53',
    'Radni kutak studija',
    1000,
    1250
  ),
  aboutNails: createImage(
    'https://images.unsplash.com/photo-1604654894610-df63bc536371',
    'Negovani nokti',
    500,
    500
  ),
};

export const MENU_CATEGORIES: MenuCategory[] = [
  {
    id: 'all',
    name: 'Sve',
    iconName: 'Sparkles',
    description: 'Nokti, trepavice, nega i paketi',
  },
  {
    id: 'nails',
    name: 'Nokti',
    iconName: 'Sparkles',
    description: 'Gel, french, nadogradnja i nail art',
  },
  {
    id: 'lashes',
    name: 'Trepavice',
    iconName: 'Eye',
    description: 'Klasične trepavice i volume setovi',
  },
  {
    id: 'care',
    name: 'Nega',
    iconName: 'Heart',
    description: 'Manikir, oblikovanje obrva i korekcije',
  },
  {
    id: 'sets',
    name: 'Paketi',
    iconName: 'Gem',
    description: 'Kombinacije noktiju i trepavica',
  },
];

export const MENU_ITEMS: MenuItem[] = [
  {
    id: 'n1',
    name: 'French manicure',
    description: 'Klasičan french na prirodnom noktu ili gel bazi. Čista linija, sjaj i oblik po ruci.',
    price: '1.800 RSD',
    category: 'nails',
    popular: true,
    tags: ['Hit', 'Nokti'],
    volume: '60 min',
    image: unsplashPhoto('1604654894610-df63bc536371', 'French manicure'),
  },
  {
    id: 'n2',
    name: 'Gel nadogradnja',
    description: 'Produžetak i ojačanje nokta, oblik koji drži liniju. Korekcija se dogovara na terminu.',
    price: '2.800 RSD',
    category: 'nails',
    tags: ['Nokti'],
    volume: '90 min',
    image: unsplashPhoto('1632345031435-8727f6897d53', 'Gel nadogradnja noktiju'),
  },
  {
    id: 'n3',
    name: 'Nail art',
    description: 'Boja, linija ili detalj po dogovoru. Jednostavan set ili jedan akcent nokat.',
    price: '3.200 RSD',
    category: 'nails',
    tags: ['Signature'],
    volume: '100 min',
    image: unsplashPhoto('1610992015732-2449b76344bc', 'Nail art'),
  },
  {
    id: 'l1',
    name: 'Klasične trepavice',
    description: 'Jedna na jednu, prirodan volumen. Dužina i krivina biraju se prema oku.',
    price: '2.500 RSD',
    category: 'lashes',
    popular: true,
    tags: ['Hit', 'Trepavice'],
    volume: '90 min',
    image: unsplashPhoto('1487412947147-5cebf100ffc2', 'Klasične trepavice'),
  },
  {
    id: 'l2',
    name: 'Volume trepavice',
    description: 'Meki volume set. Puniji izgled bez teškog osećaja, prilagođen obliku oka.',
    price: '3.500 RSD',
    category: 'lashes',
    tags: ['Trepavice'],
    volume: '120 min',
    image: unsplashPhoto('1487412947147-5cebf100ffc2', 'Volume trepavice'),
  },
  {
    id: 'b1',
    name: 'Oblikovanje obrva',
    description: 'Čišćenje i oblik koji prati lice. Bez trajne šminke — samo linija i nega.',
    price: '1.200 RSD',
    category: 'care',
    tags: ['Nega'],
    volume: '30 min',
    image: unsplashPhoto('1516975080664-ed2fc6a32937', 'Oblikovanje obrva'),
  },
  {
    id: 'b2',
    name: 'Spa manikir',
    description: 'Nega kožice, oblik i sjaj. Može da stoji sam ili kao priprema za gel.',
    price: '1.500 RSD',
    category: 'care',
    tags: ['Nega'],
    volume: '45 min',
    image: unsplashPhoto('1632345031435-8727f6897d53', 'Spa manikir'),
  },
  {
    id: 'p1',
    name: 'Set za poseban dan',
    description: 'Nokti i trepavice u istom dolasku. Termin se zakazuje unapred.',
    price: '5.800 RSD',
    category: 'sets',
    tags: ['Paket'],
    volume: '180 min',
    image: unsplashPhoto('1610992015732-2449b76344bc', 'Set nokti i trepavice'),
  },
];

export const EVENTS: EventItem[] = [
  {
    id: 'ev-bridal',
    title: 'Set za venčanje i slavlje',
    date: 'Po dogovoru',
    time: '180 min',
    category: 'Paket',
    badge: 'Unapred',
    description:
      'Nokti i trepavice za dan koji se fotografise. Termin se zaključava ranije, proba oblika ako treba.',
    image: unsplashPhoto('1604654894610-df63bc536371', 'Set za venčanje', 800, 500),
  },
  {
    id: 'ev-refill',
    title: 'Popuna trepavica',
    date: 'Svake nedelje',
    time: '60 min',
    category: 'Trepavice',
    badge: 'Redovno',
    description: 'Popuna posle dve do tri nedelje, da set ostane lak i uredan. Doneti sliku prethodnog rada pomaže.',
    image: unsplashPhoto('1487412947147-5cebf100ffc2', 'Popuna trepavica', 800, 500),
  },
  {
    id: 'ev-season',
    title: 'Sezonski nail art',
    date: 'Ograničen broj termina',
    time: '100 min',
    category: 'Nokti',
    badge: 'Sezona',
    description: 'Kratka serija detalja u boji sezone. Najava ide na Instagram, mesta se zatvaraju čim se popune.',
    image: unsplashPhoto('1610992015732-2449b76344bc', 'Sezonski nail art', 800, 500),
  },
];

export const GALLERY_IMAGES: GalleryImage[] = [
  {
    id: 'g1',
    title: 'French izbliza',
    category: 'studio',
    image: unsplashPhoto('1604654894610-df63bc536371', 'French izbliza', 900, 600),
    aspect: 'wide',
  },
  {
    id: 'g2',
    title: 'French linija',
    category: 'nails',
    image: unsplashPhoto('1604654894610-df63bc536371', 'French linija', 800, 800),
    aspect: 'square',
  },
  {
    id: 'g3',
    title: 'Gel na noktu',
    category: 'studio',
    image: unsplashPhoto('1632345031435-8727f6897d53', 'Gel na noktu', 900, 600),
    aspect: 'wide',
  },
  {
    id: 'g4',
    title: 'Pogled posle trepavica',
    category: 'lashes',
    image: unsplashPhoto('1487412947147-5cebf100ffc2', 'Pogled posle trepavica', 800, 1000),
    aspect: 'tall',
  },
  {
    id: 'g6',
    title: 'Ružičasti detalj',
    category: 'nails',
    image: unsplashPhoto('1610992015732-2449b76344bc', 'Ružičasti detalj', 800, 800),
    aspect: 'square',
  },
  {
    id: 'g7',
    title: 'Detalj boje',
    category: 'details',
    image: unsplashPhoto('1610992015732-2449b76344bc', 'Detalj boje', 900, 600),
    aspect: 'wide',
  },
  {
    id: 'g8',
    title: 'Nail art',
    category: 'details',
    image: unsplashPhoto('1632345031435-8727f6897d53', 'Nail art', 800, 800),
    aspect: 'square',
  },
];

export const TESTIMONIALS: Testimonial[] = [];

export const FAQS: FAQItem[] = [
  {
    category: 'Termin',
    question: 'Da li je termin obavezan?',
    answer: 'Da. Studio radi po jednom terminu. Dolazak bez zakazivanja moguć je samo ako je sto slobodan.',
  },
  {
    category: 'Tretman',
    question: 'Koliko traje prvi dolazak?',
    answer: 'Manikir oko 45 minuta, gel i french duže, trepavice od 90 minuta. Tačno vreme piše uz uslugu.',
  },
  {
    category: 'Nega',
    question: 'Šta ako imam osetljivu kožu ili alergiju?',
    answer: 'Recite pre tretmana. Ako postoji reakcija na lepak, gel ili preparat, tretman se ne radi.',
  },
  {
    category: 'Otkaz',
    question: 'Kako se otkazuje termin?',
    answer: 'Javite se bar jedan dan ranije, telefonom ili porukom. Isti dan molimo da javite čim znate.',
  },
  {
    category: 'Lokacija',
    question: 'Gde je studio?',
    answer: 'U Užicu. Tačnu ulicu javljamo uz potvrdu termina.',
  },
];

export const VIBE_HIGHLIGHTS = [
  {
    title: 'Nokti',
    subtitle: 'Gel, french, art',
    description: 'Oblik, boja i linija koje drže. Od čistog french-a do jednog detalja koji se vidi izbliza.',
    icon: 'Sparkles',
    tag: 'Nokti',
    image: unsplashPhoto('1604654894610-df63bc536371', 'Nokti u studiju'),
  },
  {
    title: 'Trepavice',
    subtitle: 'Klasika i volume',
    description: 'Set koji prati oko. Dužina i gustina biraju se tako da ostane lagano i uredno između popuna.',
    icon: 'Eye',
    tag: 'Trepavice',
    image: unsplashPhoto('1487412947147-5cebf100ffc2', 'Trepavice'),
  },
  {
    title: 'Ritam studija',
    subtitle: 'Jedan termin',
    description: 'Bez čekaonice punih stolica. Dolazite na svoje vreme, sedite, i odlazite kad je rad gotov.',
    icon: 'Heart',
    tag: 'Studio',
    image: unsplashPhoto('1610992015732-2449b76344bc', 'Ritam studija'),
  },
];
