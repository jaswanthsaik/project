import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiRequestOptions } from 'src/app/models/api-request-options';
import { ApiResponse } from 'src/app/models/api-response';
import { environment } from 'src/environments/environment';
import { ScheduleApiResponse } from '../../accounts/models/schedule-api-response';
import { ActionLogApiResponse } from '../models/action-log-api-response';
import { InstanceApiResponse } from '../models/instance-api-response';
import { ScalingScheduleApiResponse } from '../models/scaling-schedule-api-response';
import { ScalingScheduleEvent } from '../models/scaling-schedule-event';
import { FineTuningEventAPIResponse } from '../models/fine-tuning-api-response';
import { FineTuningScheduleEvent } from '../models/fine-tuning-schedule-events';

@Injectable({
  providedIn: 'root'
})
export class InstanceHttpService {
  accountApi = environment.baseAccountApiUrl;
  resourceApi = environment.baseResourceApiUrl;
  reportApi = environment.baseReportApiUrl;
  version = environment.apiVersion;

  constructor(
    private http: HttpClient
  ) { }

  getInstanceComplete(instanceId: number): Observable<ApiResponse<InstanceApiResponse>> {
    const url = `${this.resourceApi}VirtualMachine/${this.version}/${instanceId}/complete/details`;
    return this.http.get(url) as Observable<ApiResponse<InstanceApiResponse>>;
  }

  getActionLogs(instanceId: number, options:  ApiRequestOptions = new ApiRequestOptions()): Observable<ApiResponse<ActionLogApiResponse[]>> { 
    let params = `?limit=${options.limit}&pageNo=${options.pageNo}`;
    params += options.provider ? `&provider=${options.provider}` : '';
    params += options.sortBy ? `&sortBy=${options.sortBy}` : '';
    params += options.sortDirection ? `&sortDirection=${options.sortDirection}` : '';
    params += options.filterText ? `&filterText=${options.filterText}` : '';
    const url = `${this.reportApi}Audit/${this.version}/actionlog/${instanceId}/virtualmachine${params}`;
    return this.http.get(url) as Observable<ApiResponse<ActionLogApiResponse[]>>;
  }

  
  getScalingSchedule(instanceId: number): Observable<ApiResponse<ScalingScheduleApiResponse>> {
    const url = `${this.reportApi}ScheduleResizing/${this.version}/${instanceId}`;
    return this.http.get(url) as Observable<ApiResponse<ScalingScheduleApiResponse>>;
  }

  
  addScalingSchedule(schedule: ScalingScheduleEvent): Observable<ApiResponse<string>> {
    const url = `${this.reportApi}ScheduleResizing/${this.version}`;
    return this.http.post(url, schedule) as Observable<ApiResponse<string>>;
  }

  deleteScalingSchedule(instanceId: number): Observable<ApiResponse<string>> {
    const url = `${this.reportApi}ScheduleResizing/${this.version}/${instanceId}`;
    return this.http.delete(url) as Observable<ApiResponse<string>>;
  }

  fineTuning (schedule: number): Observable<ApiResponse<FineTuningEventAPIResponse>> {
    const url = `${this.reportApi}WeeklyScheduleFineTuning/${this.version}/WeeklyScheduleFineTuningEvents/${schedule}`;
    return this.http.get(url) as Observable<ApiResponse<FineTuningEventAPIResponse>>;
  }

  addFineTuningScheduleEvents(VirtualMachineID:any, events: FineTuningScheduleEvent): Observable<ApiResponse<string>> {
    const url = `${this.reportApi}WeeklyScheduleFineTuning/${this.version}/VirtualMachine/${VirtualMachineID}`;
    return this.http.post(url, events) as Observable<ApiResponse<string>>;
  }

  deleteFineTuningSchedule(instanceId: number): Observable<ApiResponse<string>>  {
    const url = `${this.reportApi}WeeklyScheduleFineTuning/${this.version}/clear/${instanceId}`;
    return this.http.delete(url) as Observable<ApiResponse<string>>;
  }
}