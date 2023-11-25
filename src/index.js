const stripAnsi = require('strip-ansi');
const getReportPortalInstance = require('./reportPortalInstanceProvider');

const parseMeta = meta =>
  Object.entries(meta)
    .filter(([, value]) => value)
    .reduce((acc, [key, value]) => acc.concat(Array.isArray(value) ? value.map(obj => ({ key, value: obj })) : [{ key, value }]), []);

const TEST_STATUSES = {
  STARTED: 'started',
  COMPLETED: 'completed',
};

const reportPortalReporter = () => ({
  noColors: false,

  reportTaskStart(startTime, userAgents, testCount, taskStartInfo) {
    try {
      const { productReport, launchId, instanceCount } = getReportPortalInstance();

      this.productReport = productReport;
      this.launchId = launchId;
      this.instanceCount = instanceCount;
      this.taskStartInfo = taskStartInfo;
    } catch (e) {
      console.error('error in reportTaskStart ', e);
    }
  },

  reportFixtureStart(/* name, path, meta */) {
    // FIXME this method doesnt work with multiple threads, is only called once. Need fix in testcafe - https://github.com/DevExpress/testcafe/issues/4951
    // const rpSuiteId = this.productReport.initSuiteItem({ launchId: this.launchId, name: `${name}`, path });
    // this.taskStartInfo.find(task => task.fixture.name === name).fixture.rpSuiteId = rpSuiteId;
  },

  reportTestStart(name, testMeta, testStartInfo) {
    // FIXME workaround for broken reportFixtureStart
    try {
      const matchingFixture = this.taskStartInfo.find(task => task.fixture.tests.some(test => test.id === testStartInfo.testId)).fixture;
      if (matchingFixture.tests.filter(({ testStatus }) => [TEST_STATUSES.STARTED, TEST_STATUSES.COMPLETED].includes(testStatus)).length === 0) {
        matchingFixture.tests.find(test => test.id === testStartInfo.testId).testStatus = TEST_STATUSES.STARTED;
        const rpSuiteId = this.productReport.initSuiteItem({ launchId: this.launchId, name: `${matchingFixture.name}` });
        matchingFixture.rpSuiteId = rpSuiteId;
      } else {
        matchingFixture.tests.find(test => test.id === testStartInfo.testId).testStatus = TEST_STATUSES.STARTED;
      }

      const fixtureId = this.taskStartInfo.find(task => task.fixture.tests.some(test => test.id === testStartInfo.testId)).fixture.rpSuiteId;
      const rpTestId = this.productReport.initTestItem({ launchId: this.launchId, fixtureId, name: `${name}`, attributes: parseMeta(testMeta) });

      this.taskStartInfo.reduce((acc, task) => acc.concat(task.fixture.tests), []).find(test => test.id === testStartInfo.testId).rpTestId = rpTestId;
    } catch (e) {
      console.error('error in reportTestStart ', e);
    }
  },

  reportTestDone(name, testRunInfo) {
    try {
      const rpTestId = this.taskStartInfo.reduce((acc, task) => acc.concat(task.fixture.tests), []).find(test => test.id === testRunInfo.testId).rpTestId;
      const hasErr = !!testRunInfo.errs.length;
      const errors = hasErr ? testRunInfo.errs.map(err => stripAnsi(this.formatError(err))) : [];

      this.productReport.endTestItem({ name: `${name}`, testRunInfo, errors, rpTestId });
      this.taskStartInfo.reduce((acc, task) => acc.concat(task.fixture.tests), []).find(test => test.id === testRunInfo.testId).testStatus = TEST_STATUSES.COMPLETED;

      const matchingFixture = this.taskStartInfo.find(({ fixture }) => fixture.tests.some(test => test.id === testRunInfo.testId)).fixture;
      const isFixtureFinished = matchingFixture.tests.every(({ testStatus }) => testStatus === TEST_STATUSES.COMPLETED);

      if (isFixtureFinished) {
        this.productReport.finishFixture({
          fixtureId: matchingFixture.rpSuiteId,
        });
      }
    } catch (e) {
      console.error('error in reportTestDone ', e);
    }
  },

  async reportTaskDone() {
    try {
      this.instanceCount -= 1;
      if (this.instanceCount === 0) {
        await this.productReport.finishLaunch(this.launchId);
      }
    } catch (e) {
      console.error('error in reportTaskDone ', e);
    }
  },
});

process.on('exit', async code => {
  try {
    if (code > 128) {
      await this.productReport.finishLaunch(this.launchId);
    }
  } catch (e) {
    console.error('error in process.exit ', e);
  }
});

module.exports = reportPortalReporter;
