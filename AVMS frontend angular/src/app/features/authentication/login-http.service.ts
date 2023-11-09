import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from 'src/app/models/api-response';
import { environment } from 'src/environments/environment';
import { AccessToken } from './models/access-token';

@Injectable({
  providedIn: 'root'
})
export class LoginHttpService {

  api = environment.baseLoginApiUrl;
  version = environment.apiVersion;

  constructor(
    private http: HttpClient
  ) { }

  getAccessToken(): Observable<ApiResponse<AccessToken>> {
    const url = `${this.api}Login/${this.version}/msp`;
    const request$ = this.http.get(url);
    return request$ as Observable<ApiResponse<AccessToken>>;
  }
}
