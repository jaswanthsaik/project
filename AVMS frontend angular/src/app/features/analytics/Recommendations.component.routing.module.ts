import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Recommendations } from './Recommendations.component';

const routes: Routes = [
  {
    path: '',
    component: Recommendations,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecommendationsRoutingModule { }
