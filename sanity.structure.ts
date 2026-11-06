import type { StructureResolver } from 'sanity/structure';
import { CalendarDays, CircleDollarSign, Mail, Music2, Newspaper, PartyPopper, Users } from 'lucide-react';
export const structure: StructureResolver = S => S.list().title('Ventus · upravljanje').items([
  S.documentTypeListItem('scheduleSchema').title('Rasporedi treninga').icon(CalendarDays),
  S.listItem().title('Cjenik').icon(CircleDollarSign).child(S.document().schemaType('pricingSettings').documentId('ventus-pricing').title('Cjenik studija')),
  S.divider(),
  S.documentTypeListItem('dances').title('Plesovi i programi').icon(Music2),
  S.documentTypeListItem('instructors').title('Instruktori').icon(Users),
  S.documentTypeListItem('post').title('Novosti').icon(Newspaper),
  S.documentTypeListItem('event').title('Događanja').icon(PartyPopper),
  S.divider(),
  S.documentTypeListItem('registrationMessage').title('Prijave na trening').icon(Mail),
  S.documentTypeListItem('contactMessage').title('Kontaktne poruke').icon(Mail),
  S.divider(),
  S.documentTypeListItem('category').title('Kategorije'),
  S.documentTypeListItem('author').title('Autori objava'),
]);
