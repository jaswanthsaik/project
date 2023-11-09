import { Dialog } from '@angular/cdk/dialog';
import { ComponentPortal } from '@angular/cdk/portal';
import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import * as _ from 'lodash';
import { catchError, mergeMap, of, Subject, Subscription, switchMap, takeUntil } from 'rxjs';
import { TooltipData } from 'src/app/features/home-page/models/tooltip-data';
import { DashboardHttpService } from 'src/app/features/home-page/services/dashboard-http.service';
import { ApiError } from 'src/app/models/api-error';
import { ApiRequestOptions } from 'src/app/models/api-request-options';
import { InstanceGraph } from 'src/app/models/instance-graph';
import { CommonService } from 'src/app/services/common.service';
import { ConfirmationDialogComponent } from 'src/app/shared/components/dialogs/confirmation-dialog/confirmation-dialog.component';
import { ModalDialogComponent } from 'src/app/shared/components/dialogs/modal-dialog/modal-dialog.component';
import { ModalDialogData } from 'src/app/shared/components/dialogs/models/modal-dialog-data';
import { ModalDialogResponseOptions } from 'src/app/shared/components/dialogs/models/modal-dialog-reponse-options';
import { DialogService } from 'src/app/shared/components/dialogs/services/dialog.service';
import { BreadcrumbsItem } from 'src/app/shared/models/breadcrumbs-item';
import { PaginationInfo } from 'src/app/shared/models/pagination-info';
import { TableHeader } from 'src/app/shared/models/table-header';
import { NotifierService } from 'src/app/shared/services/notifier.service';
import { Account } from '../../models/account';
import { AccountsTableRow } from '../../models/accounts-table-row';
import { AddAccount } from '../../models/add-account';
import { EditAccount } from '../../models/edit-account';
import { AccountsHttpService } from '../../services/accounts-http.service';
import { AccountsService } from '../../services/accounts.service';
import { AddAccountComponent } from '../add-account/add-account.component';
import { RefreshAccountComponent } from '../refresh-account/refresh-account.component';
import { RemoveAccountComponent } from '../remove-account/remove-account.component';
import { NgxSpinnerService } from 'ngx-spinner';

//import { * as data } from '../../mock-data/accounts-table-test-data.json';

@Component({
  selector: 'app-accounts-container',
  templateUrl: './accounts-container.component.html',
  styleUrls: ['./accounts-container.component.scss'],
  providers: [DatePipe]
})
export class AccountsContainerComponent implements OnInit, OnDestroy{
  private readonly _destroying$ = new Subject<void>();
  accounts: Account[] = [];
  data: AccountsTableRow[] = [];
  acouuntdata: TableHeader[] = [];
  displayedColumns: string[] = ['Name', 'Provider', 'Date', 'Services', 'Tenants', 'Instances',
   'Recommendation', 'Scheduled', '...'];
  columnsToDisplay: string[] = this.displayedColumns.slice();
  breadcrumbs: BreadcrumbsItem[] = [
    { label: 'Home', url: '/' },
    { label: 'Cloud & Resources: Accounts', url: ''},
  ];

  topAccountOptions = [
    { id: '0', description: 'Select Top Accounts'},
    { id: '1', description: 'Top 3 Accounts' },
    { id: '2', description: 'Top 5 Accounts' },
    { id: '3', description: 'Top 10 Accounts' },
  ];

  filterOptions = [
    { id: '0', description: 'filter by' },
    { id: '1', description: 'Name' },
    { id: '2', description: 'Teams' },
    { id: '3', description: 'Providers' },
    { id: '4', description: 'Date Range' },
    { id: '5', description: 'Number of Tenants' },
    { id: '6', description: 'Number of Instances' },
    { id: '7', description: 'Savings Range %' },
    { id: '8', description: 'Recommendations' },
    { id: '9', description: 'Status' },
    { id: '10', description: 'Schedules' },
  ];

  filterText = '';
  sortField = '';
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

  testData: AccountsTableRow[] = require('../../mock-data/accounts-table-test-data.json');

