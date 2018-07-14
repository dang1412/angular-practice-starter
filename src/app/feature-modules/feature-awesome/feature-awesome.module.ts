import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';

// components
import { FeatureAwesomeComponents } from './components';

// pages
import { FeatureAwesomePages } from './pages';

// routing
import { FeatureAwesomeRoutingModule } from './feature-awesome-routing.module';

@NgModule({
  imports: [
    SharedModule,
    FeatureAwesomeRoutingModule,
  ],
  declarations: [
    ...FeatureAwesomePages,
    ...FeatureAwesomeComponents,
  ],
})
export class FeatureAwesomeModule { }
