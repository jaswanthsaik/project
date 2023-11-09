import { Dialog } from '@angular/cdk/dialog';
import { ComponentPortal } from '@angular/cdk/portal';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { concatMap, mergeMap, of, Subject, Subscription, takeUntil } from 'rxjs';
import { TooltipData } from 'src/app/features/home-page/models/tooltip-data';
import { DashboardHttpService } from 'src/app/features/home-page/services/dashboard-http.service';
import { ApiRequestOptions } from 'src/app/models/api-request-options';
import { InstanceGraph } from 'src/app/models/instance-graph';
import { RecommendationItem } from 'src/app/models/recommendation-item';
import { ModalDialogComponent } from 'src/app/shared/components/dialogs/modal-dialog/modal-dialog.component';
import { ModalDialogData } from 'src/app/shared/components/dialogs/models/modal-dialog-data';
import { ModalDialogResponseOptions } from 'src/app/shared/components/dialogs/models/modal-dialog-reponse-options';
import { BreadcrumbsItem } from 'src/app/shared/models/breadcrumbs-item';
import { PaginationInfo } from 'src/app/shared/models/pagination-info';
import { TableHeader } from 'src/app/shared/models/table-header';
import { Account } from '../../models/account';
import { AzureSubscription } from '../../models/azure-subscription';
import { ScheduleApiResponse } from '../../models/schedule-api-response';
import { Tenant } from '../../models/tenant';
import { TenantsTableRow } from '../../models/tenants-table-row';
import { AccountsHttpService } from '../../services/accounts-http.service';
import { AccountsService } from '../../services/accounts.service';
import { AddAccountComponent } from '../add-account/add-account.component';
import { ApplyScheduleComponent } from '../apply-schedule/apply-schedule.component';
import { ManageLabelComponent } from '../manage-label/manage-label.component';
//import { * as data } from '../../mock-data/accounts-table-test-data.json';


import { animate, state, style, transition, trigger } from '@angular/animations';
import * as _ from 'lodash';
import { DashboardResume } from 'src/app/features/home-page/models/resume';
import { NotifierService } from 'src/app/shared/services/notifier.service';

