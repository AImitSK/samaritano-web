import { seo } from './objects/seo'
import { page } from './page'
import { post } from './post'
import { blogSettings } from './blogSettings'
import { category } from './category'
import { settings } from './settings'
import { navigation } from './navigation'
import { team } from './team'
import { news } from './news'
import { job } from './job'
import { download } from './download'
import { milestone } from './milestone'
import { legal } from './legal'

export const schemaTypes = [
  // Objects
  seo,
  // Singletons
  settings,
  navigation,
  blogSettings,
  // Content Types
  page,
  post,
  category,
  team,
  news,
  job,
  download,
  milestone,
  legal,
]
