import { Injectable } from '@angular/core';
import { recommendationsApiResponseDetails } from '../models/recommendations-api-response';
import { recommendationsTableRow } from '../models/recommendations-table-row';

@Injectable({
  providedIn: 'root'
})
export class recommendationsService {

  recommendationModel: recommendationsTableRow = {
    recommendation: "Not specified by Azure",
    resource_name: "Not specified by Azure",
    resource_group_name: "Not specified by Azure",
    subscription_name: "Not specified by Azure",
    recommendation_category: 0,
    recommendation_category_name: "Not specified by Azure",
    recommendation_impact: 0,
    recommendation_impact_name: "Not specified by Azure",
    recommendation_problem: "Not specified by Azure",
    recommendation_solution: "Not specified by Azure",
    action_type: "Not specified by Azure",
    action: "Not specified by Azure",
    problem: "Not specified by Azure",
    solution: "Not specified by Azure",
    risk_name: "Not specified by Azure",
    action_detail: "Not specified by Azure",
    potential_benefit: "Not specified by Azure"
  }

  constructor() { }
}
