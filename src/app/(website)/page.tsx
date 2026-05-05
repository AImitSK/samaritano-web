import { Hero } from '@/components/sections/samaritano/Hero'
import { RolesTicker } from '@/components/sections/samaritano/RolesTicker'
import { TwoPaths } from '@/components/sections/samaritano/TwoPaths'
import { Manifest } from '@/components/sections/samaritano/Manifest'

export default function Home() {
  return (
    <>
      <Hero />
      <RolesTicker />
      <TwoPaths />
      <Manifest />
      {/* TODO: FeaturedJobs, AIMatching, Quote, SalaryTeaser, Magazine, NewsletterCTA */}
    </>
  )
}
