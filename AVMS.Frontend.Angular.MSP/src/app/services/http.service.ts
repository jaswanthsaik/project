import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(
    private http: HttpClient
  ) { }

  getTestData(): Observable<any> {
    return this.http.get('https://jsonplaceholder.typicode.com/posts');
  }

}
