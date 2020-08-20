const puppeteer = require('puppeteer');
const inspect_headers = require('./inspect_headers');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  console.log(await inspect_headers(page));
  await browser.close();
})();
