import { Injectable } from '@angular/core';
import { HttpHandler, HttpRequest, HttpInterceptor, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from 'src/environments/environment';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  errorMessage = 'Connection error, please try again';
  isUnauthorized: boolean = false;
  qlik_base_url = environment.qlik_baseUrl;
  constructor(private router: Router,
    private spinnerService: NgxSpinnerService) { }
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    this.spinnerService.show();
    return next.handle(request).pipe(
      tap(res => {
        if (res instanceof HttpResponse) {
            this.spinnerService.hide();
        }
    }),
      catchError(error => {
        this.spinnerService.hide();
        if (error.status === 401) {
          if (error.url.includes(`${this.qlik_base_url}/api/v1/csrf-token`) && error.statusText === "OK") {
            this.router.navigate(['/allow-cookies']);
          } else if (error.url.includes(`${this.qlik_base_url}/login/jwt-session?qlik-web-integration-id=nVJKIACZcz5LdOgy3RappKJSxPDKrlr0`) ||
            error.url.includes(`${this.qlik_base_url}/api/v1/csrf-token`)) {
            this.isUnauthorized = true; 
            localStorage.removeItem('appID');
            localStorage.removeItem('sheetID');
            const isReloaded = sessionStorage.getItem('isReloaded');
            if (!isReloaded) {
              sessionStorage.setItem('isReloaded', 'true');
              location.reload();
            }
          }
          if(!this.isUnauthorized) {
            localStorage.removeItem('appID');
            localStorage.removeItem('sheetID');
            this.router.navigate(['/unauthorized']);
          }
        }
        throw error;
      })
    );
  }
}
