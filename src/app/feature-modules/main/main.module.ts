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
