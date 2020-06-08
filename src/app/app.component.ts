import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Plugins, Capacitor } from '@capacitor/core';
import { AuthService } from 'src/common/sdk/core/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {

  currentUser: any;
  public appMainPages = [
    {
      title: 'Your Trips',
      url: '/app-dashboard/trip',
      icon: 'car-sport'
    },
    {
      title: 'Wallet',
      url: '/app-dashboard/wallet',
      icon: 'cash'
    },
    {
      title: 'Get discounts',
      url: '/app-dashboard/discount',
      icon: 'shield-checkmark'
    }
  ];
  public appAccountPages = [
    {
      title: 'Settings',
      url: '/app-dashboard/setting',
      icon: 'settings'
    },
    {
      title: 'Help',
      url: '/app-dashboard/help',
      icon: 'help-circle'
    },
    {
      title: 'Sign Out',
      url: '/app-starter-auth',
      icon: 'log-out'
    }
  ];

  public legalPage = {
    title: 'Legal',
    url: '/app-dashboard/legal',
    version: 'v1.0.0'
  };

  constructor(
    private platform: Platform,
    private authService: AuthService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      if (Capacitor.isPluginAvailable('SplashScreen')) {
        Plugins.SplashScreen.hide();
      }
    });
  }

  async ngOnInit() {
    this.currentUser = await this.authService.getCurrentUser();
  }

  logout(page) {
    if (page.title === 'Sign Out') {
      this.authService.logout();
    }
  }
}
