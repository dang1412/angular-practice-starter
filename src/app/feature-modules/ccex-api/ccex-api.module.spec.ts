import { CcexApiModule } from './ccex-api.module';

describe('CcexApiModule', () => {
  let ccexApiModule: CcexApiModule;

  beforeEach(() => {
    ccexApiModule = new CcexApiModule();
  });

  it('should create an instance', () => {
    expect(ccexApiModule).toBeTruthy();
  });
});
