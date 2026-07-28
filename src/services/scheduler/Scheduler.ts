import cron from 'node-cron'
import fs from 'fs'
import path from 'path'
import type { ScheduleConfig, PublishJob } from '../../types'
import type { Config } from '../../config/config'
import { Publisher } from '../../orchestrator/Publisher'
import { logger } from '../../utils/logger'

const CONFIG_PATH = path.resolve(process.cwd(), 'config', 'schedule-config.json')

export class Scheduler {
  private config: Config

  constructor(config: Config) {
    this.config = config
  }

  loadScheduleConfig(): ScheduleConfig {
    if (!fs.existsSync(CONFIG_PATH)) {
      throw new Error(`schedule-config.json introuvable. Copie config/schedule-config.json.example vers config/schedule-config.json et configure-le.`)
    }
    return JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8')) as ScheduleConfig
  }

  saveScheduleConfig(cfg: ScheduleConfig): void {
    fs.mkdirSync(path.dirname(CONFIG_PATH), { recursive: true })
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(cfg, null, 2))
  }

  start(): void {
    const cfg = this.loadScheduleConfig()

    if (!cron.validate(cfg.cronTime)) {
      throw new Error(`Expression cron invalide : ${cfg.cronTime}`)
    }

    logger.info(`Scheduler démarré — prochain déclenchement : ${cfg.cronTime}`)
    logger.info(`Sujets planifiés : ${cfg.subjects.join(', ')}`)

    cron.schedule(cfg.cronTime, async () => {
      const freshCfg = this.loadScheduleConfig()
      const subject = freshCfg.subjects[freshCfg.currentIndex % freshCfg.subjects.length]

      logger.info(`\n⏰ Déclenchement schedulé — sujet : "${subject}"`)

      const job: PublishJob = {
        subject,
        articleCount: freshCfg.articleCount,
        wpStatus: freshCfg.wpStatus,
      }

      try {
        const publisher = new Publisher(this.config)
        const results = await publisher.run(job)
        logger.success(`Scheduler : ${results.length} article(s) publié(s)`)
      } catch (err) {
        logger.error(`Scheduler error : ${err instanceof Error ? err.message : String(err)}`)
      }

      freshCfg.currentIndex = (freshCfg.currentIndex + 1) % freshCfg.subjects.length
      this.saveScheduleConfig(freshCfg)
    })
  }
}
