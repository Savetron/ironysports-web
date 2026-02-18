import { sanityFetch } from "@/sanity/lib/fetch";
import { SEARCH_QUERY } from "@/sanity/lib/queries";
import { PostCard } from "@/components/PostCard";
import { Container } from "@/components/Container";

export const dynamic = 'force-dynamic';

export default async function SearchPage({
    searchParams,
}: {
    searchParams: Promise<{ q: string }>;
}) {
    const { q } = await searchParams;
    const posts = q ? await sanityFetch({ query: SEARCH_QUERY, params: { q } }) : [];

    return (
        <Container className="py-12">
            <header className="mb-8 border-b border-slate-200 pb-4">
                <h1 className="text-3xl font-bold text-slate-900">
                    {q ? `"${q}" için arama sonuçları` : "Arama"}
                </h1>
            </header>

            <div className="mb-8">
                <form action="/search" method="get" className="flex gap-2">
                    <input
                        type="text"
                        name="q"
                        defaultValue={q}
                        placeholder="Haber ara..."
                        className="flex-1 px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                        Ara
                    </button>
                </form>
            </div>

            {posts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {posts.map((post: any) => (
                        <PostCard key={post._id} post={post} />
                    ))}
                </div>
            ) : (
                q && (
                    <div className="py-10 text-center bg-slate-50 rounded-lg">
                        <p className="text-slate-500">Sonuç bulunamadı.</p>
                    </div>
                )
            )}
        </Container>
    );
}
