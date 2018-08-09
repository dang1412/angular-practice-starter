import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { CoreServices } from './services';
import { CoreComponents } from './components';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule
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
