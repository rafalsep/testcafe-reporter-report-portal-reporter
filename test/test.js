const createReport = require('./utils/create-report');
const RPClient = require('@reportportal/client-javascript');
const fs = require('fs');

jest.mock('@reportportal/client-javascript');
jest.mock('fs', () => ({
  ...jest.requireActual('fs'),
  readFileSync: jest.fn(path => path.includes('screenshots') || path.includes('videos') ? path : '{}'),
  readdirSync: jest.fn(() => []),
}));

const reportportalClientMock = {
  startLaunch: jest.fn(() => ({ tempId: '1234' })),
  startTestItem: jest.fn(({ name }) => ({ tempId: `${name.replaceAll(' ', '_').toUpperCase()}_ID` })),
  finishTestItem: jest.fn(),
  sendLog: jest.fn(),
  finishLaunch: jest.fn(),
  helpers: { now: () => 1590922816323 },
};

RPClient.mockImplementation(() => reportportalClientMock);

beforeAll(() => {
  process.env.REPORT_PORTAL_TOKEN = 'REPORT_PORTAL_TOKEN';
  process.env.REPORT_PORTAL_BASE_URL = 'http://localhost:8081';
  process.env.REPORT_PORTAL_LAUNCH_NAME = 'REPORT_PORTAL_LAUNCH_NAME';
  process.env.REPORT_PORTAL_PROJECT_NAME = 'REPORT_PORTAL_PROJECT_NAME';
  process.env.REPORT_PORTAL_DESCRIPTION = 'REPORT_PORTAL_DESCRIPTION';
  createReport(true);
});

it('Should init report portal client', () => {
  expect(RPClient).toHaveBeenCalledWith({ token: 'REPORT_PORTAL_TOKEN', endpoint: 'http://localhost:8081/api/v1', launch: 'REPORT_PORTAL_LAUNCH_NAME', project: 'REPORT_PORTAL_PROJECT_NAME' });
});

it('Should validate startLaunch', () => {
  expect(reportportalClientMock.startLaunch).toHaveBeenCalledTimes(1);
  expect(reportportalClientMock.startLaunch).toMatchSnapshot();
});

it('Should validate startTestItem', () => {
  expect(reportportalClientMock.startTestItem).toHaveBeenCalledTimes(10);
  expect(reportportalClientMock.startTestItem).toMatchSnapshot();
});

it('Should validate finishTestItem', () => {
  expect(reportportalClientMock.finishTestItem).toHaveBeenCalledTimes(10);
  expect(reportportalClientMock.finishTestItem.mock.calls).toMatchSnapshot();
});

it('Should call sendLog on error', () => {
  expect(reportportalClientMock.sendLog).toHaveBeenCalledTimes(7);
  expect(reportportalClientMock.sendLog.mock.calls).toMatchSnapshot();
  expect(fs.readFileSync.mock.calls.flat().filter(call => call.includes('screenshots') || call.includes('videos'))).toEqual(
    expect.arrayContaining(['/screenshots/1445437598847', '/screenshots/1445433398847', '/videos/1445437598847', '/videos/1445433398847']),
  );
});

it('Should validate finishLaunch', () => {
  expect(reportportalClientMock.finishLaunch).toHaveBeenCalledTimes(1);
  expect(reportportalClientMock.finishLaunch.mock.calls).toMatchSnapshot();
});
