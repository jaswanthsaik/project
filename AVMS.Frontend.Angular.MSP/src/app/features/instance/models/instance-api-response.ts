export interface AzureTag {
    tag_name: string;
    tag_value: string;
}

interface SizeInformation {
    id: number;
    name: string;
    cores: number;
    os_size_megabyte: number;
    resource_size_megabyte: number;
    memory_megabyte: number;
    memory_gigabyte: number;
    max_data_disk: number;
}

export interface InstanceApiResponse {
    postpone: number;
    postpone_end_date: string;
    postpone_status: string;
    tags: AzureTag[];
    instance: number;
    instance_name: string;
    provider: number;
    provider_name: string;
    size: number;
    size_name: string;
    label: number;
    label_name: string;
    schedule_saving: number;
    have_recommendation: true;
    status: number;
    status_name: string;
    schedule: number;
    schedule_name: string;
    size_information: SizeInformation;
}
