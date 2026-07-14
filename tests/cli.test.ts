import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest'

// ── vi.hoisted : les mocks doivent être déclarés avant vi.mock ───────────────
// (vi.mock est hissé en haut du fichier ; les const ordinaires ne sont pas
//  encore initialisées à ce moment-là)

const mocks = vi.hoisted(() => {
  const scheduleCfg = JSON.stringify({
    cronTime: '0 8 * * *',
    subjects: ['IA et automatisation', 'Transformation digitale PME'],
    currentIndex: 0,
    wpStatus: 'draft',
    articleCount: 1,
  })

  return {
    run: vi.fn().mockResolvedValue([{
      articleId: 1,
      slug: 'ia-guide',
      title: 'IA Guide',
      wpUrl: 'https://easydigia.com/ia-guide',
      wpPostId: 99,
      wpStatus: 'draft' as const,
      pdfPath: 'reports/ia-guide.pdf',
    }]),
    cronSchedule: vi.fn(),
    cronValidate: vi.fn().mockReturnValue(true),
    fsExistsSync: vi.fn().mockReturnValue(true),
    fsReadFileSync: vi.fn().mockReturnValue(scheduleCfg),
    fsWriteFileSync: vi.fn(),
    rlQuestion: vi.fn(),
    rlClose: vi.fn(),
  }
})

// ── Mocks de modules ──────────────────────────────────────────────────────────

vi.mock('../src/orchestrator/Publisher', () => ({
  Publisher: vi.fn().mockImplementation(() => ({ run: mocks.run })),
}))

vi.mock('../src/config/config', () => ({
  loadConfig: vi.fn().mockReturnValue({
    wp: { url: 'https://easydigia.com', username: 'u', appPassword: 'p' },
    anthropic: { apiKey: 'sk' },
    unsplash: { accessKey: 'uk' },
    webp: { quality: 85, maxKb: 300 },
    imagesPerArticle: 1,
    defaultStatus: 'draft',
    claudeModel: 'claude-sonnet-5',
  }),
}))

vi.mock('node-cron', () => ({
  default: {
    validate: mocks.cronValidate,
    schedule: mocks.cronSchedule,
  },
}))

// fs : exposer à la fois via default et comme named exports pour couvrir
// les deux formes d'import selon la transformation du bundler
vi.mock('fs', () => ({
  default: {
    existsSync: mocks.fsExistsSync,
    readFileSync: mocks.fsReadFileSync,
    writeFileSync: mocks.fsWriteFileSync,
  },
  existsSync: mocks.fsExistsSync,
  readFileSync: mocks.fsReadFileSync,
  writeFileSync: mocks.fsWriteFileSync,
}))

vi.mock('readline/promises', () => ({
  createInterface: vi.fn().mockReturnValue({
    question: mocks.rlQuestion,
    close: mocks.rlClose,
  }),
}))

afterEach(() => vi.clearAllMocks())

// ── Tests Scheduler ───────────────────────────────────────────────────────────

