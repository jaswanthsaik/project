import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { DashboardHttpService } from 'src/app/features/home-page/services/dashboard-http.service';
import { NotifierService } from '../../services/notifier.service';
import { AzureSubscription } from 'src/app/features/accounts/models/azure-subscription';
import { Tenant } from 'src/app/features/accounts/models/tenant';
import { Account } from 'src/app/features/accounts/models/account';
import { Provider } from 'src/app/features/accounts/models/provider';
import { ResourceGroups } from 'src/app/features/accounts/models/resource-groups';
import { AccountsHttpService } from 'src/app/features/accounts/services/accounts-http.service';
import { ReportsHttpService } from 'src/app/features/reports/services/reports-http.service';
import { ApiRequestOptions } from 'src/app/models/api-request-options';
import { Instance } from 'src/app/features/accounts/models/instance';

@Component({
  selector: 'app-save-new-filter',
  templateUrl: './save-new-filter.component.html',
  styleUrls: ['./save-new-filter.component.scss']
})
export class SaveNewFilterComponent implements OnInit, OnDestroy {

  accounts: Account[] = [];
  @Input() accountsLookup = [{ id: '0', description: 'Select Account' }];
  @Input() selectedAccount: string = '0';
  tenants: Tenant[] = [];
  @Input() tenantsLookup = [{ id: '0', description: 'Select Tenant' }];
  @Input() selectedTenant: string = '0';
  subscriptions: AzureSubscription[] = [];
  @Input() subscriptionsLookup = [{ id: '0', description: 'Select Subscription' }];
  @Input() selectedSubscription: string = '0';
  resourceGroup: ResourceGroups[] = [];
  @Input() resourceGroupLookup = [{ id: '0', description: 'Select Resource Group' }];
  @Input() selectedResourceGroup: string = '0';
  @Input() companyId!: number;
  providers: Provider[] = [];
  @Input() providersLookup = [{ id: '0', description: 'Select Provider' }];
  selectedProvider: string = '0';
  @Input() filter!: string;
  instances: Instance[] = [];
  @Input() instancesLookup = [{ id: '0', description: 'Select Instance' }];
  @Input() selectedInstance: string = '0';
  Form!: FormGroup;
  submitted = false;
  subs: any;
  constructor(
    public dialogRef: MatDialogRef<SaveNewFilterComponent>,
    private formBuilder: FormBuilder,
    private reportsService: ReportsHttpService,
    private accountsHttpService: AccountsHttpService,
    private toaster: NotifierService,
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.Form = this.formBuilder.group({
      filterName: ['', Validators.required],
      filterDescription: ['', Validators.required]
    });
  }
  
  getAccounts(): void {
    const sub = this.accountsHttpService.getAccounts().subscribe(res => {
      this.accounts = res.data;
      // this.dataSource.data = res.data;
      const lookup = this.accounts.map(account => {
        return { id: account.account.toString(), description: account.account_name };
      });
      this.accountsLookup = [...this.accountsLookup, ...lookup];
    
    });
  }
  accountSelected(event: any): void {
    this.selectedAccount = event.target.value;;
    this.selectedTenant = '0';
    this.selectedSubscription = '0';
    this.tenantsLookup = [{ id: '0', description: 'Select Tenant' }];
    this.subscriptionsLookup = [{ id: '0', description: 'Select Subscription' }];
    this.resourceGroupLookup = [{ id: '0', description: 'Select Resource Group' }];
    this.getTenants();
  }

  getTenants(): void {
    const sub = this.accountsHttpService.getTenantsByAccount(+this.selectedAccount).subscribe(res => {
      this.tenants = res.data;
      const lookup = this.tenants.map(tenant => {
        return { id: tenant.tenant.toString(), description: tenant.tenant_name };
      });
      this.tenantsLookup = [...this.tenantsLookup, ...lookup];
    });
  }

  tenantSelected(event: any): void {
    this.selectedTenant = event.target.value;
    this.subscriptionsLookup = [{ id: '0', description: 'Select Subscription' }];
    this.selectedSubscription = '0';
    this.getSubscriptions();
    // this.getMainGraphData(this.selectedMainGraphInterval);
  }
  getSubscriptions(): void {
    const options = new ApiRequestOptions();
    options.tenant = +this.selectedTenant;
    const sub = this.accountsHttpService.getSubscriptionsByAccountAndTenant(+this.selectedAccount, options).subscribe(res => {
      this.subscriptions = res.data;
      const lookup = this.subscriptions.map(subscription => {
        return { id: subscription.subscription.toString(), description: subscription.subscription_name };
      });
      this.subscriptionsLookup = [...this.subscriptionsLookup, ...lookup];
    });
  }

  subscriptionSelected(event: any): void {
    this.selectedSubscription = event.target.value;
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
  }

  resourceGroupSelected(event: any) {
    this.selectedResourceGroup = event.target.value;

    this.getInstances();
  }

  getProviders(): void {
    const sub = this.accountsHttpService.getProviders().subscribe(res => {
      this.providers = res.data;
      const lookup = this.providers.map(provider => {
        return { id: provider.provider.toString(), description: provider.provider_name };
      });
      this.providersLookup = [...this.providersLookup, ...lookup];
    });
  }

  providerSelected(event: any): void {
    this.selectedProvider = event.target.value;
  }

  
  getInstances(): void {
    const options = new ApiRequestOptions();
    options.resourcegroup = +this.selectedResourceGroup;
    const sub = this.accountsHttpService.getInstancesByResourceGroup(options).subscribe(res => {
      this.instances = res.data;
      const lookup = this.instances.map(instance => {
        return { id: instance.instance.toString(), description: instance.instance_name };
      });
      this.instancesLookup = [...this.instancesLookup, ...lookup];
    });
  }

  instanceSelected(event: any): void {
    this.selectedInstance = event.target.value;
  }

  close() {
    this.dialogRef.close();
  }
  onSubmit() {
    let data = {
      name: this.Form.value['filterName'],
      description: this.Form.value['filterDescription'],
      criteria: {
        account: this.selectedAccount,
        tenant: this.selectedTenant,
        subscription: this.selectedSubscription,
        resourcegroup: this.selectedResourceGroup,
        provider: this.selectedProvider,
        instances: this.selectedInstance
      }
    }
    if (this.filter === "savings") {
      this.reportsService.addSavingsReportFilter(this.companyId, data).subscribe(res => {
        if (res) {
          this.toaster.showSuccess('Success!','New Report filter has been created');
          this.close();
        }
      },
      error => {
        if(error) {
          this.toaster.showError(error.error.message[0], 'Error');
        }
      })
    } else if (this.filter === "costs") {
      this.reportsService.addCostsReportFilter(this.companyId, data).subscribe(res => {
        if (res) {
          this.toaster.showSuccess('Success!','New Report filter has been created');
          this.close();
        }
      },
      error => {
        if(error) {
          this.toaster.showError(error.error.message[0], 'Error');
        }
      })
    }
    else if (this.filter === "cpu") {
      this.reportsService.addCpuUtilizationReportFilter(this.companyId, data).subscribe(res => {
        if (res) {
          this.toaster.showSuccess('Success!','New Report filter has been created');
          this.close();
        }
      },
      error => {
        if(error) {
          this.toaster.showError(error.error.message[0], 'Error');
        }
      })
    }
}

 avoidSpaceAtStart(event:any) {
  if(event.keyCode === 32 && event.target.selectionStart === 0) {
    event.preventDefault();
  }
}

  ngOnDestroy(): void {
  }

}
