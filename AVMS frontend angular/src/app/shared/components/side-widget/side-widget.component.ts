import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RecommendationItem } from 'src/app/models/recommendation-item';

@Component({
  selector: 'app-side-widget',
  templateUrl: './side-widget.component.html',
  styleUrls: ['./side-widget.component.scss']
})
export class SideWidgetComponent implements OnInit {
  @Input() contentType: 'recommendation' | 'graph' = 'recommendation';
  @Input() recommendations: RecommendationItem[] = [];
  @Output() recommendationClicked = new EventEmitter<RecommendationItem>();

  getLevelText(recommendation: RecommendationItem): string {
    switch (recommendation.level) {
      case 1: return 'Low';
      case 2: return 'Medium';
      case 3: return 'High';
    }
  }

  constructor() { }

  clicked(recommendation: RecommendationItem): void {
    this.recommendationClicked.emit(recommendation);
  }

  ngOnInit(): void {
  }

}
