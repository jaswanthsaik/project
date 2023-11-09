export interface recommendationsTableRow {
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
    action: string,
    problem?: string,
    solution?: string,
    risk_name?: string,
    action_detail?: string,
    potential_benefit?: string
}