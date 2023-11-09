import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiRequestOptions } from 'src/app/models/api-request-options';
import { ApiResponse } from 'src/app/models/api-response';
import { environment } from 'src/environments/environment';
import { AddLabel } from '../models/add-label';
import { LabelApiResponse } from '../models/label-api-response';
import { LabelResource } from '../models/label-resource';
import { SubscriptionHierarchyApiRequest } from '../models/subscription-hierarchy-api-request';
import { SubscriptionHierarchyApiResponse } from '../models/subscription-hierarchy-api-response';

@Injectable({
  providedIn: 'root'
})
export class LabelsHttpService {
  accountApi = environment.baseAccountApiUrl;
  resourceApi = environment.baseResourceApiUrl;
  reportApi = environment.baseReportApiUrl;
  version = environment.apiVersion;

  constructor(
    private http: HttpClient
  ) { }

  getLabels(options:  ApiRequestOptions = new ApiRequestOptions()): Observable<ApiResponse<LabelApiResponse[]>> {
    let params = `?limit=${options.limit}&pageNo=${options.pageNo}`;
    params += options.sortBy ? `&sortBy=${options.sortBy}` : '';
    params += options.sortDirection ? `&sortDirection=${options.sortDirection}` : '';
    params += options.filterText ? `&filterText=${options.filterText}` : '';
    const url = `${this.resourceApi}Label/${this.version}${params}`;
    return this.http.get(url) as Observable<ApiResponse<LabelApiResponse[]>>;
  }

  addLabel(label: AddLabel): Observable<ApiResponse<string>> {
    const url = `${this.resourceApi}Label/${this.version}`;
    return this.http.post(url, label) as Observable<ApiResponse<string>>;
  }

  editLabel(labelId: number, label: AddLabel): Observable<ApiResponse<string>> {
    const url = `${this.resourceApi}Label/${this.version}/${labelId}`;
    return this.http.put(url, label) as Observable<ApiResponse<string>>;
  }

  deleteLabel(label: number): Observable<ApiResponse<string>> {
    const url = `${this.resourceApi}Label/${this.version}/${label}`;
    return this.http.delete(url) as Observable<ApiResponse<string>>;
  }

  scheduleTag(scheduleId: number, labelId: number): Observable<ApiResponse<number>> {
    const url = `${this.reportApi}ScheduleResource/${this.version}/apply/${scheduleId}/label/${labelId}`;
    return this.http.patch(url,{}) as Observable<ApiResponse<number>>;
  }

  getSubscriptionAndLabelsByAccount(body: SubscriptionHierarchyApiRequest, options:  ApiRequestOptions = new ApiRequestOptions()): Observable<ApiResponse<SubscriptionHierarchyApiResponse[]>> {
    let params = options.subscription ? `?subscription=${options.subscription}` : '';
    params += options.resourcegroup && !options.subscription ? `?resourcegroup=${options.resourcegroup}` : '';
    params += options.resourcegroup && options.subscription ? `&resourcegroup=${options.resourcegroup}` : '';
    const url = `${this.resourceApi}Subscription/${this.version}/hierarchy${params}`;
    return this.http.post(url, body) as Observable<ApiResponse<SubscriptionHierarchyApiResponse[]>>;
  }

  getSubscriptionAndLabelsByLabel(body: SubscriptionHierarchyApiRequest): Observable<ApiResponse<SubscriptionHierarchyApiResponse[]>> {
    const url = `${this.resourceApi}Subscription/${this.version}/hierarchy`;
    return this.http.post(url, body) as Observable<ApiResponse<SubscriptionHierarchyApiResponse[]>>;
  }

}
