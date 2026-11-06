import { defineArrayMember, defineField, defineType } from 'sanity';
import defaults from '../content/default-pricing.json';
const amount = () => defineField({ name: 'amount', title: 'Cijena', type: 'number', validation: r => r.min(0).precision(2).custom((value, context) => typeof value === 'number' || context.parent && (context.parent as { priceText?: string }).priceText ? true : 'Unesi cijenu ili tekst umjesto cijene.') });
const priceText = () => defineField({ name: 'priceText', title: 'Tekst umjesto cijene', type: 'string', description: 'Neobavezno: npr. „Na upit” ili „Besplatno”. Ako je popunjeno, prikazuje se umjesto broja.' });
export default defineType({
  name: 'pricingSettings', title: 'Cjenik', type: 'document', initialValue: defaults,
  groups: [{ name: 'prices', title: 'Cijene i paketi', default: true }, { name: 'texts', title: 'Naslovi i postavke' }],
  fields: [
    defineField({ name: 'title', title: 'Interni naziv', type: 'string', hidden: true, initialValue: 'Cjenik studija' }),
    defineField({ name: 'enabled', title: 'Prikaži cjenik na stranici', type: 'boolean', initialValue: true, group: 'texts' }),
    defineField({ name: 'currency', title: 'Valuta', type: 'string', initialValue: 'EUR', options: { list: [{ title: 'Euro (€)', value: 'EUR' }, { title: 'Američki dolar ($)', value: 'USD' }, { title: 'Britanska funta (£)', value: 'GBP' }, { title: 'Švicarski franak (CHF)', value: 'CHF' }] }, validation: r => r.required(), group: 'texts' }),
    defineField({ name: 'eyebrow', title: 'Mali naslov iznad cjenika', type: 'string', group: 'texts' }),
    defineField({ name: 'heading', title: 'Glavni naslov', type: 'string', group: 'texts' }),
    defineField({ name: 'accent', title: 'Istaknuti dio naslova', type: 'string', group: 'texts' }),
    defineField({ name: 'description', title: 'Uvodni opis', type: 'text', rows: 3, group: 'texts' }),
    defineField({ name: 'note', title: 'Napomena ispod cjenika', type: 'text', rows: 3, group: 'texts' }),
    defineField({ name: 'cards', title: 'Ponude i cijene', type: 'array', group: 'prices', description: 'Dodaj ponudu, uredi iznose i pakete. Povuci ručicu uz ponudu da promijeniš redoslijed na stranici.', of: [defineArrayMember({
      name: 'priceCard', title: 'Ponuda', type: 'object', initialValue: { enabled: true, featured: false, buttonAction: 'registration', buttonText: 'Prijavi se' },
      fields: [
        defineField({ name: 'enabled', title: 'Prikaži ovu ponudu', type: 'boolean', initialValue: true }),
        defineField({ name: 'label', title: 'Kategorija / mali naslov', type: 'string', description: 'Primjer: GRUPNI TRENINZI', validation: r => r.required() }),
        defineField({ name: 'title', title: 'Naslov ponude', type: 'text', rows: 2, description: 'Novi red ovdje postaje novi red u naslovu kartice.', validation: r => r.required() }),
        amount(), priceText(),
        defineField({ name: 'unit', title: 'Oznaka uz cijenu', type: 'string', description: 'Primjer: / mjesečno po osobi, / mjesečno po paru ili / sat.' }),
        defineField({ name: 'description', title: 'Opis i što je uključeno', type: 'text', rows: 3 }),
        defineField({ name: 'featured', title: 'Istakni ponudu narančastom bojom', type: 'boolean', initialValue: false }),
        defineField({ name: 'badge', title: 'Oznaka iznad ponude', type: 'string', description: 'Primjer: NAJPOPULARNIJE ili ZAJEDNO JE BOLJE.' }),
        defineField({ name: 'packages', title: 'Paketi unutar ponude', type: 'array', description: 'Neobavezno. Npr. 6 + 1 sat gratis. Pakete možeš povlačiti u željeni redoslijed.', of: [defineArrayMember({ name: 'pricePackage', title: 'Paket', type: 'object', fields: [defineField({ name: 'title', title: 'Naziv paketa', type: 'string', validation: r => r.required() }), amount(), priceText()], preview: { select: { title: 'title', amount: 'amount', text: 'priceText' }, prepare({ title, amount, text }) { return { title, subtitle: text || `${amount ?? '—'}` }; } } })] }),
        defineField({ name: 'buttonText', title: 'Tekst gumba', type: 'string', description: 'Ako ostaviš prazno, gumb se ne prikazuje.' }),
        defineField({ name: 'buttonAction', title: 'Gumb vodi na', type: 'string', options: { list: [{ title: 'Prijavu na probni trening', value: 'registration' }, { title: 'Kontaktni obrazac', value: 'contact' }, { title: 'Raspored treninga', value: 'schedule' }] }, initialValue: 'registration' }),
      ],
      preview: { select: { title: 'label', amount: 'amount', unit: 'unit', text: 'priceText', enabled: 'enabled', featured: 'featured' }, prepare({ title, amount, unit, text, enabled, featured }) { return { title: `${featured ? '★ ' : ''}${title || 'Nova ponuda'}`, subtitle: enabled === false ? 'Skrivena ponuda' : `${text || amount || 0} ${unit || ''}` }; } },
    })], validation: r => r.min(1) }),
  ],
  preview: { prepare: () => ({ title: 'Cjenik studija', subtitle: 'Cijene, paketi i prikaz na stranici' }) },
});
