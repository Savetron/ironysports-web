import Link from 'next/link'
import Image from 'next/image'
import { urlFor } from '@/sanity/lib/image'
import { Container } from './Container'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'

interface HeroProps {
    featuredPost: any
    topPosts: any[]
}

export function Hero({ featuredPost, topPosts }: HeroProps) {
    if (!featuredPost) return null

    const heroImageUrl = featuredPost.mainImage?.asset
        ? urlFor(featuredPost.mainImage).width(1200).height(675).url()
        : null

    return (
        <section className="py-8 bg-slate-50 border-b border-slate-200">
            <Container>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Featured Post - Takes up 2 columns */}
                    <div className="lg:col-span-2 group relative h-full min-h-[400px]">
                        <Link href={`/${featuredPost.slug.current}`} className="block relative h-full w-full rounded-xl overflow-hidden shadow-sm">
                            {heroImageUrl ? (
                                <Image
                                    src={heroImageUrl}
                                    alt={featuredPost.title}
                                    fill
                                    sizes="(max-width: 1024px) 100vw, 66vw"
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    priority
                                />
                            ) : (
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-slate-900" />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                            <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full">
                                <div className="flex items-center gap-3 mb-3">
                                    {featuredPost.categories?.[0] && (
                                        <span className="px-3 py-1 text-xs font-bold text-white bg-[#E30613] rounded">
                                            {featuredPost.categories[0]}
                                        </span>
                                    )}
                                    <time className="text-xs text-slate-300 font-medium">
                                        {format(new Date(featuredPost.publishedAt), 'd MMMM HH:mm', { locale: tr })}
                                    </time>
                                </div>
                                <h1 className="text-2xl md:text-4xl font-black text-white leading-tight mb-3 drop-shadow-sm">
                                    {featuredPost.title}
                                </h1>
                                {featuredPost.excerpt && (
                                    <p className="text-slate-200 line-clamp-2 md:text-lg hidden md:block opacity-90">
                                        {featuredPost.excerpt}
                                    </p>
                                )}
                            </div>
                        </Link>
                    </div>

                    {/* Side List - Recent/Top Posts */}
                    <div className="flex flex-col h-full">
                        <div className="flex items-center justify-between mb-4 border-b border-slate-200 pb-2">
                            <h2 className="text-lg font-black text-[#E30613] uppercase tracking-wide">Son Dakika</h2>
                            <span className="animate-pulse w-2 h-2 rounded-full bg-[#E30613]"></span>
                        </div>

                        <div className="flex flex-col gap-0 divide-y divide-slate-100 bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden flex-1">
                            {topPosts.map((post) => (
                                <Link key={post._id} href={`/${post.slug.current}`} className="group p-4 hover:bg-slate-50 transition-colors flex gap-3 items-start">
                                    <div className="flex flex-col items-center min-w-[50px] pt-1">
                                        <span className="text-xs font-bold text-slate-400">
                                            {format(new Date(post.publishedAt), 'HH:mm', { locale: tr })}
                                        </span>
                                    </div>
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-[10px] font-bold text-white bg-[#E30613] px-1.5 py-0.5 rounded-sm uppercase">
                                                {post.categories?.[0] || 'Gündem'}
                                            </span>
                                        </div>
                                        <h3 className="text-sm font-bold text-slate-800 leading-snug group-hover:text-[#E30613] transition-colors line-clamp-2">
                                            {post.title}
                                        </h3>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    )
}
