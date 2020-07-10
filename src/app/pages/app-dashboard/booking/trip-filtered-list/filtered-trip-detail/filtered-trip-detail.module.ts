import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FilteredTripDetailPageRoutingModule } from './filtered-trip-detail-routing.module';

import { FilteredTripDetailPage } from './filtered-trip-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    FilteredTripDetailPageRoutingModule
  ],
  declarations: [FilteredTripDetailPage]
})
export class FilteredTripDetailPageModule {}
