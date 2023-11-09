import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { manageByExceptions } from './manageByExceptions.component';
import { CPUusage } from './CPUusage.component';

const routes: Routes = [
  {
    path: '',
    component: CPUusage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CPUusageRoutingModule { }
