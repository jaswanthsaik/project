
export interface ScalingScheduleEventPeriod {
    id: string;
    start: string;
    end: string;
}

export interface ScalingScheduleEventApiResponse {
    day: number;
    periods: ScalingScheduleEventPeriod [];
}

export interface ScalingScheduleApiResponse {
    schedule: number;
    virtual_machine: number;
    size_from: number;
    size_from_name: string;
    size_to: number;
    size_to_name: string;
    timezone: number;
    events: ScalingScheduleEventApiResponse [];
}
