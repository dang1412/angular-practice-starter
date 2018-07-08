import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { SharedPipes } from './pipes';
import { SharedComponents } from './components';
import { SharedDirectives } from './directives';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
  ],
  declarations: [
    ...SharedComponents,
    ...SharedPipes,
  ],
  exports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ...SharedComponents,
    ...SharedPipes,
    ...SharedDirectives,
  ],
  providers: [
  ]
})
export class SharedModule { }
