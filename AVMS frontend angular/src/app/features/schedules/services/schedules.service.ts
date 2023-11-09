import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Timezone } from 'src/app/shared/models/timezone';

@Injectable({
  providedIn: 'root'
})
export class SchedulesService {
  recordsPerPage = 10;

  scheduleName: string = '';
  scheduleDescription: string = '';
  selectedTimezone: string = '0';
  scheduleTimezoneName: string = '';
  timezones: Timezone[] = [];
  step: 'first' | 'second' = 'first';

  constructor() { }

  addSchedule(): Observable<string> {
    console.log('TODO: add schedule');
    return of('schedule added');
  }

}
