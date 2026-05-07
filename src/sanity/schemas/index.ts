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
import { team } from './team'
import { milestone } from './milestone'

export const schemaTypes = [
  // Objects
  seo,
  // Singletons
  settings,
  navigation,
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
]
