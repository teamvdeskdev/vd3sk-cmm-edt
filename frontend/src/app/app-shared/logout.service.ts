import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { globals } from 'src/config/globals';
import { AppConfig } from '../app-config';
import { DashboardCacheService } from '../app-services/dashboard-cache.service';
import { CacheService } from '../mail/services/cache.service';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class LogoutService {

  globalsVar: AppConfig;
  isTim: boolean;
  isSamlUser: boolean;

  constructor(
    private authService: AuthenticationService,
    private dashboardCacheService: DashboardCacheService,
    private cacheService: CacheService,
    private router: Router
  ) {
    this.globalsVar = globals;
  }

  logoutUser() {
    if (this.globalsVar.customCustomer.toLowerCase() == 'sua') {
      let Bearer = sessionStorage.getItem('BearerSua');
      let  body =  {
        "client_id": this.authService.clientIdSUA,
        "token": Bearer,
        "token_type_hint": "refresh_token"
      }
      this.authService.LogoutSUA(body).subscribe((result: any) => {
          this.authService.removeVCCookiesSUA();
      });
    }
    this.authService.doLogout().subscribe((result: any) => {
      this.isTim = (this.globalsVar.customCustomer.toLowerCase() == 'tim')? true : false;
      this.isSamlUser = this.authService.isUserSaml;
      this.dashboardCacheService.setCacheCardModel(null);
      this.dashboardCacheService.setCacheHeaderModel(null);
      sessionStorage.clear();
      this.cacheService.clearCache();
      this.authService.removeVCCookies();
      this.authService.removeCookie('access_token');
      const removedToken = sessionStorage.getItem('access_token');
      const removedUser = sessionStorage.getItem('user');
      const removedUserManager = sessionStorage.getItem('userManager');
      if ((removedToken == null || removedToken === undefined) &&
        (removedUser == null || removedUser === undefined) &&
        (removedUserManager == null || removedUserManager === undefined)) {
        this.router.navigate(['login']);
      }
      this.logoutChat();
      localStorage.clear();
      if(result && result.status == 200 && !this.isTim && this.isSamlUser){
        window.open(this.authService.Logout, '_blank');
      }
    });
  }

  logoutChat() {
    const converse = document.getElementById('conversejs');
    if (this.globalsVar.enableVmeet && converse) {
      const evt = new CustomEvent('ChatLogout');
      window.dispatchEvent(evt);
    }
  }
}
