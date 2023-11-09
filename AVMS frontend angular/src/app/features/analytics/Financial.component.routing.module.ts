import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Financial } from './Financial.component';

const routes: Routes = [
  {
    path: '',
    component: Financial,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FinancialRoutingModule { }
