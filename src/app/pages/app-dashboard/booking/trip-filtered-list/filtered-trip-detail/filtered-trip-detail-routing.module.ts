import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FilteredTripDetailPage } from './filtered-trip-detail.page';

const routes: Routes = [
  {
    path: '',
    component: FilteredTripDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FilteredTripDetailPageRoutingModule {}
