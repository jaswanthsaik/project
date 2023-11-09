export interface SavingsDataItem {
    reference_date: string,
    total_saving: number
}

export interface SavingsData {
    summary_resume: SavingsDataItem[],
    graph_information: SavingsDataItem[]
}
