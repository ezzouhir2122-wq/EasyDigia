import axios from 'axios'
import fs from 'fs'
import path from 'path'
import type { ImageCandidate } from '../../types'
import type { Config } from '../../config/config'
import { withRetry } from '../../utils/retry'
import { logger } from '../../utils/logger'

const ORIGINAL_DIR = path.resolve(process.cwd(), 'assets', 'images', 'original')

export class ImageDownloader {
  constructor(private config: Config) {}

  async download(img: ImageCandidate, slug: string, index: number): Promise<string> {
    fs.mkdirSync(ORIGINAL_DIR, { recursive: true })
    const filename = `${slug}-${String(index + 1).padStart(3, '0')}.jpg`
    const dest = path.join(ORIGINAL_DIR, filename)

    logger.step('Téléchargement', filename)

    await withRetry(async () => {
      const res = await axios.get(img.url, { responseType: 'stream' })
      await new Promise<void>((resolve, reject) => {
        const writer = fs.createWriteStream(dest)
        res.data.pipe(writer)
        res.data.on('error', reject)
        writer.on('finish', resolve)
        writer.on('error', reject)
      })
    }, 3, `download ${filename}`)

    return dest
  }
}
