# Report Portal reporter for TestCafe

###### This is the [report-portal](https://reportportal.io/) reporter plugin for [TestCafe](http://devexpress.github.io/testcafe).

[![Build Status](https://travis-ci.org/rafalsep/testcafe-reporter-report-portal-reporter.svg)](https://travis-ci.org/rafalsep/testcafe-reporter-report-portal-reporter)

<p align="center">
    <img src="https://raw.github.com/rafalsep/testcafe-reporter-report-portal-reporter/master/media/preview.png" alt="preview" />
</p>

## Features
- preserves testcafe features -> tests structure in report portal
- the only report portal plugin that supports concurrency
- supports sending screenshots and videos recoded by testcafe to report portal
- test metadata (string or array) is propagated to report portal and can be used to build effective dashboards
- propagates actual test and fixture execution time to report portal (see note)
- supports quarantine mode (adds multiple screenshots and one video containing all attempts)

### Note
When running tests using `concurrency > 1` testcafe hook `reportTestDone` is called for all tests at the same time after last test finishes.
This causes all tests from that fixture to have the exact same execution time.

## Prerequisite
In order to use Report Portal plugin for testcafe, [Report Portal](https://reportportal.io/) need to installed first. Follow [setup in official docs](https://reportportal.io/installation) for installation instructions.

## Install
```
npm install testcafe-reporter-report-portal-reporter
```

## Setup
Once installed add required env variables to use the plugin. Good idea is to use [env-cmd](https://github.com/toddbluhm/env-cmd) or [dot-env](https://github.com/motdotla/dotenv) to simplify the setup.

| Required | Argument                      | Description                                                         | Example                              |
| -------- | ----------------------------- | ------------------------------------------------------------------- | ------------------------------------ |
| Yes      | REPORT_PORTAL_BASE_URL        | url of report portal instance including protocol and port           | http://<IP_ADDRESS>:8080             |
| Yes      | REPORT_PORTAL_TOKEN           | can be taken from report portal -> user profile -> access token     | d19fb675-5ebc-4104-a6c7-fc44e18d27de |
| Yes      | REPORT_PORTAL_PROJECT_NAME    | need to match project name in report portal                         | superadmin_personal                  |
| Yes      | REPORT_PORTAL_LAUNCH_NAME     | Name that identifies this test run                                  | Sanity                               |
| No       | REPORT_PORTAL_DESCRIPTION     | additional information about the launch                             | Some custom description              |

## Usage
When you run tests from the command line, specify the reporter name by using the `--reporter` option:

```
testcafe chrome 'path/to/test/file.js' --reporter report-portal-reporter
```

When you use API, pass the reporter name to the `reporter()` method:

```js
testCafe
    .createRunner()
    .src('path/to/test/file.js')
    .browsers('chrome')
    .reporter('report-portal-reporter') // <-
    .run();
```

## Example
See `example` folder for real working example based on report portal demo instance available under https://demo.reportportal.io. Run the example using:
```shell
npm run example
```

## Author
Rafal Szczepankiewicz
