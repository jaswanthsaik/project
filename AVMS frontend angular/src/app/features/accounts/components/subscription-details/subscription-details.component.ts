import { Dialog } from '@angular/cdk/dialog';
import { ComponentPortal } from '@angular/cdk/portal';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute } from '@angular/router';
import { catchError, Subscription, mergeMap, of, Subject, takeUntil } from 'rxjs';
import { DashboardResume } from 'src/app/features/home-page/models/resume';
import { TooltipData } from 'src/app/features/home-page/models/tooltip-data';
import { DashboardHttpService } from 'src/app/features/home-page/services/dashboard-http.service';
import { ApiError } from 'src/app/models/api-error';
import { ApiRequestOptions } from 'src/app/models/api-request-options';
import { InstanceGraph } from 'src/app/models/instance-graph';
import { RecommendationItem } from 'src/app/models/recommendation-item';
import { ModalDialogComponent } from 'src/app/shared/components/dialogs/modal-dialog/modal-dialog.component';
import { ModalDialogData } from 'src/app/shared/components/dialogs/models/modal-dialog-data';
import { ModalDialogResponseOptions } from 'src/app/shared/components/dialogs/models/modal-dialog-reponse-options';
import { BreadcrumbsItem } from 'src/app/shared/models/breadcrumbs-item';
import { PaginationInfo } from 'src/app/shared/models/pagination-info';
import { TableHeader } from 'src/app/shared/models/table-header';
import { CatalogHttpService } from 'src/app/shared/services/catalog-http.service';
import { NotifierService } from 'src/app/shared/services/notifier.service';
import { AzureSubscription } from '../../models/azure-subscription';
import { Instance } from '../../models/instance';
import { ResourceGroups } from '../../models/resource-groups';
import { SubscriptionDetailsTableRow } from '../../models/subscription-details-table-row';
import { TenantsTableRow } from '../../models/tenants-table-row';
import { AccountsHttpService } from '../../services/accounts-http.service';
import { AccountsService } from '../../services/accounts.service';
import { ApplyScheduleComponent } from '../apply-schedule/apply-schedule.component';
import { PostponeShutdownComponent } from '../apply-schedule/postpone-shutdown/postpone-shutdown.component';
import { ScaleInstanceComponent } from '../scale-instance/scale-instance.component';
import { SecureAccountComponent } from '../secure-account/secure-account.component';
import { StartStopInstanceComponent } from '../start-stop-instance/start-stop-instance.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatSort, Sort } from '@angular/material/sort';
import * as _ from 'lodash';

@Component({
  selector: 'app-subscription-details',
  templateUrl: './subscription-details.component.html',
  styleUrls: ['./subscription-details.component.scss']
})
export class SubscriptionDetailsComponent implements OnInit, OnDestroy {
  private readonly _destroying$ = new Subject<void>();
  instances: Instance[] = [];
  subscriptionId = 0;
  subscription?: AzureSubscription;
  resourceGroups?: ResourceGroups;
  displayedColumns: string[] = ['Name', 'Instances', 'Savings','Scheduled', '...'];
  dataSource = new MatTableDataSource<ResourceGroups>();
  data: SubscriptionDetailsTableRow[] = [];
  resume?: DashboardResume;
  breadcrumbs: BreadcrumbsItem[] = [
    { label: 'Home', url: '/' },
    { label: 'Accounts', url: '/accounts' },
    { label: 'Account Name', url: '/accounts/123' },
    { label: 'Tenant', url: '' },
    { label: 'Subscription', url: '' },
  ];

  recommendations: RecommendationItem[] = [];

  topAccountOptions = [
    { id: '1', description: 'Annual' },
    { id: '2', description: '6 Months' },
    { id: '3', description: '3 Months' },
  ];

  filterOptions = [
    { id: '0', description: 'Filtered by' },
    { id: '1', description: 'Filter 1' },
    { id: '2', description: 'Filter 2' },
    { id: '3', description: 'Filter 3' },
  ];


