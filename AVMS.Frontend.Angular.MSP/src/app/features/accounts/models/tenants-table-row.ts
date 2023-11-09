import { SubscriptionsTableRow } from './subscriptions-table-row';

export interface TenantsTableRow {
    tenant: number;
    name: string;
    subscriptions?: number;
    resource_groups?: number;
    instances: number;
    savings: number;
    recommendation?: string;
    status?: string;
    scheduled?: boolean;
    schedule?: number;
    scheduleName?: string;

    selected?: boolean;
    expanded?: boolean;
    subscriptionRow?: boolean;

    numberOfScheduledInstances?: number;

    parentTenantRow?: TenantsTableRow;
}
