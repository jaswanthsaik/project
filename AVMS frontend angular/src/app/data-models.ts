export interface RecommendationDetail {
    recommendationProblem: string;
    recommendationSolution: string;
    resourceName: string;
    resourceGroupName: string;
    subscriptionName: string;
    recommendationCategory: string;
    recommendationImpactName: string;
    resourceTypeName: string;
}

export interface RecommendationData {
    details: RecommendationDetail;
}
