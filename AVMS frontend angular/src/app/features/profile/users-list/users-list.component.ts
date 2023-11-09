import { Dialog } from '@angular/cdk/dialog';
import { ComponentPortal } from '@angular/cdk/portal';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import { catchError, combineLatest, forkJoin, map, mergeMap, Observable, of, repeat, Subscription, timer } from 'rxjs';
import { ApiError } from 'src/app/models/api-error';
import { ApiRequestOptions } from 'src/app/models/api-request-options';
import { ApiResponse } from 'src/app/models/api-response';
import { ConfirmationDialogComponent } from 'src/app/shared/components/dialogs/confirmation-dialog/confirmation-dialog.component';
import { ModalDialogComponent } from 'src/app/shared/components/dialogs/modal-dialog/modal-dialog.component';
import { ConfirmationDialogData } from 'src/app/shared/components/dialogs/models/confirmation-dialog-data';
import { ModalDialogData } from 'src/app/shared/components/dialogs/models/modal-dialog-data';
import { ModalDialogResponseOptions } from 'src/app/shared/components/dialogs/models/modal-dialog-reponse-options';
import { BreadcrumbsItem } from 'src/app/shared/models/breadcrumbs-item';
import { PaginationInfo } from 'src/app/shared/models/pagination-info';
import { TableHeader } from 'src/app/shared/models/table-header';
import { CatalogHttpService } from 'src/app/shared/services/catalog-http.service';
import { CountryHttpService } from 'src/app/shared/services/country-http.service';
import { NotifierService } from 'src/app/shared/services/notifier.service';
import { DeleteScheduleComponent } from '../../schedules/components/delete-schedule/delete-schedule.component';
import { AddUserComponent } from '../add-user/add-user.component';
import { DeleteUserComponent } from '../delete-user/delete-user.component';
import { EditUserComponent } from '../edit-user/edit-user.component';
import { User } from '../models/user';
import { UserDetails } from '../models/userDetails';
import { UserService } from '../user.service';


