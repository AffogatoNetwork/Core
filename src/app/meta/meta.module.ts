import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MetaSenderComponent} from './meta-sender/meta-sender.component';
import {UtilModule} from '../util/util.module';
import {RouterModule} from '@angular/router';
import { AppMaterialModule } from './../app.material.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { TopNavComponent } from './top-nav/top-nav.component';
import { QRCodeModule } from 'angularx-qrcode';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    CommonModule,
    AppMaterialModule,
    RouterModule,
    UtilModule,
    QRCodeModule
  ],
  declarations: [
    MetaSenderComponent,
    TopNavComponent
],
  exports: [
    MetaSenderComponent,
    TopNavComponent]
})
export class MetaModule {
}
