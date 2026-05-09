import { Hero } from '@/components/sections/samaritano/Hero'
import { RolesTicker } from '@/components/sections/samaritano/RolesTicker'
import { TwoPaths } from '@/components/sections/samaritano/TwoPaths'
import { Manifest } from '@/components/sections/samaritano/Manifest'
import { FeaturedJobs } from '@/components/sections/samaritano/FeaturedJobs'
import { AIMatching } from '@/components/sections/samaritano/AIMatching'
import { Magazine } from '@/components/sections/samaritano/Magazine'
import { NewsletterCTA } from '@/components/sections/samaritano/NewsletterCTA'

export default function Home() {
  return (
    <>
      <Hero />
      <RolesTicker />
      <TwoPaths />
      <Manifest />
      <FeaturedJobs />
      <AIMatching />
      <Magazine />
      <NewsletterCTA />
    </>
  )
}
