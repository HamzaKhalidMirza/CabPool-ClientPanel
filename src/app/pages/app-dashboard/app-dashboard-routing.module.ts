import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppDashboardPage } from './app-dashboard.page';

const routes: Routes = [
  {
    path: '',
    component: AppDashboardPage
  },
  {
    path: 'discount',
    loadChildren: () => import('./side-menu/discount/discount.module').then( m => m.DiscountPageModule)
  },
  {
    path: 'help',
    loadChildren: () => import('./side-menu/help/help.module').then( m => m.HelpPageModule)
  },
  {
    path: 'setting',
    loadChildren: () => import('./side-menu/setting/setting.module').then( m => m.SettingPageModule)
  },
  {
    path: 'legal',
    loadChildren: () => import('./side-menu/legal/legal.module').then( m => m.LegalPageModule)
  },
  {
    path: 'wallet',
    loadChildren: () => import('./side-menu/wallet/wallet.module').then( m => m.WalletPageModule)
  },
  {
    path: 'trip',
    loadChildren: () => import('./side-menu/trip/trip.module').then( m => m.TripPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppDashboardPageRoutingModule {}
