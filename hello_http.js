'use strict';
const puppeteer = require('puppeteer');
const request_client = require('request-promise-native');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const result = [];

  await page.setRequestInterception(true);

  page.on('request', request => {
    request_client({
      uri: request.url(),
      resolveWithFullResponse: true,
    }).then(response => {
      const request_headers = request.headers();

      result.push({
        // request_url,
        request_headers,
        // request_post_data,
        // response_headers,
        // response_size,
        // response_body,
      });

      console.log(request_headers);
      request.continue();
    }).catch(error => {
      console.error(error);
      request.abort();
    });
  });

  await page.goto('https://youtube.com', { //change location of website 
    waitUntil: 'networkidle0',
  });

  await browser.close();
})();
