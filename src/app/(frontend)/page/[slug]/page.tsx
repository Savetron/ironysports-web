import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";
import { sanityFetch } from "@/sanity/lib/fetch";
import { PAGE_QUERY } from "@/sanity/lib/queries";
import { Container } from "@/components/Container";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const page = await sanityFetch({ query: PAGE_QUERY, params: { slug } });

    if (!page) {
        return {
            title: "Sayfa Bulunamadı - IronySports",
        };
    }

    return {
        title: `${page.title} - IronySports`,
    };
}

export default async function StaticPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const page = await sanityFetch({ query: PAGE_QUERY, params: { slug } });

    if (!page) {
        notFound();
    }

    return (
        <Container className="py-12">
            <header className="mb-8 border-b border-slate-200 pb-4">
                <h1 className="text-3xl font-bold text-slate-900">
                    {page.title}
                </h1>
            </header>

            <div className="prose prose-slate max-w-none">
                {page.body && <PortableText value={page.body} />}
            </div>
        </Container>
    );
}
