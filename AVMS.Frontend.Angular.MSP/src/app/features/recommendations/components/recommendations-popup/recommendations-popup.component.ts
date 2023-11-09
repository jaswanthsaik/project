import { Component, OnInit } from '@angular/core';
import { recommendationsService } from '../../service/recommendations.service';

@Component({
  selector: 'app-recommendations-popup',
  templateUrl: './recommendations-popup.component.html',
  styleUrls: ['./recommendations-popup.component.scss']
})
export class RecommendationDetailComponent implements OnInit {

  recommendation: string = "";
  resource_name: string = "";
  resource_group_name: string = "";
  subscription_name: string = "";
  recommendation_category_name: string | undefined = "";
  recommendation_impact_name: string | undefined = "";
  action_type: string | undefined = "";
  action: string | undefined = "";
  problem: string | undefined = "";
  solution: string | undefined = "";
  risk_name: string | undefined = "";
  action_detail: string | undefined = "";
  potential_benefit: string | undefined = "";

  constructor(private recommendationsService: recommendationsService) { }

  ngOnInit(): void {
    this.recommendation = this.recommendationsService.recommendationModel.recommendation;
    this.resource_name = this.recommendationsService.recommendationModel.resource_name;
    this.resource_group_name = this.recommendationsService.recommendationModel.resource_group_name;
    this.subscription_name = this.recommendationsService.recommendationModel.subscription_name;
    this.recommendation_category_name = this.recommendationsService.recommendationModel.recommendation_category_name;
    this.recommendation_impact_name = this.recommendationsService.recommendationModel.recommendation_impact_name;
    this.action_type = this.recommendationsService.recommendationModel.action_type;
    this.action = this.recommendationsService.recommendationModel.action;
    this.problem = this.recommendationsService.recommendationModel.problem;
    this.solution = this.recommendationsService.recommendationModel.solution;
    this.risk_name = this.recommendationsService.recommendationModel.risk_name;
    this.action_detail = this.recommendationsService.recommendationModel.action_detail;
    this.potential_benefit = this.recommendationsService.recommendationModel.potential_benefit;
  }

}
