export class ScheduleEvent {
    schedule = 0;
    schedule_name = '';
    events: ScheduleEventItem[] = [];
}

export class ScheduleEventItem {
    event_start = '';
    event_finish = '';
    day_of_week = -1
}
