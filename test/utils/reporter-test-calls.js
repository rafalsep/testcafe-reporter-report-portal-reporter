const TestRunErrorFormattableAdapter = require('testcafe').embeddingUtils.TestRunErrorFormattableAdapter;
const UncaughtErrorOnPage = require('testcafe').embeddingUtils.testRunErrors.UncaughtErrorOnPage;
const ActionElementNotFoundError = require('testcafe').embeddingUtils.testRunErrors.ActionElementNotFoundError;
const testCallsite = require('./test-callsite');

function makeErrors(errDescrs) {
  return errDescrs.map(descr => new TestRunErrorFormattableAdapter(descr.err, descr.metaInfo));
}

module.exports = [
  {
    method: 'reportTaskStart',
    args: [
      new Date('1970-01-01T00:00:00.000Z'),
      ['Chrome 41.0.2227 / Mac OS X 10.10.1', 'Firefox 47 / Mac OS X 10.10.1'],
      7,
      [
        {
          fixture: {
            id: 'f123',
            name: 'First fixture',
            tests: [
              {
                id: 'f1t1',
                name: 'First test in first fixture',
              },
              {
                id: 'f1t2',
                name: 'Second test in first fixture',
              },
              {
                id: 'f1t3',
                name: 'Third test in first fixture',
              },
            ],
          },
        },
        {
          fixture: {
            id: 'f456',
            name: 'Second fixture',
            tests: [
              {
                id: 'f2t1',
                name: 'First test in second fixture',
              },
              {
                id: 'f2t2',
                name: 'Second test in second fixture',
              },
              {
                id: 'f2t3',
                name: 'Third test in second fixture',
              },
            ],
          },
        },
        {
          fixture: {
            id: 'f789',
            name: 'Third fixture',
            tests: [
              {
                id: 'f3t1',
                name: 'First test in third fixture',
              },
            ],
          },
        },
      ],
    ],
  },
  {
    method: 'reportFixtureStart',
    args: ['First fixture', './fixture1.js'],
  },
  {
    method: 'reportTestStart',
    args: ['First test in first fixture', {}, { testId: 'f1t1' }],
  },
  {
    method: 'reportTestDone',
    args: [
      'First test in first fixture',
      {
        errs: [],
        durationMs: 74000,
        unstable: true,
        screenshots: [{ screenshotPath: '/screenshots/1445437598847' }],
        videos: [{ videoPath: '/videos/1445437598847' }],
        quarantine: {
          1: { passed: false },
          2: { passed: true },
        },
        testId: 'f1t1',
      },
    ],
  },
  {
    method: 'reportTestStart',
    args: ['Second test in first fixture', { type: 'FFT', module: 'test', device: 'android' }, { testId: 'f1t2' }],
  },
  {
    method: 'reportTestStart',
    args: ['Third test in first fixture', {}, { testId: 'f1t3' }],
  },
  {
    method: 'reportTestDone',
    args: [
      'Second test in first fixture',
      {
        errs: makeErrors([
          {
            err: new UncaughtErrorOnPage('Some error', 'http://example.org'),
            metaInfo: {
              userAgent: 'Chrome 41.0.2227 / Mac OS X 10.10.1',
              screenshotPath: '/screenshots/1445437598847/errors',
              videoPath: '/videos/1445437598847/errors',
              callsite: testCallsite,
              testRunState: 'inTest',
            },
          },
          {
            err: new ActionElementNotFoundError(undefined, { apiFnChain: ['one', 'two', 'three'], apiFnIndex: 1 }),
            metaInfo: {
              userAgent: 'Firefox 47 / Mac OS X 10.10.1',
              callsite: testCallsite,
              testRunState: 'inTest',
            },
          },
        ]),
        durationMs: 74000,
        unstable: false,
        screenshots: [{ screenshotPath: '/screenshots/1445433398847' }],
        videos: [{ videoPath: '/videos/1445433398847' }],
        testId: 'f1t2',
      },
    ],
  },
  {
    method: 'reportTestDone',
    args: [
      'Third test in first fixture',
      {
        errs: [],
        durationMs: 74000,
        unstable: false,
        screenshotPath: null,
        testId: 'f1t3',
      },
    ],
  },
  {
    method: 'reportFixtureStart',
    args: ['Second fixture', './fixture2.js'],
  },
  {
    method: 'reportTestStart',
    args: ['First test in second fixture', {}, { testId: 'f2t1' }],
  },
  {
    method: 'reportTestStart',
    args: ['Second test in second fixture', { invalidAttrib: undefined }, { testId: 'f2t2' }],
  },
  {
    method: 'reportTestStart',
    args: ['Third test in second fixture', {}, { testId: 'f2t3' }],
  },
  {
    method: 'reportTestDone',
    args: [
      'First test in second fixture',
      {
        errs: [],
        durationMs: 74000,
        unstable: false,
        screenshotPath: null,
        testId: 'f2t1',
      },
    ],
  },
  {
    method: 'reportTestDone',
    args: [
      'Second test in second fixture',
      {
        errs: [],
        durationMs: 74000,
        unstable: false,
        screenshotPath: null,
        testId: 'f2t2',
      },
    ],
  },
  {
    method: 'reportTestDone',
    args: [
      'Third test in second fixture',
      {
        errs: [],
        durationMs: 0,
        unstable: false,
        screenshotPath: null,
        skipped: false,
        testId: 'f2t3',
      },
    ],
  },
  {
    method: 'reportFixtureStart',
    args: ['Third fixture', './fixture3.js'],
  },
  {
    method: 'reportTestStart',
    args: ['First test in third fixture', { type: ['FFT', 'ST'], module: 'login' }, { testId: 'f3t1' }],
  },
  {
    method: 'reportTestDone',
    args: [
      'First test in third fixture',
      {
        errs: makeErrors([
          {
            err: new ActionElementNotFoundError(undefined, { apiFnChain: ['one', 'two', 'three'], apiFnIndex: 1 }),

            metaInfo: {
              userAgent: 'Firefox 47 / Mac OS X 10.10.1',
              callsite: testCallsite,
              testRunState: 'inBeforeEach',
            },
          },
        ]),
        testId: 'f3t1',
        durationMs: 74000,
        unstable: true,
        screenshotPath: null,
        quarantine: {
          1: { passed: false },
          2: { passed: false },
          3: { passed: true },
        },
      },
    ],
  },
  {
    method: 'reportTaskDone',
    args: [
      new Date('1970-01-01T00:15:25.000Z'),
      4,
      [
        'Was unable to take a screenshot due to an error.\n\nReferenceError: someVar is not defined',
        'Was unable to take a screenshot due to an error.\n\nReferenceError: someOtherVar is not defined',
        'Was unable to take screenshots because the screenshot directory is not specified. ' +
          'To specify it, use the "-s" or "--screenshots" command line option or the ' +
          '"screenshots" method of the test runner in case you are using API.',
      ],
    ],
  },
];
