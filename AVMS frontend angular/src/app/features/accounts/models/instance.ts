import { InstanceSize } from './instance-size';

export interface Instance {
    instance: number;
    instance_name: string;
    provider: 1;
    provider_name: string;
    size: number;
    size_name: string;
    label: number;
    label_name: string;
    schedule_saving: number;
    have_recommendation: boolean;
    status: number;
    status_name: string;
    schedule: number;
    schedule_name: string;
    size_information: InstanceSize;
    postpone?: number;
    postpone_end_date?: string;
    schedule_scalling: number;
}