@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit {
  data: User[] = [];

  breadcrumbs: BreadcrumbsItem[] = [
    { label: 'Home', url: '/' },
    { label: 'User Management', url: '' },
  ];
  displayedColumns: string[] = ['First Name', 'Last Name', 'Email Address', 'Timezone', '...'];
 columnsToDisplay: string[] = this.displayedColumns.slice();

  selectAll = false;

  paginationInfo = new PaginationInfo();
  pages: number[] = [1, 2];
  showRandomPage = false;
  selectedPage = 1;
  lastPage = 5;

  rowPerPageOptions = [10, 20, 50, 100];

  subs = new Subscription();
  filterText: string = "";
  currentPage: number = 1;
  recordsPerPage: number = 10;
  sortField: string = '';
  sortOrder: string = 'asc';
  totalPages: number = 1;
  startRecord = 0;
  endRecord = 0;
  totalRecords: number = 0;
  dataSource = new MatTableDataSource< User>();
  @ViewChild(MatSort) sort! : MatSort;
  
  headers: TableHeader[] = [
    { description: 'First Name', sortable: true, sortOrder: 'asc', sortField: 'first_name', sorted: true },
    { description: 'Last Name', sortable: true, sortOrder: 'asc', sortField: 'last_name', sorted: false },
    { description: 'Email Address', sortable: true, sortOrder: 'asc', sortField: 'email', sorted: false },
    { description: 'Timezone', sortable: false, sortOrder: 'asc', sortField: 'timezone_name', sorted: false },
    // { description: 'Role', sortable: true, sortOrder: 'asc' },
  ];

  constructor(
    private dialog: Dialog,
    private userService: UserService,
    private catalogHttpService: CatalogHttpService,
    private countryHttpService: CountryHttpService,
    private toaster: NotifierService,
    private router: Router
  ) { }

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
      this.getUsers().subscribe(res => {
        this.getUsersCallback(res);
      });
    }
  }

  pageChange(page: number): void {
    this.currentPage = page;
    this.getUsers().subscribe(usersData => {
      this.getUsersCallback(usersData);
    })
  }

  changePageSize(): void {
    this.userService.recordsPerPage = this.recordsPerPage;
    this.currentPage = 1;
    this.getUsers().subscribe(usersData => {
      this.getUsersCallback(usersData);
    })
  }

  addUser(retry = false): void {
    if (!retry) {
      this.userService.userProfile.first_name = '';
      this.userService.userProfile.last_name = '';
      this.userService.userProfile.email = '';
      this.userService.userProfile.role_name = '';
      this.userService.userProfile.country = 0;
      this.userService.userProfile.country_name = "";
      this.userService.userProfile.timezone = 0;
      this.userService.userProfile.timezone_name = '';
    }
    const data: ModalDialogData = {
      title: 'Add User',
      primaryButtonText: 'Save User',
      secondaryButtonText: '',
      cancelButtonText: 'Cancel',
      portal: new ComponentPortal(AddUserComponent)
    };
    const dialogRef = this.dialog.open<ModalDialogResponseOptions>(ModalDialogComponent, {
      width: '900px',
      data: data,
    });

    let isError = false;
    const sub = dialogRef.closed.pipe(
      mergeMap(result => {
        if (result === 'primary') {
          if (this.userService.userProfile.first_name != "" &&
            this.userService.userProfile.last_name != "" &&
            this.userService.userProfile.email != "" &&
            this.userService.userProfile.company_name != "" &&
            this.userService.userProfile.timezone_name != "" &&
            this.userService.userProfile.password != ""/*&&
              this.userService.userProfile.role_name != ""*/
          ) {
            return this.userService.addUser().pipe(
              catchError(err => {
                isError=true;
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
          this.toaster.showError('error', error.message.join('\n'));
          return finishDialog;
        } else if (result) {
          data.confirmMessage = 'The user ' + this.userService.userProfile.first_name + ' ' + this.userService.userProfile.last_name + ' was successfully created!.';
          let finishDialog: any
          this.getUsers().subscribe(result => { this.getUsersCallback(result) });
          this.toaster.showSuccess('Success!', data.confirmMessage);
          return finishDialog;
        } else {
          return of(null);
        }
      })
    ).subscribe(result => {
    });
    this.subs.add(sub);
  }

  filter(value: string): void {
    this.filterText = value;
    this.currentPage = 1;
    this.getUsers().subscribe(usersData => {
      this.getUsersCallback(usersData);
    });
  }

  // editUser(){
  // this.dialog.open(EditUserComponent);
  // };

  editUser(row: User): void {
    this.userService.getUserDetail(row.user).subscribe(result => {
      this.editUserCallback(row, result.data);
    })
  }

  editUserCallback(row: User, userDetail: UserDetails): void {
    this.userService.userProfile.first_name = row.first_name;
    this.userService.userProfile.last_name = row.last_name;
    this.userService.userProfile.email = row.email;
    this.userService.userProfile.role_name = row.role_name;
    this.userService.userProfile.timezone = userDetail.timezone;
    this.userService.userProfile.timezone_name = row.timezone_name;
    this.userService.userProfile.user = row.user;
    this.userService.userProfile.country = userDetail.country;
    this.userService.userProfile.avatar = userDetail.avatar;
    const data: ModalDialogData = {
      title: 'Edit User',
      primaryButtonText: 'Save User',
      secondaryButtonText: '',
      cancelButtonText: 'Cancel',
      portal: new ComponentPortal(EditUserComponent)
    };
    const dialogRef = this.dialog.open<ModalDialogResponseOptions>(ModalDialogComponent, {
      width: '900px',
      data: data,
    });

    let isError = false;
    const sub = dialogRef.closed.pipe(
      mergeMap(result => {
        if (result === 'primary') {
          if (this.userService.userProfile.first_name != "" &&
            this.userService.userProfile.last_name != "" &&
            this.userService.userProfile.email != "" &&
            this.userService.userProfile.company_name != "" &&
            this.userService.userProfile.timezone_name != "" &&
            this.userService.userProfile.role_name != ""
          ) {
            row.first_name = this.userService.userProfile.first_name;
            row.last_name = this.userService.userProfile.last_name;
            row.email = this.userService.userProfile.email;
            row.role_name = this.userService.userProfile.role_name;
            row.timezone = this.userService.userProfile.timezone;
            row.timezone_name = this.userService.userProfile.timezone_name;
            return this.userService.editUser().pipe(
              catchError(err =>{
                isError=true;
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
          this.toaster.showError('error', error.message.join('\n'));
          return finishDialog;
        } else if (result) {
          data.confirmMessage = 'The user ' + this.userService.userProfile.first_name + ' ' + this.userService.userProfile.last_name + ' was successfully updated.';
          let finishDialog: any
          this.toaster.showSuccess('Success!', data.confirmMessage);
          return finishDialog;
        } else {
          return of(null);
        }
      })
    ).subscribe(result => {
      if (result === 'secondary') {
        this.addUser();
      }
    });
    this.subs.add(sub);
  }

  deleteUser(row: User): void {
    this.userService.getUserDetail(row.user).subscribe(result => {
      this.deleteUserCallback(row, result.data);
    })
  }

  deleteUserCallback(row: User, userDetail: UserDetails): void {
    this.userService.userProfile.first_name = row.first_name;
    this.userService.userProfile.last_name = row.last_name;
    this.userService.userProfile.email = row.email;
    this.userService.userProfile.role_name = row.role_name;
    this.userService.userProfile.timezone = row.timezone;
    this.userService.userProfile.timezone_name = row.timezone_name;
    this.userService.userProfile.country = userDetail.country;
    this.userService.userProfile.user = userDetail.user;
    this.userService.userProfile.country_name = this.userService.countryOptions.find(p => p.country === userDetail.country)?.country_name;
    const data: ConfirmationDialogData = {
      title: 'Delete User',
      primaryButtonText: 'Yes, Delete it',
      secondaryButtonText: '',
      cancelButtonText: 'Cancel',
      portal: new ComponentPortal(DeleteUserComponent)
    };
    const dialogRef = this.dialog.open<ModalDialogResponseOptions>(ConfirmationDialogComponent, {
      width: '500px',
      data: data,
    });

    const sub = dialogRef.closed.pipe(
      mergeMap(result => {
        if (result === 'primary') {
          return this.userService.deleteUser();
        }

        return of(null)
      }),
      mergeMap(result => {
        if (result) {
          let finishDialog: any
          data.confirmMessage = 'The user ' + this.userService.userProfile.first_name + ' ' + this.userService.userProfile.last_name + ' was successfully deleted.';
          this.toaster.showSuccess('Success!', data.confirmMessage);
          if (this.startRecord === this.endRecord && this.currentPage > 1) {
            this.currentPage--;
          }
          this.getUsers().subscribe(res => this.getUsersCallback(res));
          return finishDialog;
        } else {
          return of(null);
        }
      })
    ).subscribe(result => {
      if (result) {
        this.getUsers().subscribe(res => this.getUsersCallback(res));
      }
    });
    this.subs.add(sub);
  }

  private getUsers(): Observable<ApiResponse<User[]>> {
    const options = new ApiRequestOptions();
    options.pageNo = this.currentPage - 1;
    options.limit = this.recordsPerPage;
    options.filterText = this.filterText;
    options.sortBy = this.sortField;
    options.sortDirection = this.sortOrder;
    return this.userService.getUsers(options);
  }

  private getUsersCallback(result: ApiResponse<User[]>) {

    this.totalPages = result.total_pages;
    this.totalRecords = result.total_records;
    this.startRecord = (this.currentPage - 1) * this.recordsPerPage + 1;
    this.endRecord = (this.currentPage - 1) * this.recordsPerPage + result.data.length;
    this.paginationInfo = {
      recordsPerPage: this.recordsPerPage,
      selectedPage: this.currentPage, totalPages: this.totalPages, totalRecords: this.totalRecords
    };
    this.data = result.data;
    this.dataSource.data = result.data;
    this.dataSource.sort = this.sort;

    this.getMyProfile();
  }

  private getMyProfile() {
    this.userService.getMyProfile().subscribe(result => {
      const itemFound = this.data.find(p => p.email === result.data.email);
      if (itemFound) {
        itemFound.isMyUser = true;
      }
    });
  }

  ngOnInit(): void {
    let getTimeZones$ = this.catalogHttpService.getTimezones();
    let getCountries$ = this.countryHttpService.getCountries();
    let getUsers$ = this.getUsers();

    combineLatest([getTimeZones$, getCountries$, getUsers$]).pipe(
      map(([timezones, countries, users]) => ({ timezones, countries, users }))
    ).subscribe(results => {
      this.userService.timezoneOptions = this.userService.timezoneOptions.concat(results.timezones.data);
      this.userService.countryOptions = this.userService.countryOptions.concat(results.countries.data);
      this.getUsersCallback(results.users);
    });
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  sortData(sort: Sort) {
    let property = ((property: string) => {
       switch(property) {
        case 'First Name': return 'first_name';
        case 'Last Name': return 'last_name';
        case 'Email Address': return 'email';
        case 'Timezone': return 'timezone_name';
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
        this.getUsers().subscribe(res => {
          this.getUsersCallback(res);
        });
        }
}
