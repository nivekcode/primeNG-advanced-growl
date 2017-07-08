import { PrimeNGAdvancedGrowlPage } from './app.po';

describe('prime-ng-advanced-growl App', () => {
  let page: PrimeNGAdvancedGrowlPage;

  beforeEach(() => {
    page = new PrimeNGAdvancedGrowlPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
