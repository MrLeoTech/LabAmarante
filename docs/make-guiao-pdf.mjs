import { launch } from 'puppeteer'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const htmlPath = path.join(__dirname, 'GUIA_COMERCIAL_Demo_LabAmarante.html')
const outPath = path.join(
  process.env.USERPROFILE || '',
  'Desktop',
  'LeoSuite_LabAmarante_Guiao_Comercial_Demo.pdf',
)

const browser = await launch({
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
})
const page = await browser.newPage()
await page.goto(pathToFileURL(htmlPath).href, { waitUntil: 'networkidle0' })
await page.pdf({
  path: outPath,
  format: 'A4',
  printBackground: true,
  margin: { top: '10mm', bottom: '10mm', left: '10mm', right: '10mm' },
})
await browser.close()
console.log('PDF criado:', outPath)
