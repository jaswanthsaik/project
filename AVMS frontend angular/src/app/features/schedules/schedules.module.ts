import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SchedulesRoutingModule } from './schedules-routing.module';
import { SchedulesContainerComponent } from './components/schedules-container/schedules-container.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { AddScheduleComponent } from './components/add-schedule/add-schedule.component';
import { EditScheduleComponent } from './components/edit-schedule/edit-schedule.component';
import { DeleteScheduleComponent } from './components/delete-schedule/delete-schedule.component';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatSortModule } from '@angular/material/sort';
import { MatDialogModule } from '@angular/material/dialog';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  declarations: [
    SchedulesContainerComponent,
    AddScheduleComponent,
    EditScheduleComponent,
    DeleteScheduleComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    SchedulesRoutingModule,
    MatIconModule,
    MatTableModule,
    MatButtonModule,
    MatSortModule,
    NgxSpinnerModule,
    MatDialogModule
  ],
})
export class SchedulesModule { }
