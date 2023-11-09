import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CostsReportComponent } from './components/costs-report/costs-report.component';
import { CpuReportComponent } from './components/cpu-report/cpu-report.component';
import { SavingsReportComponent } from './components/savings-report/savings-report.component';

const routes: Routes = [
  { path: 'savings', component: SavingsReportComponent },
  { path: 'costs', component: CostsReportComponent },
  { path: 'cpu-usage', component: CpuReportComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
