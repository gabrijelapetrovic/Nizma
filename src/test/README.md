# Testovi — Nokti & Trepavice

Vitest + Testing Library + jsdom. Komponente studija, i18n, radno vreme, XSS i putanje slika.

Trenutno: **21 fajl**, **76 testova** (`npm test -- --run`).

## Pokretanje

```bash
npm test -- --run
npm test
```

Pokrivenost (ako je instaliran `@vitest/coverage-v8`):

```bash
npx vitest run --coverage
```

## Fajlovi (`src/test/`)

| Fajl | Šta proverava |
|---|---|
| `setup.ts` | jsdom cleanup, `matchMedia`, `fetch`, `scrollIntoView` |
| `App.test.tsx` | Landing: hero, priča, ritam, cenovnik, paketi, galerija, kontakt, podnožje |
| `Navbar.test.tsx` | O nama, Cenovnik, Galerija, Lokacija, telefon, mobilni meni |
| `Hero.test.tsx` | Naslov, Cenovnik |
| `About.test.tsx` | Priča, kartice, „Kako izgleda termin“ |
| `Experience.test.tsx` | Nokti, trepavice, ritam studija |
| `Menu.test.tsx` | Kategorije usluga, pretraga, tagovi |
| `MenuItemModal.test.tsx` | Modal, ESC |
| `Events.test.tsx` | Paketi |
| `Gallery.test.tsx` | Filteri, lightbox |
| `LightboxModal.test.tsx` | Strelice, ESC |
| `Reviews.test.tsx` | Sekcija se ne prikazuje dok nema pravih utisaka |
| `LocationContact.test.tsx` | Adresa, Ponedeljak–Petak i Subota, FAQ, mapa na klik |
| `Footer.test.tsx` | Kontakt, autor Ognjen Dabić, bez newslettera |
| `Image.test.tsx` | WebP srcset, lokalni asseti, Unsplash URL |
| `constants.test.ts` | Studio, kategorije, prazni utisci, žive Unsplash putanje |
| `hours.test.ts` | 09–20 / subota 09–15 / nedelja |
| `i18n.test.ts` | Isti ključevi SR i EN, `hours.monFri` |
| `security.test.ts` | XSS, telefon, email, datumi |
| `adminAuth.test.ts` | Dozvoljeni URL-ovi slika (`https`, `/assets`) |
| `publishContent.test.ts` | Stari helper: skidanje `idb:` i `src/assets` → `/assets` |

## Okruženje

- `vitest.config.ts` — jsdom, setup `src/test/setup.ts`
- `matchMedia` u setup-u simulira desktop (`min-width: 641px`) osim ako test to ne prepiše
- Komponente čitaju jezik i sadržaj iz podrazumevanih vrednosti (SR + `defaultSiteContent`)

Sadržaj sajta menja se u Sanity Studio (`/studio`). Ovi testovi ne otvaraju Studio.
