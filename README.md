# Angular Best Practice Starter

This project was originally generated with [Angular CLI](https://github.com/angular/angular-cli) version 6.0.8.

## Features
 - Follows official [angular styles guide](https://angular.io/guide/styleguide) and some personal experiences
 - Good practice to import and use [Angular Material](https://angular.io/guide/styleguide)
 - Mock login session and sample use of login guard

## Overall structure

`AModule -> BModule` means that module A is imported inside module B declaration file (directly import or via lazy route definition)

<p align="center"><img src="assets/structure-diagram.png"></p>

Inside a feature module we may have a single component or have the whole structure same to its parent app module

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

Generate module, page components (associated directly with a route), presentation components (used in page components with input, output)

```
ng g module feature-modules/feature-awesome
ng g component feature-modules/feature-awesome/pages/my-page
ng g component feature-modules/feature-awesome/components/first-component
``` 

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

[Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
