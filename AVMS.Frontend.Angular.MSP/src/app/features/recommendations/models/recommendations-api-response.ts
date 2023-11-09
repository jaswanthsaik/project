export interface recommendationsApiResponse {
    recommendation: string,
    resource_name: string,
    resource_group_name: string,
    subscription_name: string,
    recommendation_category: number,
    recommendation_category_name: string,
    recommendation_impact: number,
    recommendation_impact_name: string,
    recommendation_problem: string,
    recommendation_solution: string,
    action_type: string,
    action: string
}


export interface recommendationsApiResponseDetails {
    risk_name: string,
    problem: string,
    solution: string,
    action_detail: string,
    potential_benefit: string,
    recommendation: string,
    resource_name: string,
    resource_group_name: string,
    subscription_name: string,
    recommendation_category: number,
    recommendation_category_name: string,
    recommendation_impact: number,
    recommendation_impact_name: string,
    action_type: string,
    action: string
}