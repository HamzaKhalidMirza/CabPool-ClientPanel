import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';

import * as jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private storage: Storage, private router: Router) {}

  public saveTokenToStorage(token: string) {
    this.storage.set('token', token);
  }

  public getTokenFromStorage() {
    return this.storage.get('token');
  }

  public async logout() {
    this.storage.remove('token');
    this.router.navigateByUrl('/sign-in');
  }

  getDecodedAccessToken(token: string): any {
    try {
      return jwt_decode(token);
    } catch (Error) {
      return null;
    }
  }
}
