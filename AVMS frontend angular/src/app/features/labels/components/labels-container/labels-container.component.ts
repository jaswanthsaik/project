import { Dialog } from '@angular/cdk/dialog';
import { ComponentPortal } from '@angular/cdk/portal';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { catchError, mergeMap, of, Subscription, timer } from 'rxjs';
import { AccountsHttpService } from 'src/app/features/accounts/services/accounts-http.service';
import { SchedulesHttpService } from 'src/app/features/schedules/services/schedules-http.service';
import { ApiError } from 'src/app/models/api-error';
import { ApiRequestOptions } from 'src/app/models/api-request-options';
import { ModalDialogComponent } from 'src/app/shared/components/dialogs/modal-dialog/modal-dialog.component';
import { ModalDialogData } from 'src/app/shared/components/dialogs/models/modal-dialog-data';
import { ModalDialogResponseOptions } from 'src/app/shared/components/dialogs/models/modal-dialog-reponse-options';
import { BreadcrumbsItem } from 'src/app/shared/models/breadcrumbs-item';
import { PaginationInfo } from 'src/app/shared/models/pagination-info';
import { TableHeader } from 'src/app/shared/models/table-header';
import { LabelApiResponse } from '../../models/label-api-response';
import { LabelsTableRow } from '../../models/labels-table-row';
import { LabelsHttpService } from '../../service/labels-http.service';
import { LabelsService } from '../../service/labels.service';
import { AddLabelComponent } from '../add-label/add-label.component';
import { DeleteLabelComponent } from '../delete-label/delete-label.component';
import { EditLabelComponent } from '../edit-label/edit-label.component';
import { ScheduleLabelComponent } from '../schedule-label/schedule-label.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DeleteScheduleComponent } from 'src/app/features/schedules/components/delete-schedule/delete-schedule.component';
import { LabelDetailsComponent } from '../label-details/label-details.component';
import { Label } from '../../models/label';
import { ConfirmationDialogComponent } from 'src/app/shared/components/dialogs/confirmation-dialog/confirmation-dialog.component';
import * as _ from 'lodash';
import { NotifierService } from 'src/app/shared/services/notifier.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-labels-container',
  templateUrl: './labels-container.component.html',
  styleUrls: ['./labels-container.component.scss']
})
export class LabelsContainerComponent implements OnInit, OnDestroy {
  labels: LabelApiResponse[] = [];
  data: LabelsTableRow[] = [];
  breadcrumbs: BreadcrumbsItem[] = [
    { label: 'Home', url: '/' },
    { label: 'Labels', url: ''},
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

  testData: LabelsTableRow[] = require('../../mock-data/labels-table-test-data.json');
  displayedColumns: string[] = ['Label', 'Instances', 'Scheduled', 'Actions'];

  headers: TableHeader[] = [
    { description: 'Label', sortable: true, sortOrder: 'asc', sortField: 'label_name', sorted: true },
    { description: 'Instances', sortable: false, sortOrder: 'asc', sortField: 'total_instance', sorted: false },
    { description: 'Scheduled', sortable: false, sortOrder: 'asc', sortField: 'schedule_name', sorted: false },
  ];
  dataSource = new MatTableDataSource<LabelApiResponse>();
  // addDialogRef = new MatDialogRef<AddLabelComponent>;
  @ViewChild(MatSort) sort! : MatSort;
  link: any;
  dialogRef!: MatDialogRef<AddLabelComponent>;
  
  constructor(
    private httpService: LabelsHttpService,
    private spinner: NgxSpinnerService,
    private dialog: Dialog,
    private labelsService: LabelsService,
    private accountsHttpService: AccountsHttpService,
    private schedulesHttpService: SchedulesHttpService,
    private router: Router,
    private toaster : NotifierService
  ) { }
  openDialog() {
    this.dialog.open(AddLabelComponent);
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
      this.getLabels();
    }
  }

  getLabels(): void {
    this.spinner.show();
    const options = new ApiRequestOptions();
    options.pageNo = this.currentPage - 1;
    options.limit = this.recordsPerPage;
    options.filterText = this.filterText;
    options.sortBy = this.sortField;
    options.sortDirection = this.sortOrder;
    const sub = this.httpService.getLabels(options).subscribe(res => {
      this.labels = res.data;
      this.dataSource.data = res.data;
      this.dataSource.sort = this.sort;
      this.totalPages = res.total_pages;
      this.totalRecords = res.total_records;
      this.startRecord = (this.currentPage - 1) * this.recordsPerPage + 1;
      this.endRecord = (this.currentPage - 1) * this.recordsPerPage + this.labels.length;
      this.paginationInfo = { recordsPerPage: this.recordsPerPage,  
        selectedPage: this.currentPage, totalPages: this.totalPages, totalRecords: this.totalRecords};
      this.data = this.labels.map(item => {
        const row: LabelsTableRow = {
          label: item.label,
          labelName: item.label_name,
          totalInstances: item.total_instance,
          schedule: item.schedule_id,
          scheduleName: item.schedule_name,
          selected: false,
        };
        return row;
      });
      this.spinner.hide();
    });
    this.subs.add(sub);
  }

  getAccounts(): void {
    const sub = this.accountsHttpService.getAccounts().subscribe(res => {
      this.labelsService.accounts = res.data;
    });
    this.subs.add(sub);
  }

  getSchedules(): void {
    const sub = this.schedulesHttpService.getSchedules().subscribe(result => {
      this.labelsService.schedules = result.data;
    });
    this.subs.add(sub);
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
    this.getLabels();
  }

