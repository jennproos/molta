import {defineType, defineField, defineArrayMember} from 'sanity'
import {PackageIcon} from '@sanity/icons'

export const sandwichService = defineType({
  name: 'sandwichService',
  title: 'Lunch Sandwiches',
  type: 'document',
  icon: PackageIcon,
  fields: [
    defineField({
      name: 'description',
      title: 'What it is',
      type: 'array',
      of: [{type: 'block'}],
      description: 'The intro copy explaining the group sandwich order offering.',
    }),
    defineField({
      name: 'groupOrderNote',
      title: 'Group order process note',
      type: 'text',
      rows: 4,
      description: 'Explains that this is group orders only, how the date/availability flow works.',
    }),
    defineField({
      name: 'sandwiches',
      title: 'Sandwiches',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'sandwich',
          fields: [
            defineField({name: 'name', title: 'Name', type: 'string', validation: (Rule) => Rule.required()}),
            defineField({
              name: 'classicName',
              title: 'Classic name',
              type: 'string',
              description: 'The familiar name shown alongside the fun name, e.g. "BLT".',
            }),
            defineField({
              name: 'ingredients',
              title: 'Ingredients',
              type: 'array',
              of: [{type: 'string'}],
            }),
            defineField({name: 'price', title: 'Price (USD)', type: 'number', validation: (Rule) => Rule.required().min(0)}),
          ],
          preview: {
            select: {title: 'name', subtitle: 'classicName'},
          },
        }),
      ],
    }),
    defineField({
      name: 'sides',
      title: 'Sides',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'sandwichSide',
          fields: [
            defineField({name: 'name', title: 'Name', type: 'string', validation: (Rule) => Rule.required()}),
            defineField({
              name: 'pricePerPerson',
              title: 'Price per person (USD)',
              type: 'number',
              validation: (Rule) => Rule.required().min(0),
            }),
          ],
          preview: {
            select: {title: 'name', subtitle: 'pricePerPerson'},
            prepare({title, subtitle}) {
              return {title, subtitle: subtitle != null ? `$${subtitle} / person` : undefined}
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'modificationNote',
      title: 'Modification note',
      type: 'string',
      initialValue: 'All sandwiches can be modified upon request.',
    }),
    defineField({
      name: 'dietaryNote',
      title: 'Dietary note',
      type: 'string',
      initialValue: 'Gluten-free and vegan options available upon request.',
    }),
    defineField({
      name: 'deliveryFee',
      title: 'Delivery fee (USD)',
      type: 'number',
      validation: (Rule) => Rule.min(0),
    }),
  ],
  preview: {
    select: {},
    prepare() {
      return {title: 'Lunch Sandwiches'}
    },
  },
})
