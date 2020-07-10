import { TripService } from "src/common/sdk/custom/api/trip.service";
import { BaseMapService } from "src/common/sdk/custom/maps/baseMap.service";
import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  Renderer2,
} from "@angular/core";
import { Location } from "@angular/common";
import { ActivatedRoute } from "@angular/router";
import { AppError } from "src/common/error/app-error";
import { BadInput } from "src/common/error/bad-input";
import { NotFoundError } from "src/common/error/not-found-error";
import { UnAuthorized } from "src/common/error/unauthorized-error";
import { format } from "date-fns";
import { LoadingController, ModalController, AlertController } from "@ionic/angular";
import { LocationPickerModalComponent } from "../../../shared/modals/location-picker-modal/location-picker-modal.component";
import { Coordinates } from "./../../../../../../common/model/placeLocation.model";
import { Plugins } from "@capacitor/core";
const { Geolocation } = Plugins;
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from "@angular/forms";

@Component({
  selector: "app-filtered-trip-detail",
  templateUrl: "./filtered-trip-detail.page.html",
  styleUrls: ["./filtered-trip-detail.page.scss"],
})
export class FilteredTripDetailPage implements OnInit {
  @ViewChild("mapTrip", { static: true }) mapTripElementRef: ElementRef;
  @ViewChild("mapBooking", { static: true }) mapBookingElementRef: ElementRef;
  @ViewChild("mapContainer", { static: true }) mapContainer: ElementRef;
  @ViewChild("warningContainer", { static: true }) warningContainer: ElementRef;
  center: any;
  tripSourceLocation: any;
  tripDestLocation: any;
  bookingSourceLocation: any;
  bookingDestLocation: any;
  googleMapsSdk: any;
  isLoading: any;
  loadedTrip: any;
  seatsCounter: number = 1;
  warningText: any;
  tripBookingForm: FormGroup;

  constructor(
    private location: Location,
    private renderer: Renderer2,
    private baseMapService: BaseMapService,
    private route: ActivatedRoute,
    private tripService: TripService,
    private formBuilder: FormBuilder,
    private loadingCtrl: LoadingController,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    this.formInitializer();

    this.route.paramMap.subscribe(async (router) => {
      let tripId = router.get("tridId");
      this.isLoading = true;
      const getTripObservable = await this.tripService.getSingleTrip({
        tripId,
      });

      getTripObservable.subscribe(
        async (response: any) => {
          this.isLoading = false;
          console.log(response);
          this.loadedTrip = response.data.data;
          this.tripSourceLocation = {
            lat: this.loadedTrip.startLocation.coordinates[0],
            lng: this.loadedTrip.startLocation.coordinates[1],
            address: this.loadedTrip.startLocation.address,
          };
          this.tripDestLocation = {
            lat: this.loadedTrip.endLocation.coordinates[0],
            lng: this.loadedTrip.endLocation.coordinates[1],
            address: this.loadedTrip.endLocation.address,
          };
          this.seatsCounter = this.loadedTrip.seatsAvailable;
          this.tripBookingForm.patchValue({seatsReserved: this.seatsCounter});  

          this.createMap(
            this.mapTripElementRef,
            this.tripSourceLocation,
            this.tripDestLocation
          );
        },
        (error: AppError) => {
          this.isLoading = false;
          if (error instanceof BadInput) {
            console.log("error B", error);
          } else if (error instanceof NotFoundError) {
            console.log("error N", error);
          } else if (error instanceof UnAuthorized) {
            console.log("error U", error);
          } else {
            console.log("error", error);
          }
        }
      );
    });
  }

  formInitializer() {
    this.tripBookingForm = this.formBuilder.group({
      description: [""],
      seatsReserved: ["",Validators.required],
      startLocation: ["",Validators.required],
      endLocation: ["",Validators.required]
    });
    this.tripBookingForm.reset();
  }

