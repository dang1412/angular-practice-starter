import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';

// components
import { TradingViewComponents } from './components';

// pages
import { TradingViewPages } from './pages';

// routing
import { TradingViewRoutingModule } from './tradingview-routing.module';

@NgModule({
  imports: [
    SharedModule,
    TradingViewRoutingModule,
  ],
  declarations: [
    ...TradingViewComponents,
    ...TradingViewPages,
  ]
})
export class TradingViewModule { }
