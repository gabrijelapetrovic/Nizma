# Testovi — Nokti & Trepavice

Vitest + Testing Library + jsdom. Komponente studija, i18n, radno vreme, XSS, admin PIN, putanje slika i objava sadržaja.

Trenutno: **22 fajla**, **88 testova** (`npm test -- --run`).

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
| `App.test.tsx` | Integracija landing stranice (lazy sekcije preko `findByText`) |
| `Navbar.test.tsx` | O nama, Cenovnik, Galerija, Lokacija, telefon, mobilni meni |
| `Hero.test.tsx` | Naslov, Zakaži termin, Cenovnik |
| `About.test.tsx` | Priča, kartice, „Kako izgleda termin“ |
| `Experience.test.tsx` | Nokti, trepavice, ritam studija |
| `Menu.test.tsx` | Kategorije usluga, pretraga, tagovi |
| `MenuItemModal.test.tsx` | Modal, ESC |
| `Events.test.tsx` | Paketi, potvrda termina porukom |
| `Gallery.test.tsx` | Filteri, lightbox |
| `LightboxModal.test.tsx` | Strelice, ESC |
| `Reservation.test.tsx` | Tretman, bez broja osoba, sati unutar radnog vremena, XSS, Formspree |
| `Reviews.test.tsx` | Sekcija se ne prikazuje dok nema pravih utisaka |
| `LocationContact.test.tsx` | Adresa, Ponedeljak–Petak i Subota, FAQ, mapa na klik |
| `Footer.test.tsx` | Instagram umesto newslettera, autor |
| `Image.test.tsx` | WebP srcset, lokalni asseti, Unsplash URL |
| `constants.test.ts` | Studio, kategorije, prazni utisci, žive Unsplash putanje |
| `hours.test.ts` | 09–20 / subota 09–15 / nedelja, termini za formu |
| `i18n.test.ts` | Isti ključevi SR i EN, `hours.monFri` |
| `security.test.ts` | XSS, telefon, email, datumi |
| `adminAuth.test.ts` | PIN hash, lockout, allowlist slika (`https`, `/assets`, `idb`) |
| `publishContent.test.ts` | Skidanje `idb:` pre Git-a, stari Freedom/Luna draft, `src/assets` → `/assets` |

## Okruženje

- `vitest.config.ts` — jsdom, setup `src/test/setup.ts`
- `matchMedia` u setup-u simulira desktop (`min-width: 641px`) osim ako test to ne prepiše
- Komponente čitaju jezik/sadržaj iz context default vrednosti (SR + `defaultSiteContent`), bez obaveznog Provider-a
- `App.test.tsx` čeka lazy chunkove (`timeout: 5000`)

Admin UI (traka Sačuvaj/Objavi, liste, upload slika) **nije** e2e u pregledaču. Logika PIN-a, sanitizacije putanja i publish payload-a jeste u unit testovima.
