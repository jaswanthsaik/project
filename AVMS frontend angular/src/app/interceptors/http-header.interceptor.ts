import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, mergeMap } from 'rxjs';
import { LoginService } from '../features/authentication/login.service';
import { environment } from 'src/environments/environment';

@Injectable()
export class HttpHeaderInterceptor implements HttpInterceptor {

  constructor(
    private loginService: LoginService
  ) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let useTokenId = false;
    const version = environment.apiVersion;
    const qlikWebIntegrationId = environment.qlikWebIntegrationId;
    if (request.url.includes(`/Login/${version}/msp`)) {
      useTokenId = true;
    }
    if (request.url.includes(`/login/jwt-session?qlik-web-integration-id=${qlikWebIntegrationId}`)) {
        const qlik_jwt_token = localStorage.getItem('qlik_jwt_token');
          const newRequest = request.clone({
            setHeaders: {
              "Content-Type": "text/plain",
              "qlik-web-integration-id": qlikWebIntegrationId,
              Authorization: `Bearer ${qlik_jwt_token}`,
            },
            responseType: 'text',
            withCredentials: true
          });
          return next.handle(newRequest);
    }
    if (request.url.includes(`/api/v1/csrf-token?qlik-web-integration-id=${qlikWebIntegrationId}`)) {
          const newRequest = request.clone({
            setHeaders: {
              "Qlik-Web-Integration-ID": qlikWebIntegrationId
            },
            withCredentials: true
          });
          return next.handle(newRequest);
    }
    return this.loginService.getToken(useTokenId).pipe(
      mergeMap(token => {
        const newRequest = request.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`,
          }
        });
        return next.handle(newRequest);
      })
    );

  }
}
