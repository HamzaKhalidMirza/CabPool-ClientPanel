import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/common/sdk/core/auth.service';
import { TripService } from 'src/common/sdk/custom/api/trip.service';
import { BaseMapService } from 'src/common/sdk/custom/maps/baseMap.service';
import { Location } from "@angular/common";
import { LoadingController } from "@ionic/angular";
import { AppError } from "src/common/error/app-error";
import { BadInput } from "src/common/error/bad-input";
import { NotFoundError } from "src/common/error/not-found-error";
import { UnAuthorized } from "src/common/error/unauthorized-error";
import {format} from "date-fns";

@Component({
  selector: 'app-trip-filtered-list',
  templateUrl: './trip-filtered-list.page.html',
  styleUrls: ['./trip-filtered-list.page.scss'],
})
export class TripFilteredListPage implements OnInit {

  sourceLocation: any;
  destLocation: any;
  googleMapsSdk: any;
  loadedTrips: any = [];
  relevantTrips: any = [];
  week: any = [];
  isLoading: any;
  isCarFilter: any = false;

  constructor(
    private authService: AuthService,
    private tripService: TripService,
    private location: Location,
    private loadingCtrl: LoadingController,
    private baseMapService: BaseMapService
  ) { }

  async ngOnInit() {

    const date1 = new Date();
    let day = this.getDayName(date1, 'en-Us');
    this.week.push({
      date: date1,day
    });
    const date2 = new Date(date1);
    date2.setDate(date2.getDate() + 1);
    day = this.getDayName(date2, 'en-Us');
    this.week.push({
      date: date2,day
    });
    const date3 = new Date(date1);
    date3.setDate(date3.getDate() + 2);
    day = this.getDayName(date3, 'en-Us');
    this.week.push({
      date: date3,day
    });
    const date4 = new Date(date1);
    date4.setDate(date4.getDate() + 3);
    day = this.getDayName(date4, 'en-Us');
    this.week.push({
      date: date4,day
    });
    const date5 = new Date(date1);
    date5.setDate(date5.getDate() + 4);
    day = this.getDayName(date5, 'en-Us');
    this.week.push({
      date: date5,day
    });
    const date6 = new Date(date1);
    date6.setDate(date6.getDate() + 5);
    day = this.getDayName(date6, 'en-Us');
    this.week.push({
      date: date6,day
    });
    const date7 = new Date(date1);
    date7.setDate(date7.getDate() + 6);
    day = this.getDayName(date7, 'en-Us');
    this.week.push({
      date: date7,day
    });
    this.week.push({
      day: 'All'
    });

    console.log('Week', this.week);

    this.isLoading = true;
    this.sourceLocation = await this.authService.getFieldDataFromStorage("source");
    this.destLocation = await this.authService.getFieldDataFromStorage("dest");
    await this.authService.clearFieldDataFromStorage("source");
    await this.authService.clearFieldDataFromStorage("dest");

    if(this.sourceLocation && this.destLocation) {
      const searchTripObservable = await this.tripService.searchTripsWithinLocation({
        startLoc: this.sourceLocation,
        endLoc: this.destLocation
      });
  
      searchTripObservable.subscribe(
        async (response: any) => {
          this.isLoading = false;
          console.log(response);
          this.loadedTrips = response.data.data;
          this.relevantTrips = this.loadedTrips.filter(
            (trip) => trip.status === "upcoming"
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
    } else {
      this.isLoading = false;
    }
  }

  filterTripsByDay(value) {
    if(value === 'All') {
      this.relevantTrips = this.loadedTrips.filter(
        (trip) => trip.status === "upcoming"
      );
      return;
    }

    let selectedDate;
    this.week.forEach(day => {
      if(day.day === value) {
        selectedDate = day.date;
      }
    });
    const date = new Date(selectedDate);
    this.relevantTrips = this.loadedTrips.filter(
      (trip) => {
        const startDate = trip.startDate;
        const tripDate = new Date(startDate);
        return tripDate.getFullYear()+':'+tripDate.getMonth()+':'+tripDate.getDate() ===
          date.getFullYear()+':'+date.getMonth()+':'+date.getDate() && 
          trip.status === "upcoming";
      }
    );
  }

  filterTripsByBike() {
    this.relevantTrips = this.loadedTrips.filter(
      (trip) => trip.status === "upcoming" &&
                trip.vehicle.type === 'bike'
    );
  }

  filterTripsByMini() {
    this.relevantTrips = this.loadedTrips.filter(
      (trip) => trip.status === "upcoming" &&
                trip.vehicle.type === 'mini'
    );
  }

  filterTripsByMoto() {
    this.relevantTrips = this.loadedTrips.filter(
      (trip) => trip.status === "upcoming" &&
                trip.vehicle.type === 'moto'
    );
  }

  filterTripsByVan() {
    this.relevantTrips = this.loadedTrips.filter(
      (trip) => trip.status === "upcoming" &&
                trip.vehicle.type === 'van'
    );
  }

  changeCarFilter() {
    this.isCarFilter = !this.isCarFilter;
  }
  
  getDayName(dateStr, locale) {
    var date = new Date(dateStr);
    return date.toLocaleDateString(locale, { weekday: "long" });
  }

  getTime(dateStr) {
    var time = new Date(dateStr);
    return format(time, 'h:m a');
  }

  goBack() {
    this.location.back();
  }
}
