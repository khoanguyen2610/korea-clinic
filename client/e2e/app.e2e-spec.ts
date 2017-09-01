import { TranslatePage } from './app.po';

describe('translate App', () => {
  let page: TranslatePage;

  beforeEach(() => {
    page = new TranslatePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
