export interface Resource {
    virtual_machine: number;
    name: string;
    label: number;
    label_applied: true;
    resource_type: number;
    resource_type_name: string;
    machine_type: number;
}

export interface SubscriptionHierarchyApiResponse {
    subscription: number;
    subscription_name: string;
    label: number;
    label_applied: true;
    resource_type: number;
    resource_type_name: string;
    virtual_machines: Resource[];
}
