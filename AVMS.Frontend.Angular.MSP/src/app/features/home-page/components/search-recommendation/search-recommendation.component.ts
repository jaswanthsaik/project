import { Component, EventEmitter, Input, OnInit, OnDestroy, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { recommendationsHttpService } from 'src/app/features/recommendations/service/recommendations-http.service';
import { ApiRequestOptions } from 'src/app/models/api-request-options';
import { RecommendationItem } from 'src/app/models/recommendation-item';

@Component({
  selector: 'app-search-recommendation',
  templateUrl: './search-recommendation.component.html',
  styleUrls: ['./search-recommendation.component.scss']
})
export class SearchRecommendationComponent implements OnInit, OnDestroy {
  recommendations: RecommendationItem[] = [];
  @Output() recommendationClicked = new EventEmitter<RecommendationItem>();
  @Output() close = new EventEmitter<void>();

  subs = new Subscription();

  getLevelText(recommendation: RecommendationItem): string {
    switch (recommendation.level) {
      case 1: return 'Low';
      case 2: return 'Medium';
      case 3: return 'High';
    }
  }

  constructor(
    private httpService: recommendationsHttpService,
  ) { }

  clicked(recommendation: RecommendationItem): void {
    this.recommendationClicked.emit(recommendation);
  }

  closeClicked(): void {
    this.close.emit();
  }
  
  filterAccounts(filter: string = ''): void {
    const options = new ApiRequestOptions();
    options.filterText = filter;
    options.sortBy = 'recommendation_impact';
    options.sortDirection = 'desc';
    const sub = this.httpService.getRecommendation(options).subscribe(res => {
      this.recommendations = res.data.map(r => {
        return { id: r.recommendation, text: r.recommendation_problem, level: r.recommendation_impact as 1 | 2 | 3 };
      });
    });
    this.subs.add(sub);
  }

  ngOnInit(): void {
    this.filterAccounts();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

}
