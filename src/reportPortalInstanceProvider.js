const ReportPortalService = require('./reportPortalService');

let reportPortalInstance;

const getReportPortalInstance = () => {
  if (!reportPortalInstance) {
    const productReport = new ReportPortalService();

    reportPortalInstance = { productReport, launchId: productReport.startLaunch(), instanceCount: 0 };
  }
  reportPortalInstance.instanceCount += 1;
  return reportPortalInstance;
};

module.exports = getReportPortalInstance;
