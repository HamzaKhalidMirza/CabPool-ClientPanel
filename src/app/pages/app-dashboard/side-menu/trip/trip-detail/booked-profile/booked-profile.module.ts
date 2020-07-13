import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BookedProfilePageRoutingModule } from './booked-profile-routing.module';

import { BookedProfilePage } from './booked-profile.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BookedProfilePageRoutingModule
  ],
  declarations: [BookedProfilePage]
})
export class BookedProfilePageModule {}
