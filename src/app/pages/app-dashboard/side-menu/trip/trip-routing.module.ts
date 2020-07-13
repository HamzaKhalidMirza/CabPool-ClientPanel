import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TripPage } from './trip.page';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: TripPage,
      },
      {
        path: ':tridId',
        loadChildren: () => import('./trip-detail/trip-detail.module').then( m => m.TripDetailPageModule)
      }
    ]

  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TripPageRoutingModule {}
