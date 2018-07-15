import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';

// pages
import { CcexApiPages } from './pages';

// routing
import { CcexApiRoutingModule } from './ccex-api-routing.module';

@NgModule({
  imports: [
    SharedModule,
    CcexApiRoutingModule,
  ],
  declarations: [
    ...CcexApiPages,
  ],
})
export class CcexApiModule { }
