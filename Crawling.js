const fs = require('fs');
const puppeteer = require('puppeteer');

function extractItems() {
  const extractedElements = document.querySelectorAll('#container > div.blog-post');
  const items = [];
  for(let element of extractedElements) {
    items.push(element.innerText);
  }
  return items;
}

async function scrapeItems(page, extractItems, itemCount, scrollDelay = 800) {
  let items = [];
  try {
    let previousHeight;
    while(items.length < itemCount) {
      items = await page.evaluate(extractItems);
      previousHeight = await page.evaluate('document.body.scrollHeight');
      await page.evaluate('window.scrollTo(0, document.body.scrollHeight');
      await page.waitForFunction(`document.body.scrollHeight > ${previousHeight}`);
      await page.waitForTimeout(scrollDelay);
    }
  }catch(e) {}
  return items;
}

(async () => {
  const browser = await puppeteer.launch({
    headless: false
  })
  const page = await browser.newPage();
  page.setViewport({ width: 1280, height: 926 });

  await page.goto('https://mmeurer00.github.io/infinite-scroll-example/');
  const items = await scrapeItems(page, extractItems, 10);
  fs.writeFileSync('./items.txt', items.join('\n') + '\n');
  
  await browser.close();
})();