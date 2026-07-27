import { readFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import express from 'express'

const here = dirname(fileURLToPath(import.meta.url))
const BUNDLE_PATH = join(here, '..', 'src', 'data', 'bundle.json')
const PORT = Number(process.env.PORT ?? 5181)

const app = express()
app.use(express.json())

/**
 * The catalogue, copy and seeded quantities the app renders from.
 *
 * Read from disk per request rather than cached, so editing bundle.json is
 * picked up by a page refresh without restarting the server.
 */
app.get('/api/bundle', async (_req, res) => {
  try {
    const raw = await readFile(BUNDLE_PATH, 'utf8')
    res.type('application/json').send(raw)
  } catch (error) {
    console.error('Could not read bundle.json:', error)
    res.status(500).json({ error: 'Bundle data is unavailable.' })
  }
})

app.get('/api/health', (_req, res) => res.json({ ok: true }))

app.listen(PORT, () => {
  console.log(`Bundle API listening on http://localhost:${PORT}/api/bundle`)
})
