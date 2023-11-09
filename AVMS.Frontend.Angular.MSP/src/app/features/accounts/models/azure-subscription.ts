export interface AzureSubscription {
    subscription: number;
    subscription_name: string;
    label: number;
    label_name: string;
    total_resource_groups: number;
    total_instances: number;
    scheduled: boolean;
    schedule: number;
    schedule_name: string;
    schedule_saving: number;
    use_recommendation: boolean;
}
