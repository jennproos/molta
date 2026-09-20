import {defineType, defineField, defineArrayMember} from 'sanity'
import {PackageIcon} from '@sanity/icons'

export const pastryBoxService = defineType({
  name: 'pastryBoxService',
  title: 'Pastry Box',
  type: 'document',
  icon: PackageIcon,
  fields: [
    defineField({
      name: 'description',
      title: 'What it is',
      type: 'array',
      of: [{type: 'block'}],
      description: 'The intro copy explaining the pastry box offering.',
    }),
    defineField({
      name: 'oneTimePurchaseAvailable',
      title: 'One-time purchase available?',
      type: 'boolean',
      description: 'If off, only recurring subscriptions are offered.',
      initialValue: true,
    }),
    defineField({
      name: 'frequencyOptions',
      title: 'Subscription frequency options',
      type: 'array',
      of: [{type: 'string'}],
      description: 'e.g. Twice a week, Once a week, Every other week, Once a month',
    }),
    defineField({
      name: 'sizes',
      title: 'Box sizes',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'pastryBoxSize',
          fields: [
            defineField({name: 'name', title: 'Name', type: 'string', validation: (Rule) => Rule.required()}),
            defineField({name: 'price', title: 'Price (USD)', type: 'number', validation: (Rule) => Rule.required().min(0)}),
            defineField({name: 'description', title: 'Description', type: 'string', description: 'e.g. Serves 2–3'}),
          ],
          preview: {
            select: {title: 'name', subtitle: 'price'},
            prepare({title, subtitle}) {
              return {title, subtitle: subtitle != null ? `$${subtitle}` : undefined}
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'maxPastryTypesPerBox',
      title: 'Max pastry types per box',
      type: 'number',
      description: 'How many different pastry types can be mixed and matched in one box.',
      initialValue: 4,
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'pastryOptions',
      title: 'Pastry options',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'pastryOption',
          fields: [
            defineField({name: 'name', title: 'Name', type: 'string', validation: (Rule) => Rule.required()}),
            defineField({
              name: 'flavorOptions',
              title: 'Flavor options',
              type: 'array',
              of: [{type: 'string'}],
              description: 'Leave empty if this pastry has no flavor variants.',
            }),
          ],
          preview: {
            select: {title: 'name', flavorOptions: 'flavorOptions'},
            prepare({title, flavorOptions}) {
              return {
                title,
                subtitle: flavorOptions?.length ? flavorOptions.join(', ') : undefined,
              }
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'deliveryFee',
      title: 'Delivery fee (USD)',
      type: 'number',
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: 'dietaryNote',
      title: 'Dietary note',
      type: 'string',
      initialValue: 'Gluten-free and vegan options available upon request.',
    }),
  ],
  preview: {
    select: {},
    prepare() {
      return {title: 'Pastry Box'}
    },
  },
})
