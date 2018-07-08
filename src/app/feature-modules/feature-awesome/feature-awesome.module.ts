import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';

// components
import { FeatureAwesomeComponents } from './components';

// pages
import { FeatureAwesomePages } from './pages';

// routing
import { FeatureAwesomeRouting } from './feature-awesome.routing';

@NgModule({
  imports: [
    SharedModule,
    FeatureAwesomeRouting,
  ],
  declarations: [
    ...FeatureAwesomePages,
    ...FeatureAwesomeComponents,
  ],
})
export class FeatureAwesomeModule { }
