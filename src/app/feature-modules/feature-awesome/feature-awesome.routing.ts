import { RouterModule, Routes } from '@angular/router';

import { MyPageComponent } from './pages';

const featureAwesomeRoutes: Routes = [
  { path: '', component: MyPageComponent },
];

export const FeatureAwesomeRouting = RouterModule.forChild(featureAwesomeRoutes);