@Component({
  selector: 'app-account-details',
  templateUrl: './account-details.component.html',
  styleUrls: ['./account-details.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class AccountDetailsComponent implements OnInit, OnDestroy {

  dataSource = new MatTableDataSource<TenantsTableRow>();
  dataSource1 = new MatTableDataSource<TenantsTableRow>();
  isToggle= false;
  columnsToDisplay = ['name', 'subscriptions', 'resource_groups', 'instances','...'];
  innerColumns = ['name', 'instances', 'savings','recommendations','scheduleName','...'];
  resume?: DashboardResume;
  recommendations: RecommendationItem[] = [];

  toggleRow(element: any) {
    element.expanded = !element.expanded;
    this.isToggle = !this.isToggle;
    this.getSubscriptions(element);
  }
  private readonly _destroying$ = new Subject<void>();
  tenants: Tenant[] = [];
  subscriptions: AzureSubscription[] = [];
  accountId: number = 0;
  account?: Account;
  data: TenantsTableRow[] = [];
  selectedTenantRow?: TenantsTableRow;
  breadcrumbs: BreadcrumbsItem[] = [
    { label: 'Home', url: '/' },
    { label: 'Accounts', url: '/accounts' },
  ];

  @ViewChild(MatSort) sort! : MatSort;
  

  topAccountOptions = [
    { id: '1', description: 'Top 3 Accounts' },
    { id: '2', description: 'Top 5 Accounts' },
    { id: '3', description: 'Top 10 Accounts' },
  ];

  filterOptions = [
    { id: '0', description: 'All Tenants' },
    { id: '1', description: 'Filter 1' },
    { id: '2', description: 'Filter 2' },
    { id: '3', description: 'Filter 3' },
  ];

  filterText = '';
  sortField = '';
  sortOrder = 'asc';
  subSortField = '';
  subSortOrder = 'asc';

  selectAll = false;

  paginationInfo = new PaginationInfo();
  selectedPage = 1;

  recordsPerPage = 10;
  currentPage: number = 1;
  totalPages: number = 1;
  startRecord = 0;
  endRecord = 0;
  totalRecords: number = 0;

  rowPerPageOptions = [10, 20, 50, 100];

  subs = new Subscription();

  testData: TenantsTableRow[] = require('../../mock-data/tenants-table-test-data.json');
  testSubsriptionData: TenantsTableRow[] = require('../../mock-data/subscriptions-test-data.json');

  headers: TableHeader[] = [
    { description: 'Tenant Name', sortable: true, sortOrder: 'asc', sortField: 'tenant_name', subTitle: 'Subscription Name', subSortable: true, subSortField: 'subscription_name', subSortOrder: 'asc' },
    { description: 'Subscriptions', sortable: false, sortOrder: 'asc', sortField: 'total_subscriptions', subTitle: '' },
    { description: 'Instances', sortable: false, sortOrder: 'asc', sortField: 'total_instances', subTitle: 'INSTANCES', subSortOrder: 'asc' },
    { description: '', sortable: false, sortOrder: 'asc', subTitle: 'SAVINGS', subSortOrder: 'asc' },
    { description: '', sortable: false, sortOrder: 'asc', subTitle: 'RECOMMENDATIONS', subSortOrder: 'asc' },
    { description: '', sortable: false, sortOrder: 'asc', subTitle: 'SCHEDULED ON SUBSCRIPTION LEVEL', subSortOrder: 'asc' },
  ];

  bestInstancesPeriods = [
    { id: '5', description: '14 days' },
    { id: '1', description: '1 month' },
    { id: '2', description: '3 months' },
    { id: '3', description: '6 months' },
    { id: '4', description: '12 months' },
  ];

  months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  xAxisLegend: string[] = [];
  seriesData: number[][] = [];
  seriesLabels: string[] = [];
  tooltipData: TooltipData[] = [];
  selectedMainGraphInterval: number = 1;
  instanceGraphData?: InstanceGraph;
  showSearchInstance = false;

  constructor(
    //private dialogService: DialogService,
    private dialog: Dialog,
    private accountsService: AccountsService,
    private router: Router,
    private route: ActivatedRoute,
    private httpService: AccountsHttpService,
    private dashboardHttpService: DashboardHttpService,
    private toaster: NotifierService
  ) { }

  getAccount(): void {
    this.httpService.getSingleAccount(this.accountId).subscribe(res => {
      this.account = res.data;
      this.breadcrumbs.push({ label: this.account.account_name, url: '' });
      this.getMainGraphData(1);
    });
  }

  getTenants(): void {
    const options = new ApiRequestOptions();
    options.pageNo = this.currentPage - 1;
    options.limit = this.recordsPerPage;
    options.filterText = this.filterText;
    options.sortBy = this.sortField;
    options.sortDirection = this.sortOrder;
    this.httpService.getTenantsByAccount(this.accountId, options).subscribe(res => {
      this.tenants = res.data;
      // this.dataSource.data = res.data;
      this.dataSource.sort = this.sort;
      this.totalPages = res.total_pages;
      this.totalRecords = res.total_records;
      this.startRecord = (this.currentPage - 1) * this.recordsPerPage + 1;
      this.endRecord = (this.currentPage - 1) * this.recordsPerPage + this.tenants.length;
      this.paginationInfo = {
        recordsPerPage: this.recordsPerPage,
        selectedPage: this.currentPage, totalPages: this.totalPages, totalRecords: this.totalRecords
      };
      this.data = this.tenants.map(item => {
        const row: TenantsTableRow = {
          tenant: item.tenant,
          name: item.tenant_name,
          subscriptions: item.total_subscriptions,
          resource_groups: item.total_resource_groups,
          instances: item.total_instances,
          selected: false,
          expanded: false,
          subscriptionRow: false,
          savings: 0
        };
        return row;
      });
      this.dataSource.data = this.data;
    });
  }

  filterTenants(filter: string): void {
    this.filterText = filter;
    this.currentPage = 1;
    this.getTenants();
  }

  chartFilter(frequency: '12-months' | '6-months' | '3-months' | '1-month' | '14-days'): void {
    alert(`You selected ${frequency}`);
  }

  getMainGraphData(interval: number): void {
    this.selectedMainGraphInterval = interval;
    this.dashboardHttpService.getGraphByAccount(interval, this.account!.account).pipe(takeUntil(this._destroying$)).subscribe(res => {
      this.xAxisLegend = [];
      this.seriesLabels = [];
      this.tooltipData = [];
      res.data.forEach((item, index) => {
        this.xAxisLegend = item.reference_values.map(value => value.time_elapsed);
        this.seriesData[index] = item.reference_values.map(item => item.percent_saving);
        this.seriesLabels.push(item.account_name);
        this.tooltipData.push({
          total_tenant: item.total_tenant,
          total_subscription: item.total_subscription,
          total_instance: item.total_instance,
          total_saving: item.total_saving,
          percent_saving: item.percent_saving
        });
        this.seriesData = [...this.seriesData];
        this.seriesLabels = [...this.seriesLabels];
        this.tooltipData = [...this.tooltipData];
      });

    });
  }

  getInstanceGraph(interval: number): void {
    this.dashboardHttpService.getInstanceGraphByAccount(interval, this.accountId).pipe(takeUntil(this._destroying$)).subscribe(res => {
      this.instanceGraphData = res.data;
      this.instanceGraphData = {...this.instanceGraphData};
    });
  }
  
  instanceClicked(): void {
    this.showSearchInstance = true;
  }

  selectAllRows(): void {
    this.data.forEach(row => row.selected = this.selectAll);
  }

  itemSelected(): void {
    if (this.data.every(row => row.selected)) {
      this.selectAll = true;
    } else {
      this.selectAll = false;
    }
  }

  pageChange(event: any): void {
    this.currentPage = event.pageIndex + 1;
    this.recordsPerPage = event.pageSize;
    this.getTenants();
  }

  sortTable(colIndex: number) {
    if (this.headers[colIndex].sortable) {
      const sortOrder = this.headers[colIndex].sortOrder === 'asc' ? 'desc' : 'asc';
      this.headers.forEach(header => {
        header.sorted = false;
        header.sortOrder = '';
      });
      this.headers[colIndex].sorted = true;
      this.headers[colIndex].sortOrder = sortOrder;
      this.sortField = this.headers[colIndex].sortField ?? '';
      this.sortOrder = sortOrder;
      this.currentPage = 1;
      this.getTenants();
    }
  }

  sortSubTable(colIndex: number) {
    if (this.headers[colIndex].subSortable) {
      const sortOrder = this.headers[colIndex].subSortOrder === 'asc' ? 'desc' : 'asc';
      this.headers.forEach(header => {
        header.subSorted = false;
        header.subSortOrder = '';
      });
      this.headers[colIndex].subSorted = true;
      this.headers[colIndex].subSortOrder = sortOrder;
      this.subSortField = this.headers[colIndex].subSortField ?? '';
      this.subSortOrder = sortOrder;
      this.currentPage = 1;
      this.getSubscriptions(this.selectedTenantRow!);
    }
  }

  addAccount(): void {
    const data: ModalDialogData = {
      title: 'ADD ACCOUNT',
      primaryButtonText: 'CONFIRM',
      secondaryButtonText: '',
      cancelButtonText: 'CANCEL',
      portal: new ComponentPortal(AddAccountComponent)
    };
    const dialogRef = this.dialog.open<ModalDialogResponseOptions>(ModalDialogComponent, {
      width: '250px',
      data: data,
    });

    const sub = dialogRef.closed.subscribe(() => { });
    this.subs.add(sub);
  }

  removeTenant(row?: TenantsTableRow): void {
    alert(`Remove tenant ${row?.name}`);
  }

  expand(row: any): void {
    this.toggleRow(row);
    this.data = this.data.filter(item => item.subscriptionRow === false);
    const index = this.data.indexOf(row);
    row.expanded = !row.expanded;
    // this.isToggle = !this.isToggle;
    row.expanded = (row.expanded ?? false) ? false : true;
    this.data.forEach((item, i) => {
      if (i !== index) {
        item.expanded = false;
      }
    });
    if (this.isToggle) {
      this.getSubscriptions(row);
    }
  }


  getSubscriptions(row: TenantsTableRow): void {
    this.selectedTenantRow = row;
    const index = this.data.indexOf(row);
    const options = new ApiRequestOptions();
    options.tenant = row.tenant;
    options.sortBy = this.subSortField;
    options.sortDirection = this.subSortOrder;
    this.httpService.getSubscriptionsByAccountAndTenant(this.accountId, options).subscribe(res => {
      this.subscriptions = [...this.subscriptions, ...res.data];
      const subRows = res.data.map(item => {
        const subRow: TenantsTableRow = {
          tenant: item.subscription,
          name: item.subscription_name,
          resource_groups: item.total_resource_groups,
          instances: item.total_instances,
          savings: item.schedule_saving,
          recommendation: item.use_recommendation ? 'YES' : 'NO',
          scheduled: item.scheduled,
          schedule: item.schedule,
          scheduleName: item.schedule_name,
          selected: false,
          expanded: false,
          subscriptionRow: true,
          parentTenantRow: row
        };
        return subRow;
      });
      this.dataSource1.data = subRows;

    });
  }


  schedule(row: TenantsTableRow): void {
    /*if (row) {
      this.accountsService.accountsToBeRemoved = [];
      this.accountsService.accountsToBeRemoved.push(row);
    } else {
      this.accountsService.accountsToBeRemoved = this.data.filter(row => row.selected);
    }*/

    this.accountsService.scheduleStep = 'first';
    this.accountsService.selectedSchedule = row.schedule?.toString() ?? '0';
    this.accountsService.instanceName = row.name;
    this.accountsService.postponeShutdown = false;
    this.accountsService.overwriteSchedule = false;
    this.accountsService.showPostponeShutdown = false;
    this.accountsService.numberOfScheduledInstances = row.numberOfScheduledInstances ?? 0;
    const data: ModalDialogData = {
      title: 'Add Schedule',
      primaryButtonText: 'Confirm',
      secondaryButtonText: '',
      cancelButtonText: 'Cancel',
      portal: new ComponentPortal(ApplyScheduleComponent)
    };

    this.accountsService.removeStep = 'first';
    const options = new ApiRequestOptions();
    options.sortBy = 'schedule_name';
    options.limit = 1000;
    const sub = this.httpService.getSchedules(options).pipe(
      mergeMap(res => {
        this.accountsService.schedules = res.data;
        const dialogRef = this.dialog.open<ModalDialogResponseOptions>(ModalDialogComponent, {
          width: '700px',
          data: data,
        });
        return dialogRef.closed;
      }),
      mergeMap(confirmResult => {
        if ((row.schedule ?? 0) <= 0 ||
          Number(this.accountsService.selectedSchedule) <= 0 ||
          ((row.schedule ?? 0) == Number(this.accountsService.selectedSchedule))) {
          return of(confirmResult);
        }
        if (confirmResult === 'primary') {
          data.primaryButtonText = 'Accept';
          data.secondaryButtonText = '';
          data.cancelButtonText = 'Cancel';
          data.confirmTitle = 'Already have another schedule associated to this Subscription';
          data.confirmMessage = `Do you want to replace the current schedule?`;
          data.dialogType = 'alert';
          const confirmationDialog = this.dialog.open<ModalDialogResponseOptions>(ModalDialogComponent, {
            width: '700px',
            data: data,
          });
          return confirmationDialog.closed;
        } else {
          return of(null);
        }
      }),
      mergeMap(confirmResult => {
        if (confirmResult === 'primary') {
          if (this.accountsService.selectedSchedule === '0') {
            return of(null);
          }
          if (this.accountsService.numberOfScheduledInstances > 0 && !this.accountsService.overwriteSchedule) {
            return of(null);
          }
          return this.httpService.applyScheduleToSubscription(row.tenant, +this.accountsService.selectedSchedule);
        } else {
          return of(null);
        }
      })
    ).subscribe(result => {
      this.accountsService.scheduleStep = 'final';
      if (result) {
        this.getSubscriptions(row.parentTenantRow!);
        row.scheduled = +this.accountsService.selectedSchedule > 0;
        const searchSchedule = +this.accountsService.selectedSchedule === -1 ? 0 : +this.accountsService.selectedSchedule;
        const selectedScheduleName = this.accountsService.schedules.find(s => s.schedule === searchSchedule)?.schedule_name;
        row.scheduleName = selectedScheduleName ? selectedScheduleName : 'Not scheduled.';
        row.schedule = +this.accountsService.selectedSchedule;
        if (result.data == -1) {
          data.confirmTitle = `The schedule has been removed from ${row.name} subscription.`;
          data.confirmMessage = ``;
          let finishDialog: any
          this.toaster.showSuccess(data.confirmTitle, data.confirmMessage);
          return finishDialog;
        }
        else {
          data.confirmTitle = `The subscription ${row.name} was scheduled successfully!`;
          data.confirmMessage = `The subscription was scheduled with: ${selectedScheduleName}`;
        }
        let finishDialog: any
        this.toaster.showSuccess(data.confirmTitle, data.confirmMessage);
        return finishDialog;
      }
    });
    this.subs.add(sub);
  }

  manageLabels(row: TenantsTableRow): void {
    const data: ModalDialogData = {
      title: 'Add Label',
      primaryButtonText: 'SAVE',
      secondaryButtonText: '',
      cancelButtonText: 'CANCEL',
      portal: new ComponentPortal(ManageLabelComponent)
    };
    const dialogRef = this.dialog.open<ModalDialogResponseOptions>(ModalDialogComponent, {
      width: '600px',
      data: data,
    });

    const sub = dialogRef.closed.pipe(
      mergeMap(confirmResult => {
        if (confirmResult === 'primary') {
          return this.accountsService.addLabel();
        } else {
          return of(null);
        }
      })
    ).subscribe(result => {
      if (result) {
        data.primaryButtonText = 'CLOSE';
        data.cancelButtonText = '';
        data.secondaryButtonText = '';
        const label = this.accountsService.newLabel;
        data.confirmTitle = `The Label "${label}" was applied successfully on the [Subscription name]`;
        data.confirmMessage = 'XXX Instances fron the subscription were labeled.';
        const confirmDialogRef = this.dialog.open<ModalDialogResponseOptions>(ModalDialogComponent, {
          width: '600px',
          data: data,
        });
      }
    });
    this.subs.add(sub);
  }

  navigateToSubscription(row: TenantsTableRow): void {
    this.router.navigate([`accounts/subscription`, row.tenant]);
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }


  ngOnInit(): void {
    this.accountId = +(this.route.snapshot.paramMap.get('id') || '0');
    this.getAccount();
    this.getTenants();
    this.getInstanceGraph(5);

    const options = new ApiRequestOptions();
    options.account = this.accountId;
    this.dashboardHttpService.getResume(options).pipe(takeUntil(this._destroying$)).subscribe(res => {
      this.resume = res.data;
      this.recommendations = this.resume.recommendations.map((item: any) => {
        const level = item.recommendation_impact === 'High' ? 3 : item.recommendation_impact === 'Medium' ? 2 : 1;
        return {
          text: item.recommendation_description,
          level
        };
      });
      this.recommendations.sort((a, b) => b.level - a.level);
    });
  }

  sortData(sort: Sort) {
    let property = ((property: string) => {
       switch(property) {
        case 'name': return 'tenant_name';
        case 'subscriptions': return 'total_subscriptions';
        case 'instances': return 'total_instances';
         default: return property;
         }
        })(sort.active);
        this.dataSource.data = _.orderBy(this.dataSource.data, property, sort.direction || false);
      }

      sortColumn(sortField: string) {
        const sortDirection = this.sortOrder === 'asc' ? 'desc' : 'asc';
        this.sortField = sortField ?? '';
        this.sortOrder = sortDirection;
        this.currentPage = 1;
        this.getTenants();
        }
}
