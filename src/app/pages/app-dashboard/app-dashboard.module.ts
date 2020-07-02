import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AppDashboardPageRoutingModule } from './app-dashboard-routing.module';

import { AppDashboardPage } from './app-dashboard.page';

import { SharedModule } from './shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AppDashboardPageRoutingModule,
    SharedModule
  ],
  declarations: [AppDashboardPage]
})
export class AppDashboardPageModule {}