  headers: TableHeader[] = [
    { description: 'Name', sortable: true, sortOrder: 'asc', sorted: true, sortField: 'account_name' },
    { description: 'Provider', sortable: true, sortOrder: '', sorted: false, sortField: 'provider_name' },
    { description: 'Date', sortable: true, sortOrder: '', sorted: false, sortField: 'created_in' },
    { description: 'Services', sortable: false, sortOrder: '', sorted: false, sortField: 'use_azure_lighthouse' },
    { description: 'Tenants', sortable: false, sortOrder: '', sorted: false, sortField: 'total_tenant' },
    { description: 'Instances', sortable: false, sortOrder: '', sorted: false, sortField: 'total_instance' },
    { description: 'Recommendation', sortable: false, sortOrder: '', sorted: false, sortField: 'have_recommendation' },
    { description: 'Scheduled', sortable: false, sortOrder: '', sorted: false, sortField: 'total_instance_scheduled' },
  ];

  dataSource = new MatTableDataSource<Account>();
  @ViewChild(MatSort) sort! : MatSort;
  
  bestInstancesPeriods = [
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
  tenantsGraphData?: InstanceGraph;

  constructor(
    //private dialogService: DialogService,
    private dialog: Dialog,
    private accountsService: AccountsService,
    private httpService: AccountsHttpService,
    private dashboardHttpService: DashboardHttpService,
    private commonService: CommonService,
    private datePipe: DatePipe,
    private toaster: NotifierService,
    private spinner: NgxSpinnerService
  ) { }

    
  chartFilter(frequency: '12-months' | '6-months' | '3-months' | '1-month' | '14-days'): void {
    alert(`You selected ${frequency}`);
  }
  
  getMainGraphData(interval: number): void {
    this.spinner.show();
    this.selectedMainGraphInterval = interval;
    this.dashboardHttpService.getGraph(interval).pipe(takeUntil(this._destroying$)).subscribe(res => {
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
        this.spinner.hide();
      });
      
    });
  }

  getInstanceGraph(interval: number): void {
    this.spinner.show();
    this.dashboardHttpService.getInstanceGraph(interval).pipe(takeUntil(this._destroying$)).subscribe(res => {
      this.instanceGraphData = res.data;
      this.instanceGraphData = {...this.instanceGraphData};
      this.spinner.hide();
    });
  }

  getTenantsGraph(interval: number): void {
    this.spinner.show();
    this.dashboardHttpService.getTenantsGraph(interval).pipe(takeUntil(this._destroying$)).subscribe(res => {
      this.tenantsGraphData = res.data;
      this.tenantsGraphData = {...this.tenantsGraphData};
      this.spinner.hide();
    });
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

  pageChange(page: number): void {
    this.currentPage = page;
    this.getAccounts();
  }
  changePageSize(): void {
    this.accountsService.recordsPerPage = this.recordsPerPage;
    this.currentPage = 1;
    this.getAccounts();
  }

  sortTable(colIndex: number) {
    if (this.headers[colIndex].sortable) {
      const sortOrder = this.headers[colIndex].sortOrder === 'asc' ? 'desc' : 'asc';
      this.headers.forEach(header => {
        header.sorted = false;
        header.sortOrder = '';
      } );
      this.headers[colIndex].sorted = true;
      this.headers[colIndex].sortOrder = sortOrder;
      this.sortField = this.headers[colIndex].sortField ?? '';
      this.sortOrder = sortOrder;
      this.currentPage = 1;
      this.getAccounts();
    }
  }
  // addAccount() {
  //   this.dialog.open(AddAccountComponent);
  // }

  addAccount(): void {
    this.accountsService.editing = false;
    this.accountsService.newAccount = new AddAccount();
    const data: ModalDialogData = {
      title: 'Add Account',
      primaryButtonText: 'Confirm',
      secondaryButtonText: '',
      cancelButtonText: 'Cancel',
      portal: new ComponentPortal(AddAccountComponent)
    };
    const dialogRef = this.dialog.open<ModalDialogResponseOptions>(ModalDialogComponent, {
      width: '750px',
      data: data,
    });
    let isError = false;
    const sub = dialogRef.closed.pipe(
      mergeMap(result => {
        if (result==='primary') {
          if (this.accountsService.provider === 'azure') {
            return this.httpService.addAzureAccount(this.accountsService.newAccount).pipe(
              catchError(err => {
                isError = true;
                return of(err.error as ApiError);
              }),
            );
          } 
          return of(null);
        } else {
          return of(null);
        }
      }), 
      mergeMap(result => {
        if (isError) {
          const error = result as ApiError;
          let finishDialog: any
          data.confirmMessage = error.message.join('\n');
          this.toaster.showError('error', data.confirmMessage);
          return finishDialog.closed;
        } else
        if (result) {
          data.primaryButtonText = '';
          data.secondaryButtonText = 'Add Another Account';
          data.cancelButtonText = 'close';
          // data.confirmTitle = 'Account added successfully';
          let confirmMessage = 'Account was successfully added to the portal.';
          const finishDialog = this.dialog.open<ModalDialogResponseOptions>(ModalDialogComponent, {
            width: '750px',
            data: data,
          });
          this.toaster.showSuccess('Success!', confirmMessage);
          return finishDialog.closed;
        } else {
          return of(null);
        }
      })
    ).subscribe(result => {
      this.getAccounts();
      // if (result==='secondary') {
      //   this.addAccount();
      // }
      
    });
    this.subs.add(sub);
    // this.dialogService.openDialog(data);
  }


  editAccount(row: AccountsTableRow): void {
    this.accountsService.editing = true;
    const data: ModalDialogData = {
      title: 'Edit Account',
      primaryButtonText: 'Confirm',
      secondaryButtonText: '',
      cancelButtonText: 'Cancel',
      portal: new ComponentPortal(AddAccountComponent)
    };

    const account$ = this.httpService.getSingleAccount(row.account);
    let isError = false;
    const sub = account$.pipe(
      switchMap(acc => {
        const account = acc.data;
        const editAccount: EditAccount = {
          client_id: '',
          client_secret: '',
          name: account.account_name,
        };
        this.accountsService.editAccount = editAccount;
        const dialogRef = this.dialog.open<ModalDialogResponseOptions>(ModalDialogComponent, {
          width: '750px',
          data: data,
        });
        return dialogRef.closed;
      }),
      mergeMap(result => {
        if (result==='primary') {
          return this.httpService.editAccount(row.account, this.accountsService.editAccount).pipe(
            catchError(err => {
              isError = true;
              return of(err.error as ApiError);
            }),
          );
        } else {
          return of(null);
        }
      }), 
      mergeMap(result => {
        if (isError) {
          const error = result as ApiError;
          let finishDialog: any;
          data.confirmMessage = error.message.join('\n');
          this.toaster.showError('error', data.confirmMessage);
          return finishDialog.closed;
        } 
        else if (result) {
          data.confirmMessage = 'Account was successfully saved.';
          let finishDialog: any;
          this.toaster.showSuccess('Success!', data.confirmMessage);
          this.getAccounts();
          return finishDialog.closed;
        }
        else {
          return of(null);
        }
      })
    ).subscribe(result => {});
    this.subs.add(sub);
    // this.dialogService.openDialog(data);
  }


  removeAccount(row?: any): void {
    const data: ModalDialogData = {
      title: 'Remove Accounts',
      primaryButtonText: 'Confirm',
      secondaryButtonText: '',
      cancelButtonText: 'Cancel',
      portal: new ComponentPortal(RemoveAccountComponent)
    };
    if (row) {
      this.accountsService.accountsToBeRemoved = [];
      this.accountsService.accountsToBeRemoved.push(row);
    } else {
      // this.accountsService.accountsToBeRemoved = this.data.filter(row => row.selected);
    }

    this.accountsService.removeStep = 'first';
    const dialogRef = this.dialog.open<ModalDialogResponseOptions>(ModalDialogComponent, {
      width: '500px',
      data: data,
    });
    const sub = dialogRef.closed.pipe(
      mergeMap(result => {
        if (result === 'primary') {
          this.accountsService.removeStep = 'second';
          const confirmDialogRef = this.dialog.open<ModalDialogResponseOptions>(ModalDialogComponent, {
            width: '500px',
            data: data,
          });
          return confirmDialogRef.closed;
        } else {
          return of(null);
        }
      }),
      mergeMap(confirmResult => {
        if (confirmResult === 'primary') {
          return this.httpService.deleteAccount(row!.account);
        } else {
          return of(null);
        }
      })
    ).subscribe(result => {
      this.accountsService.removeStep = 'final';
      if (result) {
        this.getAccounts();
        data.confirmTitle = 'The account was removed successfully';
        data.confirmMessage = 'The selected account was removed from the MSP portal.';
        let confirmDialogRef: any;
        this.toaster.showSuccess(data.confirmTitle, data.confirmMessage);
        return confirmDialogRef.closed;
      }
    });
    this.subs.add(sub);
  }

  getAccounts(): void {
    const options = new ApiRequestOptions();
    options.pageNo = this.currentPage - 1;
    options.limit = this.recordsPerPage;
    options.filterText = this.filterText;
    options.sortBy = this.sortField;
    options.sortDirection = this.sortOrder;
    const sub = this.httpService.getAccounts(options).subscribe(res => {
      this.accounts = res.data;
      this.dataSource.data = res.data;
      this.dataSource.sort = this.sort;
      this.totalPages = res.total_pages;
      this.totalRecords = res.total_records;
      this.startRecord = (this.currentPage - 1) * this.recordsPerPage + 1;
      this.endRecord = (this.currentPage - 1) * this.recordsPerPage + this.accounts.length;
      this.paginationInfo = { recordsPerPage: this.recordsPerPage,  
        selectedPage: this.currentPage, totalPages: this.totalPages, totalRecords: this.totalRecords};
      this.data = this.accounts.map(account => {
        const row: AccountsTableRow = {
          account: account.account,
          name: account.account_name,
          provider: account.provider_name,
          date: new Date(account.created_in),
          services: account.use_azure_lighthouse ? 'Lighthouse' : '',
          tenants: account.total_tenant,
          instances: account.total_instance,
          recommendation: account.have_recommendation ? 'Yes' : 'No',
          scheduled: account.total_instance_scheduled.toString(),
          savings: 0,
          selected: false,
          resources: account.total_resource,
          subscription: account.total_subscription
        };
        return row;
      });
      this.subs.add(sub);
    });
  }

  filterAccounts(filter: string): void {
    this.filterText = filter;
    this.currentPage = 1;
    this.getAccounts();
  }

  hardRefresh(row?: any): void {
    let date = this.datePipe.transform(row?.created_in, 'EE, MMM d, y, h:mm:ss zzzz');
    this.accountsService.hardRefrehLocalTitle = `Local Account Data:   ${date}`;
    this.accountsService.hardRefrehLocalText = `${row?.total_tenant}  Tenants, ${row?.total_subscription} Subsciptions, ${row?.total_instance} Instances, ${row?.total_instance_scheduled} Schedules`;
    // this.accountsService.hardRefrehRemoteTitle = 'Cloud Data: 21/20/2022 - 20:00';
    // this.accountsService.hardRefrehRemoteText = '13, Accounts, 5 Tenants, 51 Subsciptions, 150 Instances, 20 Schedules.....';

    const data: ModalDialogData = {
      title: 'Refresh Account',
      primaryButtonText: 'CONFIRM',
      secondaryButtonText: '',
      cancelButtonText: 'CANCEL',
      portal: new ComponentPortal(RefreshAccountComponent)
    };

    const dialogRef = this.dialog.open<ModalDialogResponseOptions>(ModalDialogComponent, {
      width: '751px',
      data: data,
    });

    const sub = dialogRef.closed.pipe(
      mergeMap(confirmResult => {
        if (confirmResult === 'primary') {
          return this.httpService.refreshAccount(row!.account);
        } else {
          return of(null);
        }
      })
    ).subscribe(result => {
      if (result) {
        data.primaryButtonText = 'CLOSE';
        data.cancelButtonText = '';
        let confirmTitle = 'Update saved successfully.';
        let confirmMessage = 'Wait a few minutes for the process to be completed.';
        let confirmDialogRef: any;
        this.toaster.showSuccess(confirmTitle, confirmMessage);
        return confirmDialogRef.closed;
      }
    });
    this.subs.add(sub);
  }


  ngOnInit(): void {
    this.getMainGraphData(1);
    this.getInstanceGraph(5);
    this.getTenantsGraph(1);
    this.getAccounts();
  }

  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }

  sortData(sort: Sort) {
    let property = ((property: string) => {
       switch(property) {
        case 'Name': return 'account_name';
        case 'Provider': return 'provider_name';
        case 'Date': return 'created_in | date';
        case 'Services': return 'use_azure_lighthouse';
        case 'Tenants': return 'total_tenant';
        case 'Instances': return 'total_instance';
        case 'Recommendation': return 'have_recommendation';
        case 'Scheduled': return 'total_instance_scheduled';
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
        this.getAccounts();
      }
}
