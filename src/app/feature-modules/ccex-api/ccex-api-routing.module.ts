import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CcexPageComponent } from './pages';

const ccexApiRoutes: Routes = [
  { path: '', component: CcexPageComponent },
];

@NgModule({
  imports: [
    RouterModule.forChild(ccexApiRoutes),
  ],
  exports: [RouterModule],
})
export class CcexApiRoutingModule { }
