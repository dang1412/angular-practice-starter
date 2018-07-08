import { Route } from '@angular/router';
import { RouterModule } from '@angular/router';

const appRoutes: Route[] = [
  {
    path: '',
    loadChildren: './feature-modules/feature-awesome/feature-awesome.module#FeatureAwesomeModule'
  },
];

export const AppRouting = RouterModule.forRoot(appRoutes);
