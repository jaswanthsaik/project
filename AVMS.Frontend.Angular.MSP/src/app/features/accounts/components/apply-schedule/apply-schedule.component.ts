import { Component, OnInit } from '@angular/core';
import { TenantsTableRow } from '../../models/tenants-table-row';
import { AccountsService } from '../../services/accounts.service';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';
@Component({
  selector: 'app-apply-schedule',
  templateUrl: './apply-schedule.component.html',
  styleUrls: ['./apply-schedule.component.scss']
})
export class ApplyScheduleComponent implements OnInit {
  data: TenantsTableRow[] = [];
  step: 'first' | 'second' | 'final';
  selectedSchedule: string = '0';
  selectedItem: string = '';
  postponeShutdown: boolean = false;
  overwrite: boolean = false;
  numberOfScheduledInstances = 0;
  showPostponeShutdown = false;

  
  scheduleOptions = [
    { id: '0', description: 'Select a schedule' },
    { id: '-1', description: 'Detach schedule' },
  ];

  testData = [
    { instance: `INSTANCE 1 Schedule: Saving 41 % || Subscriptions | Mon-Fri | 6h00 to 20h00Total Savings: XXX% - U$ X.XXX,00` },
    { instance: `INSTANCE 2 Schedule: Saving 41 % || Subscriptions | Mon-Fri | 6h00 to 20h00Total Savings: XXX% - U$ X.XXX,00` },
    { instance: `INSTANCE 3 Schedule: Saving 41 % || Subscriptions | Mon-Fri | 6h00 to 20h00Total Savings: XXX% - U$ X.XXX,00` }
  ];


  constructor(
    private accountsService: AccountsService,
    private commonService: CommonService,
    private router: Router
  ) { 
    this.data = this.accountsService.subscriptionsToBeRescheduled;
    this.step = this.accountsService.scheduleStep;
    this.numberOfScheduledInstances = this.accountsService.numberOfScheduledInstances;
    this.showPostponeShutdown = this.accountsService.showPostponeShutdown;
    this.selectedItem = this.accountsService.instanceName;
    if (this.accountsService.scheduleStep === 'final') {
      this.selectedSchedule = this.accountsService.selectedSchedule;
      this.postponeShutdown = this.accountsService.postponeShutdown;
      this.overwrite = this.accountsService.overwriteSchedule;
    }
  }

  scheduleChanged(schedule: string): void {
    this.accountsService.selectedSchedule = schedule;
  }

  postponeShutdownChanged(status: boolean): void {
    this.postponeShutdown = status;
    this.accountsService.postponeShutdown = status;
  }

  overwriteChanged(status: boolean): void {
    this.overwrite = status;
    this.accountsService.overwriteSchedule = status;
  }

  ngOnInit(): void {
    this.accountsService.schedules.forEach(schedule => {
      this.scheduleOptions.push({ id: schedule.schedule.toString(), description: schedule.schedule_name });
      this.selectedSchedule = this.accountsService.selectedSchedule;
    });
  }
  navigateSchedule(): void {
    this.router.navigate(['/schedules']);
    this.commonService.closeModal();
  }
}
