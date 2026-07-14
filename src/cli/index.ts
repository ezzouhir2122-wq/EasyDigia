import { Command } from 'commander'
import { createInterface } from 'readline/promises'
import { loadConfig } from '../config/config'
import { Publisher } from '../orchestrator/Publisher'
import { Scheduler } from '../services/scheduler/Scheduler'
import { logger } from '../utils/logger'
import type { PublishJob } from '../types'

const program = new Command()

program
  .name('easydigia-publisher')
  .description('Autonomous AI Content Publisher for WordPress')
  .version('1.0.0')

program
  .command('publish')
  .description('Publier un ou plusieurs articles sur WordPress')
  .action(async () => {
    const rl = createInterface({ input: process.stdin, output: process.stdout })

    try {
      const config = loadConfig()

      const subject = await rl.question('Sujet de l\'article : ')
      if (!subject.trim()) {
        logger.error('Le sujet ne peut pas être vide.')
        process.exit(1)
      }

      const countRaw = await rl.question('Nombre d\'articles à générer (défaut : 1) : ')
      const articleCount = parseInt(countRaw) || 1

      const statusRaw = await rl.question('Statut WordPress — draft ou publish (défaut : draft) : ')
      const wpStatus = statusRaw.trim() === 'publish' ? 'publish' : 'draft'

      rl.close()

      logger.info(`\n🚀 Démarrage — "${subject}" × ${articleCount} (${wpStatus})\n`)

      const job: PublishJob = { subject: subject.trim(), articleCount, wpStatus }
      const publisher = new Publisher(config)
      const results = await publisher.run(job)

      logger.success(`\n✅ ${results.length} article(s) publié(s).`)
      for (const r of results) {
        logger.success(`  → ${r.wpUrl}`)
        logger.success(`  → PDF : ${r.pdfPath}`)
      }
    } catch (err) {
      rl.close()
      logger.error(err instanceof Error ? err.message : String(err))
      process.exit(1)
    }
  })

program
  .command('schedule')
  .description('Démarrer le scheduler de publication quotidienne')
  .action(async () => {
    try {
      const config = loadConfig()
      const scheduler = new Scheduler(config)

      logger.info('Vérification de schedule-config.json…')
      const cfg = scheduler.loadScheduleConfig()
      logger.info(`Heure planifiée : ${cfg.cronTime}`)
      logger.info(`Sujets : ${cfg.subjects.join(', ')}`)
      logger.info('Appuie sur Ctrl+C pour arrêter.')

      scheduler.start()
    } catch (err) {
      logger.error(err instanceof Error ? err.message : String(err))
      process.exit(1)
    }
  })

program.parseAsync(process.argv).catch(err => {
  logger.error(String(err))
  process.exit(1)
})
