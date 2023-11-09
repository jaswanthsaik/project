import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { analytics } from './analytics.component';

const routes: Routes = [
  {
    path: '',
    component: analytics,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class analyticsRoutingModule { }
