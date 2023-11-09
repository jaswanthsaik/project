import { InstanceSize } from './instance-size';

export interface SubscriptionDetailsTableRow {
    instance: number,
    instanceDescription: string;
    provider: string;
    size: number;
    sizeName: string;
    label: number;
    labelName: string;
    savings: number;
    recommendation: boolean | string;
    status: number;
    statusName: string
    schedule: number;
    scheduleName: string;
    selected?: boolean;
    sizeInformation: InstanceSize;
    postpone?: number;
    postpone_end_date?: string;
    schedule_scalling?: number;
}
