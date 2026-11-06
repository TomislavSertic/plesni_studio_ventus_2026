import { defineField, defineType } from "sanity";

export default defineType({
  name: "dances",
  title: "Plesovi",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Ime Plesa",
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
      name: "teaching",
      title: "Predajemo",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "highlighted",
      title: "Istaknuto",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "teachingOptions",
      title: "Način Predavanja",
      type: "array",
      of: [
        {
          name: "teachingOption",
          title: "Opcija",
          type: "string",
          options: {
            list: [
              { title: "Grupe", value: "Grupe" },
              { title: "Privatne Lekcije", value: "Privatne Lekcije" },
              { title: "Video Lekcije", value: "Video Lekcije" },
            ],
            layout: "dropdown",
          },
        },
      ],
    }),
    defineField({
      name: "image",
      title: "Slika",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "categories",
      title: "Kategorije",
      type: "array",
      of: [{ type: "reference", to: { type: "category" } }],
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "blockContent",
    }),
  ],
});
