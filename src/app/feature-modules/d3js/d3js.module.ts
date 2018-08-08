import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';

// components
import { D3JsComponents } from './components';

// pages
import { D3JsPages } from './pages';

// routing
import { D3JsRoutingModule } from './d3js-routing.module';

@NgModule({
  imports: [
    SharedModule,
    D3JsRoutingModule
  ],
  declarations: [
    D3JsComponents,
    D3JsPages,
  ]
})
export class D3jsModule { }
