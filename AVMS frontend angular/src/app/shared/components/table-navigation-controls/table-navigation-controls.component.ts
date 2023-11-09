import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { PaginationInfo } from '../../models/pagination-info';

@Component({
  selector: 'app-table-navigation-controls',
  templateUrl: './table-navigation-controls.component.html',
  styleUrls: ['./table-navigation-controls.component.scss']
})
export class TableNavigationControlsComponent implements OnInit, OnChanges {
  @Input() paginationInfo = new PaginationInfo();
  @Output() pageChange = new EventEmitter<number>();

  pages: number[] = [];
  lastPage: number = 0;
  selectedPage: number = 0;
  recordsPerPage = 0;

  constructor() { }

  gotoPage(page: number): void {
    if (page <= 0 || page > (this.lastPage ?? Infinity)) {
      return;
    }
    this.pageChange.emit(page);
    this.selectedPage = page;
  }

  update(): void {
    this.pages = [];
    if (this.paginationInfo.totalPages === 0) {
      return
    }
    this.pages = this.pages.filter(p => p <= this.paginationInfo.totalPages);
    if (this.recordsPerPage !== this.paginationInfo.recordsPerPage) {
      this.recordsPerPage = this.paginationInfo.recordsPerPage;
    }
    this.selectedPage = this.paginationInfo.selectedPage;
    if (this.selectedPage === 0) {
      return;
    }
    this.lastPage = this.paginationInfo.totalPages;
    if (this.pages.length > 0 && this.pages.includes(this.selectedPage)) {
      if (!this.pages.includes(this.lastPage)) {
        this.pages.push(this.lastPage);
      }
      return;
    }

    this.pages = [1];
    if (this.selectedPage > 1) {
      this.pages.push(this.selectedPage);
    }
    if (this.selectedPage < this.lastPage - 1) {
      this.pages.push(this.selectedPage + 1);
      if (this.selectedPage === 1) {
        this.pages.push(this.selectedPage + 2);
      }
    } else if (this.selectedPage === this.lastPage - 1 && this.selectedPage !== 1) {
      this.pages.splice(this.pages.length - 1, 0, this.selectedPage - 1);
    }
    if (!this.pages.includes(this.lastPage)) {
      this.pages.push(this.lastPage);
    }
  }

  ngOnInit(): void {
    this.recordsPerPage = this.paginationInfo.recordsPerPage;
    this.update();
  }

  ngOnChanges(): void {
    this.update();
  }

}
