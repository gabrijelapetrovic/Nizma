# Nokti & Trepavice

Jednostrani sajt za studio noktiju i trepavica u Užicu. Tekst, slike, cene i boje menjaju se u Sanity Studio na `/studio`. Izmena sadržaja ne pravi novi deploy.

## Studio

Otvori `/studio`, dokument **Sajt**.

| Polje | Šta menja |
|---|---|
| Naziv, opis, telefon, adresa, mreže | Kontakt i podnožje |
| Radno vreme | Ponedeljak–petak 09:00–20:00, subota 09:00–15:00, nedelja zatvoreno, dok se u Studiju ne promeni |
| Cenovnik | Usluge. **Add item** dodaje novu uslugu na sajt |
| Ponude, galerija, utisci | Iste sekcije. Utisci se prikazuju tek kad postoji bar jedan |
| Slike sekcija | Hero, o nama i kartice ritma rada |
| Tekst na sajtu | Natpisi. Svaki red ima **Srpski** i **English**. Ključ ne menjaj |
| Ikonica u tabu | Favicon. Prazno polje ostavlja `public/favicon.svg` |
| Boje | Paleta. Podrazumevana je roze, `#C23B6E` |

**Zakaži termin** vodi na kontakt: telefon, WhatsApp i Viber. Forme za zakazivanje nema.

## Pokretanje

```bash
npm install
npm run dev
```

Sajt je na [http://localhost:3000](http://localhost:3000). Studio je na [http://localhost:3000/studio](http://localhost:3000/studio).

```bash
npm run typecheck
npm test
npm run build
```

## Okruženje

Kopiraj `.env.example` u `.env.local`. Ista imena na Vercelu:

- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET` (`production`)
- `SANITY_API_READ_TOKEN` ili `SANITY_API_WRITE_TOKEN` (samo server, bez `NEXT_PUBLIC_`)

CORS za Studio: `http://localhost:3000` i adresa objavljenog sajta, sa uključenim Allow credentials.

Dok ID projekta nije unet, stranice čitaju `public/site-content.json`.

## Tehnologija

Next.js App Router, React 19, TypeScript, Tailwind CSS 4, Sanity, Vitest.

Pravne stranice: `/privacy`, `/terms`.

## Struktura

```
app/                 Next stranice, Studio, /api/site
public/              favicon, site-content.json
sanity/              šema i GROQ
src/components/      stranica
src/content/         sadržaj i tema
src/i18n/            SR / EN
src/test/            Vitest
```

Slike ispod prvog ekrana učitavaju se kad zatrebaju. Hero slika ide odmah. Sekcije između heroja i podnožja su u prvom prikazu.
