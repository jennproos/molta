import {defineType, defineField} from 'sanity'
import {CommentIcon} from '@sanity/icons'

export const testimonial = defineType({
  name: 'testimonial',
  title: 'Testimonial',
  type: 'document',
  icon: CommentIcon,
  fields: [
    defineField({
      name: 'customerName',
      title: 'Customer Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'quote',
      title: 'Quote',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'service',
      title: 'Which service is this about?',
      type: 'string',
      options: {
        list: [
          {title: 'Pastry Box', value: 'pastryBox'},
          {title: 'Lunch Sandwiches', value: 'sandwiches'},
          {title: 'Bread & English Muffin Subscription', value: 'breadSubscription'},
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'customerName',
      subtitle: 'quote',
    },
  },
})
