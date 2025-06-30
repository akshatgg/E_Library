"use client"

import Head from "next/head"
import { useRouter } from "next/router"

interface PageMetaProps {
  title: string
  description: string
  keywords?: string[]
  image?: string
  type?: "website" | "article"
  publishedTime?: string
  modifiedTime?: string
  author?: string
  section?: string
}

export function PageMeta({
  title,
  description,
  keywords = [],
  image = "/og-image.jpg", // Default OG image
  type = "website",
  publishedTime,
  modifiedTime,
  author,
  section,
}: PageMetaProps) {
  const router = useRouter()
  const url = `https://editelibrary.com${router.asPath}`

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords.length > 0 && <meta name="keywords" content={keywords.join(", ")} />}

      {/* Open Graph Meta Tags (for Facebook, LinkedIn) */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:image" content={image.startsWith("http") ? image : `https://editelibrary.com${image}`} />
      <meta property="og:site_name" content="E-Library Solution" />

      {/* Twitter Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image.startsWith("http") ? image : `https://editelibrary.com${image}`} />

      {/* Article specific meta tags (for blog posts, case law pages, etc.) */}
      {type === "article" && publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {type === "article" && modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
      {type === "article" && author && <meta property="article:author" content={author} />}
      {type === "article" && section && <meta property="article:section" content={section} />}

      {/* Canonical URL */}
      <link rel="canonical" href={url} />
    </Head>
  )
}
