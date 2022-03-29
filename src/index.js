const stripAnsi = require('strip-ansi');
const getReportPortalInstance = require('./reportPortalInstanceProvider');

const parseMeta = meta =>
  Object.entries(meta)
    .filter(([, value]) => value)
    .reduce((acc, [key, value]) => {
      acc[key] = Array.isArray(value) ? value[0] : value;
      return acc;
    }, {});

const TEST_STATUSES = {
  STARTED: 'started',
  COMPLETED: 'completed',
};

const reportPortalReporter = () => ({
  noColors: false,

  reportTaskStart(startTime, userAgents, testCount, taskStartInfo) {
    const { productReport, launchId, instanceCount } = getReportPortalInstance();

    this.productReport = productReport;
    this.launchId = launchId;
    this.instanceCount = instanceCount;
    this.taskStartInfo = taskStartInfo;
  },

  reportFixtureStart(/* name, path, meta */) {
    // FIXME this method doesnt work with multiple threads, is only called once. Need fix in testcafe - https://github.com/DevExpress/testcafe/issues/4951
    // const rpSuiteId = this.productReport.initSuiteItem({ launchId: this.launchId, name: `${name}`, path });
    // this.taskStartInfo.find(task => task.fixture.name === name).fixture.rpSuiteId = rpSuiteId;
  },

  reportTestStart(name, testMeta, testStartInfo) {
    // FIXME workaround for broken reportFixtureStart
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
  },

  reportTestDone(name, testRunInfo) {
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
  },

  async reportTaskDone() {
    this.instanceCount -= 1;
    if (this.instanceCount === 0) {
      await this.productReport.finishLaunch(this.launchId);
    }
  },
});

module.exports = reportPortalReporter;
