import PDFDocument from 'pdfkit'
import fs from 'fs'
import path from 'path'
import type { PublicationResult } from '../../types'
import { logger } from '../../utils/logger'

const REPORTS_DIR = path.resolve(process.cwd(), 'reports')

export class ReportGenerator {
  async generate(result: PublicationResult, coverImageWebpPath: string): Promise<string> {
    fs.mkdirSync(REPORTS_DIR, { recursive: true })

    const date = new Date().toISOString().slice(0, 10)
    const filename = `${date}-${result.slug}.pdf`
    const pdfPath = path.join(REPORTS_DIR, filename)

    logger.step('Génération rapport PDF', filename)

    await new Promise<void>((resolve, reject) => {
      const doc = new PDFDocument({ size: 'A4', margin: 50 })
      const stream = fs.createWriteStream(pdfPath)
      doc.pipe(stream)

      // Header
      doc.fontSize(22).fillColor('#1a1a2e').font('Helvetica-Bold')
        .text('EasyDigia — Rapport de Publication', { align: 'center' })
        .moveDown(0.5)

      doc.fontSize(11).fillColor('#666666').font('Helvetica')
        .text(`Généré le ${new Date().toLocaleString('fr-FR')}`, { align: 'center' })
        .moveDown(1)

      // Separator
      doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke('#cccccc').moveDown(1)

      // Cover image
      if (fs.existsSync(coverImageWebpPath)) {
        try {
          doc.image(coverImageWebpPath, { width: 495, align: 'center' }).moveDown(1)
        } catch {
          // image peut ne pas être supportée par pdfkit en webp — skip silencieusement
        }
      }

      // Article info
      const rows: [string, string][] = [
        ['Titre', result.title],
        ['Slug', result.slug],
        ['URL WordPress', result.wpUrl],
        ['ID WordPress', String(result.wpPostId)],
        ['Statut', result.wpStatus],
      ]

      for (const [label, value] of rows) {
        doc.fontSize(10).fillColor('#333333').font('Helvetica-Bold').text(`${label} :`, { continued: true })
        doc.font('Helvetica').fillColor('#000000').text(` ${value}`)
        doc.moveDown(0.3)
      }

      doc.end()
      stream.on('finish', resolve)
      stream.on('error', reject)
    })

    logger.success(`PDF généré : ${filename}`)
    return pdfPath
  }
}
