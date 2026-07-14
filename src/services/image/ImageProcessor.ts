import sharp from 'sharp'
import path from 'path'
import fs from 'fs'
import type { Config } from '../../config/config'
import { logger } from '../../utils/logger'

const WEBP_DIR = path.resolve(process.cwd(), 'assets', 'images', 'webp')

export class ImageProcessor {
  constructor(private config: Config) {}

  async process(
    originalPath: string,
    slug: string,
    index: number
  ): Promise<{ webpPath: string; webpSizeKb: number }> {
    fs.mkdirSync(WEBP_DIR, { recursive: true })
    const filename = `${slug}-${String(index + 1).padStart(3, '0')}.webp`
    const webpPath = path.join(WEBP_DIR, filename)

    logger.step('Conversion WebP', filename)

    let quality = this.config.webp.quality
    let sizeKb: number

    do {
      const result = await sharp(originalPath).webp({ quality }).toFile(webpPath)
      sizeKb = Math.round(result.size / 1024)

      if (sizeKb > this.config.webp.maxKb && quality > 30) {
        quality -= 10
        logger.warn(`${filename} : ${sizeKb} KB > ${this.config.webp.maxKb} KB — qualité → ${quality}%`)
      } else {
        break
      }
    } while (true)

    if (sizeKb > this.config.webp.maxKb) {
      logger.warn(`ImageProcessor: ${path.basename(webpPath)} (${sizeKb}KB) dépasse maxKb=${this.config.webp.maxKb}KB même à qualité 30`)
    }
    logger.success(`${filename} : ${sizeKb} KB (qualité ${quality}%)`)
    return { webpPath, webpSizeKb: sizeKb }
  }
}
