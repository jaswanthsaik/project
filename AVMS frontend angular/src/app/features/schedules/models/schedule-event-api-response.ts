
export interface ScheduleEventPeriod {
    id: string;
    start: string;
    end: string;
}

export interface ScheduleEventApiResponse {
    day: number;
    periods: ScheduleEventPeriod [];
}
