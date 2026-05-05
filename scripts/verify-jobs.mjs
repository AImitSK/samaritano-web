import { createClient } from '@sanity/client'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

// Delete any draft job documents (cleanup)
const drafts = await client.fetch('*[_type=="job" && _id in path("drafts.**")]{_id}')
for (const d of drafts) {
  await client.delete(d._id)
  console.log(`  [DELETED draft] ${d._id}`)
}

// Final list (published only)
const jobs = await client.fetch(
  '*[_type=="job" && !(_id in path("drafts.**")) && isActive==true] | order(publishedAt desc){title, "slug": slug.current, featured}'
)
console.log(`\nPublished active jobs: ${jobs.length}`)
for (const j of jobs) {
  console.log(`  ${j.featured ? '★' : ' '} ${j.slug}  —  ${j.title}`)
}
