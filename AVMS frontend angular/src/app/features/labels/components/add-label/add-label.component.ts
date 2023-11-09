import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Account } from 'src/app/features/accounts/models/account';
import { AzureSubscription } from 'src/app/features/accounts/models/azure-subscription';
import { Tenant } from 'src/app/features/accounts/models/tenant';
import { AccountsHttpService } from 'src/app/features/accounts/services/accounts-http.service';
import { SubscriptionHttpService } from 'src/app/features/subscription/subscription-http.service';
import { ApiRequestOptions } from 'src/app/models/api-request-options';
import { LabelResource } from '../../models/label-resource';
import { ResourceLookup } from '../../models/resource-lookup';
import { SubscriptionHierarchyApiRequest } from '../../models/subscription-hierarchy-api-request';
import { LabelsHttpService } from '../../service/labels-http.service';
import { LabelsService } from '../../service/labels.service';

@Component({
  selector: 'app-add-label',
  templateUrl: './add-label.component.html',
  styleUrls: ['./add-label.component.scss']
})
export class AddLabelComponent implements OnInit, OnDestroy {

  editing = false;
  name: string = "";
  accountName: string | undefined = "";
  providerTag: string = "";
  resource: string = "";
  selectedResources: ResourceLookup[] = [];

  availableProviders = [
    { id: '0', description: 'Select one provider' },
    { id: '1', description: 'Microsoft Azure' },
    { id: '2', description: 'AWS' }
  ];
  selectedProvider: string = "0";
  
  availableAccounts = [
    { id: '0', description: 'Select an account' }
  ];
  selectedAccount: string = "0";
  
  tenants: Tenant[] = [];
  availableTenants = [{ id: '0', description: 'Select a tenant' }];
  selectedTenant: string = '0';

  subscriptions: AzureSubscription[] = [];
  availableSubscriptions = [{ id: '0', description: 'Select a subscription' }];
  selectedSubscription: string = '0';

  availableResources = [
    { id: '0', description: 'Select a resource' }
  ];

  subs = new Subscription();

  constructor(
    public dialogRef: DialogRef,
    private labelsService: LabelsService,
    private subscriptionHttpService: SubscriptionHttpService,
    private httpService: LabelsHttpService,
    private accountsHttpService: AccountsHttpService
  ) { }

  providerChanged(id: string): void {
    alert('provider changed, implementation pending');
  }

  accountChanged(account: string): void {
    this.selectedAccount = account;
    this.availableTenants = [{ id: '0', description: 'Select a tenant' }];
    this.selectedTenant = '0';
    this.availableSubscriptions = [{ id: '0', description: 'Select a subscription' }];
    this.selectedSubscription = '0';
    this.getTenants();
  }

  
  getTenants(): void {
    const sub = this.accountsHttpService.getTenantsByAccount(+this.selectedAccount).subscribe(res => {
      this.tenants = res.data;
      const lookup = this.tenants.map(tenant => {
        return { id: tenant.tenant.toString(), description: tenant.tenant_name };
      });
      this.availableTenants = [...this.availableTenants, ...lookup];
    });
    this.subs.add(sub);
  }

  tenantChanged(id: string): void {
    this.selectedTenant = id;
    this.availableSubscriptions = [{ id: '0', description: 'Select a subscription' }];
    this.selectedSubscription = '0';
    this.getSubscriptions();
  }


  getSubscriptions(): void {
    const options = new ApiRequestOptions();
    options.tenant = +this.selectedTenant;
    const sub = this.accountsHttpService.getSubscriptionsByAccountAndTenant(+this.selectedAccount).subscribe(res => {
      this.subscriptions = res.data;
      const lookup = this.subscriptions.map(subscription => {
        return { id: subscription.subscription.toString(), description: subscription.subscription_name };
      });
      this.availableSubscriptions = [...this.availableSubscriptions, ...lookup];
    });
    this.subs.add(sub);
  }

  subscriptionChanged(id: string): void {
    this.selectedSubscription = id;
  }

  
  getResources(): void {
    this.accountName = this.availableAccounts.find(p => p.id === this.selectedAccount)?.description;
    this.availableResources = [{ id: '0', description: 'Select a resource' }];
    const body: SubscriptionHierarchyApiRequest = new SubscriptionHierarchyApiRequest();
    body.accounts.push(+this.selectedAccount);
    let subsCounter = -1
    const sub = this.httpService.getSubscriptionAndLabelsByAccount(body).subscribe(res => {
      res.data.forEach(subscription => {
        this.availableResources.push({ id: subsCounter.toString(), description: 'SUBSCRIPTION: ' + subscription.subscription_name });
        subsCounter -= 1;
        subscription.virtual_machines.forEach(item => {
          this.availableResources.push({ id: item.virtual_machine.toString(), description: item.name });
        });
      });
    });
    this.subs.add(sub);
  }


  resourceChanged(selectedResourceId: string): void {
    if (+selectedResourceId > 0) {
      const exists = this.selectedResources.find(p => p.id === selectedResourceId);
      if (!exists) {
        const newResource = this.availableResources.find(p => p.id === selectedResourceId);
        if (newResource) {
          this.selectedResources.push(newResource);
        }
      }
    }
    this.labelsService.selectedResources = this.selectedResources;
  }

  removeFromList(id: string): void {
    this.selectedResources = this.selectedResources.filter(p => p.id !== id);
    this.labelsService.selectedResources = this.selectedResources;
  }

  ngOnInit(): void {
    this.editing = this.labelsService.editing;
    this.availableAccounts = this.availableAccounts.concat(this.labelsService.accounts.map(item => {
      return { id: String(item.account), description: item.account_name };
    }));
    if (this.editing) {
      this.name = this.labelsService.label.name;
      const body: SubscriptionHierarchyApiRequest = new SubscriptionHierarchyApiRequest();
      body.label = this.labelsService.labelId;
      const sub = this.httpService.getSubscriptionAndLabelsByLabel(body).subscribe(res => {
        res.data.forEach(subscription => {
          subscription.virtual_machines.forEach(item => {
            if (item.label === body.label) {
              this.selectedResources.push({ id: item.virtual_machine.toString(), description: item.name });
            }
          });
        });
        this.labelsService.selectedResources = this.selectedResources;
      });
    }
  }

  ngOnDestroy(): void {
    this.labelsService.label.name = this.name;
    this.subs.unsubscribe();
  }
  dialogclose() {
    this.dialogRef.close();
  }
}
