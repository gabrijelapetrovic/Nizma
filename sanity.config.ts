import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { schemaTypes } from './sanity/schemaTypes';
import { sanityDataset, sanityProjectId } from './sanity/env';

const projectId = sanityProjectId() || 'placeholder';

export default defineConfig({
  name: 'nokti-trepavice',
  title: 'Nokti & Trepavice',
  projectId,
  dataset: sanityDataset(),
  basePath: '/studio',
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Sadržaj')
          .items([
            S.listItem()
              .title('Sajt')
              .id('site')
              .child(S.document().schemaType('site').documentId('site')),
          ]),
    }),
  ],
  schema: { types: schemaTypes },
});
