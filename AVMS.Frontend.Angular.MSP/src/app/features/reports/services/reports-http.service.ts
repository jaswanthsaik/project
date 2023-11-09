import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from 'src/app/models/api-response';
import { environment } from 'src/environments/environment';
import { CostsData } from '../models/costs-report-structure';
import { CpuData } from '../models/cpu-report-structure';
import { SavingsData } from '../models/savings-report-structure';
import { Filters } from 'src/app/models/filters';

@Injectable({
  providedIn: 'root'
})
export class ReportsHttpService {
  accountApi = environment.baseAccountApiUrl;
  resourceApi = environment.baseResourceApiUrl;
  reportApi = environment.baseReportApiUrl;
  version = environment.apiVersion;

  constructor(
    private http: HttpClient
  ) { }

  private formattedParameters(tenant: number = 0, subscription: number = 0, resourceGroup: number = 0, provider: number = 0): string {
    let parameters = '';
    if (tenant) {
      parameters += `?tenant=${tenant}`;
    }
    if (subscription) {
      parameters += `&subscription=${subscription}`;
    }
    if (resourceGroup) {
      parameters += `&resourceGroup=${resourceGroup}`
    }
    if (provider) {
      if (parameters) {
        parameters += `&provider=${provider}`;
      } else {
        parameters += `?provider=${provider}`;
      }
    }
    return parameters;
  }

  getSummarySavingsReport(tenant: number = 0, subscription: number = 0, resourceGroup: number = 0, provider: number = 0): Observable<ApiResponse<SavingsData>> {
    let url = `${this.reportApi}Report/${this.version}/summary/saving`;
    url += this.formattedParameters(tenant, subscription, resourceGroup, provider);
    return this.http.get(url) as Observable<ApiResponse<SavingsData>>;
  }

  getSummarySavingsReportExport(tenant: number = 0, subscription: number = 0, resourceGroup: number = 0, provider: number = 0): Observable<HttpResponse<Blob>> {
    let url = `${this.reportApi}Report/${this.version}/summary/saving/export`;
    url += this.formattedParameters(tenant, subscription, resourceGroup, provider);
    return this.http.get<Blob>(url, { observe: 'response', responseType: 'blob' as 'json'});
  } 

  getMonthlySavingsReport(tenant: number = 0, subscription: number = 0, resourceGroup: number = 0, provider: number = 0): Observable<ApiResponse<SavingsData>> {
    let url = `${this.reportApi}Report/${this.version}/monthly/saving`;
    url += this.formattedParameters(tenant, subscription, resourceGroup, provider);
    return this.http.get(url) as Observable<ApiResponse<SavingsData>>;
  }

  getMonthlySavingsReportExport(tenant: number = 0, subscription: number = 0, resourceGroup: number = 0, provider: number = 0): Observable<HttpResponse<Blob>> {
    let url = `${this.reportApi}Report/${this.version}/monthly/saving/export`;
    url += this.formattedParameters(tenant, subscription, resourceGroup, provider);
    return this.http.get<Blob>(url, { observe: 'response', responseType: 'blob' as 'json'});
  } 

  getDailySavingsReport(tenant: number = 0, subscription: number = 0, resourceGroup: number = 0, provider: number = 0): Observable<ApiResponse<SavingsData>> {
    let url = `${this.reportApi}Report/${this.version}/daily/saving`;
    url += this.formattedParameters(tenant, subscription, resourceGroup, provider);
    return this.http.get(url) as Observable<ApiResponse<SavingsData>>;
  }

  getDailySavingsReportExport(tenant: number = 0, subscription: number = 0, resourceGroup: number = 0, provider: number = 0): Observable<HttpResponse<Blob>> {
    let url = `${this.reportApi}Report/${this.version}/daily/saving/export`;
    url += this.formattedParameters(tenant, subscription, resourceGroup, provider);
    return this.http.get<Blob>(url, { observe: 'response', responseType: 'blob' as 'json'});
  }

  getDateCostReport(tenant: number = 0, subscription: number = 0, resourceGroup: number = 0, provider: number = 0): Observable<ApiResponse<CostsData>> {
    let url = `${this.reportApi}Report/${this.version}/daily/date/cost`;
    url += this.formattedParameters(tenant, subscription, resourceGroup, provider);
    return this.http.get(url) as Observable<ApiResponse<CostsData>>;
  }

  getDateCostReportExport(tenant: number = 0, subscription: number = 0, resourceGroup: number = 0, provider: number = 0): Observable<HttpResponse<Blob>> {
    let url = `${this.reportApi}Report/${this.version}/daily/date/cost/export`;
    url += this.formattedParameters(tenant, subscription, resourceGroup, provider);
    return this.http.get<Blob>(url, { observe: 'response', responseType: 'blob' as 'json'});
  }

  getDailyCostReport(tenant: number = 0, subscription: number = 0, resourceGroup: number = 0, provider: number = 0): Observable<ApiResponse<CostsData>> {
    let url = `${this.reportApi}Report/${this.version}/daily/cost`;
    url += this.formattedParameters(tenant, subscription, resourceGroup, provider);
    return this.http.get(url) as Observable<ApiResponse<CostsData>>;
  }

