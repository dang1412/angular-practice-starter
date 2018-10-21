import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MyPageComponent } from './pages';

const mainRoutes: Routes = [
  { path: '', component: MyPageComponent },
];

@NgModule({
  imports: [
    RouterModule.forChild(mainRoutes),
  ],
  exports: [RouterModule],
})
export class MainRoutingModule { }
