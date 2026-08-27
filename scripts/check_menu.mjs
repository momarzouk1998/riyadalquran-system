import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

await page.goto('http://localhost:3010');
await page.waitForLoadState('networkidle');

// فتح القائمة
const btn = page.locator('button').filter({ hasText: 'القائمة' }).first();
await btn.click();
await page.waitForTimeout(700);

await page.screenshot({ path: 'scripts/menu_shot.png', fullPage: false });
console.log('screenshot saved');
await browser.close();