  filterText = '';
  sortField = 'resource_group_name';
  sortOrder = 'asc';

  selectAll = false;

  paginationInfo = new PaginationInfo();
  selectedPage = 1;
  lastPage = 0;

  recordsPerPage = 10;
  currentPage: number = 1;
  totalPages: number = 1;
  startRecord = 0;
  endRecord = 0;
  totalRecords: number = 0;

  rowPerPageOptions = [10, 20, 50, 100];


  subs = new Subscription();

  testData: SubscriptionDetailsTableRow[] = require('../../mock-data/subscription-details-test-data.json');
  @ViewChild(MatSort) sort! : MatSort;

  headers: TableHeader[] = [
    { description: 'Instance', sortable: true, sortOrder: 'asc', sorted: true, sortField: 'instance_name' },
    { description: 'Provider', sortable: true, sortOrder: 'asc', sorted: true, sortField: 'provider' },
    { description: 'Size', sortable: true, sortOrder: 'asc', sorted: true, sortField: 'size_name' },
    { description: 'Label', sortable: true, sortOrder: 'asc', sorted: true, sortField: 'label_name' },
    { description: 'Savings', sortable: true, sortOrder: 'asc', sorted: true, sortField: 'schedule_saving'},
    { description: 'Recommendation', sortable: true, sortOrder: 'asc', sorted: true, sortField: 'recommendation' },
    { description: 'Status', sortable: true, sortOrder: 'asc', sorted: true, sortField: 'status_name' },
    { description: 'Scheduled', sortable: true, sortOrder: 'asc', sorted: true, sortField: 'schedule_name' },
  ];

  bestInstancesPeriods = [
    { id: '14-days', description: '14 days' },
    { id: '1-month', description: '1 month' },
    { id: '3-months', description: '3 months' },
    { id: '6-months', description: '6 months' },
    { id: '12-months', description: '12 months' },
  ];

  months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  xAxisLegend: string[] = [];
  seriesData: number[][] = [];
  seriesLabels: string[] = [];
  tooltipData: TooltipData[] = [];
  selectedMainGraphInterval: number = 1;
  instanceGraphData?: InstanceGraph;

  constructor(
    //private dialogService: DialogService,
    private dialog: Dialog,
    private httpService: AccountsHttpService,
    private dashboardHttpService: DashboardHttpService,
    private catalogHttpService: CatalogHttpService,
    private accountsService: AccountsService,
    private router: Router,
    private route: ActivatedRoute,
    private toaster: NotifierService,
    private spinner: NgxSpinnerService
  ) { }

  getSubscription(): void {
    const sub = this.httpService.getSingleSubscription(this.subscriptionId).subscribe(res => {
      this.subscription = res.data;
      this.getMainGraphData(1);
      this.getInstanceGraph(5);
    });
    this.subs.add(sub);
  }

  getRoute(): void {
    const sub = this.catalogHttpService.getRouteBySubscription(this.subscriptionId).subscribe(res => {
      this.breadcrumbs[2] = {label: res.data.account_name, url: `/accounts/${res.data.account}`};
      this.breadcrumbs[3] = {label: res.data.tenant_name, url: ``};
      this.breadcrumbs[4] = {label: res.data.subscription_name, url: ``};
    });
    this.subs.add(sub);
  }

