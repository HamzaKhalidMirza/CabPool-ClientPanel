import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Renderer2,
} from "@angular/core";
import { AuthService } from "src/common/sdk/core/auth.service";
import { format } from "date-fns";
import { Location } from "@angular/common";
import { BaseMapService } from "src/common/sdk/custom/maps/baseMap.service";

@Component({
  selector: "app-booked-profile",
  templateUrl: "./booked-profile.page.html",
  styleUrls: ["./booked-profile.page.scss"],
})
export class BookedProfilePage implements OnInit {
  @ViewChild("map", {static: false}) mapElementRef: ElementRef;
  sourceLocation: any;
  destLocation: any;
  googleMapsSdk: any;
  isLoading: any;
  bookingData: any;

  constructor(
    private location: Location,
    private renderer: Renderer2,
    private baseMapService: BaseMapService,
    private authService: AuthService
  ) {}

  async ngOnInit() {
    this.isLoading = true;
    this.bookingData = await this.authService.getFieldDataFromStorage(
      "bookedData"
    );
    this.sourceLocation = {
      lat: this.bookingData.startLocation.coordinates[0],
      lng: this.bookingData.startLocation.coordinates[1],
      address: this.bookingData.startLocation.address,
    };
    this.destLocation = {
      lat: this.bookingData.endLocation.coordinates[0],
      lng: this.bookingData.endLocation.coordinates[1],
      address: this.bookingData.endLocation.address,
    };

    this.createMap();
    this.isLoading = false;
  }

  createMap() {
    this.baseMapService
      .getGoogleMapsSdk()
      .then((googleMapsSdk: any) => {
        this.googleMapsSdk = googleMapsSdk;
        var start = new googleMapsSdk.LatLng(
          this.sourceLocation.lat,
          this.sourceLocation.lng
        );
        var end = new googleMapsSdk.LatLng(
          this.destLocation.lat,
          this.destLocation.lng
        );

        this.mapElementRef.nativeElement.hidden = false;
        const mapEl = this.mapElementRef.nativeElement;

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

        var bounds = new googleMapsSdk.LatLngBounds();
        // bounds.extend(start);
        // bounds.extend(end);
        map.fitBounds(bounds);
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
