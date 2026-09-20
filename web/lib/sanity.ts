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

export const PASTRY_BOX_QUERY = defineQuery(
  `*[_type == "pastryBoxService" && _id == "pastryBoxService"][0] {
    description,
    oneTimePurchaseAvailable,
    frequencyOptions,
    sizes[] { _key, name, price, description },
    maxPastryTypesPerBox,
    pastryOptions[] { _key, name, flavorOptions },
    deliveryFee,
    dietaryNote
  }`,
)

export const SANDWICH_SERVICE_QUERY = defineQuery(
  `*[_type == "sandwichService" && _id == "sandwichService"][0] {
    description,
    groupOrderNote,
    sandwiches[] { _key, name, classicName, ingredients, price },
    modificationNote,
    dietaryNote,
    deliveryFee
  }`,
)

export const BREAD_SUBSCRIPTION_QUERY = defineQuery(
  `*[_type == "breadSubscriptionService" && _id == "breadSubscriptionService"][0] {
    description,
    frequencyOptions,
    products[] { _key, name, category, price, description },
    deliveryFee,
    pickupLocation,
    pickupWindow
  }`,
)

export const TESTIMONIALS_QUERY = defineQuery(
  `*[_type == "testimonial" && service == $service] | order(_createdAt asc) { _id, customerName, quote }`,
)
