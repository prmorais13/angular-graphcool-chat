import { NgModule, Optional, SkipSelf } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// import { MatToolbarModule, MatListModule } from '@angular/material';
import { GraphQLModule } from '../graphql.module';

@NgModule({
  declarations: [],
  exports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    // MatToolbarModule,
    // MatListModule,
    GraphQLModule
  ]
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error('CorelModule só pode ser importanto uma vez!');
    }
  }
}