  openMapPickerModal() {
    this.warningContainer.nativeElement.style.display = "none";
    Geolocation.getCurrentPosition()
      .then((geoPosition) => {
        const coordinates: Coordinates = {
          lat: geoPosition.coords.latitude,
          lng: geoPosition.coords.longitude,
        };
        this.center = coordinates;

        this.modalCtrl
          .create({
            component: LocationPickerModalComponent,
            componentProps: {
              currentLocation: this.center,
            },
          })
          .then((modalEl) => {
            modalEl.present();
            modalEl.onDidDismiss().then(async (locationData) => {
              if (locationData.data != null) {
                this.bookingSourceLocation = locationData.data[0];
                this.bookingDestLocation = locationData.data[1];

                let tripStart = new this.googleMapsSdk.LatLng(
                  this.tripSourceLocation.lat,
                  this.tripSourceLocation.lng
                );
                let tripEnd = new this.googleMapsSdk.LatLng(
                  this.tripDestLocation.lat,
                  this.tripDestLocation.lng
                );
                let bookingStart = new this.googleMapsSdk.LatLng(
                  this.bookingSourceLocation.lat,
                  this.bookingSourceLocation.lng
                );
                let bookingEnd = new this.googleMapsSdk.LatLng(
                  this.bookingDestLocation.lat,
                  this.bookingDestLocation.lng
                );

                var cascadiaFault = new this.googleMapsSdk.Polyline({
                  path: [tripStart, tripEnd],
                });

                // console.log(tripStart.lat(), tripStart.lng());
                // console.log(tripEnd.lat(), tripEnd.lng());
                // console.log(bookingStart.lat(), bookingStart.lng());
                // console.log(bookingEnd.lat(), bookingEnd.lng());
                // console.log(cascadiaFault);

                if (
                  this.googleMapsSdk.geometry.poly.isLocationOnEdge(
                    new this.googleMapsSdk.LatLng(
                      bookingStart.lat(),
                      bookingStart.lng()
                    ),
                    cascadiaFault,
                    10e-3
                  )
                ) {
                  if (
                    this.googleMapsSdk.geometry.poly.isLocationOnEdge(
                      new this.googleMapsSdk.LatLng(
                        bookingEnd.lat(),
                        bookingEnd.lng()
                      ),
                      cascadiaFault,
                      10e-3
                    )
                  ) {
                    this.mapContainer.nativeElement.style.display = "block";
                    this.createMap(
                      this.mapBookingElementRef,
                      this.bookingSourceLocation,
                      this.bookingDestLocation
                    );

                    this.tripBookingForm.patchValue({
                      startLocation: {
                        coordinates: [this.bookingSourceLocation.lat, this.bookingSourceLocation.lng],
                        address: this.bookingSourceLocation.address
                      }
                    });
                    this.tripBookingForm.patchValue({
                      endLocation: {
                        coordinates: [this.bookingDestLocation.lat, this.bookingDestLocation.lng],
                        address: this.bookingDestLocation.address
                      }
                    });
                    this.tripBookingForm.patchValue({seatsReserved: this.seatsCounter});

                  } else {
                    this.mapContainer.nativeElement.style.display = "none";
                    this.bookingSourceLocation = null;
                    this.bookingDestLocation = null;
                    this.warningContainer.nativeElement.style.display = "block";
                    this.warningText =
                      "Dropoff Location is far from the path. Please try again to relocate near the path.";
                  }
                } else {
                  this.mapContainer.nativeElement.style.display = "none";
                  this.bookingSourceLocation = null;
                  this.bookingDestLocation = null;
                  this.warningContainer.nativeElement.style.display = "block";
                  this.warningText =
                    "Pickup Location is far from the path. Please try again to relocate near the path.";
                }
              }
            });
          });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  onBookingTrip() {
    if (this.tripBookingForm.invalid) {
      return;
    }
    this.tripBookingForm.patchValue({seatsReserved: this.seatsCounter});

    this.loadingCtrl.create({}).then( async (loadingEl) => {
      loadingEl.present();

      const bookTripObservable = await this.tripService
      .bookTrip(this.tripBookingForm.value, this.loadedTrip.id);

      bookTripObservable.subscribe(
        async (response) => {
            loadingEl.dismiss();
            this.tripBookingForm.reset();

            console.log('response', response);
            this.seatsCounter = 1;
            this.mapContainer.nativeElement.style.display = "none";
            this.bookingSourceLocation = null;
            this.bookingDestLocation = null;

            this.alertCtrl
            .create({
              header: "Booking Created Successfully!",
              buttons: ["Okay"],
            })
            .then((alertEl) => alertEl.present());
      
        },
        (error: AppError) => {
          loadingEl.dismiss();
          if (error instanceof BadInput) {
            console.log("error B", error);
          } else if (error instanceof NotFoundError) {
            console.log("error N", error);
          } else if (error instanceof UnAuthorized) {
            console.log("error U", error);
          } else {
            console.log("error", error);
          }
        }
      );
    });
  }

  incrementSeat() {
    if (this.seatsCounter === this.loadedTrip.seatsAvailable) {
      return;
    }
    this.seatsCounter++;
  }

  decrementSeat() {
    if (this.seatsCounter === 1) {
      return;
    }
    this.seatsCounter--;
  }

  createMap(mapElement: ElementRef, sourceLocation, destLocation) {
    this.baseMapService
      .getGoogleMapsSdk()
      .then((googleMapsSdk: any) => {
        this.googleMapsSdk = googleMapsSdk;
        var start = new googleMapsSdk.LatLng(
          sourceLocation.lat,
          sourceLocation.lng
        );
        var end = new googleMapsSdk.LatLng(destLocation.lat, destLocation.lng);

        mapElement.nativeElement.hidden = false;
        const mapEl = mapElement.nativeElement;

        const map = new googleMapsSdk.Map(mapEl, {
          center: start,
          zoom: 14,
          disableDefaultUI: true,
          scaleControl: true,
          zoomControl: true,
          mapTypeId: "roadmap",
        });

        this.googleMapsSdk.event.addListenerOnce(map, "idle", () => {
          this.renderer.addClass(mapEl, "visible");
        });

        let sourceMarker = new googleMapsSdk.Marker({
          position: start,
          icon: "assets/icon/car.png",
          map: map,
          title: "Picked Location",
        });

        let destMarker = new googleMapsSdk.Marker({
          position: end,
          icon: "assets/icon/car.png",
          map: map,
          title: "Destination Location",
        });

        let directionsService = new googleMapsSdk.DirectionsService();
        let directionsDisplay = new googleMapsSdk.DirectionsRenderer();
        directionsDisplay.setMap(map);

        // console.log('D', directionsService);

        // var bounds = new googleMapsSdk.LatLngBounds();
        // // bounds.extend(start);
        // // bounds.extend(end);
        // map.fitBounds(bounds);

        // var cascadiaFault = new googleMapsSdk.Polyline({
        //   path: [
        //     start,
        //     end
        //   ]
        // });

        // if (googleMapsSdk.geometry.poly.isLocationOnEdge(
        //   new googleMapsSdk.LatLng(33.583141, 73.096908), cascadiaFault, 10e-3)) {
        //   alert("Relocate!");
        // } else {
        //   alert("No Relocate!");
        // }

        var request = {
          origin: start,
          destination: end,
          travelMode: googleMapsSdk.TravelMode.DRIVING,
        };
        directionsService.route(request, function (response, status) {
          if (status == googleMapsSdk.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
            directionsDisplay.setMap(map);
          } else {
            alert(
              "Directions Request from " +
                start.toUrlValue(6) +
                " to " +
                end.toUrlValue(6) +
                " failed: " +
                status
            );
          }
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  getTripDayName(dateStr, locale) {
    var date = new Date(dateStr);
    return date.toLocaleDateString(locale, { weekday: "long" });
  }

  getTripTime(dateStr) {
    var time = new Date(dateStr);
    return format(time, "hh:mm a");
  }

  goBack() {
    this.location.back();
  }
}
