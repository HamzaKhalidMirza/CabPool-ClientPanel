import { TripService } from "./../../../../../common/sdk/custom/api/trip.service";
import { Component, OnInit } from "@angular/core";
import { Location } from "@angular/common";
import { AppError } from "src/common/error/app-error";
import { BadInput } from "src/common/error/bad-input";
import { NotFoundError } from "src/common/error/not-found-error";
import { UnAuthorized } from "src/common/error/unauthorized-error";
import { SegmentChangeEventDetail } from "@ionic/core";
import {format} from "date-fns";

@Component({
  selector: 'app-trip',
  templateUrl: './trip.page.html',
  styleUrls: ['./trip.page.scss'],
})
export class TripPage implements OnInit {
  loadedbookings: any = [];
  relevantbookings: any = [];
  isLoading: any;

  constructor(private location: Location, private tripService: TripService) {}

  getTripDayName(dateStr, locale) {
    var date = new Date(dateStr);
    return date.toLocaleDateString(locale, { weekday: "long" });
  }

  getTripTime(dateStr) {
    var time = new Date(dateStr);
    return format(time, 'h:m a');
  }

  async ngOnInit() {
    this.isLoading = true;
    const getCurrentClientObservable = await this.tripService.getCurrentClientBookings();

    getCurrentClientObservable.subscribe(
      async (response: any) => {
        this.isLoading = false;
        console.log(response);
        this.loadedbookings = response.data.data;
        this.relevantbookings = this.loadedbookings.filter(
          (booking) => booking.status === "complete"
        );
        console.log("CO-Bookings", this.relevantbookings);
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
  }

  onFilterUpdate(event: CustomEvent<SegmentChangeEventDetail>) {
    if (event.detail.value === "complete") {
      this.relevantbookings = this.loadedbookings.filter(
        (booking) => booking.status === "complete"
      );
      console.log("CO-Bookings", this.relevantbookings);
    } else if (event.detail.value === "cancelled") {
      this.relevantbookings = this.loadedbookings.filter(
        (booking) => booking.status === "cancelled"
      );
      console.log("CA-Bookings", this.relevantbookings);
    } else if (event.detail.value === "upcoming") {
      this.relevantbookings = this.loadedbookings.filter(
        (booking) => booking.status === "upcoming"
      );
      console.log("UP-Bookings", this.relevantbookings);
    }
  }

  goBack() {
    this.location.back();
  }
}