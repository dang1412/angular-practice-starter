import { NgModule } from '@angular/core';
import { Routes, PreloadAllModules, RouterModule } from '@angular/router';

const appRoutes: Routes = [
  {
    path: '',
    loadChildren: './feature-modules/feature-awesome/feature-awesome.module#FeatureAwesomeModule'
  },
  {
    path: 'ccex-api',
    loadChildren: './feature-modules/ccex-api/ccex-api.module#CcexApiModule'
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
