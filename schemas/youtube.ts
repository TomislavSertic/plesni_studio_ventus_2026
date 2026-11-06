import { defineField, defineType } from "sanity";
// youtube.js
export default defineField({
  name: "youtube",
  type: "object",
  title: "YouTube Embed",
  fields: [
    {
      name: "url",
      type: "url",
      title: "YouTube video URL",
    },
    {
      name: "videoDesc",
      type: "string",
      title: "Opis Videa",
    },
  ],
  preview: {
    select: {
      url: "url",
    },
  },
});
