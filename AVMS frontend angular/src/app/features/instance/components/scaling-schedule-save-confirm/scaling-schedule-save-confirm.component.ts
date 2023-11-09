import { Component, OnInit } from '@angular/core';
import { InstanceService } from '../../services/instance.service';

@Component({
  selector: 'app-scaling-schedule-save-confirm',
  templateUrl: './scaling-schedule-save-confirm.component.html',
  styleUrls: ['./scaling-schedule-save-confirm.component.scss']
})
export class ScalingScheduleSaveConfirmComponent implements OnInit {
  scalingScheduleSize = '';
  scalingScheduleNewSize = '';

  constructor(
    private instanceService: InstanceService
  ) { }

  ngOnInit(): void {
    this.scalingScheduleSize = this.instanceService.scalingScheduleSize;
    this.scalingScheduleNewSize = this.instanceService.scalingScheduleNewSize;
  }

}
