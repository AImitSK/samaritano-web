import { readdir, stat, rename } from 'node:fs/promises'
import { join, extname } from 'node:path'
import sharp from 'sharp'

const DIR = 'public/uploads'
const MAX_WIDTH = 2400
const QUALITY = 82

const files = await readdir(DIR)
let beforeTotal = 0
let afterTotal = 0
const results = []

for (const name of files) {
  const ext = extname(name).toLowerCase()
  if (!['.jpg', '.jpeg', '.png'].includes(ext)) continue
  const src = join(DIR, name)
  const tmp = src + '.tmp'
  const before = (await stat(src)).size
  beforeTotal += before
  const meta = await sharp(src).metadata()
  const pipe = sharp(src).rotate()
  if (meta.width && meta.width > MAX_WIDTH) pipe.resize({ width: MAX_WIDTH })
  if (ext === '.png') {
    await pipe.png({ compressionLevel: 9 }).toFile(tmp)
  } else {
    await pipe.jpeg({ quality: QUALITY, mozjpeg: true }).toFile(tmp)
  }
  const after = (await stat(tmp)).size
  afterTotal += after
  await rename(tmp, src)
  results.push({ name, before, after, w: meta.width })
}

const fmt = (b) => (b / 1024 / 1024).toFixed(2) + ' MB'
results.sort((a, b) => b.before - a.before)
for (const r of results) {
  const saved = (((r.before - r.after) / r.before) * 100).toFixed(0)
  console.log(`  ${r.name.padEnd(48)}  ${fmt(r.before).padStart(10)} → ${fmt(r.after).padStart(10)}  (-${saved}%)`)
}
console.log(
  `\nTotal: ${fmt(beforeTotal)} → ${fmt(afterTotal)}  (-${(((beforeTotal - afterTotal) / beforeTotal) * 100).toFixed(0)}%)`,
)
