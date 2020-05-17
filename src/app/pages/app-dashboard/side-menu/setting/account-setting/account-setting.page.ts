import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { AuthService } from 'src/common/sdk/core/auth.service';

@Component({
  selector: 'app-account-setting',
  templateUrl: './account-setting.page.html',
  styleUrls: ['./account-setting.page.scss'],
})
export class AccountSettingPage implements OnInit {

  currentUser: any;

  constructor(
    private location: Location,
    private authService: AuthService
  ) { }

  async ngOnInit() {
    this.currentUser = await this.authService.getCurrentUser();
    if (this.currentUser.gender === undefined) {
      this.currentUser.gender = 'Not yet specified';
    }
    if (this.currentUser.dob === undefined) {
      this.currentUser.dob = 'Not yet specified';
    }
  }

  goBack() {
    this.location.back();
  }

}
