export class ApiRequestOptions {
    limit?: number = 100;
    pageNo?: number = 0;
    provider?: number = 0;
    account?: number = 0;
    tenant?: number = 0;
    subscription?: number = 0;
    resourcegroup?: number = 0;
    sortBy?: string = '';
    sortDirection?: string = '';
    filterText?: string = '';
    resourceName?: string = '';
    resourceGroup?: string = '';
    subscriptionName?: string = '';
    resourceType?: number = 0;
    recommendationCategory?: number = 0;
    recommendationImpact?: number = 0;
}