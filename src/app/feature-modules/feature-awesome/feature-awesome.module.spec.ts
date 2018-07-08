import { FeatureAwesomeModule } from './feature-awesome.module';

describe('FeatureAwesomeModule', () => {
  let featureAwesomeModule: FeatureAwesomeModule;

  beforeEach(() => {
    featureAwesomeModule = new FeatureAwesomeModule();
  });

  it('should create an instance', () => {
    expect(featureAwesomeModule).toBeTruthy();
  });
});
