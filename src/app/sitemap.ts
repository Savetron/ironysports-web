import { MetadataRoute } from 'next'
import { client } from '@/sanity/client'
import { defineQuery } from 'next-sanity'

const SITEMAP_QUERY = defineQuery(`{
  "posts": *[_type == "post" && defined(slug.current)] { "slug": slug.current, _updatedAt },
  "categories": *[_type == "category" && defined(slug.current)] { "slug": slug.current, _updatedAt },
  "tags": *[_type == "tag" && defined(slug.current)] { "slug": slug.current, _updatedAt },
  "pages": *[_type == "page" && defined(slug.current)] { "slug": slug.current, _updatedAt }
}`)

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_URL || 'https://ironysports.com' // Fallback to example domain

    const { posts, categories, tags, pages } = await client.fetch(SITEMAP_QUERY)

    const postEntries: MetadataRoute.Sitemap = posts.map((post: any) => ({
        url: `${baseUrl}/${post.slug}`,
        lastModified: post._updatedAt,
        changeFrequency: 'daily',
        priority: 0.7,
    }))

    const categoryEntries: MetadataRoute.Sitemap = categories.map((category: any) => ({
        url: `${baseUrl}/category/${category.slug}`,
        lastModified: category._updatedAt,
        changeFrequency: 'daily',
        priority: 0.6,
    }))

    const tagEntries: MetadataRoute.Sitemap = tags.map((tag: any) => ({
        url: `${baseUrl}/tag/${tag.slug}`,
        lastModified: tag._updatedAt,
        changeFrequency: 'weekly',
        priority: 0.5,
    }))

    const pageEntries: MetadataRoute.Sitemap = pages.map((page: any) => ({
        url: `${baseUrl}/page/${page.slug}`,
        lastModified: page._updatedAt,
        changeFrequency: 'monthly',
        priority: 0.3,
    }))

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'always',
            priority: 1,
        },
        ...postEntries,
        ...categoryEntries,
        ...tagEntries,
        ...pageEntries,
    ]
}
