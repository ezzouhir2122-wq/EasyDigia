import { z } from 'zod'
import dotenv from 'dotenv'

dotenv.config()

const ConfigSchema = z.object({
  wp: z.object({
    url: z.string().url(),
    username: z.string().min(1),
    appPassword: z.string().min(1),
  }),
  unsplash: z.object({ accessKey: z.string().min(1) }).optional(),
  pexels: z.object({ apiKey: z.string().min(1) }).optional(),
  pixabay: z.object({ apiKey: z.string().min(1) }).optional(),
  anthropic: z.object({ apiKey: z.string().min(1) }),
  webp: z.object({
    quality: z.number().int().min(1).max(100),
    maxKb: z.number().int().positive(),
  }),
  imagesPerArticle: z.number().int().min(1).max(10),
  defaultStatus: z.enum(['draft', 'publish']),
  claudeModel: z.string().min(1),
})

export type Config = z.infer<typeof ConfigSchema>

export function loadConfig(): Config {
  const raw = {
    wp: {
      url: process.env.WP_URL ?? '',
      username: process.env.WP_USERNAME ?? '',
      appPassword: process.env.WP_APP_PASSWORD ?? '',
    },
    unsplash: process.env.UNSPLASH_ACCESS_KEY
      ? { accessKey: process.env.UNSPLASH_ACCESS_KEY }
      : undefined,
    pexels: process.env.PEXELS_API_KEY
      ? { apiKey: process.env.PEXELS_API_KEY }
      : undefined,
    pixabay: process.env.PIXABAY_API_KEY
      ? { apiKey: process.env.PIXABAY_API_KEY }
      : undefined,
    anthropic: { apiKey: process.env.ANTHROPIC_API_KEY ?? '' },
    webp: {
      quality: process.env.WEBP_QUALITY ? parseInt(process.env.WEBP_QUALITY) : 85,
      maxKb: process.env.WEBP_MAX_KB ? parseInt(process.env.WEBP_MAX_KB) : 300,
    },
    imagesPerArticle: process.env.IMAGES_PER_ARTICLE
      ? parseInt(process.env.IMAGES_PER_ARTICLE)
      : 3,
    defaultStatus: (process.env.DEFAULT_STATUS ?? 'draft') as 'draft' | 'publish',
    claudeModel: process.env.CLAUDE_MODEL ?? 'claude-sonnet-5',
  }

  const result = ConfigSchema.safeParse(raw)
  if (!result.success) {
    const issues = result.error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join('\n')
    throw new Error(`Configuration invalide :\n${issues}`)
  }

  if (!result.data.unsplash && !result.data.pexels && !result.data.pixabay) {
    throw new Error('Au moins une clé API image est requise (UNSPLASH, PEXELS ou PIXABAY)')
  }

  return result.data
}
