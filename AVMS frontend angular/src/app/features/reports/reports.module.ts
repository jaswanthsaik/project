import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportsRoutingModule } from './reports-routing.module';
import { SavingsReportComponent } from './components/savings-report/savings-report.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CostsReportComponent } from './components/costs-report/costs-report.component';
import { CpuReportComponent } from './components/cpu-report/cpu-report.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';


@NgModule({
  declarations: [
    CostsReportComponent,
    CpuReportComponent,
    SavingsReportComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ReportsRoutingModule,
    MatIconModule,
    MatTabsModule,
    MatTableModule,
    MatSortModule,
    MatDialogModule,
    MatSelectModule
  ]
})
export class ReportsModule { }
