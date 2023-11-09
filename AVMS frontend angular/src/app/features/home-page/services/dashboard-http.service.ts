import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AccountGraph } from 'src/app/models/account-graph';
import { ApiResponse } from 'src/app/models/api-response';
import { InstanceGraph } from 'src/app/models/instance-graph';
import { environment } from 'src/environments/environment';
import { DashboardSummary } from 'src/app/models/dashboard-summary';
import { DashboardResume } from '../models/resume';
import { ApiRequestOptions } from 'src/app/models/api-request-options';

@Injectable({
  providedIn: 'root'
})
export class DashboardHttpService {
  api = environment.dashboardApiUrl.replace('VVVVV', environment.apiVersion);

  constructor(
    private httpService: HttpClient
  ) { }
  
  getResume(options:  ApiRequestOptions = new ApiRequestOptions()): Observable<ApiResponse<DashboardResume>> {
    let params = options.account ? `?account=${options.account}` : '' ;
    params += options.subscription ? `?subscription=${options.subscription}` : '' ;
    params += options.resourcegroup ? `?resourceGroup=${options.resourcegroup}` : '' ;
    let url = `${this.api.replace('XXXXX', 'msp/resume')}${params}`;
    return this.httpService.get(url) as Observable<ApiResponse<DashboardResume>>;
  }
  
  getGraph(intervalType: number): Observable<ApiResponse<AccountGraph[]>> {
    const url = `${this.api.replace('XXXXX', 'msp/account/graph?intervalType=')}${intervalType}`;
    return this.httpService.get(url) as Observable<ApiResponse<AccountGraph[]>>;
  }

  getGraphExport(intervalType: number): Observable<HttpResponse<Blob>> {
    const url = `${this.api.replace('XXXXX', 'msp/account/graph/export?intervalType=')}${intervalType}`;
    return this.httpService.get<Blob>(url,  { observe: 'response', responseType: 'blob' as 'json'});
  }

  getGraphByAccount(intervalType: number, accountId: number): Observable<ApiResponse<AccountGraph[]>> {
    const url = `${this.api.replace('XXXXX', 'msp/account/graph?intervalType=')}${intervalType}&account=${accountId}`;
    return this.httpService.get(url) as Observable<ApiResponse<AccountGraph[]>>;
  }
  
  getGraphBySubscription(intervalType: number, subscriptionId: number): Observable<ApiResponse<AccountGraph[]>> {
    const url = `${this.api.replace('XXXXX', 'msp/account/graph?intervalType=')}${intervalType}&subscription=${subscriptionId}`;
    return this.httpService.get(url) as Observable<ApiResponse<AccountGraph[]>>;
  }

  getGraphByResourceGroup(intervalType: number, resourceGroupId: number): Observable<ApiResponse<AccountGraph[]>> {
    const url = `${this.api.replace('XXXXX', 'msp/account/graph?intervalType=')}${intervalType}&resourceGroup=${resourceGroupId}`;
    return this.httpService.get(url) as Observable<ApiResponse<AccountGraph[]>>;
  }
  
  getInstanceGraph(intervalType: number): Observable<ApiResponse<InstanceGraph>> {
    const url = `${this.api.replace('XXXXX', 'msp/instance/')}${intervalType}`;
    return this.httpService.get(url) as Observable<ApiResponse<InstanceGraph>>;
  }

  getInstanceGraphByAccount(intervalType: number, accountId: number): Observable<ApiResponse<InstanceGraph>> {
    const url = `${this.api.replace('XXXXX', 'msp/instance/')}${intervalType}?instance=${accountId}`;
    return this.httpService.get(url) as Observable<ApiResponse<InstanceGraph>>;
  }
    
  getTenantsGraph(intervalType: number): Observable<ApiResponse<InstanceGraph>> {
    const url = `${this.api.replace('XXXXX', 'msp/instance/')}${intervalType}`;
    return this.httpService.get(url) as Observable<ApiResponse<InstanceGraph>>;
  }
  
  getSubscriptionGraph(intervalType: number, subscriptionId: number): Observable<ApiResponse<InstanceGraph>> {
    const url = `${this.api.replace('XXXXX', 'msp/instance/')}${intervalType}?subscription=${subscriptionId}`;
    return this.httpService.get(url) as Observable<ApiResponse<InstanceGraph>>;
  }

  getResourceGroupGraph(intervalType: number, resourceGroupId: number): Observable<ApiResponse<InstanceGraph>> {
    const url = `${this.api.replace('XXXXX', 'msp/instance/')}${intervalType}?resourceGroup=${resourceGroupId}`;
    return this.httpService.get(url) as Observable<ApiResponse<InstanceGraph>>;
  }
  
  getSummary(startDate: string, endDate: string): Observable<ApiResponse<DashboardSummary>> {
    const url = `${this.api.replace('XXXXX', 'msp/summary/')}${startDate}/${endDate}`;
    return this.httpService.get(url) as Observable<ApiResponse<DashboardSummary>>;
  }
  
}
