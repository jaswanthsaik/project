export interface AccountsTableRow {
    account: number;
    name: string;
    provider: string;
    date: Date;
    services: string;
    tenants: number;
    instances: number;
    savings: number;
    recommendation: string;
    scheduled: string;
    
    selected?: boolean;
    resources: number;
    subscription: number;
}
