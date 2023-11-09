import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountDetailsComponent } from './components/account-details/account-details.component';
import { AccountsContainerComponent } from './components/accounts-container/accounts-container.component';
import { ResourceGroupDetailsComponent } from './components/resource-group-details/resource-group-details.component';
import { SubscriptionDetailsComponent } from './components/subscription-details/subscription-details.component';

const routes: Routes = [
  {
    path: '', component: AccountsContainerComponent,
  },
  {
    path: ':id', component: AccountDetailsComponent,
  },
  {
      path: 'subscription/:subscriptionId', component: SubscriptionDetailsComponent,
  },
  {
    path: 'resourceGroup/:resourceGroupId', component: ResourceGroupDetailsComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountsRoutingModule { }
