import sharp from 'sharp'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const input = path.join(__dirname, '../public/branding/mr-leotech-leosuite.jpg')
const output = path.join(__dirname, '../public/branding/mr-leotech-leosuite.png')

const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true })

const threshold = 38 // pixels quase pretos → transparentes
for (let i = 0; i < data.length; i += 4) {
  const r = data[i]
  const g = data[i + 1]
  const b = data[i + 2]
  if (r <= threshold && g <= threshold && b <= threshold) {
    data[i + 3] = 0
  }
}

await sharp(data, {
  raw: { width: info.width, height: info.height, channels: 4 },
}).png().toFile(output)

console.log('PNG sem fundo preto:', output)
