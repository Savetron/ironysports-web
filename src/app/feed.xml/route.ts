import { client } from '@/sanity/client'
import { defineQuery } from 'next-sanity'

const RSS_QUERY = defineQuery(`*[_type == "post" && defined(slug.current)] | order(publishedAt desc)[0...50] {
  title,
  "slug": slug.current,
  publishedAt,
  excerpt,
  "author": author->name
}`)

export async function GET() {
    const posts = await client.fetch(RSS_QUERY)
    const baseUrl = process.env.NEXT_PUBLIC_URL || 'https://ironysports.com'

    const itemsXml = posts.map((post: any) => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${baseUrl}/${post.slug}</link>
      <guid>${baseUrl}/${post.slug}</guid>
      <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>
      <description><![CDATA[${post.excerpt || ''}]]></description>
      ${post.author ? `<dc:creator>${post.author}</dc:creator>` : ''}
    </item>
  `).join('')

    const rssXml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>IronySports</title>
    <link>${baseUrl}</link>
    <description>Sporun En Zeki Hali - Son Dakika Spor Haberleri ve Analizler</description>
    <language>tr</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${itemsXml}
  </channel>
</rss>`

    return new Response(rssXml, {
        headers: {
            'Content-Type': 'application/xml',
            'Cache-Control': 's-maxage=3600, stale-while-revalidate',
        },
    })
}
