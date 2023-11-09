import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, delay, Observable, Subscription, timer } from 'rxjs';
import { AzureSubscription } from 'src/app/features/accounts/models/azure-subscription';
import { Tenant } from 'src/app/features/accounts/models/tenant';
import { AccountsHttpService } from 'src/app/features/accounts/services/accounts-http.service';
import { SubscriptionHttpService } from 'src/app/features/subscription/subscription-http.service';
import { ApiRequestOptions } from 'src/app/models/api-request-options';
import { ToasterService } from 'src/app/shared/components/avms-toaster/services/toaster.service';
import { BreadcrumbsItem } from 'src/app/shared/models/breadcrumbs-item';
import { ResourceLookup } from '../../models/resource-lookup';
import { SubscriptionHierarchyApiRequest } from '../../models/subscription-hierarchy-api-request';
import { LabelsHttpService } from '../../service/labels-http.service';
import { LabelsService } from '../../service/labels.service';
import { ApiError } from 'src/app/models/api-error';
import { ApiResponse } from 'src/app/models/api-response';
import { ResourceGroups } from 'src/app/features/accounts/models/resource-groups';
import { NotifierService } from 'src/app/shared/services/notifier.service';

@Component({
  selector: 'app-label-details',
  templateUrl: './label-details.component.html',
  styleUrls: ['./label-details.component.scss']
})
export class LabelDetailsComponent implements OnInit, OnDestroy {

  breadcrumbs: BreadcrumbsItem[] = [
    { label: 'Home', url: '/' },
    { label: 'Labels', url: '/labels' },
    { label: this.labelsService.label.name, url: '' }
  ];

  editing = false;
  name: string = "";
  accountName: string | undefined = "";
  providerTag: string = "";
  resource: string = "";
  selectedResources: ResourceLookup[] = [];
  resourceGroup: ResourceGroups[] = [];
  resourceGroupLookup = [{ id: '0', description: 'Select Resource Group' }];
  selectedResourceGroup: string = '0';
  
  availableProviders = [
    { id: '0', description: 'Select one provider' },
    { id: '1', description: 'Microsoft Azure' },
    { id: '2', description: 'AWS' }
  ];
  selectedProvider: string = "0";

  availableAccounts = [
    { id: '0', description: 'Select Account' }
  ];
  selectedAccount: string = "0";

  tenants: Tenant[] = [];
  availableTenants = [{ id: '0', description: 'Select Tenant' }];
  selectedTenant: string = '0';

  subscriptions: AzureSubscription[] = [];
  availableSubscriptions = [{ id: '0', description: 'Select Subscription' }];
  selectedSubscription: string = '0';

  availableResources: { id: string, description: string, parent?: string }[] = [];

  subs = new Subscription();

  constructor(
    private labelsService: LabelsService,
    private httpService: LabelsHttpService,
    private accountsHttpService: AccountsHttpService,
    private toaster: NotifierService,
    private router: Router
  ) { }

  providerChanged(id: string): void {
    alert('provider changed, implementation pending');
  }

  accountChanged(account: string): void {
    this.selectedAccount = account;
    this.availableTenants = [{ id: '0', description: 'Select Tenant' }];
    this.selectedTenant = '0';
    this.availableSubscriptions = [{ id: '0', description: 'Select Subscription' }];
    this.selectedSubscription = '0';
    this.getTenants();
    this.getResources();
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
    this.availableSubscriptions = [{ id: '0', description: 'Select Subscription' }];
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
    this.resourceGroupLookup = [{ id: '0', description: 'Select Resource Group' }];
    this.selectedResourceGroup = '0';
    this.getResources();
    this.getResouceGroup();
  }

  getResouceGroup() {
    const options = new ApiRequestOptions();
    options.tenant = +this.selectedTenant;
    options.subscription = +this.selectedSubscription;
    const sub = this.accountsHttpService.getResourceGroupsBySubscription(+this.selectedSubscription, options).subscribe(res => {
      this.resourceGroup = res.data;
      const lookup = this.resourceGroup.map(resourceGroup => {
        return { id: resourceGroup.resource_group.toString(), description: resourceGroup.resource_group_name };
      });
      this.resourceGroupLookup = [...this.resourceGroupLookup, ...lookup];
    });
    this.subs.add(sub);
  }

