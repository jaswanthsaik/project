import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { DashboardSummary } from 'src/app/models/dashboard-summary';
import { InstanceGraph } from 'src/app/models/instance-graph';
import { RecommendationItem } from 'src/app/models/recommendation-item';
import { CommonService } from 'src/app/services/common.service';
import { BreadcrumbsItem } from 'src/app/shared/models/breadcrumbs-item';
import { DashboardResume } from '../../models/resume';
import { TooltipData } from '../../models/tooltip-data';
import { DashboardHttpService } from '../../services/dashboard-http.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-home-page-container',
  templateUrl: './home-page-container.component.html',
  styleUrls: ['./home-page-container.component.scss']
})
export class HomePageContainerComponent implements OnInit, OnDestroy {
  showGettingStarted = false;
  resume?: DashboardResume;
  summary: DashboardSummary = new DashboardSummary();

  private readonly _destroying$ = new Subject<void>();

  recommendations: RecommendationItem[] = [];
  showSearchRecommendation = false;
  showSearchInstance = false;
  breadcrumbs: BreadcrumbsItem[] = [
    { label: 'Home', url: '/' },
    { label: '', url: '' },
  ];

  bestInstancesPeriods = [
    { id: '5', description: '14 days' },
    { id: '1', description: '1 month' },
    { id: '2', description: '3 months' },
    { id: '3', description: '6 months' },
    { id: '4', description: '12 months' },
  ];

  months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  xAxisLegend: string[] = [];
  seriesData: number[][] = [];
  seriesLabels: string[] = [];
  tooltipData: TooltipData[] = [];
  selectedMainGraphInterval: number = 1;

  instanceGraphData?: InstanceGraph;
  bestInstanceSelectedPeriod = '1';

  selectedSummaryInterval: number = 1;

  constructor(
    private httpService: DashboardHttpService,
    private datePipe: DatePipe,
    private commonService: CommonService,
    private spinner: NgxSpinnerService
  ) { }

  chartFilter(frequency: '12-months' | '6-months' | '3-months' | '1-month' | '14-days'): void {
    alert(`You selected ${frequency}`);
  }

  bottomFilter(frequency: '12-months' | '6-months' | '3-months' | '1-month' | '14-days'): void {
    alert(`You selected ${frequency}`);
  }

  getMainGraphData(interval: number): void {
    this.selectedMainGraphInterval = interval;
    this.spinner.show(); // Show the spinner

    this.httpService.getGraph(interval).pipe(takeUntil(this._destroying$)).subscribe(res => {
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
          percent_saving: item.percent_saving,
          recommendations: item.total_recommendations
        });
        this.seriesData = [...this.seriesData];
        this.seriesLabels = [...this.seriesLabels];
        this.tooltipData = [...this.tooltipData];
      });

      this.spinner.hide(); // Hide the spinner
    });
  }

  getSummaryData(interval: number): void {
    this.showGettingStarted = true;
    this.selectedSummaryInterval = interval;
    let days = 365;
    if (interval === 2) {
      days = 180;
    } else if (interval === 3) {
      days = 30;
    }
    const endDate = Date.now();
    const startDate = endDate - (days * 24 * 60 * 60 * 1000);
    const startDateString = this.datePipe.transform(startDate, 'yyyy-MM-dd');
    const endDateString = this.datePipe.transform(endDate, 'yyyy-MM-dd');

    this.spinner.show(); // Show the spinner

    this.httpService.getSummary(startDateString!, endDateString!).pipe(takeUntil(this._destroying$)).subscribe(res => {
      this.summary = res.data;
      this.spinner.hide(); // Hide the spinner
    });
  }

  getInstanceGraph(interval: number): void {
    this.httpService.getInstanceGraph(interval).pipe(takeUntil(this._destroying$)).subscribe(res => {
      this.instanceGraphData = res.data;
      this.instanceGraphData = { ...this.instanceGraphData };
    });
  }

  recommendationClicked(recommendation: RecommendationItem): void {
    this.showSearchRecommendation = true;
  }

  instanceClicked(): void {
    this.showSearchInstance = true;
  }

  export(interval: number): void {
    let report$ = this.httpService.getGraphExport(interval);

    report$.subscribe(response => {
      const downloadLink = document.createElement('a');
      if (response.body) {
        downloadLink.href = URL.createObjectURL(new Blob([response.body], { type: response.body.type }));
        const contentDisposition = response.headers.get('content-disposition');
        const fileName = contentDisposition!.split(';')[1].split('filename')[1].split('=')[1].trim();
        downloadLink.download = fileName;
        downloadLink.click();
      }
    });
  }

  ngOnInit(): void {
    this.showGettingStarted = this.commonService.showGettingStarted;
    this.httpService.getResume().pipe(takeUntil(this._destroying$)).subscribe(res => {
      this.resume = res.data;
      if (this.resume.account_number === 0) {
        this.commonService.showGettingStarted = true;
        this.showGettingStarted = true;
      }
      this.recommendations = this.resume.recommendations.map(item => {
        const level = item.recommendation_impact === 'High' ? 3 : item.recommendation_impact === 'Medium' ? 2 : 1;
        return {
          text: item.recommendation_description,
          level
        };
      });
      this.recommendations.sort((a, b) => b.level - a.level);
    });
    this.getMainGraphData(1);
    this.getSummaryData(1);
    this.getInstanceGraph(5);
  }

  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }
}