  getDailyCostReportExport(tenant: number = 0, subscription: number = 0, resourceGroup: number = 0, provider: number = 0): Observable<HttpResponse<Blob>> {
    let url = `${this.reportApi}Report/${this.version}/daily/cost/export`;
    url += this.formattedParameters(tenant, subscription, resourceGroup, provider);
    return this.http.get<Blob>(url, { observe: 'response', responseType: 'blob' as 'json'});
  }

  getTopTenCostReport(tenant: number = 0, subscription: number = 0, resourceGroup: number = 0, provider: number = 0): Observable<ApiResponse<CostsData>> {
    let url = `${this.reportApi}Report/${this.version}/daily/cost/resource`;
    url += this.formattedParameters(tenant, subscription, resourceGroup, provider);
    return this.http.get(url) as Observable<ApiResponse<CostsData>>;
  }

  getTopTenCostReportExport(tenant: number = 0, subscription: number = 0, resourceGroup: number = 0, provider: number = 0): Observable<HttpResponse<Blob>> {
    let url = `${this.reportApi}Report/${this.version}/daily/cost/resource/export`;
    url += this.formattedParameters(tenant, subscription, resourceGroup, provider);
    return this.http.get<Blob>(url, {observe: 'response', responseType: 'blob' as 'json'});
  }

  getMonthlyCpuReport(idResource: number): Observable<ApiResponse<CpuData[]>> {
    const url = `${this.reportApi}Report/${this.version}/resource/${idResource}/month`;
    return this.http.get(url) as Observable<ApiResponse<CpuData[]>>;
  }

  getMonthlyCpuReportExport(idResource: number): Observable<HttpResponse<Blob>> {
    const url = `${this.reportApi}Report/${this.version}/resource/${idResource}/month/export`;
    return this.http.get<Blob>(url, {observe: 'response', responseType: 'blob' as 'json'});
  }

  getWeeklyCpuReport(idResource: number): Observable<ApiResponse<CpuData[]>> {
    const url = `${this.reportApi}Report/${this.version}/resource/${idResource}/week`;
    return this.http.get(url) as Observable<ApiResponse<CpuData[]>>;
  }

  getWeeklyCpuReportExport(idResource: number): Observable<HttpResponse<Blob>> {
    const url = `${this.reportApi}Report/${this.version}/resource/${idResource}/week/export`;
    return this.http.get<Blob>(url, {observe: 'response', responseType: 'blob' as 'json'});
  }

  getDailyCpuReport(idResource: number): Observable<ApiResponse<CpuData[]>> {
    const url = `${this.reportApi}Report/${this.version}/resource/${idResource}/day`;
    return this.http.get(url) as Observable<ApiResponse<CpuData[]>>;
  }

  getDailyCpuReportExport(idResource: number): Observable<HttpResponse<Blob>> {
    const url = `${this.reportApi}Report/${this.version}/resource/${idResource}/day/export`;
    return this.http.get<Blob>(url, {observe: 'response', responseType: 'blob' as 'json'});
  }

/*Save A New Filter API's */

addSavingsReportFilter(companyId: number, body: any): Observable<ApiResponse<any>> {
  let url = `${this.reportApi}ReportFilter/${this.version}/${companyId}/savings`;
  return this.http.post(url, body) as Observable<ApiResponse<any>>
}

addCostsReportFilter(companyId: number, body: any): Observable<ApiResponse<any>> {
  let url = `${this.reportApi}ReportFilter/${this.version}/${companyId}/costs`;
  return this.http.post(url, body) as Observable<ApiResponse<any>>
}

addCpuUtilizationReportFilter(companyId: number, body: any): Observable<ApiResponse<any>> {
  let url = `${this.reportApi}ReportFilter/${this.version}/${companyId}/cpuutilization`;
  return this.http.post(url, body) as Observable<ApiResponse<any>>
}

getOneSavedFilter(reportFilterId: number): Observable<ApiResponse<Filters>> {
  let url = `${this.reportApi}ReportFilter/${this.version}/${reportFilterId}/details`;
  return this.http.get(url) as Observable<ApiResponse<Filters>>
}

getSavingsReportFilter(companyId: number): Observable<ApiResponse<any>> {
  let url = `${this.reportApi}ReportFilter/${this.version}/${companyId}/savings`;
  return this.http.get(url) as Observable<ApiResponse<any>>
}

getCostsReportFilter(companyId: number): Observable<ApiResponse<any>> {
  let url = `${this.reportApi}ReportFilter/${this.version}/${companyId}/costs`;
  return this.http.get(url) as Observable<ApiResponse<any>>
}

getCpuUtilizationReportFilter(companyId: number): Observable<ApiResponse<any>> {
  let url = `${this.reportApi}ReportFilter/${this.version}/${companyId}/cpuutilization`;
  return this.http.get(url) as Observable<ApiResponse<any>>
}
  deleteReportFilter(id: any): Observable<ApiResponse<any>> {
    let url = `${this.reportApi}ReportFilter/${this.version}/${id}/delete`;
    return this.http.delete(url) as Observable<ApiResponse<any>>
  }
}
