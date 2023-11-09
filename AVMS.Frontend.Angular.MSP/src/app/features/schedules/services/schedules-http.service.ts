import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiRequestOptions } from 'src/app/models/api-request-options';
import { ApiResponse } from 'src/app/models/api-response';
import { environment } from 'src/environments/environment';
import { AddSchedule } from '../models/add-schedule';
import { ScheduleApiResponse } from '../models/schedule-api-response';
import { ScheduleEvent, ScheduleEventItem } from '../models/schedule-event';
import { ScheduleEventApiResponse } from '../models/schedule-event-api-response';

@Injectable({
  providedIn: 'root'
})
export class SchedulesHttpService {
  accountApi = environment.baseAccountApiUrl;
  resourceApi = environment.baseResourceApiUrl;
  reportApi = environment.baseReportApiUrl;
  version = environment.apiVersion;

  constructor(
    private http: HttpClient
  ) { }

  getSingleSchedule(scheduleId: number): Observable<ApiResponse<ScheduleApiResponse>> {
    const url = `${this.reportApi}Schedule/${this.version}/${scheduleId}/details`;
    return this.http.get(url) as Observable<ApiResponse<ScheduleApiResponse>>;
  }

  getSchedules(options:  ApiRequestOptions = new ApiRequestOptions()): Observable<ApiResponse<ScheduleApiResponse[]>> {
    let params = `?limit=${options.limit}&pageNo=${options.pageNo}`;
    params += options.sortBy ? `&sortBy=${options.sortBy}` : '';
    params += options.sortDirection ? `&sortDirection=${options.sortDirection}` : '';
    params += options.filterText ? `&filterText=${options.filterText}` : '';
    const url = `${this.reportApi}Schedule/${this.version}${params}`;
    return this.http.get(url) as Observable<ApiResponse<ScheduleApiResponse[]>>;
  }

  addSchedule(schedule: AddSchedule): Observable<ApiResponse<string>> {
    const url = `${this.reportApi}Schedule/${this.version}`;
    return this.http.post(url, schedule) as Observable<ApiResponse<string>>;
  }

  deleteSchedule(scheduleId: number): Observable<ApiResponse<string>> {
    const url = `${this.reportApi}Schedule/${this.version}/${scheduleId}?idSchedule=${scheduleId}`;
    return this.http.delete(url) as Observable<ApiResponse<string>>;
  }

  getScheduleEvents(scheduleId: number): Observable<ApiResponse<ScheduleEventApiResponse[]>> {
    const url = `${this.reportApi}ScheduleEvent/${this.version}/${scheduleId}`;
    return this.http.get(url) as Observable<ApiResponse<ScheduleEventApiResponse[]>>;
  }

  addScheduleEvents(events: ScheduleEvent): Observable<ApiResponse<string>> {
    const url = `${this.reportApi}ScheduleEvent/${this.version}`;
    return this.http.post(url, events) as Observable<ApiResponse<string>>;
  }

}
