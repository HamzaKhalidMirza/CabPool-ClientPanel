import {
  Coordinates,
  PlaceLocation,
} from "./../../../../../../common/model/placeLocation.model";
import { BaseMapService } from "src/common/sdk/custom/maps/baseMap.service";
import { ModalController } from "@ionic/angular";
import {
  ElementRef,
  Input,
  AfterViewInit,
  Output,
  EventEmitter,
} from "@angular/core";
import { Component, NgZone, OnInit, ViewChild } from "@angular/core";

@Component({
  selector: "app-location-picker-modal",
  templateUrl: "./location-picker-modal.component.html",
  styleUrls: ["./location-picker-modal.component.scss"],
})
export class LocationPickerModalComponent implements OnInit, AfterViewInit {
  @ViewChild("editFromIcon", {static: false}) editFromIcon: ElementRef;
  @ViewChild("closeFromIcon", {static: false}) closeFromIcon: ElementRef;
  @ViewChild("editWhereIcon", {static: false}) editWhereIcon: ElementRef;
  @ViewChild("closeWhereIcon", {static: false}) closeWhereIcon: ElementRef;

  @ViewChild("fromInputEl", {static: false}) fromInputEl: ElementRef | any;
  @ViewChild("whereInputEl", {static: false}) whereInputEl: ElementRef | any;

  sourceFocus: any;
  destinationFocus: any;
  lastFocusedField: any;

  @Input("center") currentLocation: Coordinates;
  actualCurrentAddress: any;
  googleMapsSdk: any;
  loading: any;

  sourceLocationItems: any;
  destinationLocationItems: any;

  selectedSourceLocation: any;
  selectedDestinationLocation: any;

  mapAdjustmentIcons: any;
  mapAdjustment: any;

  constructor(
    private modalCtrl: ModalController,
    private baseMapService: BaseMapService,
    private zone: NgZone
  ) {}

  ionViewWillEnter() {
    this.sourceLocationItems = [];
    this.destinationLocationItems = [];
    this.loading = false;
    this.mapAdjustment = false;
    this.mapAdjustmentIcons = true;

    if (this.currentLocation) {
      this.baseMapService
        .getAddress(this.currentLocation.lat, this.currentLocation.lng)
        .subscribe((address) => {
          let actualAddress = '';
          let streetAddress = {
            street_number: null,
            route: null,
            locality: null,
          };
  
          address.address_components.forEach((addressCmp) => {
            let types = addressCmp.types;
            types.forEach((type) => {
              if (type === "street_number") {
                streetAddress.street_number = addressCmp.long_name;
              } else if (type === "route") {
                streetAddress.route = addressCmp.long_name;
              } else if (type === "locality") {
                streetAddress.locality = addressCmp.long_name;
              }
            });
          });
          
          if(streetAddress.street_number != null) {
            actualAddress += streetAddress.street_number + ' - ' +
                             streetAddress.locality;
          } else if(streetAddress.route != null) {
            actualAddress += streetAddress.route + ' - ' +
                             streetAddress.locality;
          } else if(streetAddress.locality != null) {
            actualAddress += streetAddress.locality + ' - ' +
                             streetAddress.locality;
          }

          this.actualCurrentAddress = actualAddress;
  
          const location: PlaceLocation = {
            lat: this.currentLocation.lat,
            lng: this.currentLocation.lng,
            address: actualAddress,
            caption: "Your Location",
            staticMapImageUrl: null,
          };

          this.selectedSourceLocation = location;

          if (this.selectedSourceLocation) {
            this.whereInputEl.setFocus();
          } else {
            this.fromInputEl.setFocus();
          }
        });
    }
  }

  ngOnInit() {}

  ngAfterViewInit() {}

  onSearchSourceLocation(value) {
    this.sourceLocationItems = [];
    this.destinationLocationItems = [];
    this.selectedSourceLocation = null;

    if (value === "") {
      this.closeFromIcon.nativeElement.style.display = "none";
      this.editFromIcon.nativeElement.style.display = "block";
      this.mapAdjustmentIcons = true;
      this.loading = false;
    } else {
      this.closeFromIcon.nativeElement.style.display = "block";
      this.editFromIcon.nativeElement.style.display = "none";
      this.mapAdjustmentIcons = false;
      this.loading = true;

      this.baseMapService
        .getGoogleMapsSdk()
        .then((googleMapsSdk: any) => {
          this.googleMapsSdk = googleMapsSdk;
          let myLatLng = new googleMapsSdk.LatLng({
            lat: this.currentLocation.lat,
            lng: this.currentLocation.lng,
          });

          let service = new googleMapsSdk.places.AutocompleteService();
          service.getPlacePredictions(
            {
              input: value,
              components: "country:pk",
              location: myLatLng,
              radius: "500",
            },
            (predictions) => {
              this.loading = false;
              this.sourceLocationItems = [];

              this.zone.run(() => {
                predictions.forEach((prediction) => {
                  this.sourceLocationItems.push(prediction);
                });
              });
            }
          );
        })
        .catch((err) => {
          this.loading = false;
          console.log(err);
        });
    }
  }

