import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { map, Subscription } from 'rxjs';
import { Account } from 'src/app/features/accounts/models/account';
import { AzureSubscription } from 'src/app/features/accounts/models/azure-subscription';
import { Instance } from 'src/app/features/accounts/models/instance';
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
import { CpuData } from '../../models/cpu-report-structure';
import { ReportsHttpService } from '../../services/reports-http.service';
import { SaveNewFilterComponent } from 'src/app/shared/components/save-new-filter/save-new-filter.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { User } from 'src/app/features/profile/models/user';
import { Filters } from 'src/app/models/filters';

@Component({
  selector: 'app-cpu-report',
  templateUrl: './cpu-report.component.html',
  styleUrls: ['./cpu-report.component.scss']
})
export class CpuReportComponent implements OnInit, OnDestroy {

  data: CpuData[] = [];
  breadcrumbs: BreadcrumbsItem[] = [
    { label: 'Home', url: '/' },
    { label: 'Reports: CPU Utilization', url: ''},
  ];
  displayedColumns: string[] = ['Time range', 'CPU'];
  accounts: Account[] = [];
  accountsLookup = [{ id: '0', description: 'Select Account' }];
  selectedAccount: string = '0';
  tenants: Tenant[] = [];
  tenantsLookup = [{ id: '0', description: 'Select Tenant' }];
  selectedTenant: string = '0';
  subscriptions: AzureSubscription[] = [];
  subscriptionsLookup = [{ id: '0', description: 'Select Subscription' }];
  selectedSubscription: string = '0';
  instances: Instance[] = [];
  instancesLookup = [{ id: '0', description: 'Select Instance' }];
  selectedInstance: string = '0';
  resourceGroup: ResourceGroups[] = [];
  resourceGroupLookup = [{ id: '0', description: 'Select Resource Group' }];
  selectedResourceGroup: string = '0';

  xAxisLegend: string[] = [];
  seriesData: number[][] = [];
  seriesLabels: string[] = [];
  tooltipData: TooltipData[] = [];
  selectedMainGraphInterval: number = 1;
  cpuGraphData?: CpuData;

  filterText = '';
  sortField = 'account_name';
  sortOrder = 'asc';

  selectAll = false;

  today = true;
  lastweek = false;
  lastmonth = false;

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
  user?: User;
  filter: Filters[] = [];
  filterLookUp = [{ id: '0', description: 'Filters' }];
  selectedFilter: string = '0';
  deletedFilterId?: number;
  companyId!: number;

  headers: TableHeader[] = [
    { description: 'Time range', sortable: true, sortOrder: 'asc' },
    { description: 'Cpu', sortable: true, sortOrder: 'asc' },
  ];
  // dataSource = new MatTableDataSource<Account>();
  // displayedColumns: string[] = ['Time range', 'CPU'];
  dataSource = new MatTableDataSource<CpuData>();
  @ViewChild(MatSort) sort: MatSort | any;
  
  addFilterRef!: MatDialogRef<SaveNewFilterComponent>;
  constructor(
    private httpService: ReportsHttpService,
    private accountsHttpService: AccountsHttpService,
    private toaster: NotifierService,
    private dialog: MatDialog,
  ) { } 

  getAccounts(): void {
    this.accountsLookup = [{ id: '0', description: 'Select Account' }];
    const sub = this.accountsHttpService.getAccounts().subscribe(res => {
      this.accounts = res.data;
      // this.dataSource.data = res.data;
      this.dataSource.sort = this.sort;
      const lookup = this.accounts.map(account => {
        return { id: account.account.toString(), description: account.account_name };
      });
      this.accountsLookup = [...this.accountsLookup, ...lookup];
    });
    this.subs.add(sub);
  }

  accountSelected(event: any): void {
    this.selectedAccount = event.target.value;
    this.selectedTenant = '0';
    this.selectedSubscription = '0';
    this.selectedInstance = '0';
    this.tenantsLookup = [{ id: '0', description: 'Select Tenant' }];
    this.subscriptionsLookup = [{ id: '0', description: 'Select Subscription' }];
    this.resourceGroupLookup = [{ id: '0', description: 'Select Resource Group' }];
    this.instancesLookup = [{ id: '0', description: 'Select Instance' }];
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
    this.instancesLookup = [{ id: '0', description: 'Select Instance' }];
    this.selectedSubscription = '0';
    this.selectedInstance = '0';
    this.getSubscriptions();
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
    this.instancesLookup = [{ id: '0', description: 'Select Instance' }];
    this.selectedInstance = '0';
    this.getResouceGroup();
    // this.getInstances();
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
    this.getInstances();
    this.getMainGraphData(this.selectedMainGraphInterval)
  }


  getInstances(): void {
    this.instancesLookup = [{ id: '0', description: 'Select Instance' }];
    const options = new ApiRequestOptions();
    options.resourcegroup = +this.selectedResourceGroup;
    const sub = this.accountsHttpService.getInstancesByResourceGroup(options).subscribe(res => {
      this.instances = res.data;
      const lookup = this.instances.map(instance => {
        return { id: instance.instance.toString(), description: instance.instance_name };
      });
      this.instancesLookup = [...this.instancesLookup, ...lookup];
    });
    this.subs.add(sub);
  }

