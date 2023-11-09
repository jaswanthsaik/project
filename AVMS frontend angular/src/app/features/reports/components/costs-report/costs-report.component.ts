import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { map, Subscription } from 'rxjs';
import { Account } from 'src/app/features/accounts/models/account';
import { AzureSubscription } from 'src/app/features/accounts/models/azure-subscription';
import { Provider } from 'src/app/features/accounts/models/provider';
import { ResourceGroup } from 'src/app/features/accounts/models/resource-group';
import { ResourceGroups } from 'src/app/features/accounts/models/resource-groups';
import { Tenant } from 'src/app/features/accounts/models/tenant';
import { AccountsHttpService } from 'src/app/features/accounts/services/accounts-http.service';
import { TooltipData } from 'src/app/features/home-page/models/tooltip-data';
import { ApiRequestOptions } from 'src/app/models/api-request-options';
import { BreadcrumbsItem } from 'src/app/shared/models/breadcrumbs-item';
import { PaginationInfo } from 'src/app/shared/models/pagination-info';
import { TableHeader } from 'src/app/shared/models/table-header';
import { NotifierService } from 'src/app/shared/services/notifier.service';
import { CostsData, CostsDataItem } from '../../models/costs-report-structure';
import { ReportsHttpService } from '../../services/reports-http.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SaveNewFilterComponent } from 'src/app/shared/components/save-new-filter/save-new-filter.component';
import { Filters } from 'src/app/models/filters';
import { User } from 'src/app/features/profile/models/user';
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'app-costs-report',
  templateUrl: './costs-report.component.html',
  styleUrls: ['./costs-report.component.scss']
})
export class CostsReportComponent implements OnInit, OnDestroy {

  data: CostsDataItem[] = [];  
  breadcrumbs: BreadcrumbsItem[] = [
    { label: 'Home', url: '/' },
    { label: 'Reports: Costs', url: ''},
  ];
  user?: User;
  accounts: Account[] = [];
  accountsLookup = [{ id: '0', description: 'Select Account' }];
  selectedAccount: string = '0';
  tenants: Tenant[] = [];
  tenantsLookup = [{ id: '0', description: 'Select Tenant' }];
  selectedTenant: string = '0';
  subscriptions: AzureSubscription[] = [];
  subscriptionsLookup = [{ id: '0', description: 'Select Subscription' }];
  selectedSubscription: string = '0';
  resourceGroup: ResourceGroups[] = [];
  resourceGroupLookup = [{ id: '0', description: 'Select Resource Group' }];
  selectedResourceGroup: string = '0';

  providers: Provider[] = [];
  providersLookup = [{ id: '0', description: 'Select Provider' }];
  selectedProvider: string = '0';
  
  xAxisLegend: string[] = [];
  seriesData: number[][] = [];
  seriesLabels: string[] = [];
  tooltipData: TooltipData[] = [];
  selectedMainGraphInterval: number = 1;
  costsGraphData?: CostsData;
  
  filterText = '';
  sortField = 'account_name';
  sortOrder = 'asc';

  selectAll = false;

  dailycost = true;
  topcost = false;
  monthdate = false;

  paginationInfo = new PaginationInfo();
  selectedPage = 1;
  lastPage = 0;

  recordsPerPage = 10;
  currentPage: number = 1;
  totalPages: number = 1;
  startRecord = 0;
  endRecord = 0;
  totalRecords: number = 0;

  rowPerPageOptions = [10, 20, 50, 100, 500];

  subs = new Subscription();

  filter: Filters[] = [];
  filterLookUp = [{ id: '0', description: 'Filters' }];
  selectedFilter: string = '0';
  headers: TableHeader[] = [
    { description: 'Time range', sortable: true, sortOrder: 'asc' },
    { description: 'Costs ($)', sortable: true, sortOrder: 'asc' },
  ];

  dataSource = new MatTableDataSource<CostsDataItem>();
  displayedColumns: string[] = ['Time range', 'Costs'];
  @ViewChild(MatSort) sort: MatSort | any;
  
  addFilterRef!: MatDialogRef<SaveNewFilterComponent>;
  deletedFilterId?: number;
  companyId!: number;
  constructor(
    private httpService: ReportsHttpService,
    private spinner: NgxSpinnerService,
    private accountsHttpService: AccountsHttpService,
    private toaster: NotifierService,
    private dialog: MatDialog,
  ) { }

  getAccounts(): void {
    this.accountsLookup = [{ id: '0', description: 'Select Account' }];
    const sub = this.accountsHttpService.getAccounts().subscribe(res => {
      this.accounts = res.data;
      // this.dataSource.data = res.data;
      const lookup = this.accounts.map(account => {
        return { id: account.account.toString(), description: account.account_name };
      });
      this.accountsLookup = [...this.accountsLookup, ...lookup];
    });
    this.subs.add(sub);
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
    this.tenantsLookup = [{ id: '0', description: 'Select Tenant' }]
    const sub = this.accountsHttpService.getTenantsByAccount(+this.selectedAccount).subscribe(res => {
      this.tenants = res.data;
      const lookup = this.tenants.map(tenant => {
        return { id: tenant.tenant.toString(), description: tenant.tenant_name };
      });
      this.tenantsLookup = [...this.tenantsLookup, ...lookup];
    });
    this.subs.add(sub);
  }

