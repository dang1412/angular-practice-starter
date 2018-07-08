import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { CoreServices } from './services';
import { CoreComponents } from './components';

@NgModule({
  imports: [
    BrowserModule,
  ],
  declarations: [
    ...CoreComponents,
  ],
  exports: [
    ...CoreComponents,
  ],
  providers: [
    ...CoreServices,
  ]
})
export class CoreModule { }
