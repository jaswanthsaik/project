import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InstanceComponent } from './components/instance/instance.component';
import { ScalingScheduleComponent } from './components/scaling-schedule/scaling-schedule.component';
import { WeeklyFineTuningComponent } from './components/weekly-fine-tuning/weekly-fine-tuning.component';

const routes: Routes = [
  {
    path: ':id', component: InstanceComponent,
  },
  {
    path: 'scaling-schedule/:id', component: ScalingScheduleComponent,
  },
  {
    path: 'weekly-fine-tuning/:id', component: WeeklyFineTuningComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InstanceRoutingModule { }
