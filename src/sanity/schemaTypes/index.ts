import { type SchemaTypeDefinition } from 'sanity'

import { category } from './category'
import { post } from './post'
import { tag } from './tag'
import { page } from './page'

export const schema: { types: SchemaTypeDefinition[] } = {
    types: [post, category, tag, page],
}
