import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditScheduleComponent } from './components/edit-schedule/edit-schedule.component';
import { SchedulesContainerComponent } from './components/schedules-container/schedules-container.component';
const routes: Routes = [
  {
    path: '', component: SchedulesContainerComponent,
  },
  {
    path: ':id', component: EditScheduleComponent,
  },
  /*{
      path: 'subscription/:subscriptionId', component: SubscriptionDetailsComponent,
  }*/
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SchedulesRoutingModule { }
