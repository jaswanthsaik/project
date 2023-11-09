import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';

import { SeriesOption } from 'echarts';
import { Subscription } from 'rxjs';
import { SideNavService } from 'src/app/shared/components/side-nav/side-nav.service';

@Component({
  selector: 'app-avms-bar-chart',
  templateUrl: './avms-bar-chart.component.html',
  styleUrls: ['./avms-bar-chart.component.scss']
})
export class AvmsBarChartComponent implements OnInit, OnDestroy, OnChanges {
  @Input() xAxisLegend: string[] = [];
  @Input() seriesData: number[][] = [];
  @Input() seriesLabels: string[] = [];
  @Input() fullWidth = false;
  wide = true;
  subs = new Subscription();

  option: any = {
    backgroundColor: 'rgb(255, 255, 255)',
    title: {
      text: ''
    },
    tooltip: {
      trigger: 'axis',
      valueFormatter: (value: any) => '$ ' + value
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
       top: '2%',
      containLabel: true,
      show: true,
    },
    xAxis: {
      type: 'category',
      data: [],
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: '${value}'
      }
    },
    series: [
      {
        name: 'Account 1',
        type: 'bar',
        symbol: 'circle',
        symbolSize: 10,
        itemStyle: {
          color: 'rgb(24, 252, 60)'
        },
        lineStyle: {
          color: 'rgb(24, 252, 60)',
          width: 2,
          type: 'solid'
        },
        endLabel: {
          show: true,
          offset: [-70, -10],
          formatter: '{a}',
          color: 'rgb(24, 252, 60)'
        },
        data: []
      },
    ]
  };

  constructor(
    private sideNavService: SideNavService
  ) { }

  getClass(): string {
    if (this.fullWidth) {
      if (this.wide) {
        return 'full-width';
      } else {
        return 'full-width-narrow';
      }
    }
    return this.wide ? 'wide' : 'narrow';
  }

  ngOnInit(): void {
    const sub = this.sideNavService.menuExpandedNotifier.subscribe(res => {
      this.wide = !res;
    });
    this.subs.add(sub);
  }

  ngOnChanges(): void {
    this.option.xAxis! = {
      type: 'category',
      data: this.xAxisLegend,
    };
    this.seriesLabels.forEach((label, index) => {
      this.option.series![index].data = this.seriesData[index] as SeriesOption[];
      this.option.series![index].name = label;
    });
    // this.option!.legend!.data! = this.seriesLabels;
    this.option = { ...this.option };
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

}
