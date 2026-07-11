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

async function processFile(srcPath, destPath) {
  const img = sharp(srcPath)
  const meta = await img.metadata()
  const pipeline = meta.width > MAX_WIDTH ? img.resize(MAX_WIDTH) : img
  await pipeline.webp({ quality: QUALITY }).toFile(destPath)
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
    const destPath = path.join(destDir, `${name}.webp`)
    if (await shouldProcess(srcPath, destPath)) {
      await mkdir(destDir, { recursive: true })
      await processFile(srcPath, destPath)
      processed++
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
