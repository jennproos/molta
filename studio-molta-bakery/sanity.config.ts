import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'Molta Bakery',

  projectId: 'c8c5zb1s',
  dataset: 'production',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.documentTypeListItem('marketEvent').title('Market Schedule'),
            S.listItem()
              .title('About')
              .id('about')
              .child(
                S.document().schemaType('about').documentId('about').title('About'),
              ),
            S.documentTypeListItem('galleryPhoto').title('Gallery Photos'),
            S.divider(),
            S.listItem()
              .title('Services')
              .child(
                S.list()
                  .title('Services')
                  .items([
                    S.listItem()
                      .title('Pastry Box')
                      .id('pastryBoxService')
                      .child(
                        S.document()
                          .schemaType('pastryBoxService')
                          .documentId('pastryBoxService')
                          .title('Pastry Box'),
                      ),
                    S.listItem()
                      .title('Lunch Sandwiches')
                      .id('sandwichService')
                      .child(
                        S.document()
                          .schemaType('sandwichService')
                          .documentId('sandwichService')
                          .title('Lunch Sandwiches'),
                      ),
                    S.listItem()
                      .title('Bread & English Muffin Subscription')
                      .id('breadSubscriptionService')
                      .child(
                        S.document()
                          .schemaType('breadSubscriptionService')
                          .documentId('breadSubscriptionService')
                          .title('Bread & English Muffin Subscription'),
                      ),
                    S.divider(),
                    S.documentTypeListItem('testimonial').title('Testimonials'),
                  ]),
              ),
          ]),
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
})
