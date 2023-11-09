import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditMyProfileComponent } from './edit-my-profile/edit-my-profile.component';
import { UsersListComponent } from './users-list/users-list.component';
import { ViewMyProfileComponent } from './view-my-profile/view-my-profile.component';

const routes: Routes = [
  {
    path: '', component: ViewMyProfileComponent,
  },
  {
    path: 'edit', component: EditMyProfileComponent,
  },
  {
    path: 'userslist', component: UsersListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule { }
