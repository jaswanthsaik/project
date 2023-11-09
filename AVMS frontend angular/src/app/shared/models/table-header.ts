export interface TableHeader {
    description: string;
    sortable: boolean;
    sortOrder: 'asc' | 'desc' | '';
    subTitle?: string;
    subSortOrder?: 'asc' | 'desc' | '';
    sorted?: boolean;
    sortField?: string;
    subSortField?: string;
    subSortable?: boolean;
    subSorted?: boolean;
}
