import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TripDetailPage } from './trip-detail.page';

const routes: Routes = [
  {
    path: '',
    component: TripDetailPage
  },
  {
    path: 'booked-profile',
    loadChildren: () => import('./booked-profile/booked-profile.module').then( m => m.BookedProfilePageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TripDetailPageRoutingModule {}
