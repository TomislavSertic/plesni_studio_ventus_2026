# Ventus 2026

Nova Next.js stranica za Plesni studio Ventus, napravljena u zasebnoj mapi. Originalni projekt nije mijenjan. Sučelje je na hrvatskom; dizajn koristi originalni logo, narančaste i bakrene tonove, toplu svijetlu podlogu, plesne fotografije i diskretnu Three.js animaciju.

## Lokalno pokretanje

Potreban je **Node.js 22.12 ili noviji**.

```powershell
npm ci
npm run dev
```

Pregled: http://localhost:3338. Sanity Studio: http://localhost:3338/studio.

```powershell
npm run build
npm start
```

`npm start` poštuje varijablu `PORT` hostinga; bez nje koristi port 3000. Za produkcijski pregled na 3338 u PowerShellu postavi `$env:PORT = '3338'` prije `npm start`.

## Zamjena postojećeg projekta na hostingu

1. Postavi sadržaj ove mape kao novi izvor postojećeg projekta/repozitorija. `.git` starog projekta nije kopiran niti je promijenjen njegov remote.
2. Na hostingu postavi Node.js 22.12+ i standardni Next.js build (`npm run build`). Za samostalni Node hosting koristi `npm start`. Stranica zahtijeva server za API i SMTP; nije statički export.
3. Zadrži postojeće varijable okruženja: `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `NEXT_PUBLIC_SANITY_API_VERSION`, `NEXT_PUBLIC_SANITY_TOKEN`, `MAILTRAP_USER`, `MAILTRAP_PASS`, `SEND_FROM_EMAIL`, `SEND_TO_EMAIL`. Njihove vrijednosti nisu promijenjene. Lokalna `.env.local` kopirana je iz izvornog projekta i isključena iz Gita.
4. Na istoj domeni nisu potrebni novi Sanity projekt, dataset, migracija podataka ni promjena SMTP pružatelja. Ako koristiš novu domenu ili želiš pristupati Studiju na novom lokalnom portu, taj origin mora biti dopušten u postojećim Sanity CORS postavkama. Ovaj projekt ne mijenja te postavke.
5. Nakon objave provjeri `/studio`, raspored, jednu stvarnu prijavu i jednu kontaktnu poruku, uključujući primitak email obavijesti na postojećoj adresi.

`NEXT_PUBLIC_SITE_URL` je opcionalan; zadana domena ostaje `https://www.plesni-studio-ventus.hr`.

Preporučeno za buduće postavke: Sanity token možeš spremiti kao `SANITY_API_TOKEN`. Ima prednost pred starim nazivom. Stari naziv ostaje podržan radi zamjene bez promjene postojećeg hostinga. Token koristi isključivo serverski modul; Studio ne prima token iz aplikacije.

## Sadržaj i postojeće adrese

| Adresa | Izvor / funkcija |
| --- | --- |
| `/` | Novi pregled programa, priča studija, raspored, instruktori, novosti i česta pitanja |
| `/classes`, `/classes/[slug]` | Sanity `dances`, filter `teaching`, istaknuti programi `highlighted`, pretraga i načini poduke |
| `/schedule` | Svi objavljeni `scheduleSchema`, glavni raspored prvi; dani, lokacije, razine, napomene i vrijeme iz baze |
| `/schedule#price-list` | Sanity `pricingSettings`, dokument `ventus-pricing`: ponude, cijene, paketi, tekstovi, valuta, redoslijed i vidljivost |
| `/schedule#free-lesson` | Prijava na probni trening, odabir programa i kontakta |
| `/aboutus`, `/aboutus#instructors` | Priča studija i vidljivi instruktori (`show`) |
| `/instructors/[slug]` | Biografija, plesovi, kontakti i društvene mreže instruktora |
| `/news`, `/news/[slug]` | Objavljene vijesti, kategorije, autori, bogati tekst, slike i YouTube |
| `/events`, `/events/[slug]` | Događanja s terminom, mjestom, organizatorom i cijenom; prošli događaji prikazani kao arhiva |
| `/contact` | Kontaktni obrazac, postojeći kontakti, stvarne lokacije iz rasporeda |
| `/privacypolicy` | Objašnjenje obrade podataka obrazaca |
| `/studio` | Isti Sanity projekt, dataset i imena postojećih shema |
| `/api/contact`, `/api/registration`, `/api/mail` | Sačuvane API adrese i stare vrijednosti `wantedResponse` |
| `/sitemap.xml`, `/robots.txt` | Automatski generirani iz stvarnih adresa; Studio isključen iz indeksiranja |

