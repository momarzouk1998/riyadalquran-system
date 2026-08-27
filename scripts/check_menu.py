from playwright.sync_api import sync_playwright
import time

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1280, "height": 900})
    page.goto("http://localhost:3010")
    page.wait_for_load_state("networkidle")
    
    # Click the menu button
    menu_btn = page.locator("button").filter(has_text="القائمة").first
    menu_btn.click()
    page.wait_for_timeout(600)
    
    page.screenshot(path="scripts/menu_shot.png", full_page=False)
    browser.close()
    print("done")
