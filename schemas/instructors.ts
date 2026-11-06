import { defineField, defineType } from "sanity";

export default defineType({
  name: "instructors",
  title: "Instruktori",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Ime",
      type: "string",
    }),
    defineField({
      name: "surname",
      title: "Prezime",
      type: "string",
    }),
    defineField({
      name: "show",
      title: "Pokaži u Instruktor Listi",
      type: "boolean",
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
    }),
    defineField({
      name: "phoneNumber",
      title: "Broj Telefona",
      type: "string",
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "name",
        maxLength: 96,
      },
    }),
    defineField({
      name: "knowledge",
      title: "Poznaje plesove",
      type: "array",
      of: [{ type: "reference", to: { type: "dances" } }],
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "socials",
      title: "Socijalne Mreže",
      type: "array",
      of: [
        {
          name: "social",
          type: "object",
          fields: [
            {
              name: "socialName",
              type: "string",
              title: "Socijalna Mreža",
              options: {
                list: [
                  { title: "facebook", value: "facebook" },
                  { title: "instagram", value: "instagram" },
                  { title: "youtube", value: "youtube" },
                ],
                layout: "dropdown",
              },
            },
            {
              name: "url",
              type: "url",
              title: "Link Socijalne Mreže",
            },
          ],
        },
      ],
    }),
    defineField({
      name: "description",
      title: "Kratki Opis",
      type: "string",
    }),
    defineField({
      name: "bio",
      title: "Bio",
      type: "array",
      of: [
        {
          title: "Block",
          type: "block",
          styles: [{ title: "Normal", value: "normal" }],
          lists: [],
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: "name",
      media: "image",
    },
  },
});
