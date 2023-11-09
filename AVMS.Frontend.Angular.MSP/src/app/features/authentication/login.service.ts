import { Injectable } from '@angular/core';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import { AuthenticationResult, InteractionStatus } from '@azure/msal-browser';
import { BehaviorSubject, catchError, filter, iif, map, mergeMap, Observable, of, Subject, tap } from 'rxjs';
import { ApiResponse } from 'src/app/models/api-response';
import { environment } from 'src/environments/environment';
import { LoginHttpService } from './login-http.service';
import { AccessToken } from './models/access-token';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class LoginService {
  authResult?: AuthenticationResult;
  accessToken: string = '';
  private loginFinal$ = new BehaviorSubject<boolean>(false);
  loginFinalized = this.loginFinal$.asObservable();

  constructor(
    private authService: MsalService,
    private broadcastService: MsalBroadcastService,
    private httpService: LoginHttpService,
    private router: Router
  ) { }

  login(): void {
    if (this.authService.instance.getAllAccounts().length === 0) {
      if(window.location.pathname ==='/unauthorized') {
        this.router.navigate(['/home'])
      }
      if(window.location.pathname ==='/allow-cookies') {
        this.router.navigate(['/home'])
      }
      this.authService.loginRedirect();
    } else {
      this.broadcastService.inProgress$.pipe(
        filter((status: InteractionStatus) => status === InteractionStatus.None),
      ).subscribe(() => this.getTokens());
    }
  }

  logout(): void {
    this.authService.logout();
    localStorage.clear();
    sessionStorage.clear();
  }

  private getTokens(): void {
    this.authService
      .acquireTokenSilent({ scopes: [environment.clientId], account: this.authService.instance.getAllAccounts()[0] }).pipe(
        tap(res => {
          this.authResult = res;
          this.accessToken = res.idToken;
          localStorage.setItem('access_token', this.accessToken);
        }),
        mergeMap(res => this.httpService.getAccessToken()),
        catchError(err => {
          return of('error');
        }
        ))
      .subscribe(res => {
        if (res === 'error') {
          this.authService.loginRedirect();
        } else {
          const apiResponse = res as ApiResponse<AccessToken>;
          this.accessToken = apiResponse.data.token;
          this.loginFinal$.next(true);
        }
      });
  }

  getToken(useTokenId = false): Observable<string> {
    if (useTokenId) {
      return of(this.accessToken);
    }
    return this.loginFinal$.pipe(
      filter(res => res === true),
      map(() => this.accessToken)
    );
  }

  isLoggedIn(): boolean {
    return this.authService.instance.getAllAccounts().length === 0;
  }

  bypassLogin(): boolean {
    return localStorage.getItem('dev') === 'true';
  }

  validateToken(): boolean {
    alert('validateToken not implemented');
    return true;
  }
}
