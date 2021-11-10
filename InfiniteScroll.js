/*
  크롤링(crawling)이란 ?
  웹 페이지를 그대로 가져와서 거기서 데이터를 추출해 내는 행위
*/


// 파일 처리와 관려된 전반적인 작업을 하는 모듈
const fs = require('fs');

// Puppeteer는 Headless Chrome 혹은 Chromium을 제어하도록 도와주는 라이브러리.
/*
  Headless Browser는 CLI(Command Line Interface)에서 동작하는 브라우저이다.
  일반적으로 사용자가 사용하는 GUI에서 동작하는 브라우저가 아니다. 백그라운드에서 동작하며, 실제로
  브라우저 창을 띄우지 않고 백그라운드에서 가상으로 진행되며 특정 페이지에 접속하고 렌더링한다.

  Puppeteer 주요 기능
  - 웹 페이지에서 자동화된 테스트를 실행. JavaScript 테스트를 최신 버전의 Chrome에서 직접 수행
  - 사이트의 timeline trace를 기록하여 성능 문제를 진단할 수 있다.
  - Chrome Extensions을 테스트할 수 있다.
  - PDF 생성
  - 스크린샷 찍기
  - 지루한 작업 자동화. Form Submit, UI테스트, 키보드 입력 등을 자동화한다.
  - 웹 사이트에서 데이터를 가져와 저장
  - SPA(Single-Page Application)를 크롤링하고 미리 렌더링된 컨텐츠 SSR(Server Side 
    Rendering)를 생성할 수 있다.
*/
const puppeteer = require('puppeteer');

function extractItems() {
  // dom 요소를 qeurySelectorAll로 가져온다.
  const extractedElements = document.querySelectorAll('#container > div.blog-post');
  // 빈 배열 생성
  const items = [];
  // 모든 요소들을 반복문을 실행하여 배열안에 저장한다.
  for (let element of extractedElements) {
    items.push(element.innerText);
  }
  // 데이터가 들어가 있는 배열 리턴.
  return items;
}

async function scrapeItems(
  page,
  extractItems,
  itemCount,
  scrollDelay = 800
) {
  let items = [];
  try {
    let previousHeight;
    while (items.length < itemCount) {
      items = await page.evaluate(extractItems);
      // 스크롤 시키지 않았을 때의 전체 높이를 구한 후 previousHeight에 저장.
      previousHeight = await page.evaluate('document.body.scrollHeight');
      // window.scrollTo('x좌표', 'y좌표');
      await page.evaluate('window.scrollTo(0, document.body.scrollHeight)');
      await page.waitForFunction(`document.body.scrollHeight > ${previousHeight}`);
      await page.waitForTimeout(scrollDelay);
    }
  }catch(e) {}
  return items;
}

(async () => {
  // 브라우저를 실행한다.
  const browser = await puppeteer.launch({
    headless: false,
  });
  // 새로운 페이지를 열어 상수 page에 저장한다.
  const page = await browser.newPage();
  // 페이지의 크기를 설정한다.
  page.setViewport({ width: 1280, height: 926 });

  // 해당 url에 접속한다.
  await page.goto('https://mmeurer00.github.io/infinite-scroll-example/');
  const items = await scrapeItems(page, extractItems, 10);
  fs.writeFileSync('./items.txt', items.join('\n') + '\n');
  // fs.writeFileSync(filename, data, [options])
  // => filename의 파일에 [options]의 방식으로 data 내용을 씁니다.
  await browser.close();
})();