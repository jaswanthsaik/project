import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RecommendationData } from './data-models';
import { catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecommendationsService {

  private apiUrl = 'https://kalibr8analyticspoc.azurewebsites.net/RecommendationReports/v2/1/recommendationDetails';

  constructor(private http: HttpClient) { }

  private handleError(error: any) {
    console.error('An error occurred:', error);
    return throwError(error);
  }

  
  fetchRecommendations(): Observable<RecommendationData[]> {
    return this.http.get<{data: RecommendationData[]}>(this.apiUrl)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }
  
  
}
