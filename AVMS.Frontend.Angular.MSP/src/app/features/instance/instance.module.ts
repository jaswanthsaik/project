import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InstanceRoutingModule } from './instance-routing.module';
import { InstanceComponent } from './components/instance/instance.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ScalingScheduleComponent } from './components/scaling-schedule/scaling-schedule.component';
import { AvmsScalingSchedulerComponent } from './components/avms-scaling-scheduler/avms-scaling-scheduler.component';
import { ScalingScheduleSaveConfirmComponent } from './components/scaling-schedule-save-confirm/scaling-schedule-save-confirm.component';
import { ScalingScheduleDeleteConfirmComponent } from './components/scaling-schedule-delete-confirm/scaling-schedule-delete-confirm.component';
import { WeeklyFineTuningComponent } from './components/weekly-fine-tuning/weekly-fine-tuning.component';
import { MatPaginatorModule } from '@angular/material/paginator';


@NgModule({
  declarations: [
    InstanceComponent,
    ScalingScheduleComponent,
    AvmsScalingSchedulerComponent,
    ScalingScheduleSaveConfirmComponent,
    ScalingScheduleDeleteConfirmComponent,
    WeeklyFineTuningComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    InstanceRoutingModule,
    MatPaginatorModule
  ]
})
export class InstanceModule { }
