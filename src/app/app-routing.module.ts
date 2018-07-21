import { NgModule } from '@angular/core';
import { Routes, PreloadAllModules, RouterModule } from '@angular/router';

const appRoutes: Routes = [
  {
    path: '',
    loadChildren: './feature-modules/feature-awesome/feature-awesome.module#FeatureAwesomeModule'
  },
  {
    path: 'tradingview',
    loadChildren: './feature-modules/tradingview/tradingview.module#TradingViewModule'
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes, {
      useHash: false,
      preloadingStrategy: PreloadAllModules,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule { }
