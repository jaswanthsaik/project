import { Dialog } from '@angular/cdk/dialog';
import { ComponentPortal } from '@angular/cdk/portal';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute } from '@angular/router';
import { catchError, concatMap, mergeMap, of, Subscription, timer } from 'rxjs';
import { ApiError } from 'src/app/models/api-error';
import { ApiRequestOptions } from 'src/app/models/api-request-options';
import { ApiResponse } from 'src/app/models/api-response';
import { ModalDialogComponent } from 'src/app/shared/components/dialogs/modal-dialog/modal-dialog.component';
import { ModalDialogData } from 'src/app/shared/components/dialogs/models/modal-dialog-data';
import { ModalDialogResponseOptions } from 'src/app/shared/components/dialogs/models/modal-dialog-reponse-options';
import { BreadcrumbsItem } from 'src/app/shared/models/breadcrumbs-item';
import { PaginationInfo } from 'src/app/shared/models/pagination-info';
import { TableHeader } from 'src/app/shared/models/table-header';
import { Timezone } from 'src/app/shared/models/timezone';
import { CatalogHttpService } from 'src/app/shared/services/catalog-http.service';
import { AddSchedule } from '../../models/add-schedule';
import { ScheduleApiResponse } from '../../models/schedule-api-response';
import { SchedulesTableRow } from '../../models/schedules-table-row';
import { SchedulesHttpService } from '../../services/schedules-http.service';
import { SchedulesService } from '../../services/schedules.service';
import { AddScheduleComponent } from '../add-schedule/add-schedule.component';
import { DeleteScheduleComponent } from '../delete-schedule/delete-schedule.component';
import { MatSort, Sort } from '@angular/material/sort';
import { ScheduleLabelComponent } from 'src/app/features/labels/components/schedule-label/schedule-label.component';
import { EditScheduleComponent } from '../edit-schedule/edit-schedule.component';
import { ConfirmationDialogComponent } from 'src/app/shared/components/dialogs/confirmation-dialog/confirmation-dialog.component';
import * as _ from 'lodash';
import { NotifierService } from 'src/app/shared/services/notifier.service';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-schedules-container',
  templateUrl: './schedules-container.component.html',
  styleUrls: ['./schedules-container.component.scss']
})
export class SchedulesContainerComponent implements OnInit, OnDestroy {
  schedules: ScheduleApiResponse[] = [];
  scheduleId = 0;
  currentSchedule = '';
  data: SchedulesTableRow[] = [];
  timezones: Timezone[] = [];
  breadcrumbs: BreadcrumbsItem[] = [
    { label: 'Home', url: '/' },
    { label: 'Schedules', url: ''},
  ];

  displayedColumns: string[] = ['Name', 'Description', 'Timezone', 'In Use', 'Savings', '...'];

  filterText = '';
  sortField = '';
  sortOrder = 'asc';

  selectAll = false;

  //pages: number[] = [1, 2, 3];
  paginationInfo = new PaginationInfo();

  recordsPerPage = 10;
  currentPage: number = 1;
  totalPages: number = 1;
  startRecord = 0;
  endRecord = 0;
  totalRecords: number = 0;

  rowPerPageOptions = [3, 10, 20, 50, 100];

  subs = new Subscription();

  testData: SchedulesTableRow[] = require('../../mock-data/schedules-table-test-data.json');

  headers: TableHeader[] = [
    { description: 'Name', sortable: true, sortOrder: 'asc', sortField: 'schedule_name' },
    { description: 'Description', sortable: true, sortOrder: 'asc', sortField: 'schedule_description' },
    { description: 'Timezone', sortable: false, sortOrder: 'asc', sortField: 'timezone_name' },
    { description: 'In Use', sortable: false, sortOrder: 'asc', sortField: 'schedule_used' },
    { description: 'Savings', sortable: true, sortOrder: 'asc', sortField: 'schedule_saving' },
  ];

