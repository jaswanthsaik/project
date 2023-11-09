import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from 'src/app/models/api-response';
import { environment } from 'src/environments/environment';
import { AccountSubscription } from './models/account-subscription';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionHttpService {
  resourceApi = environment.baseResourceApiUrl;
  version = environment.apiVersion;

  constructor(
    private http: HttpClient
  ) { }

  getSubscriptionsByAccounts(accounts:number[]): Observable<ApiResponse<AccountSubscription[]>> {
    const url = `${this.resourceApi}Subscription/${this.version}/hierarchy`;
    return this.http.post(url, {"label": 0,"accounts": accounts, "tags": []}) as Observable<ApiResponse<AccountSubscription[]>>;
  }

  getSubscriptionsByLabel(labelId:number): Observable<ApiResponse<AccountSubscription[]>> {
    const url = `${this.resourceApi}Subscription/${this.version}/hierarchy`;
    return this.http.post(url, {"label": labelId,"accounts": [], "tags": []}) as Observable<ApiResponse<AccountSubscription[]>>;
  }
}
