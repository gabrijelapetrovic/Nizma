import { defineArrayMember, defineField, defineType } from 'sanity';

const hex = (name: string, title: string) =>
  defineField({
    name,
    title,
    type: 'string',
    description: 'Hex boja, npr. #C23B6E',
    validation: (rule) => rule.regex(/^#([0-9a-fA-F]{6})$/, { name: 'hex' }),
  });

const imageFields = [
  defineField({
    name: 'image',
    title: 'Fajl u Sanity biblioteci',
    type: 'image',
    options: { hotspot: true },
  }),
  defineField({
    name: 'imageUrl',
    title: 'Postojeći URL slike',
    type: 'url',
    description: 'Unsplash ili /assets putanja. Koristi se dok fajl nije u biblioteci.',
  }),
];

export const siteSchema = defineType({
  name: 'site',
  title: 'Sajt',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Naziv', type: 'string', validation: (rule) => rule.required() }),
    defineField({ name: 'tagline', title: 'Kratak opis', type: 'string' }),
    defineField({ name: 'description', title: 'Opis', type: 'text', rows: 4 }),
    defineField({ name: 'phone', title: 'Telefon', type: 'string' }),
    defineField({ name: 'phoneRaw', title: 'Telefon (raw)', type: 'string' }),
    defineField({ name: 'email', title: 'E-mail', type: 'string' }),
    defineField({ name: 'addressFull', title: 'Adresa', type: 'string' }),
    defineField({ name: 'instagramUrl', title: 'Instagram URL', type: 'url' }),
    defineField({ name: 'instagramHandle', title: 'Instagram nalog', type: 'string' }),
    defineField({ name: 'facebookUrl', title: 'Facebook URL', type: 'url' }),
    defineField({ name: 'mapsUrl', title: 'Google Maps link', type: 'url' }),
    defineField({ name: 'mapsEmbed', title: 'Google Maps embed', type: 'url' }),
    defineField({ name: 'whatsapp', title: 'WhatsApp broj', type: 'string' }),
    defineField({
      name: 'favicon',
      title: 'Ikonica u tabu',
      description: 'Prevuci sliku na polje, ili pritisni Upload i izaberi fajl sa uređaja. Kvadratna PNG, WEBP ili JPG. Ako je obrišeš, ostaje sadašnja ikonica.',
      type: 'image',
      options: { accept: 'image/png,image/webp,image/jpeg' },
    }),
    defineField({
      name: 'workingHours',
      title: 'Radno vreme',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'workingHoursRow',
          fields: [
            defineField({ name: 'id', type: 'string' }),
            defineField({ name: 'days', type: 'string' }),
            defineField({ name: 'hours', type: 'string' }),
            defineField({ name: 'weekdays', type: 'array', of: [{ type: 'number' }] }),
            defineField({ name: 'openTime', type: 'string' }),
            defineField({ name: 'closeTime', type: 'string' }),
          ],
          preview: { select: { title: 'days', subtitle: 'hours' } },
        }),
      ],
    }),
    defineField({
      name: 'images',
      title: 'Slike sekcija',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'namedImage',
          fields: [
            defineField({ name: 'key', title: 'Ključ', type: 'string' }),
            ...imageFields,
          ],
          preview: { select: { title: 'key', media: 'image' } },
        }),
      ],
    }),
    defineField({
      name: 'menu',
      title: 'Cenovnik',
      description: 'Add item dodaje novu uslugu. Pojavljuje se na sajtu posle objave.',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'menuItem',
          fields: [
            defineField({ name: 'id', type: 'string' }),
            defineField({ name: 'name', type: 'string' }),
            defineField({ name: 'price', type: 'string' }),
            defineField({ name: 'description', type: 'text', rows: 3 }),
            defineField({
              name: 'category',
              type: 'string',
              options: { list: ['nails', 'lashes', 'care', 'sets'] },
            }),
            ...imageFields,
          ],
          preview: { select: { title: 'name', subtitle: 'price', media: 'image' } },
        }),
      ],
    }),
    defineField({
      name: 'events',
      title: 'Ponude',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'eventItem',
          fields: [
            defineField({ name: 'id', type: 'string' }),
            defineField({ name: 'title', type: 'string' }),
            defineField({ name: 'date', type: 'string' }),
            defineField({ name: 'time', type: 'string' }),
            defineField({ name: 'description', type: 'text', rows: 3 }),
            defineField({ name: 'badge', type: 'string' }),
            ...imageFields,
          ],
          preview: { select: { title: 'title', subtitle: 'date', media: 'image' } },
        }),
      ],
    }),
    defineField({
      name: 'gallery',
      title: 'Galerija',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'galleryItem',
          fields: [
            defineField({ name: 'id', type: 'string' }),
            defineField({ name: 'title', type: 'string' }),
            defineField({
              name: 'category',
              type: 'string',
              options: { list: ['studio', 'nails', 'lashes', 'details'] },
            }),
            ...imageFields,
          ],
          preview: { select: { title: 'title', subtitle: 'category', media: 'image' } },
        }),
      ],
    }),
    defineField({
      name: 'reviews',
      title: 'Utisci',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'reviewItem',
          fields: [
            defineField({ name: 'id', type: 'string' }),
            defineField({ name: 'name', type: 'string' }),
            defineField({ name: 'role', type: 'string' }),
            defineField({ name: 'comment', type: 'text', rows: 3 }),
            ...imageFields,
          ],
          preview: { select: { title: 'name', subtitle: 'role', media: 'image' } },
        }),
      ],
    }),
    defineField({
      name: 'copy',
      title: 'Tekst na sajtu',
      description: 'Svaki natpis. Ključ ne menjaj. Srpski i English su tekst koji gosti vide. Novu uslugu dodaj u Cenovnik.',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'copyLine',
          fields: [
            defineField({ name: 'key', title: 'Ključ', type: 'string' }),
            defineField({ name: 'sr', title: 'Srpski', type: 'text', rows: 3 }),
            defineField({ name: 'en', title: 'English', type: 'text', rows: 3 }),
          ],
          preview: { select: { title: 'key', subtitle: 'sr' } },
        }),
      ],
    }),
    defineField({
      name: 'theme',
      title: 'Boje',
      type: 'object',
      fields: [
        defineField({
          name: 'preset',
          title: 'Set',
          type: 'string',
          options: {
            list: [
              { title: 'Roze', value: 'rose' },
              { title: 'Blush', value: 'blush' },
              { title: 'Mauve', value: 'mauve' },
              { title: 'Nude', value: 'nude' },
              { title: 'Berry', value: 'berry' },
              { title: 'Žalfija', value: 'zalfija' },
              { title: 'Posebno', value: 'custom' },
            ],
          },
        }),
        defineField({
          name: 'colors',
          title: 'Tokeni',
          type: 'object',
          fields: [
            hex('bg', 'Pozadina'),
            hex('sand', 'Pesak'),
            hex('card', 'Kartica'),
            hex('text', 'Tekst'),
            hex('muted', 'Prigušeno'),
            hex('accent', 'Glavna'),
            hex('gold', 'Zlatna'),
            hex('dark', 'Tamna'),
            hex('sage', 'Sage'),
          ],
        }),
      ],
    }),
  ],
});
