import puppeteer from 'puppeteer';
import { existsSync, readdirSync } from 'fs';
import { join } from 'path';

const url = process.argv[2] || 'http://localhost:3000';
const label = process.argv[3] || '';

const dir = '.';
const existing = readdirSync(dir).filter(f => f.startsWith('screenshot-') && f.endsWith('.png'));
const n = existing.length + 1;
const filename = label ? `screenshot-${n}-${label}.png` : `screenshot-${n}.png`;
const outputPath = join(dir, filename);

const browser = await puppeteer.launch({
  headless: 'new',
  args: ['--no-sandbox', '--disable-setuid-sandbox']
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
await new Promise(r => setTimeout(r, 1500));
await page.screenshot({ path: outputPath, fullPage: true });
await browser.close();

console.log(`Screenshot saved: ${outputPath}`);
