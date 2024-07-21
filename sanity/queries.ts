import { groq } from "next-sanity";

import { getDate } from "@/lib/date";
import { client } from "@/sanity/lib/client";
import { type Post, type PostDetail } from "@/sanity/schemas/post";

export const getAllLatestBlogPostSlugsQuery = () =>
  groq`
  *[_type == "post" && !(_id in path("drafts.**"))
  && publishedAt <="${getDate().toISOString()}"
  && defined(slug.current)] | order(publishedAt desc).slug.current
  `;

export const getAllLatestBlogPostSlugs = () => {
  return client.fetch<string[]>(getAllLatestBlogPostSlugsQuery());
};

type GetBlogPostsOptions = {
  limit?: number;
  offset?: number;
  locale?: string;
  forDisplay?: boolean;
};
export const getLatestBlogPostsQuery = ({
  limit = 5,
  forDisplay = true,
  locale,
}: GetBlogPostsOptions) =>
  groq`
  *[_type == "post" && !(_id in path("drafts.**") && locale == "${locale}") && publishedAt <= "${getDate().toISOString()}"
  && defined(slug.current)] | order(publishedAt desc)[0...${limit}] {
    _id,
    title,
    "slug": slug.current,
    "categories": categories[]->title,
    description,
    publishedAt,
    readingTime,
    locale,
    mainImage {
      _ref,
      asset->{
        url,
        ${
          forDisplay
            ? '"lqip": metadata.lqip, "dominant": metadata.palette.dominant,'
            : ""
        }
      }
    }
  }`;
export const getLatestBlogPosts = (options: GetBlogPostsOptions) =>
  client.fetch<Post[] | null>(getLatestBlogPostsQuery(options));

export const getBlogPostQuery = groq`
  *[_type == "post" && slug.current == $slug && locale == $locale && !(_id in path("drafts.**"))][0] {
    _id,
    title,
    "slug": slug.current,
    "categories": categories[]->title,
    description,
    "locale": locale,
    publishedAt,
    readingTime,
    mood,
    body[] {
      ...,
      _type == "image" => {
        "url": asset->url,
        "lqip": asset->metadata.lqip,
        "dimensions": asset->metadata.dimensions,
        ...
      }
    },
    "headings": body[length(style) == 2 && string::startsWith(style, "h")],
    mainImage {
      _ref,
      asset->{
        url,
        "lqip": metadata.lqip
      }
    },
    "related": *[_type == "post" && slug.current != $slug && locale == $locale && count(categories[@._ref in ^.^.categories[]._ref]) > 0] | order(publishedAt desc, _createdAt desc) [0..2] {
      _id,
      title,
      "slug": slug.current,
      "locale": locale,
      "categories": categories[]->title,
      publishedAt,
      readingTime,
      mainImage {
        _ref,
        asset->{
          url,
          "lqip": metadata.lqip,
          "dominant": metadata.palette.dominant
        }
      },
    }
  }`;
export const getBlogPost = ({
  slug,
  locale,
}: {
  slug: string;
  locale: string;
}) => {
  console.log("slug, locale", slug, locale);
  return client.fetch<PostDetail | undefined, { slug: string; locale }>(
    getBlogPostQuery,
    {
      slug,
      locale,
    },
  );
};
