import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';

// pages
import { CcexApiPages } from './pages';

// components
import { CcexApiComponents } from './components';

// routing
import { CcexApiRoutingModule } from './ccex-api-routing.module';

@NgModule({
  imports: [
    SharedModule,
    CcexApiRoutingModule,
  ],
  declarations: [
    ...CcexApiPages,
    ...CcexApiComponents,
  ],
})
export class CcexApiModule { }
