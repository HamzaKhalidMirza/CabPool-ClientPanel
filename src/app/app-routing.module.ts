import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { RedirectLoginGuard } from 'src/common/sdk/custom/guards/redirectlogin.guard';
import { IsLoginGuard } from 'src/common/sdk/custom/guards/islogin.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'app-starter-auth',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'app-starter-auth',
    canActivate: [RedirectLoginGuard],
    loadChildren: () => import('./pages/app-starter-auth/app-starter-auth.module').then( m => m.AppStarterAuthPageModule)
  },
  {
    path: 'app-dashboard',
    canActivate: [IsLoginGuard],
    loadChildren: () => import('./pages/app-dashboard/app-dashboard.module').then( m => m.AppDashboardPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
