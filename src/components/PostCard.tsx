import Link from 'next/link'
import Image from 'next/image'
import { urlFor } from '@/sanity/lib/image'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'

interface PostCardProps {
    post: {
        title: string
        slug: { current: string }
        mainImage?: any
        publishedAt: string
        categories?: string[]
        author?: string
    }
}

export function PostCard({ post }: PostCardProps) {
    const imageUrl = post.mainImage?.asset ? urlFor(post.mainImage).width(800).height(450).url() : null

    return (
        <div className="group flex flex-col h-full overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white border border-slate-100">
            <Link href={`/${post.slug.current}`} className="relative aspect-video overflow-hidden bg-slate-100">
                {imageUrl ? (
                    <Image
                        src={imageUrl}
                        alt={post.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
                        <span className="text-slate-400 font-medium italic">IronySports</span>
                    </div>
                )}
            </Link>
            <div className="flex flex-col flex-1 p-5">
                <div className="flex items-center justify-between text-xs font-medium text-slate-500 mb-3">
                    {post.categories?.[0] && (
                        <span className="text-[#E30613] uppercase tracking-wider font-bold">{post.categories[0]}</span>
                    )}
                    <time dateTime={post.publishedAt}>
                        {format(new Date(post.publishedAt), 'd MMM', { locale: tr })}
                    </time>
                </div>
                <h3 className="text-lg font-bold leading-tight mb-2 group-hover:text-[#E30613] transition-colors line-clamp-2">
                    <Link href={`/${post.slug.current}`}>
                        {post.title}
                    </Link>
                </h3>
                {/* Excerpt if available in the data */}
                <p className="text-slate-600 text-sm line-clamp-2 leading-relaxed">
                    {/* Fallback to excerpt or empty string if not present in query */}
                    {(post as any).excerpt || ''}
                </p>
            </div>
        </div>
    )
}
