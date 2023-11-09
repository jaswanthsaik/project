import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiRequestOptions } from 'src/app/models/api-request-options';
import { ApiResponse } from 'src/app/models/api-response';
import { environment } from 'src/environments/environment';
import { ResourceApiResponse } from '../models/resource-api-response';

@Injectable({
  providedIn: 'root'
})
export class ResourcesHttpService {
  accountApi = environment.baseAccountApiUrl;
  resourceApi = environment.baseResourceApiUrl;
  reportApi = environment.baseReportApiUrl;
  version = environment.apiVersion;

  constructor(
    private http: HttpClient
  ) { }

  getResources(options: ApiRequestOptions): Observable<ApiResponse<ResourceApiResponse[]>> {
    let params = `?limit=${options.limit}&pageNo=${options.pageNo}`;
    params += options.provider ? `&provider=${options.provider}` : '';
    params += options.sortBy ? `&sortBy=${options.sortBy}` : '';
    params += options.sortDirection ? `&sortDirection=${options.sortDirection}` : '';
    params += options.filterText ? `&filterText=${options.filterText}` : '';
    const url = `${this.resourceApi}Resource/${this.version}${params}`;
    return this.http.get(url) as Observable<ApiResponse<ResourceApiResponse[]>>;
  }

}
