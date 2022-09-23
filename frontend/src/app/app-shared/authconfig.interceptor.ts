import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { AuthenticationService } from './authentication.service';
import { Router } from '@angular/router';
import 'rxjs/add/operator/do';
import { GlobalVariable } from '../globalviarables';

/**
 * This class intercept any HTTP request to set JWT token in request header
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private authService: AuthenticationService,
                private router: Router,
                private global: GlobalVariable) { }

    /**
     * Set JWT Toket in request header
     * @param req HttpRequest
     * @param next HttpHandler
     */
    intercept(req: HttpRequest<any>, next: HttpHandler) {
        const authToken = this.authService.getToken();

        const regex1 = RegExp('https://api.openweathermap.org/');
        if (regex1.test(req.url)) {
            return next.handle(req);
        }

        /*
        // Adding authorization header with JWT token if available
        if (authToken) {
            req = req.clone({
                setHeaders: {
                    // Accept: 'application/json',
                    // Authorization: 'Bearer ' + authToken
                },
                withCredentials: true
            });
        }
        */
        
        // Adding authorization header with JWT token if available
        if (authToken) {
            if (req.url !== 'https://api.ipify.org/?format=json') {
                req = req.clone({
                    setHeaders: {
                        AddressIp: this.global.addressIp
                        // Accept: 'application/json',
                        // Authorization: 'Bearer ' + authToken
                    },
                    withCredentials: true
                });
            }

        } else {
            if (this.global.addressIp != '') {
                req = req.clone({
                    setHeaders: {
                        AddressIp: this.global.addressIp
                        // Accept: 'application/json',
                        // Authorization: 'Bearer ' + authToken
                    }
                });
            }
            
        }

        // return next.handle(req);
        return next.handle(req).do(
            (event: HttpEvent<any>) => {
                if (event instanceof HttpResponse) { }
            },
            (err: any) => {
                if (err instanceof HttpErrorResponse) {
                    switch (err.status) {
                        case 401:
                            this.router.navigate(['login']);
                            break;
                        case 403:
                            this.router.navigate(['login']);
                            break;
                    }
                }
            }
        );
    }
}