  tenantSelected(event: any): void {
    this.selectedTenant = event.target.value;
    this.subscriptionsLookup = [{ id: '0', description: 'Select Subscription' }];
    this.selectedSubscription = '0';
    this.getSubscriptions();
    this.getMainGraphData(this.selectedMainGraphInterval);
  }

  getSubscriptions(): void {
    this.subscriptionsLookup = [{ id: '0', description: 'Select Subscription' }];
    const options = new ApiRequestOptions();
    options.tenant = +this.selectedTenant;
    const sub = this.accountsHttpService.getSubscriptionsByAccountAndTenant(+this.selectedAccount, options).subscribe(res => {
      this.subscriptions = res.data;
      const lookup = this.subscriptions.map(subscription => {
        return { id: subscription.subscription.toString(), description: subscription.subscription_name };
      });
      this.subscriptionsLookup = [...this.subscriptionsLookup, ...lookup];
    });
    this.subs.add(sub);
  }

  subscriptionSelected(event: any): void {
    this.selectedSubscription = event.target.value;
    this.getResouceGroup();
    this.getMainGraphData(this.selectedMainGraphInterval)
  }

  getResouceGroup() {
    this.resourceGroupLookup = [{ id: '0', description: 'Select Resource Group' }];
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

  resourceGroupSelected(event: any) {
    this.selectedResourceGroup = event.target.value;
    this.getMainGraphData(this.selectedMainGraphInterval)
  }

  getProviders(): void {
    this.providersLookup = [{ id: '0', description: 'Select Provider' }];
    const sub = this.accountsHttpService.getProviders().subscribe(res => {
      this.providers = res.data;
      const lookup = this.providers.map(provider => {
        return { id: provider.provider.toString(), description: provider.provider_name };
      });
      this.providersLookup = [...this.providersLookup, ...lookup];
    });
    this.subs.add(sub);
  }

  providerSelected(event: any): void {
    this.selectedProvider = event.target.value;
    this.getMainGraphData(this.selectedMainGraphInterval)
  }
  getMainGraphData(interval: number): void {
    this.spinner.show();
    this.selectedMainGraphInterval = interval;
    let report$ = this.httpService.getDateCostReport(+this.selectedTenant, +this.selectedSubscription, +this.selectedResourceGroup, +this.selectedProvider);
    let days = 999;
    if (interval === 2) {
      report$ = this.httpService.getTopTenCostReport(+this.selectedTenant, +this.selectedSubscription, +this.selectedResourceGroup, +this.selectedProvider);
    }
    else if (interval === 1) {
      report$ = this.httpService.getDailyCostReport(+this.selectedTenant, +this.selectedSubscription, +this.selectedResourceGroup, +this.selectedProvider);
    }
    days = interval === 1 || interval === 3 ? 31 : 10;
    const sub = report$.subscribe(res => {
      this.data = res.data.summary_resume;
      this.dataSource.data = res.data.summary_resume;
      this.xAxisLegend = [];
      this.seriesData[0] = [];
      this.seriesLabels = ['Costs'];
      this.tooltipData = [];
      res.data.graph_information.forEach((item, index) => {
          this.xAxisLegend.push(item.reference_date);
          this.seriesData[0].push(item.total_cost);
          this.spinner.hide();
          //this.seriesLabels.push(item.account_name);
      });
      
      if (days < this.seriesData[0].length) {
        this.seriesData[0] = this.seriesData[0].slice(this.seriesData[0].length - days);
        this.xAxisLegend = this.xAxisLegend.slice(this.xAxisLegend.length - days);
        this.data = this.data.slice(this.data.length - days);
        this.dataSource.data = this.dataSource.data.slice(this.dataSource.data.length - days);
      }

      this.dailycost = interval === 1;
      this.topcost = interval === 2;
      this.monthdate = interval === 3;
      this.headers[0].description = interval === 2 ? 'Instance name' : 'Time range';

      this.seriesData = [...this.seriesData];
      this.seriesLabels = [...this.seriesLabels];
      this.tooltipData = [...this.tooltipData];
    });
    this.subs.add(sub);

  }

  export(interval: number): void {
    this.spinner.show();
    let report$ = this.httpService.getDateCostReportExport(+this.selectedTenant, +this.selectedSubscription, +this.selectedResourceGroup, +this.selectedProvider);
    if(interval === 1){
      report$ = this.httpService.getDailyCostReportExport(+this.selectedTenant, +this.selectedSubscription, +this.selectedResourceGroup, +this.selectedProvider);
    }
    else if(interval === 2){
      report$ = this.httpService.getTopTenCostReportExport(+this.selectedTenant, +this.selectedSubscription, +this.selectedResourceGroup, +this.selectedProvider);
    }
    report$.subscribe(response => {
      const downloadLink = document.createElement('a');
      if (response.body) {
        downloadLink.href = URL.createObjectURL(new Blob([response.body], { type: response.body.type }));
        const contentDisposition = response.headers.get('content-disposition');
        const fileName = contentDisposition!.split(';')[1].split('filename')[1].split('=')[1].trim();
        downloadLink.download = fileName;
        downloadLink.click();
        this.toaster.showSuccess('Success!', 'Reports has been Sucessfully downloaded.');
      }
      this.spinner.hide();
    });
  }

  ngOnInit(): void {
    this.companyId = this.user?.user || 0;
    this.getMainGraphData(1);
    this.getAccounts();
    this.getProviders();
    this.getSavedFilters();
    
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
  selectSavedFilterHandler(event: any) {
    this.selectedFilter = event.source.value;
    let number = Number(this.selectedFilter)
    if(this.deletedFilterId === event.source.value) {
      return;
    }

    if (number != 0) {
      this.httpService.getOneSavedFilter(number).subscribe(res => {
        this.selectedAccount = String(res.data.criteria.account);
        this.selectedTenant = String(res.data.criteria.tenant);
        this.selectedSubscription = String(res.data.criteria.subscription);
        this.selectedResourceGroup = String(res.data.criteria.resourcegroup);
        this.selectedProvider = String(res.data.criteria.provider);
        this.getAccounts();
        this.getTenants();
        this.getSubscriptions();
        this.getResouceGroup();
        this.getProviders();
      this.getMainGraphData(this.selectedMainGraphInterval)
      })
    } else {
        this.selectedAccount = '0';
        this.selectedTenant = '0';
        this.selectedSubscription = '0';
        this.selectedResourceGroup = '0';
        this.selectedProvider = '0';
        this.data = [];
        this.seriesData = [];
        this.seriesLabels = [];
        this.tooltipData = [];
        this.xAxisLegend = [];
        if(+this.selectedAccount !=0 || +this.selectedTenant !=0) {
          this.getMainGraphData(this.selectedMainGraphInterval);
        }
    }
  }

openSaveNewFilter(){
  this.addFilterRef = this.dialog.open(SaveNewFilterComponent, {
    width: '525px',
    height: '360px',
  });
    this.addFilterRef.componentInstance.companyId = this.companyId;
    this.addFilterRef.componentInstance.providersLookup = this.providersLookup;
    this.addFilterRef.componentInstance.tenantsLookup = this.tenantsLookup;
    this.addFilterRef.componentInstance.subscriptionsLookup = this.subscriptionsLookup;
    this.addFilterRef.componentInstance.accountsLookup = this.accountsLookup;
    this.addFilterRef.componentInstance.resourceGroupLookup = this.resourceGroupLookup;
    this.addFilterRef.componentInstance.accountsLookup = this.accountsLookup;
    this.addFilterRef.componentInstance.resourceGroupLookup = this.resourceGroupLookup;
    this.addFilterRef.componentInstance.selectedAccount = this.selectedAccount;
    this.addFilterRef.componentInstance.selectedTenant = this.selectedTenant;
    this.addFilterRef.componentInstance.selectedSubscription = this.selectedSubscription;
    this.addFilterRef.componentInstance.selectedResourceGroup = this.selectedResourceGroup;
    this.addFilterRef.componentInstance.selectedProvider = this.selectedProvider;
    this.addFilterRef.componentInstance.filter = "costs";
    this.addFilterRef.afterClosed().subscribe(
    () => {
      this.getSavedFilters();
    }
  )
}
 deleteFilter(id: any) {
    this.deletedFilterId = id;
    this.httpService.deleteReportFilter(id).subscribe(res => {
      if (res) {
        this.getSavedFilters();
        this.toaster.showSuccess('Success!', 'Filter has been Successfully Deleted');
      }
    })
  }

  getSavedFilters() {
    this.filter = [];
    this.filterLookUp = [{ id: '0', description: 'Filters' }];
    this.httpService.getCostsReportFilter(this.companyId).subscribe(res => {
      this.filter = res.data;
      const lookup = this.filter.map(filter => {
        return { id: filter.filter.toString(), description: filter.filter_name };
      });
      this.filterLookUp = [...this.filterLookUp, ...lookup];
    })
  }
  clearFilter() {
    this.selectedAccount = '0'
    this.selectedTenant = '0';
    this.selectedSubscription = '0';
    this.selectedResourceGroup = '0';
    this.selectedProvider = '0';
    this.selectedFilter = 'Filters';
  }
}