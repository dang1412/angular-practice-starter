import { TradingviewModule } from './tradingview.module';

describe('TradingviewModule', () => {
  let tradingviewModule: TradingviewModule;

  beforeEach(() => {
    tradingviewModule = new TradingviewModule();
  });

  it('should create an instance', () => {
    expect(tradingviewModule).toBeTruthy();
  });
});
