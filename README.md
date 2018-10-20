# Angular Practice Starter
This project was originally generated with [Angular CLI](https://github.com/angular/angular-cli) version 7.0.2.

## Features
 - Following official [angular styles guide](https://angular.io/guide/styleguide) and some personal experiences.
 - Best practice to import and use [Angular Material](https://angular.io/guide/styleguide).
 - Using username/password authentication.
 - Using [D3Js](https://d3js.org/), branch [`feature/d3`](https://github.com/dang1412/angular-practice-starter/tree/feature/d3).
 - Using [Tradingview](https://www.tradingview.com/chart/) with official sample, branch [`feature/tradingview`](https://github.com/dang1412/angular-practice-starter/tree/feature/tradingview)
 - Using [Ccex-api](https://github.com/dang1412/ccex-api) (library that wrapping crypto exchanges api) including Tradingview with realtime datafeed, branch [`feature/ccex-api`](https://github.com/dang1412/angular-practice-starter/tree/feature/ccex-api).

 ## TODO
  - Using Firebase authentication.
  - Using Google Drive storage.
  - Using AWS S3.
  - ... Please tell me more.

## Guides

### Add material
```
npm i --save @angular/material @angular/cdk @angular/animations
```
 - Create angular material import module file `src/shared/material.module.ts`
 - Include font style `src/index.html`
```
<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
```
 - Include prebuilt theme style `src/styles.scss`
```
@import '~@angular/material/prebuilt-themes/deeppurple-amber.css';
```

## Code scalfoding
Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Create module with pages and components
Steps to generate one module with one page component (associated directly with a route), and one reusable component (used in page components with input, output).

```
ng g module feature-modules/main
ng g component feature-modules/main/pages/my-page --skip-import
ng g component feature-modules/main/components/my-view --skip-import
```

 - Create `feature-modules/main/pages/index.ts`
```ts
import { MyPageComponent } from './my-page/my-page.component';

// used in module
export const MainPages = [
  MyPageComponent,
];

// used in routing module
export {
  MyPageComponent
};
```

 - Create `feature-modules/main/components/index.ts`
```ts
import { MyViewComponent } from './my-view/my-view.component';

export const MainComponents = [
  MyViewComponent
];
```

 - Routing module
```ts
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
```

 - Declarations in main module
```ts
import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';

// components
import { MainComponents } from './components';

// pages
import { MainPages } from './pages';

// routing
import { MainRoutingModule } from './main-routing.module';

@NgModule({
  imports: [
    SharedModule,
    MainRoutingModule
  ],
  declarations: [
    ...MainPages,
    ...MainComponents
  ]
})
export class MainModule { }
```
## Run, build and test

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

[Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

## Contributing
If you have any comment or desired sample feature, welcome to create issue. I will check them all and try to be helpful as much as possible.
