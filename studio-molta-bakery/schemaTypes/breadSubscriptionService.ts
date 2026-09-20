import {defineType, defineField, defineArrayMember} from 'sanity'
import {PackageIcon} from '@sanity/icons'

export const breadSubscriptionService = defineType({
  name: 'breadSubscriptionService',
  title: 'Bread & English Muffin Subscription',
  type: 'document',
  icon: PackageIcon,
  fields: [
    defineField({
      name: 'description',
      title: 'What it is',
      type: 'array',
      of: [{type: 'block'}],
      description: 'The intro copy explaining the subscription offering.',
    }),
    defineField({
      name: 'frequencyOptions',
      title: 'Frequency options',
      type: 'array',
      of: [{type: 'string'}],
      description: 'e.g. Twice a week, Once a week, Every other week, Once a month',
    }),
    defineField({
      name: 'products',
      title: 'Products',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'breadProduct',
          fields: [
            defineField({name: 'name', title: 'Name', type: 'string', validation: (Rule) => Rule.required()}),
            defineField({
              name: 'category',
              title: 'Category',
              type: 'string',
              options: {
                list: [
                  {title: 'Bread', value: 'bread'},
                  {title: 'English Muffins', value: 'englishMuffins'},
                ],
                layout: 'radio',
              },
              validation: (Rule) => Rule.required(),
            }),
            defineField({name: 'price', title: 'Price (USD)', type: 'number', validation: (Rule) => Rule.required().min(0)}),
            defineField({name: 'description', title: 'Description', type: 'string'}),
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
      name: 'deliveryFee',
      title: 'Delivery fee (USD)',
      type: 'number',
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: 'pickupLocation',
      title: 'Pickup location',
      type: 'string',
      initialValue: 'Batches Kitchen',
    }),
    defineField({
      name: 'pickupWindow',
      title: 'Pickup window',
      type: 'string',
      description: 'e.g. Saturdays, 9–11am',
    }),
  ],
  preview: {
    select: {},
    prepare() {
      return {title: 'Bread & English Muffin Subscription'}
    },
  },
})
