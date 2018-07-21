import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TradingViewSamplePageComponent } from './pages';

const tradingViewRoutes: Routes = [
  { path: '', component: TradingViewSamplePageComponent },
];

@NgModule({
  imports: [
    RouterModule.forChild(tradingViewRoutes),
  ],
  exports: [RouterModule],
})
export class TradingViewRoutingModule { }
