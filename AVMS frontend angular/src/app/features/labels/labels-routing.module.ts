import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LabelDetailsComponent } from './components/label-details/label-details.component';
import { LabelsContainerComponent } from './components/labels-container/labels-container.component';

const routes: Routes = [
  {
    path: '', component: LabelsContainerComponent,
  },
  {
    path: ':id', component: LabelDetailsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LabelsRoutingModule { }
