import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { recommendationsContainerComponent } from './components/recommendations-container/recommendations-container.component';

const routes: Routes = [
  {
    path: '', component: recommendationsContainerComponent,
  },
  {
    path: ':id', component: recommendationsContainerComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class recommendationsRoutingModule { }