describe('Scheduler', () => {
  beforeEach(() => {
    // Réinitialiser les valeurs de retour après clearAllMocks
    mocks.cronValidate.mockReturnValue(true)
    mocks.fsExistsSync.mockReturnValue(true)
    mocks.fsReadFileSync.mockReturnValue(JSON.stringify({
      cronTime: '0 8 * * *',
      subjects: ['IA et automatisation', 'Transformation digitale PME'],
      currentIndex: 0,
      wpStatus: 'draft',
      articleCount: 1,
    }))
  })

  const MOCK_CONFIG = {
    wp: { url: 'https://easydigia.com', username: 'u', appPassword: 'p' },
    anthropic: { apiKey: 'sk' },
    unsplash: { accessKey: 'uk' },
    webp: { quality: 85, maxKb: 300 },
    imagesPerArticle: 1,
    defaultStatus: 'draft' as const,
    claudeModel: 'claude-sonnet-5',
  }

  it('démarre le cron avec le cronTime configuré', async () => {
    const { Scheduler } = await import('../src/services/scheduler/Scheduler')
    const scheduler = new Scheduler(MOCK_CONFIG as any)
    scheduler.start()

    expect(mocks.cronValidate).toHaveBeenCalledWith('0 8 * * *')
    expect(mocks.cronSchedule).toHaveBeenCalledWith('0 8 * * *', expect.any(Function))
  })

  it('loadScheduleConfig retourne la config parsée depuis le fichier', async () => {
    const { Scheduler } = await import('../src/services/scheduler/Scheduler')
    const scheduler = new Scheduler(MOCK_CONFIG as any)
    const cfg = scheduler.loadScheduleConfig()

    expect(cfg.cronTime).toBe('0 8 * * *')
    expect(cfg.subjects).toHaveLength(2)
    expect(cfg.currentIndex).toBe(0)
    expect(cfg.wpStatus).toBe('draft')
  })

  it('loadScheduleConfig lève une erreur si schedule-config.json est introuvable', async () => {
    const { Scheduler } = await import('../src/services/scheduler/Scheduler')
    mocks.fsExistsSync.mockReturnValue(false)

    const scheduler = new Scheduler(MOCK_CONFIG as any)
    expect(() => scheduler.loadScheduleConfig()).toThrow('schedule-config.json introuvable')
  })

  it('start lève une erreur si le cronTime est invalide', async () => {
    const { Scheduler } = await import('../src/services/scheduler/Scheduler')
    mocks.cronValidate.mockReturnValue(false)

    const scheduler = new Scheduler(MOCK_CONFIG as any)
    expect(() => scheduler.start()).toThrow('Expression cron invalide')
  })

  it('saveScheduleConfig écrit le fichier JSON mis à jour', async () => {
    const { Scheduler } = await import('../src/services/scheduler/Scheduler')
    const scheduler = new Scheduler(MOCK_CONFIG as any)
    const updatedCfg = {
      cronTime: '0 8 * * *',
      subjects: ['IA et automatisation'],
      currentIndex: 1,
      wpStatus: 'draft' as const,
      articleCount: 1,
    }
    scheduler.saveScheduleConfig(updatedCfg)

    expect(mocks.fsWriteFileSync).toHaveBeenCalledWith(
      expect.stringContaining('schedule-config.json'),
      expect.stringContaining('"currentIndex": 1'),
    )
  })
})

// ── Tests CLI publish ─────────────────────────────────────────────────────────

describe('CLI commande publish', () => {
  let originalArgv: string[]

  beforeEach(() => {
    originalArgv = process.argv
    vi.spyOn(process, 'exit').mockImplementation((() => {}) as any)
    // Préparer readline avec les réponses simulées
    mocks.rlQuestion
      .mockResolvedValueOnce('Intelligence Artificielle')
      .mockResolvedValueOnce('2')
      .mockResolvedValueOnce('draft')
    mocks.run.mockResolvedValue([{
      articleId: 1, slug: 'ia-guide', title: 'IA Guide',
      wpUrl: 'https://easydigia.com/ia-guide', wpPostId: 99,
      wpStatus: 'draft', pdfPath: 'reports/ia-guide.pdf',
    }])
    vi.resetModules()
  })

  afterEach(() => {
    process.argv = originalArgv
    vi.restoreAllMocks()
  })

  it('parcours heureux : lance Publisher.run avec le sujet, articleCount et wpStatus corrects', async () => {
    process.argv = ['node', 'src/cli/index.ts', 'publish']

    // Importer le CLI déclenche parseAsync ; attendre la résolution
    const cliPromise = import('../src/cli/index.ts')
    await cliPromise
    // Laisser la pile d'événements se vider pour que l'action async se termine
    await new Promise(resolve => setTimeout(resolve, 50))

    expect(mocks.run).toHaveBeenCalledWith(
      expect.objectContaining({
        subject: 'Intelligence Artificielle',
        articleCount: 2,
        wpStatus: 'draft',
      }),
    )
    expect(mocks.rlClose).toHaveBeenCalled()
  })
})

// ── Tests CLI schedule ────────────────────────────────────────────────────────

describe('CLI commande schedule', () => {
  let originalArgv: string[]

  beforeEach(() => {
    originalArgv = process.argv
    vi.spyOn(process, 'exit').mockImplementation((() => {}) as any)
    mocks.cronValidate.mockReturnValue(true)
    mocks.fsExistsSync.mockReturnValue(true)
    mocks.fsReadFileSync.mockReturnValue(JSON.stringify({
      cronTime: '0 8 * * *',
      subjects: ['IA et automatisation', 'Transformation digitale PME'],
      currentIndex: 0,
      wpStatus: 'draft',
      articleCount: 1,
    }))
    vi.resetModules()
  })

  afterEach(() => {
    process.argv = originalArgv
    vi.restoreAllMocks()
  })

  it('démarre le cron avec le cronTime lu dans schedule-config.json', async () => {
    process.argv = ['node', 'src/cli/index.ts', 'schedule']

    await import('../src/cli/index.ts')
    await new Promise(resolve => setTimeout(resolve, 50))

    expect(mocks.cronSchedule).toHaveBeenCalledWith('0 8 * * *', expect.any(Function))
  })
})
