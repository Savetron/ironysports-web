import { sanityFetch } from "@/sanity/lib/fetch";
import { HERO_POST_QUERY, LATEST_POSTS_QUERY } from "@/sanity/lib/queries";
import { Hero } from "@/components/Hero";
import { PostCard } from "@/components/PostCard";
import { Container } from "@/components/Container";

export const revalidate = 60;

export default async function Home() {
    const [heroPost, latestPostsData] = await Promise.all([
        sanityFetch({ query: HERO_POST_QUERY }),
        sanityFetch({ query: LATEST_POSTS_QUERY }),
    ]);

    // Priority: Tagged 'son-dakika', otherwise standard latest posts
    const widgetPosts = latestPostsData.sonDakika.length > 0
        ? latestPostsData.sonDakika
        : latestPostsData.latest.slice(0, 5); // Fallback to latest

    // For the main grid, we want latest posts, excluding the ones already shown if possible, 
    // but for simplicity, let's just show latest posts excluding the hero post if it's there.
    // Actually, asking for "Son Haberler" usually implies the general feed.
    const mainGridPosts = latestPostsData.latest.filter((p: any) => p._id !== heroPost?._id).slice(0, 12);

    if (!heroPost && mainGridPosts.length === 0) {
        return (
            <Container className="py-20 text-center">
                <h1 className="text-3xl font-bold text-slate-800 mb-4">Henüz içerik yok</h1>
                <p className="text-slate-600 mb-8 max-w-lg mx-auto">
                    Sanity Studio üzerinden içerik eklemeye başlayın.
                </p>
                <a
                    href="/studio"
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                >
                    Studio'ya Git
                </a>
            </Container>
        );
    }

    return (
        <div className="pb-20">
            {/* Pass the calculated widgetPosts to Hero */}
            <Hero featuredPost={heroPost} topPosts={widgetPosts} />

            <Container className="mt-12">
                <div className="flex items-center justify-between mb-8 border-b border-slate-200 pb-4">
                    <h2 className="text-2xl font-bold text-slate-900 border-l-4 border-[#E30613] pl-3">
                        Son Haberler
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {mainGridPosts.map((post: any) => (
                        <PostCard key={post._id} post={post} />
                    ))}
                </div>
            </Container>
        </div>
    );
}
