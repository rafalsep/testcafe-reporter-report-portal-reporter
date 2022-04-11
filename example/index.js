const createTestCafe = require('testcafe');
const reportPortalReporter = require('../src/index');

(async () => {
  const testcafe = await createTestCafe('localhost');

  try {
    const runner = testcafe.createRunner();
    await runner.reporter(reportPortalReporter);

    const failedCount = await runner.src(['example/test.js']).browsers(['chrome']).run();

    console.log('Tests failed: ' + failedCount);
  } finally {
    await testcafe.close();
  }
})();
