import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiRequestOptions } from 'src/app/models/api-request-options';
import { ApiResponse } from 'src/app/models/api-response';
import { environment } from 'src/environments/environment';
import { Categories } from '../models/categories';
import { Impact } from '../models/impact';
import { recommendationsApiResponse, recommendationsApiResponseDetails } from '../models/recommendations-api-response';
import { ResourceType } from '../models/resource-type';

@Injectable({
  providedIn: 'root'
})
export class recommendationsHttpService {
  recordsPerPage = 100;

  accountApi = environment.baseAccountApiUrl;
  resourceApi = environment.baseResourceApiUrl;
  reportApi = environment.baseReportApiUrl;
  version = environment.apiVersion;

  constructor(
    private http: HttpClient
  ) { }

  //OLD
  getRecommendation(options:  ApiRequestOptions = new ApiRequestOptions()): Observable<ApiResponse<recommendationsApiResponse[]>> {
    let params = `?limit=${options.limit}&pageNo=${options.pageNo}`;
    params += options.sortBy ? `&sortBy=${options.sortBy}` : '';
    params += options.sortDirection ? `&sortDirection=${options.sortDirection}` : '';
    params += options.filterText ? `&filterText=${options.filterText}` : '';
    const url = `${this.reportApi}Recommendation/${this.version}${params}`;
    return this.http.get(url) as Observable<ApiResponse<recommendationsApiResponse[]>>;
  }

  //NEW 
  getRecommendations(options:  ApiRequestOptions = new ApiRequestOptions()): Observable<ApiResponse<recommendationsApiResponse[]>> {
    let params = `?limit=${options.limit}&pageNo=${options.pageNo}`;
    params += options.sortBy ? `&sortBy=${options.sortBy}` : '';
    params += options.sortDirection ? `&sortDirection=${options.sortDirection}` : '';
    params += options.filterText ? `&filterText=${options.filterText}` : '';
    params += options.resourceName ? `&resourceName=${options.resourceName}` : '';
    params += options.resourceGroup ? `&resourceGroup=${options.resourceGroup}` : '';
    params += options.subscriptionName ? `&subscriptionName=${options.subscriptionName}` : '';
    params += options.resourceType ? `&resourceType=${options.resourceType}` : '';
    params += options.recommendationCategory ? `&recommendationCategory=${options.recommendationCategory}` : '';
    params += options.recommendationImpact ? `&recommendationImpact=${options.recommendationImpact}` : '';
    const url = `${this.reportApi}Recommendation/${this.version}/recommendations${params}`;
    return this.http.get(url) as Observable<ApiResponse<recommendationsApiResponse[]>>;
  }

  getResourceType() {
    const url = `${this.resourceApi}ResourceType/${this.version}`;
    return this.http.get(url) as Observable<ApiResponse<ResourceType[]>>;
  }

  getRecommendationCategory() {
    const url = `${this.reportApi}RecommendationCategory/${this.version}`;
    return this.http.get(url) as Observable<ApiResponse<Categories[]>>;
  }

  getRecommendationImpact() {
    const url = `${this.reportApi}RecommendationImpact/${this.version}`;
    return this.http.get(url) as Observable<ApiResponse<Impact[]>>;
  }

  getDetailsRecommendations(recommendationId: string): Observable<ApiResponse<recommendationsApiResponseDetails>> {
    const url = `${this.reportApi}Recommendation/${this.version}/${recommendationId}/details`;
    const result = this.http.get(url) as Observable<ApiResponse<recommendationsApiResponseDetails>>;
    return result
  }

  getRecommendationsExport(options:  ApiRequestOptions = new ApiRequestOptions(), filter: string): Observable<HttpResponse<Blob>> {
    const headers = new HttpHeaders({
      'Accept': 'text/csv'
    });
    let params = `?limit=${options.limit}&pageNo=${options.pageNo}`;
    params += options.sortBy ? `&sortBy=${options.sortBy}` : '';
    params += options.sortDirection ? `&sortDirection=${options.sortDirection}` : '';
    params += options.filterText ? `&filterText=${options.filterText}` : '';
    params += options.resourceName ? `&resourceName=${options.resourceName}` : '';
    params += options.resourceGroup ? `&resourceGroup=${options.resourceGroup}` : '';
    params += options.subscriptionName ? `&subscriptionName=${options.subscriptionName}` : '';
    params += options.resourceType ? `&resourceType=${options.resourceType}` : '';
    params += options.recommendationCategory ? `&recommendationCategory=${options.recommendationCategory}` : '';
    params += options.recommendationImpact ? `&recommendationImpact=${options.recommendationImpact}` : '';
    const url = `${this.reportApi}Recommendation/${this.version}/recommendations${params}`;
    return this.http.get<Blob>(url, { observe: 'response', headers, responseType: 'blob' as 'json'});
  } 
}
