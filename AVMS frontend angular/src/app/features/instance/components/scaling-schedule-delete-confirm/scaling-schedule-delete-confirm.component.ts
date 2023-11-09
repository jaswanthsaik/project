import { Component, OnInit } from '@angular/core';
import { InstanceService } from '../../services/instance.service';

@Component({
  selector: 'app-scaling-schedule-delete-confirm',
  templateUrl: './scaling-schedule-delete-confirm.component.html',
  styleUrls: ['./scaling-schedule-delete-confirm.component.scss']
})
export class ScalingScheduleDeleteConfirmComponent implements OnInit {
  scalingScheduleSize = '';
  scalingScheduleNewSize = '';
  timezoneName = '';

  constructor(
    private instanceService: InstanceService
  ) { }

  ngOnInit(): void {
    this.scalingScheduleSize = this.instanceService.scalingScheduleSize;
    this.scalingScheduleNewSize = this.instanceService.scalingScheduleNewSize;
    this.timezoneName = this.instanceService.timezoneName;
  }

}
