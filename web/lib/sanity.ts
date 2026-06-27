import {createClient, defineQuery} from 'next-sanity'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2026-06-27',
  useCdn: true,
})

export const MARKETS_QUERY = defineQuery(
  `*[_type == "marketEvent"] | order(date asc) { _id, name, date, location, time }`,
)

export const ABOUT_QUERY = defineQuery(
  `*[_type == "about" && _id == "about"][0] { body }`,
)
