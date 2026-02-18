import { type QueryParams } from "next-sanity";
import { client } from "@/sanity/client";

export async function sanityFetch<const QueryString extends string>({
    query,
    params = {},
    revalidate = 60, // Default revalidate time in seconds
    tags = [],
}: {
    query: QueryString;
    params?: QueryParams;
    revalidate?: number | false;
    tags?: string[];
}) {
    return client.fetch(query, params, {
        next: {
            revalidate: tags.length ? false : revalidate, // use revalidate if no tags
            tags,
        },
    });
}
