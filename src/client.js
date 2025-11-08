// app/src/client.js

import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

export const client = createClient({
  projectId: '9lhkzgx8', // <-- This is your Project ID
  dataset: 'production',
  useCdn: true, // This makes it fast for production
  apiVersion: '2025-11-02', // Use a current date
})

// This is a helper function for getting image URLs
const builder = imageUrlBuilder(client)
export function urlFor(source) {
  return builder.image(source)
}