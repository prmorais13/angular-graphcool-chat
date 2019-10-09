import { AutoLoginGuard } from './login/auto-login.guard'
import { NgModule } from '@angular/core'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { CoreModule } from './core/core.module'
import { LoginModule } from './login/login.module'

@NgModule({
  declarations: [AppComponent],
  imports: [CoreModule, LoginModule, AppRoutingModule],
  providers: [AutoLoginGuard],
  bootstrap: [AppComponent]
})
export class AppModule {}
