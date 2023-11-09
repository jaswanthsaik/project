import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit, NgZone, AfterViewInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { DashboardSummary } from 'src/app/models/dashboard-summary';
import { InstanceGraph } from 'src/app/models/instance-graph';
import { RecommendationItem } from 'src/app/models/recommendation-item';
import { CommonService } from 'src/app/services/common.service';
import { BreadcrumbsItem } from 'src/app/shared/models/breadcrumbs-item';
import { DashboardResume } from '../../models/resume';
import { TooltipData } from '../../models/tooltip-data';
import { DashboardHttpService } from '../../services/dashboard-http.service';
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { Circle } from "@amcharts/amcharts5/.internal/core/render/Circle";


@Component({
  selector: 'app-home-page-container',
  templateUrl: './home-page-container.component.html',
  styleUrls: ['./home-page-container.component.scss']
})
export class HomePageContainerComponent implements OnInit, OnDestroy, AfterViewInit {
  private root!: am5.Root;
  showGettingStarted = false;
  resume?: DashboardResume;
  summary: DashboardSummary = new DashboardSummary();


  isSubscriptionActive: boolean = true;
  isAccountActive: boolean = false;
  isResourceGroupActive: boolean = false;
  isRegionActive: boolean = false;
  isAccountsActive: boolean = true;

  onSubscriptionClick(): void {
    this.isSubscriptionActive = true;
    this.isAccountActive = false;
    this.isResourceGroupActive = false;

  }

  onAccountClick(): void {
    this.isSubscriptionActive = false;
    this.isAccountActive = true;
    this.isResourceGroupActive = false;
    this.isRegionActive = false;
  }
  onAccountsClick(): void {
    this.isAccountsActive = true;
    this.isRegionActive = false;
  }

