import { Injectable } from '@angular/core';
import { HttpHandler, HttpRequest, HttpInterceptor, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  errorMessage = 'Connection error, please try again';
  constructor(private router: Router) { }
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError(error => {
        console.log('Error intercepted....', error);
        if (error.status === 401 && error.url.includes('https://qnomwjd3u973b8f.eu.qlikcloud.com/api/v1/csrf-token') && error.statusText === "OK") {
          this.router.navigate(['/allow-cookies'])
        }
        else if (error.status === 401) {
          this.router.navigate(['/unauthorized'])
        }
        throw error;
      })
    );
  }
}
