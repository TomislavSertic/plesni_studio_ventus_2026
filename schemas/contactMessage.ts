import { defineField, defineType } from "sanity";

export default defineType({
  name: "contactMessage",
  title: "Poruka - Kontakt",
  type: "document",
  fields: [
    defineField({
      name: "responded",
      title: "Odgovoreno",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "name",
      title: "Ime Pošaljitelja",
      type: "string",
    }),
    defineField({
      name: "wantedResponse",
      title: "Želi da mu se odgovori",
      type: "string",
    }),
    defineField({
      name: "email",
      title: "Email adresa",
      type: "string",
    }),
    defineField({
      name: "phoneNumber",
      title: "Broj Telefona",
      type: "string",
    }),
    defineField({
      name: "message",
      title: "Poruka",
      type: "text",
    }),
    defineField({
      name: "dateRecived",
      title: "Datum Poruke",
      type: "datetime",
      initialValue: new Date().toISOString(),
    }),
  ],
});
