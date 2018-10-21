import { NgModule } from '@angular/core';
import { Routes, PreloadAllModules, RouterModule } from '@angular/router';

const appRoutes: Routes = [
  {
    path: '',
    loadChildren: './feature-modules/main/main.module#MainModule'
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
