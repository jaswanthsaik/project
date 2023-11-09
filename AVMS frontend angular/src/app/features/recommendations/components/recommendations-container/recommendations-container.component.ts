import { Dialog } from '@angular/cdk/dialog';
import { ComponentPortal } from '@angular/cdk/portal';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';
import { Subscription } from 'rxjs';
import { AzureSubscription } from 'src/app/features/accounts/models/azure-subscription';
import { ApiRequestOptions } from 'src/app/models/api-request-options';
import { ModalDialogComponent } from 'src/app/shared/components/dialogs/modal-dialog/modal-dialog.component';
import { ModalDialogData } from 'src/app/shared/components/dialogs/models/modal-dialog-data';
import { ModalDialogResponseOptions } from 'src/app/shared/components/dialogs/models/modal-dialog-reponse-options';
import { BreadcrumbsItem } from 'src/app/shared/models/breadcrumbs-item';
import { PaginationInfo } from 'src/app/shared/models/pagination-info';
import { TableHeader } from 'src/app/shared/models/table-header';
import { NotifierService } from 'src/app/shared/services/notifier.service';
import { Categories } from '../../models/categories';
import { Impact } from '../../models/impact';
import { recommendationsApiResponse, recommendationsApiResponseDetails } from '../../models/recommendations-api-response';
import { recommendationsTableRow } from '../../models/recommendations-table-row';
import { ResourceType } from '../../models/resource-type';
import { recommendationsHttpService } from '../../service/recommendations-http.service';
import { recommendationsService } from '../../service/recommendations.service';
import { RecommendationDetailComponent } from '../recommendations-popup/recommendations-popup.component';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-recommendations-container',
  templateUrl: './recommendations-container.component.html',
  styleUrls: ['./recommendations-container.component.scss']
})
export class recommendationsContainerComponent implements OnInit, OnDestroy {
  recommendations: recommendationsApiResponse[] = [];
  breadcrumbs: BreadcrumbsItem[] = [
    { label: 'Home', url: '/' },
    { label: 'Recommendations', url: ''},
  ];
  displayedColumns: string[] = ['Resource Name', 'Subscription', 'Resource Group', 'Resource Type', 'Category', 'Impact', '...'];
  searchColumns: string[] = [
    'resource_name-search',
    'subscription-search',
    'resource_group-search',
    'resource_type-search',
    'category-search',
    'impact-search',
    'actions-search'
  ];
  
  recommendationsDetail: recommendationsApiResponseDetails = {
    risk_name: '',
    problem: '',
    solution: '',
    action_detail: '',
    potential_benefit: '',
    recommendation: '',
    resource_name: '',
    resource_group_name: '',
    subscription_name: '',
    recommendation_category: 0,
    recommendation_category_name: '',
    recommendation_impact: 0,
    recommendation_impact_name: '',
    action_type: '',
    action: ''
  };
  data: recommendationsTableRow[] = [];

  filterText = '';
  sortField = '';
  sortOrder = 'asc';

  selectAll = false;
  filterval : boolean = false;
  resourcevalue : boolean = false;

  paginationInfo = new PaginationInfo();
  selectedPage = 1;
  lastPage = 0;

  recordsPerPage = 100;
  currentPage: number = 1;
  totalPages: number = 1;
  startRecord = 0;
  endRecord = 0;
  totalRecords: number = 0;

  rowPerPageOptions = [10, 20, 50, 100];
  selectedResource:any;
  selectedResourceId = 0;
  selectedImpact: any;
  selectedImpactId = 0;
  selectedCategory:any;
  selectedCategoryId = 0;
  subscriptions: AzureSubscription[] = [];

  categories: Categories[] = [];
  categoryLookup = [{ id: 0, description: 'Select' }];
  resourceType: ResourceType[] = [];
  resourceLookup = [{ id: 0, description: 'Select' }];
  impact: Impact[] = [];
  impactLookup = [{ id: 0, description: 'Select' }];
  subs = new Subscription();
  resource_name = '';
  subscription_name = '';
  resource_group_name = '';

