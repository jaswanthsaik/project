import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { ApiRequestOptions } from 'src/app/models/api-request-options';
import { BreadcrumbsItem } from 'src/app/shared/models/breadcrumbs-item';
import { PaginationInfo } from 'src/app/shared/models/pagination-info';
import { TableHeader } from 'src/app/shared/models/table-header';
import { ResourceApiResponse } from '../../models/resource-api-response';
import { ResourcesHttpService } from '../../services/resources-http.service';
import { MatSort, Sort } from '@angular/material/sort';
import * as _ from 'lodash';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-resources-container',
  templateUrl: './resources-container.component.html',
  styleUrls: ['./resources-container.component.scss']
})
export class ResourcesContainerComponent implements OnInit {
  data: ResourceApiResponse[] = [];
  breadcrumbs: BreadcrumbsItem[] = [
    { label: 'Home', url: '/' },
    // { label: '', url: '' },
    { label: 'Cloud & Resources: Resources', url: '' },
  ];
  displayedColumns: string[] = ['Resource Name', 'Account', 'Subscription', 'Provider', 'Size', 'Location',
  'Resource Type'];
 columnsToDisplay: string[] = this.displayedColumns.slice();

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

  headers: TableHeader[] = [
    { description: 'Resource Name', sortable: true, sortOrder: 'asc', sorted: true, sortField: 'resource_name' },
    { description: 'Account', sortable: false, sortOrder: 'asc' },
    { description: 'Subscription', sortable: true, sortOrder: 'asc', sortField: 'subscription_name' },
    { description: 'Provider', sortable: false, sortOrder: 'asc' },
    { description: 'Size', sortable: true, sortOrder: 'asc', sortField: 'resource_size' },
    { description: 'Location', sortable: true, sortOrder: 'asc', sortField: 'location_name' },
    { description: 'Resource Type', sortable: true, sortOrder: 'asc', sortField: 'resource_type_name' },
  ];

  dataSource = new MatTableDataSource<ResourceApiResponse>();
  @ViewChild(MatSort) sort! : MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  constructor(
    private httpService: ResourcesHttpService
  ) { }

  getResources(): void {
    const options = new ApiRequestOptions();
    options.pageNo = this.currentPage - 1;
    options.limit = this.recordsPerPage;
    options.filterText = this.filterText;
    options.sortBy = this.sortField;
    options.sortDirection = this.sortOrder;
    const sub = this.httpService.getResources(options).subscribe(res => {
      this.data = res.data;
      this.dataSource.data = res.data;
      this.dataSource.sort = this.sort;
      this.totalPages = res.total_pages;
      this.totalRecords = res.total_records;
      this.startRecord = (this.currentPage - 1) * this.recordsPerPage + 1;
      this.endRecord = (this.currentPage - 1) * this.recordsPerPage + this.data.length;
      this.paginationInfo = { recordsPerPage: this.recordsPerPage,  
        selectedPage: this.currentPage, totalPages: this.totalPages, totalRecords: this.totalRecords};
    });
    this.subs.add(sub);
  }



  changePageSize(): void {
    this.currentPage = 1;
    this.getResources();
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
      this.getResources();
    }
  }

  filterResource(filter: string): void {
    this.filterText = filter;
    this.currentPage = 1;
    this.getResources();
  }

  ngOnInit(): void {
    this.getResources();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  sortData(sort: Sort) {
    let property = ((property: string) => {
       switch(property) {
        case 'Resource Name': return 'resource_name';
        case 'Account': return 'account_name';
        case 'Subscription': return 'subscription_name';
        case 'Provider': return 'provider_name';
        case 'Size': return 'resource_size';
        case 'Location': return 'location_name';
        case 'Resource Type': return 'resource_type_name';
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
        this.getResources();
      }
      pageChange(event: any): void {
        this.currentPage = event.pageIndex + 1;
        this.recordsPerPage = event.pageSize;
        this.getResources();
      }
}
