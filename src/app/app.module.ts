import { NgModule } from '@angular/core';

import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';

// root component
import { AppComponent } from './app.component';

// routing
import { AppRouting } from './app.routing';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    CoreModule,
    SharedModule,
    AppRouting,
  ],
  providers: [],
  bootstrap: [AppComponent],
})

export class AppModule { }
