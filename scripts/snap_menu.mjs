// نستخدم Puppeteer من node_modules إذا متاح
import { execSync } from 'child_process';
import { existsSync } from 'fs';

// تحقق من puppeteer
const hasPuppeteer = existsSync('./node_modules/puppeteer');
const hasPlaywright = existsSync('./node_modules/@playwright/test');
const hasPlaywrightCore = existsSync('./node_modules/playwright-core');

console.log('puppeteer:', hasPuppeteer);
console.log('@playwright/test:', hasPlaywright);
console.log('playwright-core:', hasPlaywrightCore);

// list all browser-related packages
try {
  const out = execSync('dir node_modules /b 2>&1', { shell: 'cmd.exe' }).toString();
  const lines = out.split('\n').filter(l => l.match(/playwright|puppeteer|chromium|selenium/i));
  console.log('browser packages:', lines);
} catch(e) {
  console.log('error listing:', e.message);
}
