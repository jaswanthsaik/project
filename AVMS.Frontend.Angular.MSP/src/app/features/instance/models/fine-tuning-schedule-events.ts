export class FineTuningScheduleEvent {
    schedule = 0;
    schedule_name:any;
    events: FineTuningScheduleEventItem[] = [];
}

export class FineTuningScheduleEventItem {
    event_start = '';
    event_finish = '';
    day_of_week = -1
}
