import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsLayoutComponent } from './settings-layout/settings-layout.component';

import { ScrollBarComponent } from './scroll-bar/scroll-bar.component';
import { SharedModule } from '../shared/shared.module';
import { StarkPermissionsModule } from '../stark-permissions/stark-permissions.module';


@NgModule({
  imports: [
    CommonModule,
    SettingsRoutingModule,
    SharedModule,
    StarkPermissionsModule
  ],
  declarations: [SettingsLayoutComponent, ScrollBarComponent]
})
export class SettingsModule { }
