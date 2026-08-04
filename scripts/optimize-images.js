#!/usr/bin/env node

import sharp from 'sharp'
import { readdir, stat, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

const ORIGINALS_DIR = 'public/images/_originals'
const OUTPUT_DIR = 'public/images'
const MAX_WIDTH = 1200
const QUALITY = 85
const FORCE = process.argv.includes('--force')

// Sections that get a higher quality than the default. The landing page shows
// its screenshots far larger than any docs page does, so artifacts show.
const SECTION_QUALITY = {
  home: 90,
}

// Extra widths emitted for a srcset, keyed by path relative to ORIGINALS_DIR.
// The MAX_WIDTH file is always produced as well.
const HERO_WIDTHS = [800, 2000]
const RESPONSIVE = {
  'home/dashboard-overview.png': [800, 1600, 2000],
  ...Object.fromEntries(
    [
      'book-details',
      'annotations',
      'series-detail',
      'library-stats',
      'achievements',
      'metadata-field-rules',
      'koreader-sync',
      'edit-metadata',
      'reading-log',
      'reading-stats',
      'reading-analytics',
      'authors-grid',
      'ebook-reader',
      'audiobook-player',
      'comics-reader',
      // Padded to the gallery's 1200x696 ratio with transparent bands; the
      // source device shot is shorter than every other screen here.
      'koreader-plugin',
    ].map(name => [`home/${name}.png`, HERO_WIDTHS]),
  ),
}

async function getSubdirs(dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  return entries.filter(e => e.isDirectory()).map(e => e.name)
}

async function getFiles(dir) {
  if (!existsSync(dir)) return []
  const entries = await readdir(dir, { withFileTypes: true })
  return entries.filter(e => e.isFile()).map(e => e.name)
}

async function shouldProcess(srcPath, destPath) {
  if (FORCE) return true
  if (!existsSync(destPath)) return true
  const [srcStat, destStat] = await Promise.all([stat(srcPath), stat(destPath)])
  return srcStat.mtimeMs > destStat.mtimeMs
}

async function processFile(srcPath, destPath, width = MAX_WIDTH, quality = QUALITY) {
  const img = sharp(srcPath)
  const meta = await img.metadata()
  const pipeline = meta.width > width ? img.resize(width) : img
  await pipeline.webp({ quality }).toFile(destPath)
  const [srcStat, destStat] = await Promise.all([stat(srcPath), stat(destPath)])
  const saved = (((srcStat.size - destStat.size) / srcStat.size) * 100).toFixed(0)
  console.log(`  optimized: ${path.basename(destPath)} (${saved}% smaller)`)
}

async function run() {
  if (!existsSync(ORIGINALS_DIR)) {
    console.log(`No originals directory found at ${ORIGINALS_DIR}`)
    return
  }

  const sections = await getSubdirs(ORIGINALS_DIR)
  const rootFiles = await getFiles(ORIGINALS_DIR)
  let processed = 0

  async function handleFile(srcPath, destDir) {
    const name = path.basename(srcPath, path.extname(srcPath))
    const key = path.relative(ORIGINALS_DIR, srcPath).split(path.sep).join('/')
    const quality = SECTION_QUALITY[key.split('/')[0]] ?? QUALITY
    const destPath = path.join(destDir, `${name}.webp`)

    if (await shouldProcess(srcPath, destPath)) {
      await mkdir(destDir, { recursive: true })
      await processFile(srcPath, destPath, MAX_WIDTH, quality)
      processed++
    }

    for (const width of RESPONSIVE[key] ?? []) {
      const variantPath = path.join(destDir, `${name}-${width}.webp`)
      if (await shouldProcess(srcPath, variantPath)) {
        await mkdir(destDir, { recursive: true })
        await processFile(srcPath, variantPath, width, quality)
        processed++
      }
    }
  }

  for (const file of rootFiles) {
    if (!/\.(png|jpg|jpeg)$/i.test(file)) continue
    await handleFile(path.join(ORIGINALS_DIR, file), OUTPUT_DIR)
  }

  for (const section of sections) {
    const srcDir = path.join(ORIGINALS_DIR, section)
    const destDir = path.join(OUTPUT_DIR, section)
    const files = await getFiles(srcDir)
    for (const file of files) {
      if (!/\.(png|jpg|jpeg)$/i.test(file)) continue
      await handleFile(path.join(srcDir, file), destDir)
    }
  }

  if (processed === 0) {
    console.log('Nothing to process. Use --force to re-process all.')
  } else {
    console.log(`Done. ${processed} file(s) optimized.`)
  }
}

run().catch(err => { console.error(err); process.exit(1) })
