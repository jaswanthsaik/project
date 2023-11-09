export interface CostsDataItem {
    resource_id: number;
    resource_name: string;
    reference_date: string;
    total_cost: number;
}

export interface CostsData {
    summary_resume: CostsDataItem[];
    graph_information: CostsDataItem[];
}
