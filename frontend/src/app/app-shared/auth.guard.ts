import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from './authentication.service';

/**
 * This class intercept route change and check for security
 */
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(public authService: AuthenticationService,
              public router: Router
              ) { }

  /**
   * Check route permission
   * @param next activated route
   * @param state router state
   */
  canActivate(next: ActivatedRouteSnapshot,
              state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

      if (this.authService.isLoggedIn === false) {
        // window.alert('Access not allowed!');
        this.router.navigate(['login']);

      } else {
        return true;
      }
  }

}