  getMainGraphData(interval: number): void {
    this.selectedMainGraphInterval = interval;
    this.dashboardHttpService.getGraphBySubscription(interval, this.subscription!.subscription).pipe(takeUntil(this._destroying$)).subscribe(res => {
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

  hardRefresh(element: any) {
    this.spinner.show();
    this.httpService.refreshResourceGroup(element!.resource_group).pipe(
      catchError(err => {
        const error = err.error as ApiError;
        this.toaster.showError('error', error.message.join('\n'));
        this.spinner.hide();
        throw err;
      })
    ).subscribe(data=> {
      if(data) {
        let confirmTitle = 'Sucess!.';
        let confirmMessage = `The ${element.resource_group_name} resource group has refreshed sucessfully.`;
        this.toaster.showSuccess(confirmTitle, confirmMessage);
        this.getInstances();
      }
      this.spinner.hide();
    })
  }

  getInstanceGraph(interval: number): void {
    this.dashboardHttpService.getSubscriptionGraph(interval, this.subscription!.subscription).pipe(takeUntil(this._destroying$)).subscribe(res => {
      this.instanceGraphData = res.data;
      this.instanceGraphData = {...this.instanceGraphData};
    });
  }

  /*chartFilter(frequency: '12-months' | '6-months' | '3-months' | '1-month' | '14-days'): void {
    alert(`You selected ${frequency}`);
  }*/

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

  pageChange(page: number): void {
    this.currentPage = page;
    this.getInstances();
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
      this.getInstances();
    }
  }

  getInstances(): void {
    const options = new ApiRequestOptions();
    options.pageNo = this.currentPage - 1;
    options.limit = this.recordsPerPage;
    options.filterText = this.filterText;
    options.sortBy = this.sortField;
    options.sortDirection = this.sortOrder;
    this.httpService.getResourceGroupsBySubscription(this.subscriptionId, options).subscribe(res => {
      this.dataSource.data = res.data;
      this.dataSource.sort = this.sort;
      this.totalPages = res.total_pages;
      this.totalRecords = res.total_records;
      this.startRecord = (this.currentPage - 1) * this.recordsPerPage + 1;
      this.endRecord = (this.currentPage - 1) * this.recordsPerPage + this.dataSource.data.length;
      this.paginationInfo = { recordsPerPage: this.recordsPerPage,  
        selectedPage: this.currentPage, totalPages: this.totalPages, totalRecords: this.totalRecords};
    });
  }

  filterInstances(filter: string): void {
    this.filterText = filter;
    this.currentPage = 1;
    this.getInstances();
  }

  secureAccount(row: SubscriptionDetailsTableRow): void {
    this.accountsService.lockedStatus = false;
    if (row.scheduleName === 'LOCKED') {
      this.accountsService.lockedStatus = true;
    }
    const previousLockedStatus = this.accountsService.lockedStatus;
    this.accountsService.showdScheduleLockedWarning = false;
    const data: ModalDialogData = {
      title: "Security",
      primaryButtonText: 'Save',
      secondaryButtonText: '',
      cancelButtonText: 'Cancel',
      portal: new ComponentPortal(SecureAccountComponent)
    };

    const dialogRef = this.dialog.open<ModalDialogResponseOptions>(ModalDialogComponent, {
      width: '700px',
      height: '500px',
      data: data,
    });
    const sub = dialogRef.closed.pipe(
      mergeMap(confirmResult => {
        if (confirmResult === 'primary' && this.accountsService.lockedStatus !== previousLockedStatus) {
          if (this.accountsService.lockedStatus) {
            return this.httpService.lockInstance(row.instance);
          } else {
            return this.httpService.unlockInstance(row.instance);
          }
          return this.httpService.lockInstance(row.instance);
        } else {
          return of(null);
        }
      })
    ).subscribe(result => {
      if (result) {
        row.scheduleName = this.accountsService.lockedStatus ? 'LOCKED' : 'Not Scheduled';
        const newStatusText = this.accountsService.lockedStatus ? 'Locked' : 'Unlocked';
        data.primaryButtonText = 'Close';
        data.cancelButtonText = '';
        data.secondaryButtonText = '';
        data.confirmTitle = `The instance ${row.instanceDescription} was ${newStatusText} successfully! `;
        data.confirmMessage = `The instance was ${newStatusText}, to schedule this instance in the future you need to unclock it first.`;
        if (!this.accountsService.lockedStatus) {
          data.confirmMessage = 'The instance was unlocked, you are now able to schedule this instance and start saving money.';
        }
        const confirmDialogRef = this.dialog.open<ModalDialogResponseOptions>(ModalDialogComponent, {
          width: '700px',
          data: data,
        });
        this.getInstances();
      }
    });
    this.subs.add(sub);
  }

  startStopInstance(row: SubscriptionDetailsTableRow): void {
    this.accountsService.started = row.status === 1 ? true : false;
    this.accountsService.showConfirmation = false;
    if (row.status === 9999) {
      this.accountsService.showConfirmation = true;
    }
    this.accountsService.instanceName = row.instanceDescription;
    const previousState = this.accountsService.started;
    const data: ModalDialogData = {
      title: 'Changing Status',
      primaryButtonText: 'Save',
      secondaryButtonText: '',
      cancelButtonText: 'Cancel',
      portal: new ComponentPortal(StartStopInstanceComponent)
    };

    const dialogRef = this.dialog.open<ModalDialogResponseOptions>(ModalDialogComponent, {
      width: '780px',
      height: '500px',
      data: data,
    });
    const sub = dialogRef.closed.pipe(
      mergeMap(confirmResult => {
        if (confirmResult === 'primary' && this.accountsService.started !== previousState) {
          if (this.accountsService.started) {
            return this.httpService.startInstance(row.instance);
          } else {
            return this.httpService.stopInstance(row.instance);
          }
        } else {
          return of(null);
        }
      })
    ).subscribe(result => {
      if (result) {
        this.getInstances();
        const status = this.accountsService.started ? 'Running' : 'Stopped';
        row.status = this.accountsService.started ? 1 : 2;
        row.statusName = this.accountsService.started ? 'allocated' : 'deallocated';
        data.primaryButtonText = 'Close';
        data.cancelButtonText = '';
        data.secondaryButtonText = '';
        data.confirmTitle = 'The status was successfully changed!';
        data.confirmMessage = `The Instance "${row.instanceDescription}" was changed to “${status}”.`;
        const confirmDialogRef = this.dialog.open<ModalDialogResponseOptions>(ModalDialogComponent, {
          width: '800px',
          data: data,
        });
      }
    });
    this.subs.add(sub);
  }

  scaleInstance(row: SubscriptionDetailsTableRow): void {
    this.accountsService.instanceName = row.instanceDescription;
    this.accountsService.previousSize = row.sizeInformation.name;
    this.accountsService.previousCores = row.sizeInformation.cores;
    this.accountsService.previousMemory = row.sizeInformation.memory_gigabyte;

    this.accountsService.scalingFinal = false;
    const previousSize = row.sizeInformation.name;
    const previousCores = row.sizeInformation.cores;
    const previousMemory = row.sizeInformation.memory_gigabyte;
    
    const data: ModalDialogData = {
      title: 'Scale Instance',
      primaryButtonText: 'Save',
      secondaryButtonText: '',
      cancelButtonText: 'Cancel',
      portal: new ComponentPortal(ScaleInstanceComponent)
    };

    const sub = this.httpService.getInstanceSizes(row.instance).pipe(
      mergeMap(res => {
        this.accountsService.instanceSizes = res.data;
        const dialogRef = this.dialog.open<ModalDialogResponseOptions>(ModalDialogComponent, {
          width: '700px',
          height: '500px',
          data: data,
        });
        return dialogRef.closed;
      }),
      mergeMap(confirmResult => {
        if (confirmResult === 'primary' && this.accountsService.size !== previousSize.toString()) {
          return this.httpService.scaleInstance(row.instance, this.accountsService.size);
        } else {
          return of(null);
        }
      })
    ).subscribe(result => {
      if (result) {
        this.accountsService.scalingFinal = true;
        data.primaryButtonText = 'Close';
        data.cancelButtonText = '';
        data.secondaryButtonText = '';
        const newSize = this.accountsService.size;
        data.confirmTitle = `The size change request has been submitted to Azure Portal.`;
        data.confirmMessage = `Request: Instance ${row.instanceDescription} size change from ${previousSize} to ${newSize}.
          This operation can take several minutes to complete, once 
          completed an email will be sent to inform the request status.`;
        const confirmDialogRef = this.dialog.open<ModalDialogResponseOptions>(ModalDialogComponent, {
          width: '700px',
          data: data,
        });
      }
    });
    this.subs.add(sub);
  }

  scheduleResourceGroup(row: ResourceGroups): void {
    // if (row.scheduleName === 'LOCKED') {
    //   this.unlockBeforSchedule(row);
    //   return;
    // }
    this.accountsService.scheduleStep = 'first';
    this.accountsService.selectedSchedule = row.schedule?.toString() ?? '0';
    this.accountsService.postponeShutdown = false;
    this.accountsService.overwriteSchedule = false;
    this.accountsService.showPostponeShutdown = false;
    this.accountsService.numberOfScheduledInstances = 0;
    // this.accountsService.instanceName = row.instanceDescription;
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
        if (row.schedule <= 0 || 
            Number(this.accountsService.selectedSchedule) <= 0 ||
            row.schedule == Number(this.accountsService.selectedSchedule)) {
          return of(confirmResult);
        }
        if (confirmResult === 'primary') {
          data.primaryButtonText = 'Accept';
          data.secondaryButtonText = '';
          data.cancelButtonText = 'Cancel';
          data.confirmTitle = 'Already have another schedule associated to this Virtual Machine';
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
          return this.httpService.applyScheduleToResourceGroup(row.resource_group, +this.accountsService.selectedSchedule);
        } else {
          return of(null);
        }
      })
    ).subscribe(result => {
      this.accountsService.scheduleStep = 'final';
      if (result) {
        this.getInstances();
        const selectedScheduleName = this.accountsService.schedules.find(s => s.schedule === +this.accountsService.selectedSchedule)?.schedule_name;
        row.schedule_name = selectedScheduleName || '';
        if(result.data == -1){
          data.confirmTitle = `The schedule has been removed from ${row.resource_group_name} resource group.`;
          data.confirmMessage = ``;
          let finishDialog: any
          this.toaster.showSuccess(data.confirmTitle, data.confirmMessage);
          return finishDialog;
        }
        else{
          data.confirmTitle = `The resource group ${row.resource_group_name} was successfully scheduled! `;
          data.confirmMessage = `The resource group was scheduled with: ${selectedScheduleName}`;
        }
        let finishDialog: any
        this.toaster.showSuccess(data.confirmTitle, data.confirmMessage);
        return finishDialog;
      }
    });
    this.subs.add(sub);
  }

  postponeShutdown(row: SubscriptionDetailsTableRow): void {
    let isDeleted = false;
    this.accountsService.instanceName = row.instanceDescription;
    this.accountsService.scheduleName = 'Saving ' + row.savings + '% || ' + row.scheduleName;
    this.accountsService.postponeTimestamp = row.postpone_end_date || '';

    this.accountsService.postponeShutdown = row.postpone ? true : false;

    const data: ModalDialogData = {
      title: "Postpone the instance's shutdown",
      primaryButtonText: 'CONFIRM',
      secondaryButtonText: '',
      cancelButtonText: 'CANCEL',
      portal: new ComponentPortal(PostponeShutdownComponent)
    };

    this.accountsService.removeStep = 'first';
    const dialogRef = this.dialog.open<ModalDialogResponseOptions>(ModalDialogComponent, {
      width: '700px',
      data: data,
    });
    let isError = false;
    const sub = dialogRef.closed.pipe(
      mergeMap(confirmResult => {
        if (confirmResult === 'primary') {
          if (this.accountsService.postponeShutdown && this.accountsService.postponeTimestamp != "") {
            row.status = 999;
            const result = this.httpService.postponeShutdown({
              instance: row.instance,
              end_date: new Date(new Date(this.accountsService.postponeTimestamp).toUTCString()).toISOString()
            }).pipe(
              catchError(err => {
                isError = true;
                return of(err.error as ApiError);
              }),
            );
            return result;
          } else if (!this.accountsService.postponeShutdown && row.statusName === 'Postponed') {
            isDeleted = true;
            return this.httpService.deletePostpone(row.instance).pipe(
              catchError(err => {
                isError = true;
                return of(err.error as ApiError);
              }),
            );
          }
        }
        return of(null);
      }),
      mergeMap(result => {
        if (isError) {
          data.dialogType = 'alert';
          data.primaryButtonText = 'CLOSE';
          data.secondaryButtonText = '';
          data.cancelButtonText = '';
          data.confirmTitle = 'ERROR';
          const error = result as ApiError;
          data.confirmMessage = error.message.join('\n');
          const finishDialog = this.dialog.open<ModalDialogResponseOptions>(ModalDialogComponent, {
            width: '800px',
            data: data,
          });
          return finishDialog.closed;
        } else
        if (result) {
          this.getInstances();
          data.primaryButtonText = 'CLOSE';
          data.cancelButtonText = '';
          data.secondaryButtonText = '';
          if (!isDeleted) {
            data.confirmTitle = `The instance ${this.accountsService.instanceName} next scheduled shutdown was successfully postponed.`;
            data.confirmMessage = `The next scheduled shutdown will take place at ${this.accountsService.postponeTimestamp.replace('T', ' ')}.`;
          } else {
            data.confirmTitle = `Shutdown postponement deleted.`;
            data.confirmMessage = `The instance shutdown will not be postponed.`;
          }
          const confirmDialogRef = this.dialog.open<ModalDialogResponseOptions>(ModalDialogComponent, {
            width: '700px',
            data: data,
          });
          return confirmDialogRef.closed;
        } else {
          return of(null);
        }
      })
    ).subscribe(result => {
      
    });
    this.subs.add(sub);
  }


  private unlockBeforSchedule(row: SubscriptionDetailsTableRow): void {
    if (row.scheduleName === 'LOCKED') {
      this.accountsService.lockedStatus = true;
    }
    const previousLockedStatus = this.accountsService.lockedStatus;
    this.accountsService.showdScheduleLockedWarning = true;
    const data: ModalDialogData = {
      title: 'Add Schedule',
      primaryButtonText: 'SAVE & SCHEDULE',
      secondaryButtonText: 'SAVE & CLOSE',
      cancelButtonText: 'CANCEL',
      portal: new ComponentPortal(SecureAccountComponent)
    };

    const dialogRef = this.dialog.open<ModalDialogResponseOptions>(ModalDialogComponent, {
      width: '700px',
      height: '500px',
      data: data,
    });
    const sub = dialogRef.closed.pipe(
      mergeMap(confirmResult => {
        if ((confirmResult === 'primary' || confirmResult === 'secondary') && !this.accountsService.lockedStatus) {
          row.scheduleName = 'Not Scheduled';
          return of(confirmResult);
        } else {
          return of(null);
        }
      })
    ).subscribe(result => {
      if (result === 'primary') {
        // this.scheduleInstance(row);
      }
    });
    this.subs.add(sub);
  }


  navigateToResourceGroup(row: ResourceGroups): void {
    this.router.navigate([`accounts/resourceGroup`, row.resource_group]);
  }

  ngOnInit(): void {
    this.subscriptionId = +(this.route.snapshot.paramMap.get('subscriptionId') || '0');
    this.getSubscription();
    this.getInstances();
    this.getRoute();

    const options = new ApiRequestOptions();
    options.subscription = this.subscriptionId;
    this.dashboardHttpService.getResume(options).pipe(takeUntil(this._destroying$)).subscribe(res => {
      this.resume = res.data;
      this.recommendations = this.resume.recommendations.map(item => {
        const level = item.recommendation_impact === 'High' ? 3 : item.recommendation_impact === 'Medium' ? 2 : 1;
        return {
          text: item.recommendation_description,
          level
        };
      });
      this.recommendations.sort((a, b) => b.level - a.level);
    });
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }

  sortData(sort: Sort) {
    let property = ((property: string) => {
       switch(property) {
        case 'Name': return 'resource_group_name';
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
        this.currentPage = 1;
        this.getInstances();
      }
}
