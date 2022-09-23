import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthGuard } from './app-shared/auth.guard';

import { LoginComponent } from './app-pages/login/login.component';
import { LandingsamlComponent } from './app-pages/landingsaml/landingsaml.component';
import { DashboardComponent } from './app-pages/dashboard/dashboard.component';
import { LoginTotpComponent } from './app-pages/login-totp/login-totp.component';
import { LoginBackupCodeComponent } from './app-pages/login-backup-code/login-backup-code.component';
import { ExternalSharedbylinkComponent } from './app-pages/external-sharedbylink/external-sharedbylink.component';
import { OnlyofficeblackComponent } from './app-pages/onlyofficeblack/onlyofficeblack.component';
import { DownloadComponent } from './app-pages/download/download.component';
import { DownloadMobileComponent } from './app-pages/download-mobile/download-mobile.component';
import { LoginV2Component } from './app-pages/login-v2/login-v2.component';
import { FlowPageComponent } from './app-pages/login-v2/flow-page/flow-page.component';
import { RemindersPageComponent } from './app-pages/dashboard/reminders-page/reminders-page.component';
import { NewPasswordGuestComponent } from './app-pages/new-password-guest/new-password-guest.component';
import { NotFoundComponent } from './app-pages/not-found/not-found.component';


const routes: Routes = [

  { path: 'login', component: LoginComponent },
  { path: 'landingsaml', component: LandingsamlComponent },
  { path: 'login/totp', component: LoginTotpComponent },
  { path: 'login/v2', component: LoginV2Component },
  { path: 'login/v2/flow/:token', component: FlowPageComponent },
  { path: 'login/backup_code', component: LoginBackupCodeComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'dashboard/reminders', component: RemindersPageComponent },
  { path: 'download', component: DownloadComponent },
  { path: 'download-mobile', component: DownloadMobileComponent },
  { path: 'index.php/s/:name', component: ExternalSharedbylinkComponent },
  { path: 'onlyoffice/:value', component: OnlyofficeblackComponent },
  { path: 'new-password-guest', component: NewPasswordGuestComponent },

  // IVY Lazy Loading in Angular 9 and upper
  { path: 'filesharing', loadChildren: () => import('./file-sharing/file-sharing.module').then(m => m.FileSharingModule) },
  { path: 'settings', loadChildren: () => import('./settings/settings.module').then(m => m.SettingsModule) },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: '**', component: NotFoundComponent} // In case of not founded route (404 error)

];

@NgModule({
  imports: [RouterModule.forRoot(routes,  { preloadingStrategy: PreloadAllModules, enableTracing: false })],
  exports: [RouterModule],
  providers: [
    {
      provide: 'externalUrlRedirectResolver',
      useValue: (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
          window.location.href = (route.data as any).externalUrl;
      }
    }
  ]
})
export class AppRoutingModule { }
