# Nokti & Trepavice

Jednostrani sajt za studio noktiju i trepavica u Užicu: usluge, ponude, galerija, zakazivanje i SR/EN.

Tekst, slike i boje menjaju se u Sanity Studio na `/studio`.

## Studio

| Polje | Vrednost |
|---|---|
| Naziv | Nokti & Trepavice |
| Adresa | Užice, Srbija (ulica se unosi u Sanityju) |
| Telefon | [069 159 6686](tel:+381691596686) |
| E-mail | zakazivanje@noktitrepavice.rs |
| Instagram | [@nokti_trepavice_uzice](https://www.instagram.com/nokti_trepavice_uzice/) |
| Mapa | Google Maps pin na Užice |

## Šta sajt radi

- Landing: hero, o nama (kako izgleda termin), ritam rada, **cenovnik**, paketi, galerija, zakazivanje, kontakt, FAQ
- Navigacija: O nama, Cenovnik, Galerija, Lokacija, telefon i **Zakaži termin**
- Radno vreme: ponedeljak–petak 09:00–20:00, subota 09:00–15:00, nedelja zatvoreno. Forma nudi samo sate unutar tog dana
- Utisci se prikazuju tek kad u Sanityju postoji bar jedan utisak. Podrazumevano ih nema
- WhatsApp u uglu i Viber u bloku za poruku, SR | EN, pravna stranica (`/privacy`, `/terms`)
- PWA (`sw.js` + `offline.html`)
- Izmene sadržaja: `/studio`
- Javni sajt prikazuje objavljeni sadržaj. Dok Sanity dokument ne postoji, to je `public/site-content.json`

## Tehnologija

Next.js (App Router), React 19, TypeScript, Tailwind CSS 4, Sanity, Vitest. Javni tekst, slike i boje i dalje dolaze iz `public/site-content.json` dok Sanity projekat nije povezan. Posle toga isti sadržaj čita GROQ, a izmena je u `/studio`.

Pokretanje: `npm run dev` (Next, port 3000). Provera: `npm run typecheck`, `npm run build`, `npm test`.

### Sanity — čeka nalog

U `.env.local` (ne commituje se):

- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET` (`production`)
- `SANITY_API_READ_TOKEN`
- `SANITY_API_WRITE_TOKEN`

`npm run migrate:sanity` samo ispiše mapiranje. `npm run migrate:sanity -- --write` šalje dokument `site` i slike tek kad token postoji. CORS za Studio: `http://localhost:3000`.

## Performanse

Cilj: visok Mobile skor bez rušenja Desktop-a.

- Prvi ekran: Navbar + Hero; ostale sekcije `lazy` / `DeferredSection`
- Telefon: bez Google fontova, bez hero fotografije dok CMS ne postavi sliku
- Fontovi na desktopu posle `window.load`
- `site-content.json` se vuče posle učitavanja stranice
- Slike iz admina: `src/assets/photos/` → `/assets/photos/…`

## Bezbednost

- CSP, HSTS, `nosniff` (`vercel.json`)
- Forme: XSS se odbija, ne tiho briše
- Admin PIN: SHA-256, lockout 5 / 15 min, sesija 45 min
- `/api/publish`: POST sa dozvoljenog origin-a (localhost, `*.vercel.app`) i PIN-a
- Token samo na serveru (`CMS_GITHUB_TOKEN`, nikad `VITE_`)

## Admin

| Akcija | Gde ostaje |
|---|---|
| Sačuvaj | `localStorage` ovog pregledača |
| Slika sa uređaja, pre Objavi | IndexedDB (pregled) |
| Slika sa uređaja, posle Objavi | Git `src/assets/photos/` → gosti `/assets/photos/ime.webp` |
| Objavi tekst / usluge | `public/site-content.json` |

**+** dodaje stavku, **−** briše. Usluge: ime, cena, opis, slika, kategorija.

PIN na Vercel: `ADMIN_PIN_HASH` i `VITE_ADMIN_PIN_HASH` (isti hex SHA-256). Objava: `CMS_GITHUB_TOKEN`, `GITHUB_REPO`, `GITHUB_BRANCH`.

```bash
npm run pin-hash -- tvojPIN
```

Lokalni `npm run dev` **ne** objavljuje u Git. **Objavi** radi na Vercel produkciji.

## Pokretanje

```bash
npm install
npm run dev          # http://localhost:5173
npm test -- --run
npm run lint
npm run build
```

Env: kopirajte `.env.example`. Testovi: [`src/test/README.md`](src/test/README.md).

## Struktura

```
public/              PWA, sitemap, site-content.json
api/publish.js       Objava u GitHub (Vercel)
src/assets/photos/   Slike iz admina posle Objavi
src/components/      UI
src/content/         CMS, tema, IndexedDB
src/pages/           Admin, legal
src/i18n/            SR / EN
src/utils/           sati, slike, PIN
src/test/            Vitest
```

Boje: `src/index.css` i admin kartica **Boje**.

## Licenca

Sajt studija za nokte i trepavice. Sva prava zadržana.