  // dataSource = this.data;
  dataSource = new MatTableDataSource< ScheduleApiResponse>();
  @ViewChild(MatSort) sort! : MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  constructor(
    private dialog: Dialog,
    private scheduleService: SchedulesService,
    private httpService: SchedulesHttpService,
    private catalogHttpService: CatalogHttpService,
    private router: Router,
    private toaster: NotifierService
  ) { }

  // manageSchedule() {
  //   // this.dialog.open(EditScheduleComponent);
  //   this.router.navigate(['/schedules' ,1]);
  
  // }

  deleteDialog() {
    this.dialog.open(DeleteScheduleComponent);
  
  }

  getSchedules(): void {
    const options = new ApiRequestOptions();
    options.pageNo = this.currentPage - 1;
    options.limit = this.recordsPerPage;
    options.filterText = this.filterText;
    options.sortBy = this.sortField;
    options.sortDirection = this.sortOrder;
    const sub = this.httpService.getSchedules(options).subscribe(res => {
      this.schedules = res.data;
      this.dataSource.data = res.data;
      this.dataSource.sort = this.sort;
      this.totalPages = res.total_pages;
      this.totalRecords = res.total_records;
      this.startRecord = (this.currentPage - 1) * this.recordsPerPage + 1;
      this.endRecord = (this.currentPage - 1) * this.recordsPerPage + this.schedules.length;
      this.paginationInfo = { recordsPerPage: this.recordsPerPage,  
        selectedPage: this.currentPage, totalPages: this.totalPages, totalRecords: this.totalRecords};
      this.data = this.schedules.map(item => {
        const row: SchedulesTableRow = {
          schedule: item.schedule,
          schedule_name: item.schedule_name,
          schedule_description: item.schedule_description,
          timezone: item.timezone,
          timezone_name: item.timezone_name,
          schedule_saving: item.schedule_saving,
          schedule_used: item.schedule_used,
          selected: false,
        };
        return row;
      });
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

  pageChange(event: any): void {
    this.currentPage = event.pageIndex + 1;
    this.recordsPerPage = event.pageSize;
    this.getSchedules();
  }

  changePageSize(): void {
    this.scheduleService.recordsPerPage = this.recordsPerPage;
    this.currentPage = 1;
    this.getSchedules();
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
      this.getSchedules();
    }
  }

  // addSchedule(): void {
  //   this.scheduleService.scheduleName = '';
  //   this.scheduleService.scheduleDescription = '';
  //   this.scheduleService.selectedTimezone = '0';
  //   const data: ModalDialogData = {
  //     title: 'Add a New Schedule',
  //     primaryButtonText: 'Save Schedule',
  //     secondaryButtonText: '',
  //     cancelButtonText: 'Cancel',
  //     portal: new ComponentPortal(AddScheduleComponent)
  //   };

  //   let isError = false;
  //   const sub = this.catalogHttpService.getTimezones().pipe(
  //     concatMap(res => {
  //       this.timezones = res.data;
  //       this.scheduleService.timezones = res.data;
  //       const dialogRef = this.dialog.open<ModalDialogResponseOptions>(ModalDialogComponent, {
  //         width: '800px',
  //         data: data,
  //       });
  //       return dialogRef.closed;
  //     }),
  //     mergeMap(result => {
  //       if (result === 'primary') {
  //         const newSchedule = new AddSchedule();
  //         newSchedule.schedule_description = this.scheduleService.scheduleDescription;
  //         newSchedule.schedule_name = this.scheduleService.scheduleName;
  //         newSchedule.timezone = +this.scheduleService.selectedTimezone;
  //         this.currentSchedule = this.scheduleService.scheduleName
  //         return this.httpService.addSchedule(newSchedule).pipe(
  //           catchError(err =>{
  //             isError=true;
  //             return of(err.error as ApiError);
  //           }),
  //         );
  //       } else {
  //         return of(null);
  //       }
  //     }),
  //     mergeMap(result => {
  //       if (isError) {
  //         data.dialogType = 'alert';
  //         data.primaryButtonText = 'CLOSE';
  //         data.secondaryButtonText = '';
  //         data.cancelButtonText = '';
  //         data.confirmTitle = 'ERROR';
  //         const error = result as ApiError;
  //         data.confirmMessage = error.message.join('\n');
  //         const finishDialog = this.dialog.open<ModalDialogResponseOptions>(ModalDialogComponent, {
  //           width: '800px',
  //           height: '800px',
  //           data: data,
  //         });
  //         return finishDialog.closed;
  //       }
  //       else if (result) {
  //         const validResult = result as ApiResponse<string>;
  //         this.scheduleId = +validResult.data;
  //         this.getSchedules();
  //         data.primaryButtonText = 'Edit Schedule';
  //         data.secondaryButtonText = 'Add New Schedule';
  //         data.cancelButtonText = 'CLOSE';
  //         // data.confirmTitle = 'Schedule successfully created!';
  //         // this.notifier.showSuccess('Company has been Updated Successfully', 'Update');
  //         // data.confirmMessage = `The schedule ${ this.currentSchedule } was successfully created.
  //         // <ul><li>To edit the timetable for your schedule you must edit the schedule.</li>
  //         // <li>Additionally, you can add a new schedule and edit the timetable later on.</li></ul>`;
  //         const finishDialog = this.dialog.open<ModalDialogResponseOptions>(ModalDialogComponent, {
  //           width: '800px',
  //           data: data,
  //         });
  //         return finishDialog.closed;
  //       } else {
  //         return of(null);
  //       }
  //     })
  //   ).subscribe(result => {
  //     if(!isError){
  //       if (result === 'primary') {
  //         this.router.navigate(['schedules/' + this.scheduleId]);
  //       }
  //       if (result === 'secondary') {
  //         this.addSchedule();
  //       }
  //     }
  //   });
  //   this.subs.add(sub);
  // }
  addSchedule(): void {
    this.scheduleService.scheduleName = '';
    this.scheduleService.scheduleDescription = '';
    this.scheduleService.selectedTimezone = '0';
    const data: ModalDialogData = {
      title: 'Add Schedule',
      primaryButtonText: 'Save',
      secondaryButtonText: '',
      cancelButtonText: 'Cancel',
      portal: new ComponentPortal(AddScheduleComponent)
    };

    let isError = false;
    const sub = this.catalogHttpService.getTimezones().pipe(
      concatMap(res => {
        this.timezones = res.data;
        this.scheduleService.timezones = res.data;
        const dialogRef = this.dialog.open<ModalDialogResponseOptions>(ModalDialogComponent, {
          width: '800px',
          data: data,
        });
        return dialogRef.closed;
      }),
      mergeMap(result => {
        if (result === 'primary') {
          const newSchedule = new AddSchedule();
          newSchedule.schedule_description = this.scheduleService.scheduleDescription;
          newSchedule.schedule_name = this.scheduleService.scheduleName;
          newSchedule.timezone = +this.scheduleService.selectedTimezone;
          this.currentSchedule = this.scheduleService.scheduleName
          return this.httpService.addSchedule(newSchedule).pipe(
            catchError(err =>{
              isError=true;
              return of(err.error as ApiError);
            },),
            
          );
        } else {
          return of(null);
        }
      }),
      mergeMap(result => {
        if (isError) {
          const error = result as ApiError;
          let finishDialog: any
          data.confirmMessage = error.message.join('\n');
          return finishDialog.closed;
        }
        else if (result) {
          const validResult = result as ApiResponse<string>;
          this.scheduleId = +validResult.data;
          this.getSchedules();
          data.primaryButtonText = 'Edit Schedule';
          data.secondaryButtonText = 'Add New Schedule';
          data.cancelButtonText = 'Close';
          const finishDialog = this.dialog.open<ModalDialogResponseOptions>(ModalDialogComponent, {
            width: '800px',
            data: data,
          });
          let confirmMessage = `The schedule ${ this.currentSchedule } was successfully created.`;
          // this.toaster.showSuccess('Success!', 'Schedule was successfully created!');
          this.toaster.showSuccess('Success!', confirmMessage);
          return finishDialog.closed;
        }
        else {
          return of(null);
        }
      })
    ).subscribe(result => {
      if(!isError){
        if (result === 'primary') {
          this.router.navigate(['schedules/' + this.scheduleId]);
        }
        if (result === 'secondary') {
          this.addSchedule();
        }
      }
    });
    this.subs.add(sub);
  }
  // removeSchedule(row: SchedulesTableRow): void {
  //   this.scheduleService.scheduleName = row.schedule_name;
  //   this.scheduleService.scheduleDescription = row.schedule_description;
  //   this.scheduleService.scheduleTimezoneName = row.timezone_name;
  //   this.scheduleService.step = 'first';

  //   const data: ModalDialogData = {
  //     title: 'Delete Live Schedule',
  //     primaryButtonText: 'Yes, Delete it',
  //     secondaryButtonText: '',
  //     cancelButtonText: 'cancel',
  //     portal: new ComponentPortal(DeleteScheduleComponent)
  //   };
  //   const dialogRef = this.dialog.open<ModalDialogResponseOptions>(ConfirmationDialogComponent, {
  //     width: '500px',
  //     data: data,
  //   });
  //   const sub = dialogRef.closed.pipe(
  //     mergeMap(result => {
  //       if (result) {
  //         return this.httpService.deleteSchedule(row.schedule);
  //       } else {
  //         return of(null);
  //       }
  //     }),
  //   ).subscribe();
  //   this.subs.add(sub);
  // }

  removeSchedule(row: SchedulesTableRow): void {
    this.scheduleService.scheduleName = row.schedule_name;
    this.scheduleService.scheduleDescription = row.schedule_description;
    this.scheduleService.scheduleTimezoneName = row.timezone_name;
    this.scheduleService.step = 'first';

    const data: ModalDialogData = {
      title: 'Delete Schedule',
      primaryButtonText: 'Confirm',
      secondaryButtonText: '',
      cancelButtonText: 'Close',
      portal: new ComponentPortal(DeleteScheduleComponent)
    };
    const dialogRef = this.dialog.open<ModalDialogResponseOptions>(ModalDialogComponent, {
      width: '800px',
      data: data,
    });
    const sub = dialogRef.closed.pipe(
      mergeMap(result => {
        if (result === 'primary') {
          return this.httpService.deleteSchedule(row.schedule);
        } else {
          return of(null);
        }
      }),
      mergeMap(result => {
        if (result) {
          this.scheduleService.step = 'second';
          this.scheduleId = +result.data;
          this.currentPage = 1;
          this.getSchedules();
          data.confirmTitle = 'Schedule successfully deleted!';
          data.confirmMessage = `Now all the associated instances are not being managed through automated schedules, to start saving money again associate them to a new schedule. `;
          let finishDialog: any;
          this.toaster.showSuccess(data.confirmTitle, data.confirmMessage);
          return finishDialog.closed;
        } else {
          return of(null);
        }
      })
    ).subscribe();
    this.subs.add(sub);
  }

  filterSchedule(filter: string): void {
    this.filterText = filter;
    this.currentPage = 1;
    this.getSchedules();
  }

  ngOnInit(): void {
    this.getSchedules();
    this.totalPages = Math.ceil(this.totalRecords / this.recordsPerPage);
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  sortData(sort: Sort) {
    let property = ((property: string) => {
       switch(property) {
        case 'Name': return 'schedule_name';
        case 'Description': return 'schedule_description';
        case 'Timezone': return 'timezone_name';
        case 'In Use': return 'schedule_used';
        case 'Savings': return 'schedule_saving';
         default: return property;
         }
        })(sort.active);
        this.dataSource.data = _.orderBy(this.dataSource.data, property, sort.direction || false); 
      }
      sortColumn(sortname: string) {
        const sort = this.sortOrder === 'asc' ? 'desc' : 'asc';
        this.sortField = sortname ?? '';
        this.sortOrder = sort;
        this.currentPage = 1;
        this.getSchedules();
        }
}
