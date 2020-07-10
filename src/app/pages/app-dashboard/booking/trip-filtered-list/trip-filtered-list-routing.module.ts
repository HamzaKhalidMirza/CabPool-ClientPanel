import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TripFilteredListPage } from './trip-filtered-list.page';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: TripFilteredListPage,
      },
      {
        path: ':tridId',
        loadChildren: () => import('./filtered-trip-detail/filtered-trip-detail.module').then( m => m.FilteredTripDetailPageModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TripFilteredListPageRoutingModule {}
