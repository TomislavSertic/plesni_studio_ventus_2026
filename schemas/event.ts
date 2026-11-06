import { defineField, defineType } from "sanity";

export default defineType({
  name: "event",
  title: "Event",
  type: "document",
  fields: [
    defineField({
      name: "postType",
      title: "Post Type",
      type: "string",
      readOnly: true,
      initialValue: "event",
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
    }),
    defineField({
      name: "organizator",
      title: "Organizator",
      type: "reference",
      to: { type: "instructors" },
    }),
    defineField({
      name: "mainImage",
      title: "Main image",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "categories",
      title: "Tagovi",
      type: "array",
      of: [{ type: "reference", to: { type: "category" } }],
    }),
    defineField({
      name: "publishedAt",
      title: "Objavljeno",
      type: "datetime",
    }),
    defineField({
      name: "eventStart",
      title: "Početak eventa",
      type: "datetime",
    }),
    defineField({
      name: "eventEnd",
      title: "Kraj eventa",
      type: "datetime",
    }),
    defineField({
      name: "eventPrice",
      title: "Cijena Eventa (Euro) ",
      type: "number",
    }),
    defineField({
      name: "eventOrganizer",
      title: "Organizator eventa",
      type: "string",
    }),
    defineField({
      name: "eventVenue",
      title: "Ime Prostorije Eventa",
      type: "string",
    }),
    defineField({
      name: "eventVenueAddress",
      title: "Adresa Prostorije",
      type: "string",
    }),
    defineField({
      name: "description",
      title: "Kratak opis eventa",
      type: "string",
    }),
    defineField({
      name: "body",
      title: "Tekst Eventa",
      type: "blockContent",
    }),
  ],

  preview: {
    select: {
      title: "title",
      author: "author.name",
      media: "mainImage",
    },
    prepare(selection) {
      const { author } = selection;
      return { ...selection, subtitle: author && `by ${author}` };
    },
  },
});
