import { launch } from 'puppeteer'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const htmlPath = path.join(__dirname, 'DOCUMENTO_CLIENTE_Demo_LabAmarante.html')
const outPath = path.join(
  process.env.USERPROFILE || '',
  'Desktop',
  'LeoSuite_LabAmarante_Documento_Demonstracao.pdf',
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
  margin: { top: '12mm', bottom: '12mm', left: '12mm', right: '12mm' },
})
await browser.close()
console.log('PDF criado:', outPath)
