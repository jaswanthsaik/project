export class ScalingScheduleEvent {
    virtual_machine = 0;
    size_from_name = '';
    size_to_name = '';
    timezone = 0;
    events: ScalingScheduleEventItem[] = [];
}

export class ScalingScheduleEventItem {
    event_start = '';
    event_finish = '';
    day_of_week = -1
}
