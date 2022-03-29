const fs = require('fs');
const RPClient = require('@reportportal/client-javascript');

class ReportPortalService {
  constructor() {
    this.rpClient = new RPClient({
      token: process.env.REPORT_PORTAL_TOKEN,
      endpoint: `${process.env.REPORT_PORTAL_BASE_URL}/api/v1`,
      launch: process.env.REPORT_PORTAL_LAUNCH_NAME,
      project: process.env.REPORT_PORTAL_PROJECT_NAME,
    });
  }

  startLaunch() {
    const { tempId } = this.rpClient.startLaunch({
      name: process.env.REPORT_PORTAL_LAUNCH_NAME,
      description: process.env.REPORT_PORTAL_DESCRIPTION,
    });
    return tempId;
  }

  initSuiteItem({ launchId, name }) {
    const { tempId } = this.rpClient.startTestItem({ name, type: 'SUITE' }, launchId);
    return tempId;
  }

  initTestItem({ launchId, fixtureId, name, attributes }) {
    const { tempId } = this.rpClient.startTestItem({ name, type: 'STEP', attributes }, launchId, fixtureId);
    return tempId;
  }

  endTestItem({ name, testRunInfo, errors, rpTestId }) {
    // save screenshots for failed tests in testcafe
    if (testRunInfo.screenshots) {
      testRunInfo.screenshots.forEach((screenshot, screenshotIndex) => {
        try {
          const screenshotContent = fs.readFileSync(screenshot.screenshotPath);
          this.rpClient.sendLog(
            rpTestId,
            { status: 'error', message: `Error Screenshot ${screenshotIndex + 1}`, time: this.rpClient.helpers.now() },
            { name: `${name}.png`, type: 'image/png', content: screenshotContent },
          );
        } catch (error) {
          console.error('Unable to send error screenshot to report portal', error);
        }
      });
    }

    if (testRunInfo.videos) {
      testRunInfo.videos.forEach((video, videoIndex) => {
        try {
          const videoContent = fs.readFileSync(video.videoPath);
          this.rpClient.sendLog(
            rpTestId,
            { status: 'info', message: `Test Video ${videoIndex + 1}`, time: this.rpClient.helpers.now() },
            { name: `${name}.mp4"`, type: 'video/mp4', content: videoContent },
          );
        } catch (error) {
          console.error('Unable to send test video to report portal', error);
        }
      });
    }

    errors.forEach(err => {
      this.rpClient.sendLog(rpTestId, { status: 'error', message: err });
    });

    let status;
    if (testRunInfo.skipped) {
      status = 'skipped';
    } else {
      status = errors.length > 0 ? 'failed' : 'passed';
    }

    this.rpClient.finishTestItem(rpTestId, { status, ...status === 'skipped' ? { issue_type: 'NOT_ISSUE' } : {} });
  }

  finishFixture({ fixtureId }) {
    this.rpClient.finishTestItem(fixtureId);
  }

  async finishLaunch(launchId) {
    await this.rpClient.finishLaunch(launchId);
  }
}

module.exports = ReportPortalService;
