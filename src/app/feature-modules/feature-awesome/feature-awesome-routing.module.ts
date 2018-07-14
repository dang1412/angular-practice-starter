import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MyPageComponent } from './pages';

const featureAwesomeRoutes: Routes = [
  { path: '', component: MyPageComponent },
];

@NgModule({
  imports: [
    RouterModule.forChild(featureAwesomeRoutes),
  ],
  exports: [RouterModule],
})
export class FeatureAwesomeRoutingModule { }