  onSearchDestinationLocation(value) {
    this.sourceLocationItems = [];
    this.destinationLocationItems = [];
    this.selectedDestinationLocation = null;

    if (value === "") {
      this.closeWhereIcon.nativeElement.style.display = "none";
      this.editWhereIcon.nativeElement.style.display = "block";
      this.mapAdjustmentIcons = true;
      this.loading = false;
    } else {
      this.closeWhereIcon.nativeElement.style.display = "block";
      this.editWhereIcon.nativeElement.style.display = "none";
      this.mapAdjustmentIcons = false;
      this.loading = true;

      this.baseMapService
        .getGoogleMapsSdk()
        .then((googleMapsSdk: any) => {
          this.googleMapsSdk = googleMapsSdk;
          let myLatLng = new googleMapsSdk.LatLng({
            lat: this.currentLocation.lat,
            lng: this.currentLocation.lng,
          });

          let service = new googleMapsSdk.places.AutocompleteService();
          service.getPlacePredictions(
            {
              input: value,
              components: "country:pk",
              location: myLatLng,
              radius: "500",
            },
            (predictions) => {
              this.loading = false;
              this.destinationLocationItems = [];

              this.zone.run(() => {
                predictions.forEach((prediction) => {
                  this.destinationLocationItems.push(prediction);
                });
              });
            }
          );
        })
        .catch((err) => {
          this.loading = false;
          console.log(err);
        });
    }
  }

  closeSourceLocationField() {
    console.log("OnCloseFrom Hi");
    this.loading = false;
    this.selectedSourceLocation = null;
    this.sourceLocationItems = [];
    this.closeFromIcon.nativeElement.style.display = "none";
    this.editFromIcon.nativeElement.style.display = "block";
    this.fromInputEl.value = "";
  }

  closeDestinationLocationField() {
    console.log("OnCloseWhere Hi");
    this.loading = false;
    this.selectedDestinationLocation = null;
    this.destinationLocationItems = [];
    this.closeWhereIcon.nativeElement.style.display = "none";
    this.editWhereIcon.nativeElement.style.display = "block";
    this.whereInputEl.value = "";
  }

  onBlurFrom() {
    this.closeFromIcon.nativeElement.style.display = "none";
    this.editFromIcon.nativeElement.style.display = "block";
    this.sourceFocus = false;
    this.loading = false;
    this.lastFocusedField = "Source";
    console.log("Source Focus: ", this.sourceFocus, this.lastFocusedField);
  }

  onBlurwhere() {
    this.closeWhereIcon.nativeElement.style.display = "none";
    this.editWhereIcon.nativeElement.style.display = "block";
    this.destinationFocus = false;
    this.loading = false;
    this.lastFocusedField = "Dest";
    console.log("Dest Focus: ", this.destinationFocus, this.lastFocusedField);
  }

  onFocusFrom(value) {
    this.destinationLocationItems = [];
    this.sourceFocus = true;
    this.mapAdjustment = false;
    console.log("Source Focus: ", this.sourceFocus);

    if (value != "") {
      this.closeFromIcon.nativeElement.style.display = "block";
      this.editFromIcon.nativeElement.style.display = "none";
    } else {
      this.mapAdjustmentIcons = true;
    }

    this.fromInputEl.getInputElement().then((nativeInputEl) => {
      nativeInputEl.select();
    });
  }

  onFocusWhere(value) {
    this.sourceLocationItems = [];
    this.destinationFocus = true;
    this.mapAdjustment = false;
    console.log("Dest Focus: ", this.destinationFocus);

    if (value != "") {
      this.closeWhereIcon.nativeElement.style.display = "block";
      this.editWhereIcon.nativeElement.style.display = "none";
    } else {
      this.mapAdjustmentIcons = true;
    }

    this.whereInputEl.getInputElement().then((nativeInputEl) => {
      nativeInputEl.select();
    });
  }

