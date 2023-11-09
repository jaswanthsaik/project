import { Component, Input, OnInit } from '@angular/core';
import { BreadcrumbsItem } from '../../models/breadcrumbs-item';

@Component({
  selector: 'app-avms-breadcrumbs',
  templateUrl: './avms-breadcrumbs.component.html',
  styleUrls: ['./avms-breadcrumbs.component.scss']
})
export class AvmsBreadcrumbsComponent implements OnInit {
  @Input() breadcrumbs: BreadcrumbsItem[] = [];

  constructor() { }

  ngOnInit(): void {
  }

}
