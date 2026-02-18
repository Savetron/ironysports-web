import { notFound } from "next/navigation";
import { sanityFetch } from "@/sanity/lib/fetch";
import { TAG_QUERY, POSTS_BY_TAG_QUERY } from "@/sanity/lib/queries";
import { PostCard } from "@/components/PostCard";
import { Container } from "@/components/Container";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const tag = await sanityFetch({ query: TAG_QUERY, params: { slug } });

    if (!tag) {
        return {
            title: "Etiket Bulunamadı - IronySports",
        };
    }

    return {
        title: `#${tag.title} Haberleri - IronySports`,
        description: `${tag.title} etiketiyle ilgili en son haberler, gelişmeler ve gündem.`,
        openGraph: {
            title: `#${tag.title} Haberleri - IronySports`,
            description: `${tag.title} etiketiyle ilgili en son haberler.`,
        },
    };
}

export default async function TagPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    const [tag, posts] = await Promise.all([
        sanityFetch({ query: TAG_QUERY, params: { slug } }),
        sanityFetch({ query: POSTS_BY_TAG_QUERY, params: { slug } })
    ]);

    if (!tag) {
        notFound();
    }

    return (
        <Container className="py-12">
            <header className="mb-12 border-b border-slate-200 pb-8">
                <span className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-2 block">Etiket</span>
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
                    #{tag.title}
                </h1>
            </header>

            {posts && posts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {posts.map((post: any) => (
                        <PostCard key={post._id} post={post} />
                    ))}
                </div>
            ) : (
                <div className="py-20 text-center bg-slate-50 rounded-xl border border-slate-100">
                    <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /><line x1="16" x2="8" y1="13" y2="13" /><line x1="16" x2="8" y1="17" y2="17" /><line x1="10" x2="8" y1="9" y2="9" /></svg>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Henüz içerik yok</h3>
                    <p className="text-slate-500 max-w-md mx-auto">
                        Bu etikette henüz haber yayınlanmamış.
                    </p>
                </div>
            )}
        </Container>
    );
}
