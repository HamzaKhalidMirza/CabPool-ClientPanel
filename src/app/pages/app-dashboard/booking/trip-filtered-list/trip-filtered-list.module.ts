import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TripFilteredListPageRoutingModule } from './trip-filtered-list-routing.module';

import { TripFilteredListPage } from './trip-filtered-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TripFilteredListPageRoutingModule
  ],
  declarations: [TripFilteredListPage]
})
export class TripFilteredListPageModule {}
