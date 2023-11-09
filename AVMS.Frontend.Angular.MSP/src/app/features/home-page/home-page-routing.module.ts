import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageContainerComponent } from './components/home-page-container/home-page-container.component';

const routes: Routes = [
  {
    path: '', component: HomePageContainerComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomePageRoutingModule { }
