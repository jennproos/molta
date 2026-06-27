import {defineType, defineField} from 'sanity'

export const marketEvent = defineType({
  name: 'marketEvent',
  title: 'Market Event',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Market Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'date',
      title: 'Date',
      type: 'date',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'time',
      title: 'Time',
      type: 'string',
      description: 'e.g. 9am – 1pm',
      validation: (Rule) => Rule.required(),
    }),
  ],
  orderings: [
    {
      title: 'Date, Ascending',
      name: 'dateAsc',
      by: [{field: 'date', direction: 'asc'}],
    },
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'date',
    },
  },
})
