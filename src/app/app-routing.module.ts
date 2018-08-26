import { NgModule } from '@angular/core';
import { Routes, PreloadAllModules, RouterModule } from '@angular/router';

const appRoutes: Routes = [
  {
    path: '',
    redirectTo: 'd3-js'
  },
  {
    path: 'ccex-api',
    loadChildren: './feature-modules/ccex-api/ccex-api.module#CcexApiModule'
  },
  {
    path: 'd3-js',
    loadChildren: './feature-modules/d3js/d3js.module#D3jsModule'
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
