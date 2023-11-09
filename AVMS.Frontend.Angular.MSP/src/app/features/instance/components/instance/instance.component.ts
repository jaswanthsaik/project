import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, take } from 'rxjs';
import { ApiRequestOptions } from 'src/app/models/api-request-options';
import { BreadcrumbsItem } from 'src/app/shared/models/breadcrumbs-item';
import { PaginationInfo } from 'src/app/shared/models/pagination-info';
import { TableHeader } from 'src/app/shared/models/table-header';
import { CatalogHttpService } from 'src/app/shared/services/catalog-http.service';
import { ActionLogApiResponse } from '../../models/action-log-api-response';
import { AzureTag, InstanceApiResponse } from '../../models/instance-api-response';
import { InstanceHttpService } from '../../services/instance-http.service';

@Component({
  selector: 'app-instance',
  templateUrl: './instance.component.html',
  styleUrls: ['./instance.component.scss']
})
export class InstanceComponent implements OnInit, OnDestroy {
  data: ActionLogApiResponse[] = [];
  instanceId = 0;
  instance?: InstanceApiResponse;
  breadcrumbs: BreadcrumbsItem[] = [
    { label: 'Home', url: '/' },
    { label: 'Accounts', url: '/accounts' },
    { label: 'Account', url: '' },
    { label: 'Tenant', url: '' },
    { label: 'Subscription', url: '' },
    { label: 'Resource Group', url: '' },
    { label: 'Instance', url: '' },
  ];
  
  filterText = '';
  sortField = 'utc_executed_date_time';
  sortOrder = 'desc';

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

  rowPerPageOptions = [10, 20, 50, 100, 500];

  subs = new Subscription();

  headers: TableHeader[] = [
    { description: 'Date Time', sortable: true, sortOrder: 'desc', sorted: true, sortField: 'utc_executed_date_time' },
    { description: 'Action Log', sortable: true, sortOrder: 'asc', sorted: false, sortField: 'action' },
  ];


  constructor(
    private httpService: InstanceHttpService,
    private catalogHttpService: CatalogHttpService,
    private route: ActivatedRoute
  ) { }

  getInstanceComplete(): void {
    const sub = this.httpService.getInstanceComplete(this.instanceId).subscribe(res => {
      this.instance = res.data;
      this.getLogs();
    });
    this.subs.add(sub);
  }

  getRoute(): void {
    const sub = this.catalogHttpService.getRouteByInstance(this.instanceId).subscribe(res => {
      this.breadcrumbs[6] = { label: res.data.instance_name, url: `` };
      this.breadcrumbs[5] = { label: res.data.resource_group_name, url: `/accounts/resourceGroup/${res.data.resource_group}` };
      this.breadcrumbs[4] = { label: res.data.subscription_name, url: `/accounts/subscription/${res.data.subscription}` };
      this.breadcrumbs[3] = { label: res.data.tenant_name, url: `` };
      this.breadcrumbs[2] = { label: res.data.account_name ?? 'Account', url: `/accounts/${res.data.account}` };
    });
    this.subs.add(sub);
  }

  getLogs(): void {
    const options = new ApiRequestOptions();
    options.pageNo = this.currentPage - 1;
    options.limit = this.recordsPerPage;
    options.filterText = this.filterText;
    options.sortBy = this.sortField;
    options.sortDirection = this.sortOrder;
    const sub = this.httpService.getActionLogs(this.instanceId, options).subscribe(res => {
      this.data = res.data;
      this.totalPages = res.total_pages;
      this.totalRecords = res.total_records;
      this.startRecord = (this.currentPage - 1) * this.recordsPerPage + 1;
      this.endRecord = (this.currentPage - 1) * this.recordsPerPage + this.data.length;
    });
    this.subs.add(sub);
  }

  formatTags(tags: AzureTag[]): string {
    return tags.map(tag => `${tag.tag_name}: ${tag.tag_value}`).join(', ');
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
      this.getLogs();
    }
  }

  filterLog(filter: string): void {
    this.filterText = filter;
    this.currentPage = 1;
    this.getLogs();
  }

  ngOnInit(): void {
    this.instanceId = +(this.route.snapshot.paramMap.get('id') || '0');
    this.getRoute();
    this.getInstanceComplete();

  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  pageChange(event: any): void {
    this.currentPage = event.pageIndex + 1;
    this.recordsPerPage = event.pageSize;
    this.getLogs();
  }
}
