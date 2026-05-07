import { seo } from './objects/seo'
import { post } from './post'
import { category } from './category'
import { settings } from './settings'
import { navigation } from './navigation'
import { job } from './job'
import { jobCategory } from './jobCategory'
import { legal } from './legal'
import { faq } from './faq'
import { faqCategory } from './faqCategory'
import { notifications } from './notifications'
import { team } from './team'
import { milestone } from './milestone'
import { testimonial } from './testimonial'

export const schemaTypes = [
  // Objects
  seo,
  // Singletons
  settings,
  navigation,
  notifications,
  // Content Types
  post,
  category,
  job,
  jobCategory,
  faq,
  faqCategory,
  legal,
  team,
  milestone,
  testimonial,
]
