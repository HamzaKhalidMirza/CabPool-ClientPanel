import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

import { ImagePickerComponent } from './pickers/image-picker/image-picker.component';
import { MapCoverComponent } from './pickers/map-cover/map-cover.component';
import { LocationPickerModalComponent } from './modals/location-picker-modal/location-picker-modal.component';
import { LocationPickerMapComponent } from './pickers/location-picker-map/location-picker-map.component';

@NgModule({
    declarations: [
        ImagePickerComponent,
        MapCoverComponent,
        LocationPickerModalComponent,
        LocationPickerMapComponent
    ],
    imports: [
        CommonModule,
        IonicModule,
        RouterModule,
        FormsModule
    ],
    exports: [
        ImagePickerComponent,
        MapCoverComponent,
        LocationPickerModalComponent,
        LocationPickerMapComponent
    ],
    entryComponents: [
        LocationPickerModalComponent
    ]
  })
  export class SharedModule {}
  