  headers: TableHeader[] = [
    { description: 'Resource Name', sortable: true, sortOrder: 'asc', sortField: 'resource_name' },
    { description: 'Subscription', sortable: true, sortOrder: 'asc', sortField: 'subscription_name'},
    { description: 'Category', sortable: true, sortOrder: 'asc', sortField: 'recommendation_category' },
    { description: 'Impact', sortable: true, sortOrder: 'asc', sortField: 'recommendation_impact' },
    { description: 'Action Type', sortable: true, sortOrder: 'asc', sortField: 'action_type' },
  ];
  
  dataSource = new MatTableDataSource<recommendationsApiResponse>();
  @ViewChild(MatSort) sort! : MatSort;
  
  constructor(
    private dialog: Dialog,
    private recommendationsService: recommendationsService,
    private httpService: recommendationsHttpService,
    private route: ActivatedRoute,
    private toaster: NotifierService,
    private spinner: NgxSpinnerService
  ) { }

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
      this.getrecommendations();
    }
  }

  getrecommendations(): void {
    const options = new ApiRequestOptions();
    options.pageNo = this.currentPage - 1;
    options.limit = this.recordsPerPage;
    options.filterText = this.filterText;
    options.sortBy = this.sortField;
    options.sortDirection = this.sortOrder;
    options.resourceName = this.resource_name;
    options.subscriptionName = this.subscription_name;
    options.resourceGroup = this.resource_group_name;
    options.resourceType = this.selectedResourceId;
    options.recommendationCategory = this.selectedCategoryId;
    options.recommendationImpact = this.selectedImpactId;
    this.spinner.show();
    this.httpService.getRecommendations(options)?.subscribe(res => {
      this.recommendations = res?.data || [];
      this.dataSource.data = res?.data || [];
      // this.dataSource.sort = this.sort;
      this.spinner.hide();
      this.totalPages = res?.total_pages || 0;
      this.totalRecords = res?.total_records || 0;
      this.startRecord = (this.currentPage - 1) * this.recordsPerPage + 1;
      this.endRecord = (this.currentPage - 1) * this.recordsPerPage + this.recommendations.length;
      this.paginationInfo = { recordsPerPage: this.recordsPerPage,  
        selectedPage: this.currentPage, totalPages: this.totalPages, totalRecords: this.totalRecords};
      this.data = this.recommendations?.map(item => {
        const row: recommendationsTableRow = {
          recommendation: item.recommendation,
          resource_name: item.resource_name,
          resource_group_name: item.resource_group_name,
          subscription_name: item.subscription_name,
          recommendation_category: item.recommendation_category,
          recommendation_category_name: item.recommendation_category_name,
          recommendation_impact: item.recommendation_impact,
          recommendation_impact_name: item.recommendation_impact_name,
          recommendation_problem: item.recommendation_problem,
          recommendation_solution: item.recommendation_solution,
          action_type: item.action_type,
          action: item.action
        };
        return row;
      });
    });
  }

  export(): void {
    const options = new ApiRequestOptions();
    options.pageNo = this.currentPage - 1;
    options.limit = this.recordsPerPage;
    options.filterText = this.filterText;
    options.sortBy = this.sortField;
    options.sortDirection = this.sortOrder;
    options.resourceName = this.resource_name;
    options.subscriptionName = this.subscription_name;
    options.resourceGroup = this.resource_group_name;
    options.resourceType = this.selectedResourceId;
    options.recommendationCategory = this.selectedCategoryId;
    options.recommendationImpact = this.selectedImpactId;
    let report$ = this.httpService.getRecommendationsExport(options, this.filterText);
    report$.subscribe(response => {
      const downloadLink = document.createElement('a');
      if (response.body) {
        downloadLink.href = URL.createObjectURL(new Blob([response.body], { type: response.body.type }));
        const contentDisposition = response.headers.get('content-disposition');
        const fileName = contentDisposition!.split(';')[1].split('filename')[1].split('=')[1].trim();
        downloadLink.download = fileName;
        downloadLink.click();
        this.toaster.showSuccess('Success!', 'Recommendations has been Sucessfully downloaded.');
      }
    });
  }

  pageChange(page: number): void {
    this.currentPage = page;
    this.getrecommendations();
  }

  changePageSize(): void {
    this.httpService.recordsPerPage = this.recordsPerPage;
    this.currentPage = 1;
    this.getrecommendations();
  }

  //TODO: Refactor this function
  openRecommendations(row: recommendationsApiResponse | string): void {
    let id = '';
    if (typeof row === 'string') {
      id = row;
    } else {
      id = row.recommendation;
    }

    this.httpService.getDetailsRecommendations(id).subscribe(res => {
      const response = res.data;
      this.recommendationsService.recommendationModel.recommendation = /^\s*$/.test(response.recommendation) ? this.recommendationsService.recommendationModel.recommendation : response.recommendation;
      this.recommendationsService.recommendationModel.resource_name = /^\s*$/.test(response.resource_name) ? this.recommendationsService.recommendationModel.resource_name : response.resource_name;
      this.recommendationsService.recommendationModel.resource_group_name = /^\s*$/.test(response.resource_group_name) ? this.recommendationsService.recommendationModel.resource_group_name : response.resource_group_name;
      this.recommendationsService.recommendationModel.subscription_name = /^\s*$/.test(response.subscription_name) ? this.recommendationsService.recommendationModel.subscription_name : response.subscription_name;
      this.recommendationsService.recommendationModel.recommendation_category_name = /^\s*$/.test(response.recommendation_category_name) ? this.recommendationsService.recommendationModel.recommendation_category_name : response.recommendation_category_name;
      this.recommendationsService.recommendationModel.recommendation_impact_name = /^\s*$/.test(response.recommendation_impact_name) ? this.recommendationsService.recommendationModel.recommendation_impact_name : response.recommendation_impact_name;
      this.recommendationsService.recommendationModel.action_type = /^\s*$/.test(response.action_type) ? this.recommendationsService.recommendationModel.action_type : response.action_type;
      this.recommendationsService.recommendationModel.action = /^\s*$/.test(response.action) ? this.recommendationsService.recommendationModel.action : response.action;
      this.recommendationsService.recommendationModel.problem = /^\s*$/.test(response.problem) ? this.recommendationsService.recommendationModel.problem : response.problem;
      this.recommendationsService.recommendationModel.solution = /^\s*$/.test(response.solution) ? this.recommendationsService.recommendationModel.solution : response.solution;
      this.recommendationsService.recommendationModel.risk_name = /^\s*$/.test(response.risk_name) ? this.recommendationsService.recommendationModel.risk_name : response.risk_name;
      this.recommendationsService.recommendationModel.action_detail = /^\s*$/.test(response.action_detail) ? this.recommendationsService.recommendationModel.action_detail : response.action_detail;
      this.recommendationsService.recommendationModel.potential_benefit = /^\s*$/.test(response.potential_benefit) ? this.recommendationsService.recommendationModel.potential_benefit : response.potential_benefit;
      const data: ModalDialogData = {
        title: 'Details',
        primaryButtonText: 'Close',
        secondaryButtonText: '',
        cancelButtonText: '',
        portal: new ComponentPortal(RecommendationDetailComponent)
      };
      const dialogRef = this.dialog.open<ModalDialogResponseOptions>(ModalDialogComponent, {
        width: '430px',
        data: data,
      });

      return dialogRef.closed;
    });

  }

  filter(value: string): void {
    this.filterText = value;
    this.currentPage = 1;
    this.getrecommendations();
  }

  ngOnInit(): void {
    const recommendationId = this.route.snapshot.paramMap.get('id') || '0';
    this.getrecommendations();
    this.getImpactType();
    this.getCategoryType();
    this.getResourceType();
    //this.openRecommendations(recommendationId);
    if (!this.selectedResource && this.resourceLookup.length > 0) {
      this.selectedResource = this.resourceLookup[0].id;
    };
    if (!this.selectedCategory && this.categoryLookup.length > 0) {
      this.selectedCategory = this.categoryLookup[0].id;
    };
    if (!this.selectedImpact && this.impactLookup.length > 0) {
      this.selectedImpact = this.impactLookup[0].id;
    };
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  sortData(sort: Sort) {
    let property = ((property: string) => {
       switch(property) {
        case 'Resource Name': return 'resource_name';
        case 'Subscription': return 'subscription_name';
        case 'Resource Type': return 'resource_type_name'
        case 'Category': return 'recommendation_category_name';
        case 'Impact': return 'recommendation_impact_name';
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
      this.getrecommendations();
      }

  impactSelected(impact: any) {
    this.currentPage = 1;
    this.selectedImpact = impact.value;
    let data: any = this.impactLookup.find(i=> i.description === impact.value)
    this.selectedImpactId = data.id;
    this.getrecommendations();
  }
  categorySelected(category: any): void {
    this.currentPage = 1;
    this.selectedCategory = category.value;
    let data: any = this.categoryLookup.find(i=> i.description === category.value)
    this.selectedCategoryId = data.id;
    this.getrecommendations();
  }
  resourceSelected(resourceType: any): void {
    this.currentPage = 1;
    this.selectedResource = resourceType.value;
    let data: any = this.resourceLookup.find(i=> i.description === resourceType.value)
    this.selectedResourceId = data.id;
    this.getrecommendations();
  }

  getImpactType(): void {
    const sub = this.httpService.getRecommendationImpact().subscribe(res => {
      this.impact = res.data;
      const lookup = this.impact.map(recommendations => {
        return { id: recommendations.recommendation_impact_id, description: recommendations.recommendation_impact_name };
      });
      this.impactLookup = [...this.impactLookup, ...lookup];
    });
    this.subs.add(sub);
  }

  getCategoryType(): void {
    const sub = this.httpService.getRecommendationCategory().subscribe(res => {
      this.categories = res.data;
      const lookup = this.categories.map(recommendations => {
        return { id: recommendations.recommendation_category_id, description: recommendations.recommendation_category_name };
      });
      this.categoryLookup = [...this.categoryLookup, ...lookup];
    });
    this.subs.add(sub);
  }

  getResourceType(): void {
    const sub = this.httpService.getResourceType().subscribe(res => {
      this.resourceType = res.data;
      const lookup = this.resourceType.map(recommendations => {
        return { id: recommendations.resource_type_id, description: recommendations.resource_type_name };
      });
      this.resourceLookup = [...this.resourceLookup, ...lookup];
    });
    this.subs.add(sub);
  }

remove(): void {
  this.resource_name = '';
  this.currentPage = 1;
  this.getrecommendations();
}

subscriptionremove(): void {
  this.subscription_name = '';
  this.currentPage = 1;
  this.getrecommendations();
}

resourceGroupremove(): void {
  this.resource_group_name = '';
  this.currentPage = 1;
  this.getrecommendations();
}

categoryRemove() {
  this.currentPage = 1;
  this.selectedCategoryId = 0;
  this.selectedCategory = this.categoryLookup[0].id;
  this.getrecommendations();
}
resourceRemove() {
  this.currentPage = 1;
  this.selectedResourceId = 0;
  this.selectedResource = this.resourceLookup[0].id;
  this.getrecommendations();
}
impactRemove() {
  this.currentPage = 1;
  this.selectedImpactId = 0;
  this.selectedImpact = this.impactLookup[0].id;
  this.getrecommendations();
}

resourceFilter(value: string): void {
  this.resource_name = value;
  this.currentPage = 1;
  this.getrecommendations();
}

subscriptionFilter(value: string): void {
  this.subscription_name = value;
  this.currentPage = 1;
  this.getrecommendations();
}
resourceGroupFilter(value: string): void {
  this.resource_group_name = value;
  this.currentPage = 1;
  this.getrecommendations();
}

}
