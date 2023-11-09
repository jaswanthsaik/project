import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Timezone } from 'src/app/shared/models/timezone';
import { SchedulesService } from '../../services/schedules.service';

@Component({
  selector: 'app-add-schedule',
  templateUrl: './add-schedule.component.html',
  styleUrls: ['./add-schedule.component.scss']
})
export class AddScheduleComponent implements OnInit {
  scheduleName: string = '';
  scheduleDescription: string = '';
  selectedTimezone: string = '0';
  timezoneOptions = [
    { id: '0', description: 'Please Select' },
  ];

  constructor(
    private schedulesService: SchedulesService,
    // public dialogRef: MatDialogRef<AddScheduleComponent>,
  ) {
    this.scheduleName = this.schedulesService.scheduleName;
    this.scheduleDescription = this.schedulesService.scheduleDescription;
    this.selectedTimezone = this.schedulesService.selectedTimezone;
  }

  inputChanged(): void {
    this.schedulesService.scheduleName = this.scheduleName;
    this.schedulesService.scheduleDescription = this.scheduleDescription;
  }
  
  timezoneChanged(timezone: string): void {
    this.schedulesService.selectedTimezone = timezone;
  }


  ngOnInit(): void {
    const timezones = this.schedulesService.timezones.map(timezone =>({
      id: timezone.timezone.toString(),
      description: timezone.timezone_name,
    }));
    this.timezoneOptions = [...this.timezoneOptions, ...timezones];
  }
  // close() {
  //   this.dialogRef.close();
  // }
}
