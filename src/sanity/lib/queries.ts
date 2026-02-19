import { defineQuery } from "next-sanity";

export const POSTS_QUERY = defineQuery(`*[_type == "post" && defined(slug.current)] | order(publishedAt desc)[0...12]{
  _id,
  title,
  slug,
  publishedAt,
  mainImage,
  excerpt,
  "categories": categories[]->title,
  "author": author->name
}`);

export const POST_QUERY = defineQuery(`*[_type == "post" && (slug.current == $slug || $slug in slugHistory)][0]{
  _id,
  title,
  slug,
  publishedAt,
  mainImage,
  excerpt,
  body,
  "categories": categories[]->title,
  "author": author->name,
  slugHistory,
  seoTitle,
  seoDescription
}`);

export const HERO_POST_QUERY = defineQuery(`*[_type == "post" && defined(slug.current)] | order(publishedAt desc)[0]{
  _id,
  title,
  slug,
  publishedAt,
  mainImage,
  excerpt,
  "categories": categories[]->title
}`);

export const LATEST_POSTS_QUERY = defineQuery(`{
  "sonDakika": *[_type == "post" && "son-dakika" in tags[]->slug.current] | order(publishedAt desc)[0...10]{
    _id,
    title,
    slug,
    publishedAt,
    "categories": categories[]->title
  },
  "latest": *[_type == "post" && defined(slug.current)] | order(publishedAt desc)[0...10]{
    _id,
    title,
    slug,
    publishedAt,
    "categories": categories[]->title
  }
}`);

export const CATEGORIES_QUERY = defineQuery(`*[_type == "category"]{
  _id,
  title,
  slug,
  description
}`);

export const POSTS_BY_CATEGORY_QUERY = defineQuery(`*[_type == "post" && $slug in categories[]->slug.current] | order(publishedAt desc){
  _id,
  title,
  slug,
  publishedAt,
  mainImage,
  excerpt,
  "categories": categories[]->title,
  "author": author->name
}`);

export const POSTS_BY_TAG_QUERY = defineQuery(`*[_type == "post" && $slug in tags[]->slug.current] | order(publishedAt desc){
  _id,
  title,
  slug,
  publishedAt,
  mainImage,
  excerpt,
  "categories": categories[]->title,
  "author": author->name
}`);

export const CATEGORY_QUERY = defineQuery(`*[_type == "category" && slug.current == $slug][0]{
  title,
  description
}`);

export const TAG_QUERY = defineQuery(`*[_type == "tag" && slug.current == $slug][0]{
  title
}`);

export const PAGE_QUERY = defineQuery(`*[_type == "page" && slug.current == $slug][0]{
  title,
  body
}`);

export const SEARCH_QUERY = defineQuery(`*[_type == "post" && title match $q + "*"] | order(publishedAt desc){
  _id,
  title,
  slug,
  publishedAt,
  mainImage,
  "categories": categories[]->title,
  "author": author->name
}`);
