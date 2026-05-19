import { writeFileSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const tplPath = resolve(__dirname, '../vercel.template.json')
const outPath = resolve(__dirname, '../vercel.json')

const backend = process.env.BACKEND_API_URL
if (!backend) {
    console.error('[gen-vercel-json] BACKEND_API_URL is required')
    process.exit(1)
}

const content = readFileSync(tplPath, 'utf8').replace(/__BACKEND_API_URL__/g, backend)
writeFileSync(outPath, content)
console.log(`[gen-vercel-json] vercel.json generated (BACKEND_API_URL=${backend})`)