  onSelectionSourceLocation(item) {
    this.sourceLocationItems = [];
    this.destinationLocationItems = [];
    this.selectedSourceLocation = null;

    let geocoder = new this.googleMapsSdk.Geocoder();
    console.log(this.googleMapsSdk);

    geocoder.geocode({ placeId: item.place_id }, (results, status) => {
      if (status === "OK" && results[0]) {
        let position = {
          lat: results[0].geometry.location.lat(),
          lng: results[0].geometry.location.lng(),
        };

        const location: PlaceLocation = {
          lat: position.lat,
          lng: position.lng,
          address: item.structured_formatting.main_text,
          caption: item.structured_formatting.main_text,
          staticMapImageUrl: null,
        };

        this.selectedSourceLocation = location;

        if (
          this.selectedSourceLocation != null &&
          this.selectedDestinationLocation != null
        ) {

          this.modalCtrl.dismiss([
            this.selectedSourceLocation,
            this.selectedDestinationLocation,
          ]);
          return;
        }

        if (this.selectedSourceLocation) {
          this.whereInputEl.setFocus();
        } else {
          this.fromInputEl.setFocus();
        }
      }
    });
  }

  onSelectionDestinationLocation(item) {
    this.sourceLocationItems = [];
    this.destinationLocationItems = [];
    this.selectedDestinationLocation = null;

    let geocoder = new this.googleMapsSdk.Geocoder();

    geocoder.geocode({ placeId: item.place_id }, (results, status) => {
      if (status === "OK" && results[0]) {
        let position = {
          lat: results[0].geometry.location.lat(),
          lng: results[0].geometry.location.lng(),
        };

        const location: PlaceLocation = {
          lat: position.lat,
          lng: position.lng,
          address: item.structured_formatting.main_text,
          caption: item.structured_formatting.main_text,
          staticMapImageUrl: null,
        };

        this.selectedDestinationLocation = location;

        if (
          this.selectedSourceLocation != null &&
          this.selectedDestinationLocation != null
        ) {
          
          this.modalCtrl.dismiss([
            this.selectedSourceLocation,
            this.selectedDestinationLocation,
          ]);
          return;
        }

        if (this.selectedDestinationLocation) {
          this.fromInputEl.setFocus();
        } else {
          this.whereInputEl.setFocus();
        }
      }
    });
  }

  setCurrentLocation() {
    if (this.lastFocusedField != "Source" && this.lastFocusedField != "Dest") {
      return;
    }
    if (this.lastFocusedField == "Source") {
      const location: PlaceLocation = {
        lat: this.currentLocation.lat,
        lng: this.currentLocation.lng,
        address: this.actualCurrentAddress,
        caption: "Your Location",
        staticMapImageUrl: null,
      };

      this.selectedSourceLocation = location;

      if (
        this.selectedSourceLocation != null &&
        this.selectedDestinationLocation != null
      ) {

        this.modalCtrl.dismiss([
          this.selectedSourceLocation,
          this.selectedDestinationLocation,
        ]);
        return;
      }

      if (this.selectedSourceLocation) {
        this.whereInputEl.setFocus();
      } else {
        this.fromInputEl.setFocus();
      }
    }
    if (this.lastFocusedField == "Dest") {
      const location: PlaceLocation = {
        lat: this.currentLocation.lat,
        lng: this.currentLocation.lng,
        address: this.actualCurrentAddress,
        caption: "Your Location",
        staticMapImageUrl: null,
      };

      this.selectedDestinationLocation = location;

      if (
        this.selectedSourceLocation != null &&
        this.selectedDestinationLocation != null
      ) {

        this.modalCtrl.dismiss([
          this.selectedSourceLocation,
          this.selectedDestinationLocation,
        ]);
        return;
      }

      if (this.selectedDestinationLocation) {
        this.fromInputEl.setFocus();
      } else {
        this.whereInputEl.setFocus();
      }
    }
  }

  openLocationMapContainer() {
    this.mapAdjustment = true;
  }

  captureLocationFromMap(location) {
    if (this.lastFocusedField === "Source") {
      this.selectedSourceLocation = location;
    } else if (this.lastFocusedField === "Dest") {
      this.selectedDestinationLocation = location;
    }
  }

  capturePickupConfirmation() {
    if (
      this.selectedSourceLocation != null &&
      this.selectedDestinationLocation != null
    ) {

      this.modalCtrl.dismiss([
        this.selectedSourceLocation,
        this.selectedDestinationLocation,
      ]);
      return;
    }

    if (this.selectedSourceLocation) {
      this.whereInputEl.setFocus();
    } else {
      this.fromInputEl.setFocus();
    }
  }

  captureDropoffConfirmation() {
    if (
      this.selectedSourceLocation != null &&
      this.selectedDestinationLocation != null
    ) {

      this.modalCtrl.dismiss([
        this.selectedSourceLocation,
        this.selectedDestinationLocation,
      ]);
      return;
    }

    if (this.selectedDestinationLocation) {
      this.fromInputEl.setFocus();
    } else {
      this.whereInputEl.setFocus();
    }
  }

  goBack() {
    this.modalCtrl.dismiss();
  }
}
