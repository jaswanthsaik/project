import { ScheduleInstance } from "./schedule-instance";

export interface ScheduleApiResponse {
    schedule: number,
    schedule_name: string;
    schedule_description: string;
    timezone: number,
    timezone_name: string;
    schedule_saving: number,
    schedule_used: boolean;
    instances: Array<ScheduleInstance>;
}
