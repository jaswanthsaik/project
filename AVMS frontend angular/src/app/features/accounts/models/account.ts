export interface Account {
    account: number;
    account_name: string;
    provider: number;
    provider_name: string;
    created_in: string;
    use_azure_lighthouse: boolean;
    total_tenant: number;
    total_resource_groups: number;
    total_instance: number,
    have_recommendation: boolean,
    total_instance_scheduled: number,
    percent_instance_saving_money: number,
    total_resource: number,
    total_subscription: number
}
0