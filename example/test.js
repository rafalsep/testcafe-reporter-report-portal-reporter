import { Selector } from 'testcafe';

fixture`Default`.page`https://www.etihad.com/en/`;

test('Example test', async t => {
  await t.click(Selector('#onetrust-accept-btn-handler'));
  await t.expect(Selector('.header-text-logo').exists).ok();
  await t.expect(Selector('.footer').exists).ok();
});
