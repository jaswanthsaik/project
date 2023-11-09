import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiRequestOptions } from 'src/app/models/api-request-options';
import { ApiResponse } from 'src/app/models/api-response';
import { environment } from 'src/environments/environment';
import { RouteApiResponse } from '../models/route-api-response';
import { Timezone } from '../models/timezone';

@Injectable({
  providedIn: 'root'
})
export class CatalogHttpService {
  accountApi = environment.baseAccountApiUrl;
  resourceApi = environment.baseResourceApiUrl;
  reportApi = environment.baseReportApiUrl;
  version = environment.apiVersion;

  constructor(
    private http: HttpClient
  ) { }


  getTimezones(): Observable<ApiResponse<Timezone[]>> {
    const url = `${this.resourceApi}Timezone/${this.version}`;
    return this.http.get(url) as Observable<ApiResponse<Timezone[]>>;
  }

  private _getRoute(parameters: string): Observable<ApiResponse<RouteApiResponse>> {
    const url = `${this.accountApi}Account/${this.version}/route?${parameters}`;
    return this.http.get(url) as Observable<ApiResponse<RouteApiResponse>>;
  }

  getRouteByInstance(id: number): Observable<ApiResponse<RouteApiResponse>> {
    const parameters = `instance=${id}`;
    return this._getRoute(parameters);
  }

  getRouteByResourceGroup(id: number): Observable<ApiResponse<RouteApiResponse>> {
    const parameters = `resourceGroup=${id}`;
    return this._getRoute(parameters);
  }

  getRouteBySubscription(id: number): Observable<ApiResponse<RouteApiResponse>> {
    const parameters = `subscription=${id}`;
    return this._getRoute(parameters);
  }

  getRouteByTenant(id: number): Observable<ApiResponse<RouteApiResponse>> {
    const parameters = `tenant=${id}`;
    return this._getRoute(parameters);
  }

  getRouteByAccount(id: number): Observable<ApiResponse<RouteApiResponse>> {
    const parameters = `account=${id}`;
    return this._getRoute(parameters);
  } 

}
