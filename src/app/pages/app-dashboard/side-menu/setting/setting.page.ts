import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { AuthService } from 'src/common/sdk/core/auth.service';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.page.html',
  styleUrls: ['./setting.page.scss'],
})
export class SettingPage implements OnInit {

  constructor(
    private location: Location,
    private authService: AuthService
  ) { }

  ngOnInit() {
  }

  goBack() {
    this.location.back();
  }

  logout() {
    this.authService.logout();
  }

}
