import { type NextRequest, NextResponse } from 'next/server'
import { parseBody } from 'next-sanity/webhook'
import { revalidatePath, revalidateTag } from 'next/cache'

export async function POST(req: NextRequest) {
    try {
        const { isValidSignature, body } = await parseBody<{
            _type: string
            slug?: { current: string }
        }>(req, process.env.SANITY_REVALIDATE_SECRET)

        if (!isValidSignature) {
            return new Response('Invalid Signature', { status: 401 })
        }

        if (!body?._type) {
            return new Response('Bad Request', { status: 400 })
        }

        // Revalidate the specific path if it's a post, category or page
        if (body.slug?.current) {
            if (body._type === 'post') {
                revalidatePath(`/${body.slug.current}`) // The post itself
                revalidatePath('/') // Homepage
                // We could also revalidate category pages here if we had category info in the body
            } else if (body._type === 'page') {
                revalidatePath(`/page/${body.slug.current}`)
            } else if (body._type === 'category') {
                revalidatePath(`/category/${body.slug.current}`)
            }
        }

        // Always revalidate the homepage for list updates
        revalidatePath('/')

        // Revalidate all queries that use the sanityFetch tag system (if we used tags)
        // revalidateTag(body._type) 

        return NextResponse.json({
            status: 200,
            revalidated: true,
            now: Date.now(),
            body,
        })
    } catch (err: any) {
        console.error(err)
        return new Response(err.message, { status: 500 })
    }
}
