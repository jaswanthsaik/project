import { DialogRef } from '@angular/cdk/dialog';
import { Component, OnInit } from '@angular/core';
import { SubscriptionHttpService } from 'src/app/features/subscription/subscription-http.service';
import { SchedulesHttpService } from '../../services/schedules-http.service';
import { SchedulesService } from '../../services/schedules.service';

@Component({
  selector: 'app-delete-schedule',
  templateUrl: './delete-schedule.component.html',
  styleUrls: ['./delete-schedule.component.scss']
})
export class DeleteScheduleComponent implements OnInit {

  name = '';
  description = '';
  timezone = '';
  step = 'first';

  constructor(
    private schedulesService: SchedulesService,
    public dialogRef: DialogRef,
    private httpService: SchedulesHttpService
  ) { }

  ngOnInit(): void {
    this.name = this.schedulesService.scheduleName;
    this.description = this.schedulesService.scheduleDescription;
    this.timezone = this.schedulesService.scheduleTimezoneName;
    this.step = this.schedulesService.step;
  }
  cancelDialog(): void {
    this.dialogRef.close(false);
  }
  confirmation(): void {
    this.dialogRef.close(true);
  }
}
