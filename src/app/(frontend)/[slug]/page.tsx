import { notFound, permanentRedirect } from "next/navigation";
import Image from "next/image";
import { PortableText } from "@portabletext/react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

import { sanityFetch } from "@/sanity/lib/fetch";
import { POST_QUERY } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import { Container } from "@/components/Container";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = await sanityFetch({ query: POST_QUERY, params: { slug } });

    if (!post) {
        return {
            title: "Haber Bulunamadı - IronySports",
        };
    }

    return {
        title: post.seoTitle || post.title,
        description: post.seoDescription || post.excerpt,
        openGraph: {
            images: post.mainImage?.asset ? [urlFor(post.mainImage).width(1200).height(630).url()] : [],
        },
    };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = await sanityFetch({ query: POST_QUERY, params: { slug } });

    if (!post) {
        notFound();
    }

    if (post.slug?.current && post.slug.current !== slug) {
        permanentRedirect(`/${post.slug.current}`);
    }

    // Basic redirect logic if needed based on slugHistory could go here

    const imageUrl = post.mainImage?.asset ? urlFor(post.mainImage).width(1200).height(675).url() : '/placeholder.jpg';

    return (
        <article className="pb-20">
            <header className="relative w-full aspect-[21/9] md:aspect-[2.5/1]">
                <Image
                    src={imageUrl}
                    alt={post.title}
                    fill
                    className="object-cover brightness-50"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end">
                    <Container className="pb-12 text-white w-full">
                        <div className="flex items-center gap-3 text-sm font-medium text-slate-300 mb-4">
                            {post.categories?.[0] && (
                                <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs uppercase tracking-wide">
                                    {post.categories[0]}
                                </span>
                            )}
                            <time dateTime={post.publishedAt}>
                                {format(new Date(post.publishedAt), 'd MMMM yyyy HH:mm', { locale: tr })}
                            </time>
                            {post.author && <span>• {post.author}</span>}
                        </div>
                        <h1 className="text-3xl md:text-5xl font-bold leading-tight max-w-4xl drop-shadow-sm">
                            {post.title}
                        </h1>
                    </Container>
                </div>
            </header>

            <Container className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Main Content */}
                <div className="lg:col-span-8">
                    {/* JSON-LD Structured Data for SEO */}
                    <script
                        type="application/ld+json"
                        dangerouslySetInnerHTML={{
                            __html: JSON.stringify({
                                '@context': 'https://schema.org',
                                '@type': 'NewsArticle',
                                headline: post.title,
                                image: [imageUrl],
                                datePublished: post.publishedAt,
                                dateModified: post._updatedAt || post.publishedAt,
                                author: [{
                                    '@type': 'Person',
                                    name: post.author || 'IronySports Editörü',
                                    url: `${process.env.NEXT_PUBLIC_URL}/author/${post.author?.toLowerCase().replace(/\s+/g, '-')}`
                                }],
                                publisher: {
                                    '@type': 'Organization',
                                    name: 'IronySports',
                                    logo: {
                                        '@type': 'ImageObject',
                                        url: `${process.env.NEXT_PUBLIC_URL}/logo.png`
                                    }
                                },
                                description: post.excerpt,
                            }),
                        }}
                    />

                    <script
                        type="application/ld+json"
                        dangerouslySetInnerHTML={{
                            __html: JSON.stringify({
                                '@context': 'https://schema.org',
                                '@type': 'BreadcrumbList',
                                itemListElement: [
                                    {
                                        '@type': 'ListItem',
                                        position: 1,
                                        name: 'Anasayfa',
                                        item: process.env.NEXT_PUBLIC_URL || 'https://ironysports.com'
                                    },
                                    {
                                        '@type': 'ListItem',
                                        position: 2,
                                        name: post.categories?.[0] || 'Haber',
                                        item: `${process.env.NEXT_PUBLIC_URL}/category/${post.categories?.[0]?.toLowerCase().replace(/\s+/g, '-') || 'genel'}`
                                    },
                                    {
                                        '@type': 'ListItem',
                                        position: 3,
                                        name: post.title,
                                        item: `${process.env.NEXT_PUBLIC_URL}/${post.slug.current}`
                                    }
                                ]
                            }),
                        }}
                    />

                    <div className="prose prose-lg prose-slate max-w-none prose-headings:font-bold prose-a:text-blue-600">
                        {post.excerpt && (
                            <p className="lead text-xl text-slate-600 font-medium italic border-l-4 border-slate-300 pl-4 mb-8">
                                {post.excerpt}
                            </p>
                        )}
                        {post.body && <PortableText value={post.body} components={{
                            types: {
                                image: ({ value }) => {
                                    if (!value?.asset) return null;
                                    return (
                                        <div className="my-8 relative aspect-video rounded-lg overflow-hidden">
                                            <Image
                                                src={urlFor(value).url()}
                                                alt={value.alt || 'Görsel'}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    )
                                }
                            }
                        }} />}
                    </div>
                </div>

                {/* Sidebar */}
                <aside className="lg:col-span-4 space-y-8">
                    <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 sticky top-24">
                        <h3 className="font-bold text-lg mb-4 border-b pb-2">Editörün Notu</h3>
                        <p className="text-sm text-slate-600 leading-relaxed">
                            IronySports editoryal ekibi tarafından hazırlanan bu içerik, tarafsızlık ve doğruluk ilkeleri çerçevesinde sunulmuştur.
                        </p>

                        <div className="mt-6">
                            <h4 className="font-bold text-sm mb-2">Paylaş</h4>
                            <div className="flex gap-2">
                                <button className="bg-black text-white px-3 py-1 text-xs rounded hover:opacity-90">X</button>
                                <button className="bg-[#25D366] text-white px-3 py-1 text-xs rounded hover:opacity-90">WhatsApp</button>
                            </div>
                        </div>
                    </div>
                </aside>
            </Container>
        </article>
    );
}
