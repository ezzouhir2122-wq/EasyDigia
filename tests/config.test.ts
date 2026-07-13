import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { loadConfig } from '../src/config/config'

const BASE_ENV = {
  WP_URL: 'https://www.easydigia.com',
  WP_USERNAME: 'admin',
  WP_APP_PASSWORD: 'xxxx xxxx xxxx xxxx',
  ANTHROPIC_API_KEY: 'sk-ant-test',
  UNSPLASH_ACCESS_KEY: 'unsplash-key',
}

describe('loadConfig', () => {
  let original: NodeJS.ProcessEnv

  beforeEach(() => {
    original = { ...process.env }
    Object.assign(process.env, BASE_ENV)
  })

  afterEach(() => {
    process.env = original
  })

  it('charge la config valide avec des valeurs par défaut', () => {
    const config = loadConfig()
    expect(config.webp.quality).toBe(85)
    expect(config.webp.maxKb).toBe(300)
    expect(config.imagesPerArticle).toBe(3)
    expect(config.defaultStatus).toBe('draft')
    expect(config.claudeModel).toBe('claude-sonnet-5')
  })

  it('lève une erreur si WP_URL manque', () => {
    delete process.env.WP_URL
    expect(() => loadConfig()).toThrow('Configuration invalide')
  })

  it('lève une erreur si aucune clé image', () => {
    delete process.env.UNSPLASH_ACCESS_KEY
    expect(() => loadConfig()).toThrow('Au moins une clé API image')
  })

  it('accepte un statut publish', () => {
    process.env.DEFAULT_STATUS = 'publish'
    const config = loadConfig()
    expect(config.defaultStatus).toBe('publish')
  })
})
