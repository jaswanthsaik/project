import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from 'src/app/models/api-response';
import { environment } from 'src/environments/environment';
import { Country } from '../models/country';

@Injectable({
  providedIn: 'root'
})
export class CountryHttpService {

  accountApi = environment.baseAccountApiUrl;
  version = environment.apiVersion;

  constructor(
    private http: HttpClient
  ) { }

  getCountries(): Observable<ApiResponse<Country[]>> {
    const url = `${this.accountApi}Country/${this.version}`;
    return this.http.get(url) as Observable<ApiResponse<Country[]>>;
  }
}
