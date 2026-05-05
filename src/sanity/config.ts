'use client'

import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { media } from 'sanity-plugin-media'

import { schemaTypes } from './schemas'
import { structure } from './structure'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'

export default defineConfig({
  name: 'default',
  title: process.env.NEXT_PUBLIC_SITE_NAME || 'Studio',

  projectId,
  dataset,

  plugins: [
    structureTool({ structure }),
    media(),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },

  basePath: '/studio',
})
