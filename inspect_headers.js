const { extractDataFromPerformanceTiming } = require('./helpers');

async function inspect_headers(page) {
  await page.goto('http://youtube.com');

  const performanceTiming = JSON.parse(
    await page.evaluate(() => JSON.stringify(window.performance.timing))
  );

  return extractDataFromPerformanceTiming(
    performanceTiming,
    'responseEnd',
    'domInteractive',
    'domContentLoadedEventEnd',
    'loadEventEnd'
  );
}

module.exports = inspect_headers;
