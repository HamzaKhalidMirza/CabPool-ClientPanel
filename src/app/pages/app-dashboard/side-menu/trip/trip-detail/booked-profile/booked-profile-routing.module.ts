import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BookedProfilePage } from './booked-profile.page';

const routes: Routes = [
  {
    path: '',
    component: BookedProfilePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BookedProfilePageRoutingModule {}
