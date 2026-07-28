export interface ImageCandidate {
  url: string
  author: string
  sourceUrl: string
  licence: string
  width: number
  height: number
  provider: 'unsplash' | 'pexels' | 'pixabay'
}

export interface ProcessedImage extends ImageCandidate {
  originalPath: string
  webpPath: string
  webpSizeKb: number
}

export interface SeoImageMeta {
  alt: string
  caption: string
  seoTitle: string
  description: string
  seoFilename: string
}

export interface ArticleSeo {
  metaTitle: string
  metaDescription: string
  slug: string
  tags: string[]
  category: string
  keywords: string[]
}

export interface GeneratedArticle {
  h1: string
  htmlContent: string
  wordCount: number
  seo: ArticleSeo
}

export interface PublishJob {
  subject: string
  articleCount: number
  wpStatus: 'draft' | 'publish'
}

export interface WpMedia {
  id: number
  url: string
}

export interface WpPost {
  id: number
  link: string
  status: string
  slug: string
}

export interface PublicationResult {
  articleId: number
  slug: string
  title: string
  wpUrl: string
  wpPostId: number
  wpStatus: 'draft' | 'publish'
  pdfPath: string
}

export interface ScheduleConfig {
  cronTime: string
  subjects: string[]
  currentIndex: number
  wpStatus: 'draft' | 'publish'
  articleCount: number
}