  onResourceGroupClick(): void {
    this.isSubscriptionActive = false;
    this.isAccountActive = false;
    this.isResourceGroupActive = true;
  }
  onRegionClick(): void {
    this.isAccountsActive = false;
    this.isRegionActive = true;
  }

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
    private zone: NgZone
  ) { }


  chartFilter(frequency: '12-months' | '6-months' | '3-months' | '1-month' | '14-days'): void {
    alert(`You selected ${frequency}`);
  }


  bottomFilter(frequency: '12-months' | '6-months' | '3-months' | '1-month' | '14-days'): void {
    alert(`You selected ${frequency}`);
  }

  getMainGraphData(interval: number): void {
    this.selectedMainGraphInterval = interval;
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
    this.httpService.getSummary(startDateString!, endDateString!).pipe(takeUntil(this._destroying$)).subscribe(res => {
      this.summary = res.data;
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
  ngAfterViewInit(): void {
    this.zone.runOutsideAngular(() => {
      this.root = am5.Root.new("chartdiv");
      this.root.setThemes([am5themes_Animated.new(this.root)]);

      let chart = this.root.container.children.push(am5xy.XYChart.new(this.root, {
        panX: false,
        panY: false,
        wheelX: "panX",
        wheelY: "panY",
        layout: this.root.verticalLayout
      }));

      let legend = chart.children.push(
        am5.Legend.new(this.root, {
          centerX: am5.p50,
          x: am5.p50
        })
      );

      legend.labels.template.setAll({
        fontSize: 18,

      });
      let data = [{
        "year": "Kalibr8 Azure Cloud",
        "europe": 47,
        "namerica": 298,
        "asia": 88,
        "lamerica": 253,
        "meast": 36
      }, {
        "year": "Vmcostsaver.onmicrosoft.com",
        "europe": 47,
        "namerica": 298,
        "asia": 88,
        "lamerica": 253,
        "meast": 36
      }];

      let xRenderer = am5xy.AxisRendererX.new(this.root, {
        cellStartLocation: 0.1,
        cellEndLocation: 0.9
      });

      let xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(this.root, {
        categoryField: "year",
        renderer: xRenderer,
        tooltip: am5.Tooltip.new(this.root, {})
      }));

      xRenderer.grid.template.setAll({
        strokeOpacity: 0

      });


      xAxis.data.setAll(data);

      let yAxis = chart.yAxes.push(am5xy.ValueAxis.new(this.root, {
        renderer: am5xy.AxisRendererY.new(this.root, {}),
        max: 350,
      }));
      xAxis.set("maxZoomFactor", 0);

      yAxis.get("renderer").grid.template.setAll({
        strokeDasharray: [8, 8],
      });
      yAxis.set("maxZoomFactor", 0);



      const colors = [
        am5.color("#6F4D7C"),
        am5.color("#537EE1"),
        am5.color("#AD4BC8"),
        am5.color("#12A3D3"),
        am5.color("#92D584"),
      ];

      const makeSeries = (name: any, fieldName: any, color: am5.Color) => {
        let series = chart.series.push(am5xy.ColumnSeries.new(this.root, {
          name: name,
          xAxis: xAxis,
          yAxis: yAxis,
          valueYField: fieldName,
          categoryXField: "year"
        }));

        series.columns.template.setAll({
          tooltipText: "{name}, {categoryX}:{valueY}",
          width: am5.percent(38),
          tooltipY: 0,
          strokeOpacity: 0,
          fill: color,
          cornerRadiusTL: 20,
          cornerRadiusTR: 20
        });

        series.data.setAll(data);

        series.appear();

        series.bullets.push(() => {
          return am5.Bullet.new(this.root, {
            locationY: 1,
            sprite: am5.Label.new(this.root, {
              text: "{valueY}",
              fill: am5.color("#525252"),
              centerY: am5.p100,
              centerX: am5.p50,
              populateText: true,
              dy: -10,
              fontFamily: "Poppins",
              fontWeight: "bold"
            })
          });
        });

        legend.data.push(series);
      }

      makeSeries.call(this, "Optimized", "europe", colors[0]);
      makeSeries.call(this, "Schedule (on/off)", "namerica", colors[1]);
      makeSeries.call(this, "Scaled resize", "asia", colors[2]);
      makeSeries.call(this, "Not Optimized", "lamerica", colors[3]);
      makeSeries.call(this, "Protected", "meast", colors[4]);

      chart.appear(1000, 100);
    });
    this.zone.runOutsideAngular(() => {
      this.root = am5.Root.new("chartdiv2");
      this.root.setThemes([am5themes_Animated.new(this.root)]);

      let chart = this.root.container.children.push(am5xy.XYChart.new(this.root, {
        panX: false,
        panY: false,
        wheelX: "panX",
        wheelY: "panY",
        layout: this.root.verticalLayout
      }));

      let data = [{
        "year": "AVMS Sales - VM",
        "Optimized": 27,
      },
      {
        "year": "commom - Deploument",
        "Optimized": 140,
      },
      {
        "year": "Kalibr08",
        "Optimized": 250,
      }];

      let xRenderer = am5xy.AxisRendererX.new(this.root, {
        cellStartLocation: 0.1,
        cellEndLocation: 0.9
      });

      let xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(this.root, {
        categoryField: "year",
        renderer: xRenderer,
        tooltip: am5.Tooltip.new(this.root, {})
      }));

      xRenderer.grid.template.setAll({
        strokeOpacity: 0

      });


      xAxis.data.setAll(data);

      let yAxis = chart.yAxes.push(am5xy.ValueAxis.new(this.root, {
        renderer: am5xy.AxisRendererY.new(this.root, {}),
        max: 300,
      }));
      xAxis.set("maxZoomFactor", 0);

      yAxis.get("renderer").grid.template.setAll({
        strokeDasharray: [8, 8],
      });
      yAxis.set("maxZoomFactor", 0);



      const colors = [
        am5.color("#537EE1"),
      ];

      const makeSeries = (name: string, fieldName: string, color: am5.Color) => {
        let series = chart.series.push(am5xy.ColumnSeries.new(this.root, {
          name: name,
          xAxis: xAxis,
          yAxis: yAxis,
          valueYField: fieldName,
          categoryXField: "year"
        }));

        series.columns.template.setAll({
          tooltipText: "{name}, {categoryX}:{valueY}",
          width: am5.percent(38),
          tooltipY: 0,
          strokeOpacity: 0,
          fill: color,
          cornerRadiusTL: 20,
          cornerRadiusTR: 20
        });

        series.data.setAll(data);

        series.appear();

        series.bullets.push(() => {
          return am5.Bullet.new(this.root, {
            locationY: 1,
            sprite: am5.Label.new(this.root, {
              text: "{valueY}",
              fill: am5.color("#525252"),
              centerY: am5.p100,
              centerX: am5.p50,
              populateText: true,
              dy: -11,
              fontFamily: "Poppins",
              fontWeight: "bold"
            })
          });
        });
      }

      makeSeries("Optimized", "Optimized", colors[0]);

      chart.appear(1000, 100);
    });
  }


  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
    this.root.dispose();
  }

}