  resourceGroupSelected(id: string) {
    this.selectedResourceGroup = id;
    this.getResources();
    // this.getMainGraphData(this.selectedMainGraphInterval)
  }

  getResources(): void {
    const options = new ApiRequestOptions();
    options.subscription = Number(this.selectedSubscription);
    options.resourcegroup = Number(this.selectedResourceGroup);
    this.accountName = this.availableAccounts.find(p => p.id === this.selectedAccount)?.description;
    this.availableResources = [];
    const body: SubscriptionHierarchyApiRequest = new SubscriptionHierarchyApiRequest();
    body.accounts.push(+this.selectedAccount);
    let subsCounter = -1
    const sub = this.httpService.getSubscriptionAndLabelsByAccount(body, options).subscribe(res => {
      res.data.forEach(subscription => {
        this.availableResources.push({ id: subsCounter.toString(), description: subscription.subscription_name, parent: '0' });
        subscription.virtual_machines.forEach(item => {
          this.availableResources.push({ id: item.virtual_machine.toString(), description: item.name, parent: subsCounter.toString() });
        });
        subsCounter -= 1;
      });
    });
    this.subs.add(sub);
  }


  addResource(selectedResourceId: string): void {
    if (+selectedResourceId > 0) {
      const exists = this.selectedResources.find(p => p.id === selectedResourceId);
      if (!exists) {
        const newResource = this.availableResources.find(p => p.id === selectedResourceId);
        if (newResource) {
          this.selectedResources.push(newResource);
        }
      }
    } else {
      const subResources = this.availableResources.filter(p => p.parent === selectedResourceId);
      subResources.forEach(subResource => {
        const exists = this.selectedResources.find(p => p.id === subResource.id);
        if (!exists) {
          const newResource = this.availableResources.find(p => p.id === subResource.id);
          if (newResource) {
            this.selectedResources.push(newResource);
          }
        }
      });
    }
    this.labelsService.selectedResources = this.selectedResources;
  }

  removeFromList(id: string): void {
    if (+id > 0) {
      this.selectedResources = this.selectedResources.filter(p => p.id !== id);
    } else {
      this.selectedResources = this.selectedResources.filter(p => p.parent !== id && p.id !== id);
    }
    this.labelsService.selectedResources = this.selectedResources;
  }

  save(): void {
    if (this.name != "") {
      this.labelsService.label.name = this.name;
      const labels = this.labelsService.getSelectedLabels();
      let request$: Observable<ApiResponse<string>>;
      if (this.editing) {
        request$ = this.httpService.editLabel(this.labelsService.labelId, labels)
      } else {
        request$ = this.httpService.addLabel(labels);
      }
      request$.pipe(
        catchError(err => {
          const error = err.error as ApiError;
          this.toaster.showError('error', error.message.join('\n'));
          throw err;
        })
      ).subscribe(res => {
        if (this.editing) {
        this.toaster.showSuccess('Well done!', 'Your label was successfully updated.');
        timer(3000).subscribe(() => (this.router.navigate(['/labels'])));
        }
        if (!this.editing) {
        this.toaster.showSuccess('Well done!', 'Your label was successfully created!.');
        timer(3000).subscribe(() => (this.router.navigate(['/labels'])));
        }
      });
    }
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
      let subsCounter = -1;
      const sub = this.httpService.getSubscriptionAndLabelsByLabel(body).subscribe(res => {
        this.selectedResources = [];
        res.data.forEach(subscription => {
          let subAdded = false;
          subscription.virtual_machines.forEach(item => {
            if (item.label === body.label) {
              // this.selectedResources.push({ id: item.virtual_machine.toString(), description: item.name });
              if (!subAdded) {
                subsCounter -= 1;
                this.selectedResources.push({ id: subsCounter.toString(), description: subscription.subscription_name });
                subAdded = true;
              }
              this.selectedResources.push({ id: item.virtual_machine.toString(), description: item.name, parent: subsCounter.toString() });
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
}
