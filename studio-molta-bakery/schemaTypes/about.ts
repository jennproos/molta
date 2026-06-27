import {defineType, defineField} from 'sanity'

export const about = defineType({
  name: 'about',
  title: 'About',
  type: 'document',
  fields: [
    defineField({
      name: 'body',
      title: 'Content',
      type: 'array',
      of: [{type: 'block'}],
      description: 'The about section text. Each paragraph is a separate block.',
    }),
  ],
  preview: {
    select: {},
    prepare() {
      return {title: 'About'}
    },
  },
})
