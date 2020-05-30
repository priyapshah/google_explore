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
    //   const request_url = request.url();
      const request_headers = request.headers();
    //   const request_post_data = request.postData();
    //   const response_headers = response.headers;
    //   const response_size = response_headers['content-length'];
    //   const response_body = response.body;

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

  await page.goto('https://cnn.com', { //change location of website 
    waitUntil: 'networkidle0',
  });

  await browser.close();
})();


// const puppeteer = require('puppeteer');
// const fs = require('fs');

// const getTimeFromMetrics = (metrics, name) => metrics.metrics.find(x => x.name === name).value * 1000;

// (async () => {
//     const browser = await puppeteer.launch();
//     const page = await browser.newPage();

//     await page.tracing.start({ path: 'trace.json' });
//     await page.goto('https://example.com', { timeout: 60000 });

//     const metrics = await page._client.send('Performance.getMetrics');
//     const navigationStart = getTimeFromMetrics(metrics, 'NavigationStart');
//     await page.tracing.stop();

//     // --- extracting data from trace.json ---
//     const tracing = JSON.parse(fs.readFileSync('./trace.json', 'utf8'));
//     const htmlTracing = tracing.traceEvents.filter(x => (
//         x.cat === 'devtools.timeline' &&
//         typeof x.args.data !== 'undefined' &&
//         typeof x.args.data.url !== 'undefined' &&
//         x.args.data.url === 'https://example.com/'
//     ));
//     const HtmlResourceSendRequest = htmlTracing.find(x => x.name === 'ResourceSendRequest');
//     const HtmlId = HtmlResourceSendRequest.args.data.requestId;
//     const htmlTracingEnds = tracing.traceEvents.filter(x => (
//         x.cat === 'devtools.timeline' &&
//         typeof x.args.data !== 'undefined' &&
//         typeof x.args.data.requestId !== 'undefined' &&
//         x.args.data.requestId === HtmlId
//     ));
//     const HtmlResourceReceiveResponse = htmlTracingEnds.find(x => x.name === 'ResourceReceiveResponse');
//     const HtmlResourceReceivedData = htmlTracingEnds.find(x => x.name === 'ResourceReceivedData');
//     const HtmlResourceFinish = htmlTracingEnds.find(x => x.name === 'ResourceFinish');
//     // --- end extracting data from trace.json ---

//     await page.close();

//     let results = [
//         {
//             variable: 'HtmlResourceReceiveResponse',
//             value: HtmlResourceReceiveResponse.ts/1000 - navigationStart
//         },
//         {
//             variable: 'HtmlResourceReceivedData',
//             value: HtmlResourceReceivedData.ts/1000 - navigationStart
//         },
//         {
//             variable: 'HtmlResourceSendRequest',
//             value: HtmlResourceSendRequest.ts/1000 - navigationStart
//         },
//         {
//             variable: 'HtmlResourceFinish',
//             value: HtmlResourceFinish.ts/1000 - navigationStart
//         },
//     ];

//     console.log(results);
// })();