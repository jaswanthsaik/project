import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiRequestOptions } from 'src/app/models/api-request-options';
import { ApiResponse } from 'src/app/models/api-response';
import { Country } from 'src/app/shared/models/country';
import { Timezone } from 'src/app/shared/models/timezone';
import { environment } from 'src/environments/environment';
import { User } from './models/user';
import { UserDetails } from './models/userDetails';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  accountApi = environment.baseAccountApiUrl;
  resourceApi = environment.baseResourceApiUrl;
  reportApi = environment.baseReportApiUrl;
  version = environment.apiVersion;

  recordsPerPage = 10;
  // This is dummy data
  myProfile: User = {
    user: 0,
    first_name: "",
    last_name: "",
    password: "",
    email: "",
    company_name: "",
    country: 0,
    country_name: "",
    timezone_name: "",
    timezone: 1,
    role_name: "",
    role_index: "1",
    isMyUser: true,
    teams: [""],
    avatar: ""
  }

  userProfile: User = {
    user: 0,
    first_name: "AVMS",
    last_name: "MSP Demo",
    password: "",
    email: "avmsmspadmin@advancedvmsolutions.io",
    company_name: "",
    country: 3,
    country_name: "Ireland",
    timezone_name: "(UTC-09:00) Coordinated Universal Time-09",
    timezone: 1,
    role_name: "Financial",
    role_index: "1",
    isMyUser: true,
    teams: ["Team Name 1", "Team Name 2"],
    avatar: ""
  }

  timezoneOptions: Timezone[] = [
    { timezone: 0, timezone_name: 'Select a timezone' }
  ];

  countryOptions: Country[] = [
    { country: 0, country_name: 'Select a country' }
  ];

  constructor(private http: HttpClient) { }

  updateAvatar(avatar: string): Observable<ApiResponse<string>> {
    const body = {content_base64: avatar};
    const url = `${this.accountApi}MyProfile/${this.version}/avatar`;
    return this.http.put(url, body) as Observable<ApiResponse<string>>;
  }

  getAvatar(){
    const url = `${this.accountApi}MyProfile/${this.version}/avatar`;
    return this.http.get(url) as Observable<ApiResponse<string>>;
  }

  removeAvatar(): Observable<ApiResponse<string>> {
    const img = 'R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==';
    return this.updateAvatar(img);
  }

  saveProfile(): Observable<ApiResponse<number>> {
    const url = `${this.accountApi}User/${this.version}/${this.myProfile.user}`;
    return this.http.put(url, this.myProfile) as Observable<ApiResponse<number>>;
  }

  getMyProfile() {
    const url = `${this.accountApi}MyProfile/${this.version}/myinformation`;
    return this.http.get(url) as Observable<ApiResponse<UserDetails>>;
  }

  editMyProfile(): Observable<ApiResponse<number>> {
    const url = `${this.accountApi}MyProfile/${this.version}`;
    return this.http.put(url, this.myProfile) as Observable<ApiResponse<number>>;
  }

  getUsers(options:  ApiRequestOptions = new ApiRequestOptions()): Observable<ApiResponse<User[]>> {
    let params = `?limit=${options.limit}&pageNo=${options.pageNo}`;
    params += `&subscription=${options.subscription}`;
    params += options.sortBy ? `&sortBy=${options.sortBy}` : '';
    params += options.sortDirection ? `&sortDirection=${options.sortDirection}` : '';
    params += options.filterText ? `&filterText=${options.filterText}` : '';
    const url = `${this.accountApi}User/${this.version}/${params}`;
    return this.http.get(url) as Observable<ApiResponse<User[]>>;
  }

  getUserDetail(userId: number){
    const url = `${this.accountApi}User/${this.version}/${userId}/details`;
    return this.http.get(url) as Observable<ApiResponse<UserDetails>>;
  }

  addUser(): Observable<ApiResponse<number>> {
    const url = `${this.accountApi}User/${this.version}/msp`;
    return this.http.post(url, this.userProfile) as Observable<ApiResponse<number>>;
  }

  editUser(): Observable<ApiResponse<number>> {
    const url = `${this.accountApi}User/${this.version}/${this.userProfile.user}`;
    return this.http.put(url, this.userProfile) as Observable<ApiResponse<number>>;
  }

  deleteUser(): Observable<ApiResponse<boolean>> {
    const url = `${this.accountApi}User/${this.version}/${this.userProfile.user}`;
    return this.http.delete(url) as Observable<ApiResponse<boolean>>;
  }
}