  changePageSize(): void {
    this.labelsService.recordsPerPage = this.recordsPerPage;
    this.currentPage = 1;
    this.getLabels();
  }

  filter(value: string): void {
    this.filterText = value;
    this.currentPage = 1;
    this.getLabels();
  }
  editLabel(row: LabelApiResponse): void {
    this.labelsService.label.name = row.label_name;
    this.labelsService.labelId = row.label;
    this.labelsService.editing = true;
    this.router.navigate(['/labels', this.labelsService.labelId]);
  }


  addLabel(): void {
    this.labelsService.editing = false;
    this.labelsService.label.name = "";
    this.labelsService.selectedResources = [];
    this.router.navigate(['/labels', '']);

    
  }

  deleteLabel(row: LabelApiResponse): void {
    this.labelsService.label.name = row.label_name;
    this.labelsService.label.label = row.label;
    const data: ModalDialogData = {
      title: 'Delete Label',
      primaryButtonText: 'Yes, Delete it',
      secondaryButtonText: '',
      cancelButtonText: 'Cancel',
      portal: new ComponentPortal(DeleteLabelComponent)
    };
    const dialogRef = this.dialog.open<ModalDialogResponseOptions>(ModalDialogComponent, {
      width: '500px',
      data: data,
    });
    let isError = false;
    const sub = dialogRef.closed.pipe(
      mergeMap(result => {
        if (result === 'primary') {
          if (this.labelsService.label.name != ""
          ) {
            return this.httpService.deleteLabel(this.labelsService.label.label).pipe(
              catchError(err => {
                isError = true;
                return of(err.error as ApiError);
              }),
            );
          }
          else {
            return of(null);
          }
        } else {
          return of(null);
        }
      }),
      mergeMap(result => {
        if (isError) {
          const error = result as ApiError;
          let finishDialog: any
          data.confirmMessage = error.message.join('\n');
          return finishDialog;
        }
        else if (result) {
          data.confirmMessage = 'The label ' + this.labelsService.label.name + ' was successfully deleted.';
          let finishDialog: any
          this.toaster.showSuccess('Success!', data.confirmMessage);
          this.currentPage = 1;
          this.getLabels();
          return finishDialog;
        }
        else {
          return of(null);
        }
      })
    ).subscribe(result => {});
    this.subs.add(sub);
  }

  scheduleLabel(row: LabelApiResponse): void {
    this.labelsService.label.name = row.label_name;
    this.labelsService.label.label = row.label;
    this.labelsService.selectedSchedule = row.schedule_name;
    this.labelsService.selectedScheduleId = row.schedule_id;
    
    const data: ModalDialogData = {
      title: 'Add Schedule',
      primaryButtonText: 'Confirm',
      secondaryButtonText: '',
      cancelButtonText: 'Cancel',
      portal: new ComponentPortal(ScheduleLabelComponent)
    };
    const dialogRef = this.dialog.open<ModalDialogResponseOptions>(ModalDialogComponent, {
      width: '800px',
      data: data,
    });

    const sub = dialogRef.closed.pipe(
      mergeMap(confirmResult => {
        if (row.schedule_id <= 0 || this.labelsService.label.scheduleId <= 0) {
          return of(confirmResult);
        }
        if (confirmResult === 'primary') {
          data.primaryButtonText = 'ACCEPT';
          data.secondaryButtonText = '';
          data.cancelButtonText = 'CANCEL';
          data.confirmTitle = 'Already have another schedule associated to this Label';
          data.confirmMessage = `Do you want to replace the current schedule?`;
          data.dialogType = 'alert';
          const confirmationDialog = this.dialog.open<ModalDialogResponseOptions>(ModalDialogComponent, {
            width: '800px',
            data: data,
          });
          return confirmationDialog.closed;
        } else {
          return of(null);
        }
      }),
      mergeMap(result => {
        if (result === 'primary') {
          if (this.labelsService.label.scheduleId != 0 &&
            this.labelsService.label.label != 0
          ) {
            return this.httpService.scheduleTag(this.labelsService.label.scheduleId, this.labelsService.label.label);
          }
          else {
            return of(null);
          }
        } else {
          return of(null);
        }
      }),
      mergeMap(result => {
        if (result) {
          if(result.data == -1){
            data.confirmTitle = `The schedule has been removed from ${this.labelsService.label.name} label.`;
            data.confirmMessage = ``;
            let finishDialog: any
            this.toaster.showSuccess(data.confirmTitle, data.confirmMessage);
            this.getLabels();
            return finishDialog;
          }
          else{
            data.confirmTitle = 'The ' + this.labelsService.label.name + ' was successfully scheduled!';
            data.confirmMessage = 'The selected label was scheduled with ' + this.labelsService.label.scheduleDescription;
          }
          let finishDialog: any
          this.toaster.showSuccess(data.confirmTitle, data.confirmMessage);
          this.getLabels();
          return finishDialog.closed;
        }
        else {
          return of(null);
        }
      })
    ).subscribe(result => {});
    this.subs.add(sub);
  }

  ngOnInit(): void {
    this.getLabels();
    this.getAccounts();
    this.getSchedules();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
  

  sortData(sort: Sort) {
    let property = ((property: string) => {
       switch(property) {
        case 'Label': return 'label_name';
        case 'Instances': return 'total_instance';
         case 'Scheduled': return 'schedule_name';
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
        this.getLabels();
        }
}
