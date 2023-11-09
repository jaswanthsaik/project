import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';
import { LabelsService } from '../../service/labels.service';

@Component({
  selector: 'app-schedule-label',
  templateUrl: './schedule-label.component.html',
  styleUrls: ['./schedule-label.component.scss']
})
export class ScheduleLabelComponent implements OnInit {
  name: string = "";
  selectedSchedule: string = '0';

  availableSchedules = [
    { id: '0', description: 'Select a schedule' },
    { id: '-1', description: 'Detach schedule' },
  ];

  constructor(
    private labelsService: LabelsService,
    private commonService: CommonService, 
    private router: Router) { }

  ngOnInit(): void {
    this.name = this.labelsService.label.name;

    this.availableSchedules = this.availableSchedules.concat(this.labelsService.schedules.map(item => {
      return { id: String(item.schedule), description: item.schedule_saving + '% || ' + item.schedule_name + ' | ' + item.schedule_description }
    }))
    this.selectedSchedule = String(this.labelsService.selectedScheduleId);
  }

  scheduleChanged(schedule: string): void {
    this.labelsService.label.scheduleId = Number(schedule);
    this.labelsService.label.scheduleDescription = this.availableSchedules.find(p => p.id === schedule)?.description;
  }

  navigateSchedule(): void {
    this.router.navigate(['/schedules']);
    this.commonService.closeModal();
  }

}
