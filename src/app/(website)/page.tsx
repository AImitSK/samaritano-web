import { Hero } from '@/components/sections/samaritano/Hero'
import { RolesTicker } from '@/components/sections/samaritano/RolesTicker'
import { TwoPaths } from '@/components/sections/samaritano/TwoPaths'
import { Manifest } from '@/components/sections/samaritano/Manifest'
import { FeaturedJobs } from '@/components/sections/samaritano/FeaturedJobs'
import { AIMatching } from '@/components/sections/samaritano/AIMatching'
import { Magazine } from '@/components/sections/samaritano/Magazine'
import { NewsletterCTA } from '@/components/sections/samaritano/NewsletterCTA'
import { getJobStats } from '@/sanity/queries'

export default async function Home() {
  const stats = await getJobStats()

  return (
    <>
      <Hero
        openJobsCount={stats.totalJobs}
        professionsCount={stats.totalRoles}
      />
      <RolesTicker />
      <TwoPaths />
      <Manifest
        totalJobs={stats.totalJobs}
        totalRoles={stats.totalRoles}
      />
      <FeaturedJobs />
      <AIMatching />
      <Magazine />
      <NewsletterCTA />
    </>
  )
}
