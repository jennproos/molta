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
          ]),
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
})
