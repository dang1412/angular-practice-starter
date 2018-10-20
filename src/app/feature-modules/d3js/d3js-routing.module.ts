import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { D3PageComponent } from './pages';

const d3JsRoutes: Routes = [
  { path: '', component: D3PageComponent },
];

@NgModule({
  imports: [
    RouterModule.forChild(d3JsRoutes),
  ],
  exports: [RouterModule],
})
export class D3JsRoutingModule { }
