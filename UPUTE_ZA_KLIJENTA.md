# Raspored i cjenik — upute za Ventus

Otvori `/studio` na adresi stranice i prijavi se postojećim Sanity računom.

## Kreiranje rasporeda

1. U lijevom izborniku odaberi **Rasporedi treninga** i kreiraj novi raspored.
2. Upiši naziv, primjerice „Zagreb — grupni treninzi”.
3. U kartici **Postavke i objava** možeš zadati lokaciju, dvoranu, razinu i trajanje koje će novi termini automatski predlagati.
4. Vrati se na **Tjedni raspored** i klikni **Dodaj termin** pod željenim danom.
5. Odaberi ples ili ručno upiši naziv. Postavi početak, završetak i lokaciju. Po želji dodaj dvoranu, instruktora, broj mjesta i napomenu.
6. Klikni **Dodaj termin**. Za dodatne treninge ponovi postupak.
7. Kada je sve spremno, klikni **Publish / Objavi** u Sanity Studiju.

## Mijenjanje termina

- **Uredi** otvara detalje termina, uključujući vrijeme početka i završetka.
- **Povuci karticu u drugi dan** za brzo premještanje. Satnica ostaje ista; promijeni je kroz Uredi ako treba.
- **Premjesti → Odaberi dan** radi i na mobitelu ili tipkovnicom.
- **Kopiraj** stvara novi termin s istim podacima. Obavezno provjeri vrijeme kopije.
- Ikona koša traži potvrdu prije uklanjanja termina. Ostali termini ostaju sačuvani.
- Unutar dana javna stranica sortira termine po početku treninga, ne po redoslijedu povlačenja.
- **Prikaži ovaj termin na stranici** omogućuje privremeno skrivanje bez brisanja.
- Ako se termini preklapaju u istoj dvorani ili za istog instruktora, prikazuje se upozorenje. Ako su treninzi na istoj adresi, a u različitim dvoranama, upiši dvorane da budu jasno razdvojeni.
- Broj mjesta prikazuje ukupan kapacitet grupe; sustav ga ne smanjuje automatski nakon prijava.

Promjene u Studiju prvo su nacrt. Posjetitelji ih vide tek nakon **Publish / Objavi**. Nakon objave kratko pričekaj i osvježi stranicu; predmemorija se osvježava otprilike svake dvije minute.

## Postavke rasporeda

- **Prikaži raspored na stranici** skriva ili prikazuje cijeli raspored nakon objave.
- **Glavni raspored** prikazuje se prvi i koristi na naslovnici. Ako mijenjaš glavni raspored, isključi tu postavku na prethodnom i objavi oba.
- **Redoslijed prikaza** slaže dodatne rasporede; manji broj prikazuje se prije većeg.
- **Prikaži od datuma / zaključno do datuma** omogućuje sezonske rasporede. Prazna polja znače prikaz bez datumskog ograničenja. Datumi se računaju prema vremenskoj zoni Europe/Zagreb.
- Zadane vrijednosti vrijede za nove termine; ne prepisuju ranije unesene termine.

Gumb **Klasični uređivač** otvara standardni Sanity prikaz. Može pomoći pri uređivanju starijih zapisa. Postojeći rasporedi nisu brisani niti zamijenjeni.

## Uređivanje cjenika

1. U lijevom izborniku odaberi **Cjenik**.
2. U kartici **Cijene i paketi** otvori ponudu koju želiš promijeniti.
3. Uredi iznos, oznaku uz cijenu, naslov, opis i tekst gumba.
4. U polju **Tekst umjesto cijene** možeš napisati „Na upit” ili „Besplatno”. Taj tekst ima prednost pred brojčanim iznosom.
5. Za privatne lekcije možeš dodavati, mijenjati i brisati pakete, primjerice „6 + 1 sat gratis — 240 €”.
6. Povlačenjem standardne Sanity ručice uz ponudu ili paket promijeni redoslijed prikaza.
7. Za narančastu karticu uključi **Istakni ponudu**; oznaku poput „NAJPOPULARNIJE” možeš sam upisati.
8. Ponudu možeš sakriti prekidačem **Prikaži ovu ponudu**, bez brisanja.
9. U kartici **Naslovi i postavke** uređuju se valuta, naslovi, opis i napomena, a može se sakriti i cijeli cjenik.
10. Klikni **Publish / Objavi**.

Početne cijene ostale su 50 € za grupne treninge, 70 € po paru te 40 € po privatnom satu, s postojećim paketima. Sve navedene iznose sada možeš uređivati bez promjene koda stranice.

## Prijava i pristup

Projekt, dataset i Sanity računi ostali su isti. Ako na novoj lokalnoj ili testnoj adresi Studio pokaže poruku **Connect this Studio / Add CORS origin**, ta adresa treba biti dopuštena u postavkama postojećeg Sanity projekta. To nije gubitak podataka niti zahtjev za novom bazom. Za produkciju koristi postojeću adresu i postojeće administratorske račune.
