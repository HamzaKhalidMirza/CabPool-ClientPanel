import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TripFilteredListPage } from './trip-filtered-list.page';

const routes: Routes = [
  {
    path: '',
    component: TripFilteredListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TripFilteredListPageRoutingModule {}