Sadržaj se osvježava uz Next.js revalidaciju od 120 sekundi. Draftovi nisu vidljivi javnim posjetiteljima. Nova stranica prikazuje stvarne objavljene podatke, uključujući postojeće nazive i napomene u rasporedu. Testne nazive iz sadržaja treba urediti u Studiju ako nisu namijenjeni posjetiteljima.

Raspored ima vizualni uređivač po danima s povlačenjem kartica, ručnim premještanjem, dodavanjem, uređivanjem, kopiranjem i potvrdom brisanja. Postavke uključuju vidljivost, glavni raspored, redoslijed, datume prikaza te zadanu lokaciju, dvoranu, trajanje i razinu novih termina. Termini podržavaju instruktora, dvoranu i informativni kapacitet. Provjeravaju se vremena i upozorava se na preklapanja. Promjene se spremaju granularnim Sanity zakrpama po `_key`, bez zamjene cijelog rasporeda.

Sačuvani su tipovi `scheduleSchema`, `daySchedule`, `scheduleClass` i stariji `classEntry`, kao i postojeći nazivi polja i zapisi. Duplicirana inline definicija dana zamijenjena je zajedničkim tipom, bez migracije podataka. Referenca programa vodi na dokument `dances`. Javna stranica filtrira skrivene termine i rasporede izvan zadanih datuma; postojeći zapisi bez novih postavki ostaju vidljivi.

Studio sadrži zaseban odjeljak „Cjenik”. Početni dokument `ventus-pricing` inicijaliziran je postojećim iznosima. Skripta `node --env-file=.env.local scripts/initialize-pricing.mjs` može se sigurno ponoviti: koristi `createIfNotExists` i ne prepisuje klijentove izmjene. Ako se projekt postavlja na drugi dataset, pokreni je tamo ili otvori Cjenik u Studiju i objavi početne vrijednosti. Sve nove izmjene rasporeda i cjenika klijent potvrđuje standardnim gumbom Publish / Objavi.

Upute za klijenta: [UPUTE_ZA_KLIJENTA.md](UPUTE_ZA_KLIJENTA.md).

## Obrasci i email

Novi obrasci šalju jedan zahtjev na `/api/contact` ili `/api/registration`. Server validira podatke, sprema dokument u postojeću odgovarajuću Sanity kolekciju i šalje obavijest preko istog Mailtrapa (`live.smtp.mailtrap.io:587`, TLS) s postojećim pošiljateljem i primateljem. API `/api/mail` ostaje dostupan radi kompatibilnosti.

Ako Sanity spremanje ne uspije, obrazac prikazuje grešku. Ako je zapis spremljen, ali slanje emaila nije potvrđeno, obrazac to izričito navodi i prikazuje telefon. Ne prikazuje se lažna potvrda dostave. `requestId` sprečava stvaranje više zapisa kod ponavljanja istog zahtjeva; status obavijesti čuva se uz dokument. SMTP ne može jamčiti strogo jednokratnu dostavu ako se veza prekine nakon slanja, a prije potvrde.

Dodani su server-side provjera kontakata, ograničenja duljine, escaping sadržaja emaila, honeypot, provjera origina, ograničenje ponovljenih zahtjeva po procesu i pristupačne poruke statusa. Za više paralelnih server instanci ograničenje zahtjeva može se dodatno postaviti na hostingu.

## Provjere

```powershell
npm test
npm run typecheck
npm run verify:integrations
npm run build
```

Provjera Sanity shema: `node --env-file=.env.local node_modules/@sanity/cli/bin/run.js schema validate`. Rezultat nakon nadogradnje uređivača: 0 grešaka i 0 upozorenja.

Provjera svih objavljenih adresa i neispravnih API zahtjeva na pokrenutom serveru: `node --env-file=.env.local scripts/smoke.mjs http://localhost:3338`. Skripta ne šalje stvarne upite. Ujedno provjerava da vrijednosti pristupnih podataka nisu ugrađene u javne produkcijske JavaScript datoteke.

`verify:integrations` provjerava čitanje Sanityja, ovlasti pisanja u obje kolekcije kroz **dry run** i SMTP vezu, TLS i autentikaciju. Ne stvara zapise i ne šalje poruke. Stvarna dostava do primatelja provjerava se zasebnom prijavom nakon objave.

Three.js efekt se isključuje na manjim ekranima, uz `prefers-reduced-motion` i kada WebGL nije dostupan. Animacija staje izvan vidljivog područja. Osnovni sadržaj i navigacija ne ovise o 3D efektu. Fontovi su lokalno servirani kroz pakete Fontsource.
