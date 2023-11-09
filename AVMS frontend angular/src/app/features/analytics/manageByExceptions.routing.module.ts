import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { manageByExceptions } from './manageByExceptions.component';

const routes: Routes = [
  {
    path: '',
    component: manageByExceptions,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class manageByExceptionsRoutingModule { }
