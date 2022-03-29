# testcafe-reporter-report-portal
[![Build Status](https://travis-ci.org/rafalsep/testcafe-reporter-report-portal.svg)](https://travis-ci.org/rafalsep/testcafe-reporter-report-portal)

This is the **report-portal** reporter plugin for [TestCafe](http://devexpress.github.io/testcafe).

<p align="center">
    <img src="https://raw.github.com/rafalsep/testcafe-reporter-report-portal/master/media/preview.png" alt="preview" />
</p>

## Features
- mimics testcafe features and tests structure in report portal
- the only plugin that supports concurrency
- supports sending screenshots and videos recoded by testcafe to report portal
- test metadata is propagated to report portal and can be used to build effective dashboards
- reports run and test time accurately

## Prerequisite
In order to use Report Portal plugin for test cafe, report portal need to installed first. Follow [setup in official docs](https://reportportal.io/installation) for installation instructions.

## Install
```
npm install testcafe-reporter-report-portal
```

## Setup
Once installed add required env variables to use the plugin. Good idea is to use [env-cmd](https://github.com/toddbluhm/env-cmd) or [dot-env](https://github.com/motdotla/dotenv) to simplify the setup.
```
REPORT_PORTAL_BASE_URL=http://example.com
REPORT_PORTAL_TOKEN=XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
REPORT_PORTAL_PROJECT_NAME=My_Demo
# Launch name is optional, if not specified the name will default to the project name
REPORT_PORTAL_LAUNCH_NAME=The Launch Name
# Description is optional
REPORT_PORTAL_DESCRIPTION=Run description
```

- REPORT_PORTAL_BASE_URL - is the url of report portal instance including protocol and port, on local usually http://localhost:8080
- REPORT_PORTAL_TOKEN can be taken from report portal -> user profile -> access token
- REPORT_PORTAL_PROJECT_NAME - need to match project name in report portal

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
