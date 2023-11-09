export interface FineTuningEventAPIResponse {
    events: events [];
    timeZone:timeZone;
}

export interface timeZone{
    displayName: string;
    id: number;
    name: string;
    totalDifferenceHours: number;
    totalDifferenceMinutes: number;
}
export interface events {
    day: number;
    weeklyschedulefinetuningperiods: weeklyschedulefinetuningperiods [];
    scheduleeventperiods: scheduleeventperiods [];
}

export interface weeklyschedulefinetuningperiods {
    id: string;
    start: string;
    end: string;
}

export interface scheduleeventperiods {
    id: string;
    start: string;
    end: string;
}