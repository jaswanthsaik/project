import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class InstanceService {
  scalingScheduleSize = '';
  scalingScheduleNewSize = '';
  timezoneName = '';

  constructor() { }
}