  instanceSelected(event: any): void {
    this.selectedInstance = event.target.value;
    this.getMainGraphData(this.selectedMainGraphInterval);
  }

  getMainGraphData(interval: number): void {
    this.selectedMainGraphInterval = interval;
    let report$ = this.httpService.getMonthlyCpuReport(+this.selectedInstance);
    if (interval === 1) {
      report$ = this.httpService.getDailyCpuReport(+this.selectedInstance);
    }
    if (interval === 2) {
      report$ = this.httpService.getWeeklyCpuReport(+this.selectedInstance);
    }
    const sub = report$.subscribe(res => {
      this.data = res.data;
      this.dataSource.data = res.data;
      this.xAxisLegend = [];
      this.seriesData[0] = [];
      this.seriesLabels = ['CPU'];
      this.tooltipData = [];
      res.data.forEach((item, index) => {
        const dateTime = item.reference_date + ' ' + ('0' + item.reference_hour).slice(-2) + ':00';
        const xAxisLabel = interval === 1 ? dateTime : item.reference_date;
        this.xAxisLegend.push(xAxisLabel.toString());
        this.seriesData[0].push(item.usages);
        //this.seriesLabels.push(item.account_name);
      });
      this.seriesData = [...this.seriesData];
      this.seriesLabels = [...this.seriesLabels];
      this.tooltipData = [...this.tooltipData];
    });
    this.subs.add(sub);

    if(interval === 1){
      this.today=true;
      this.lastweek=false;
      this.lastmonth=false;
    }
    else if(interval === 2){
      this.today=false;
      this.lastweek=true;
      this.lastmonth=false;
    }
    else if (interval === 3){
      this.today=false;
      this.lastweek=false;
      this.lastmonth=true;
    }
  }

  export(interval: number): void {
    this.selectedMainGraphInterval = interval;
    let report$ = this.httpService.getMonthlyCpuReportExport(+this.selectedInstance);
    if (interval === 1) {
      report$ = this.httpService.getDailyCpuReportExport(+this.selectedInstance);
    }
    if (interval === 2) {
      report$ = this.httpService.getWeeklyCpuReportExport(+this.selectedInstance);
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
    });
  }
  
  ngOnInit(): void {
    this.companyId = this.user?.user || 0;
    this.getAccounts();
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
        this.selectedInstance = String(res.data.criteria.instances);
        this.getAccounts();
        this.getTenants();
        this.getSubscriptions();
        this.getResouceGroup();
        this.getInstances();
       this.getMainGraphData(this.selectedMainGraphInterval)
      })
    } else {
        this.selectedAccount = '0';
        this.selectedTenant = '0';
        this.selectedSubscription = '0';
        this.selectedResourceGroup = '0';
        this.selectedInstance = '0';
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

  getSavedFilters() {
    this.filter = [];
    this.filterLookUp = [{ id: '0', description: 'Filters' }];
    this.httpService.getCpuUtilizationReportFilter(this.companyId).subscribe(res => {
      this.filter = res.data;
      const lookup = this.filter.map(filter => {
        return { id: filter.filter.toString(), description: filter.filter_name };
      });
      this.filterLookUp = [...this.filterLookUp, ...lookup];
    })
  }

  openSaveNewFilter(){
  this.addFilterRef = this.dialog.open(SaveNewFilterComponent, {
    width: '525px',
    height: '360px',
  });
  this.addFilterRef.componentInstance.companyId = this.companyId;
  this.addFilterRef.componentInstance.tenantsLookup = this.tenantsLookup;
  this.addFilterRef.componentInstance.subscriptionsLookup = this.subscriptionsLookup;
  this.addFilterRef.componentInstance.accountsLookup = this.accountsLookup;
  this.addFilterRef.componentInstance.resourceGroupLookup = this.resourceGroupLookup;
  this.addFilterRef.componentInstance.instancesLookup = this.instancesLookup;
  this.addFilterRef.componentInstance.accountsLookup = this.accountsLookup;
  this.addFilterRef.componentInstance.resourceGroupLookup = this.resourceGroupLookup;
  this.addFilterRef.componentInstance.selectedAccount = this.selectedAccount;
  this.addFilterRef.componentInstance.selectedTenant = this.selectedTenant;
  this.addFilterRef.componentInstance.selectedSubscription = this.selectedSubscription;
  this.addFilterRef.componentInstance.selectedResourceGroup = this.selectedResourceGroup;
  this.addFilterRef.componentInstance.selectedInstance = this.selectedInstance;
  this.addFilterRef.componentInstance.filter = "cpu";
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
clearFilter() {
  this.selectedAccount = '0'
  this.selectedTenant = '0';
  this.selectedSubscription = '0';
  this.selectedResourceGroup = '0';
  this.selectedInstance = '0';
  this.selectedFilter = '0';
  this.getAccounts();
}
}
