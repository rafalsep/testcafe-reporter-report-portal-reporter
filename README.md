# testcafe-reporter-report-portal-reporter
[![Build Status](https://travis-ci.org/rafalsep/testcafe-reporter-report-portal-reporter.svg)](https://travis-ci.org/rafalsep/testcafe-reporter-report-portal-reporter)

This is the [report-portal](https://reportportal.io/) reporter plugin for [TestCafe](http://devexpress.github.io/testcafe).

<p align="center">
    <img src="https://raw.github.com/rafalsep/testcafe-reporter-report-portal-reporter/master/media/preview.png" alt="preview" />
</p>

## Features
- mimics testcafe features and tests structure in report portal
- the only plugin that supports concurrency
- supports sending screenshots and videos recoded by testcafe to report portal
- test metadata is propagated to report portal and can be used to build effective dashboards
- reports run and test time accurately

## Prerequisite
In order to use Report Portal plugin for testcafe, [Report Portal](https://reportportal.io/) need to installed first. Follow [setup in official docs](https://reportportal.io/installation) for installation instructions.

## Install
```
npm install testcafe-reporter-report-portal
```

## Setup
Once installed add required env variables to use the plugin. Good idea is to use [env-cmd](https://github.com/toddbluhm/env-cmd) or [dot-env](https://github.com/motdotla/dotenv) to simplify the setup.

| Required | Argument                      | Description                                                         | Example                              |
| -------- | ----------------------------- | ------------------------------------------------------------------- | ------------------------------------ |
| Yes      | REPORT_PORTAL_BASE_URL        | url of report portal instance including protocol and port           | http://<IP_ADDRESS>:8080             |
| Yes      | REPORT_PORTAL_TOKEN           | can be taken from report portal -> user profile -> access token     | d19fb675-5ebc-4104-a6c7-fc44e18d27de |
| Yes      | REPORT_PORTAL_PROJECT_NAME    | need to match project name in report portal                         | superadmin_personal                  |
| No       | REPORT_PORTAL_LAUNCH_NAME     | if not specified the name will default to the project name          | Sanity                               |
| No       | REPORT_PORTAL_DESCRIPTION     | additional information about the launch                             | Some custom description              |

## Usage
When you run tests from the command line, specify the reporter name by using the `--reporter` option:

```
testcafe chrome 'path/to/test/file.js' --reporter report-portal
```


When you use API, pass the reporter name to the `reporter()` method:

```js
testCafe
    .createRunner()
    .src('path/to/test/file.js')
    .browsers('chrome')
    .reporter('report-portal') // <-
    .run();
```

## Author
Rafal Szczepankiewicz
