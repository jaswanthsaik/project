import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { SeriesOption } from 'echarts';
import { Subscription } from 'rxjs';
import { SideNavService } from 'src/app/shared/components/side-nav/side-nav.service';
import { TooltipData } from '../../models/tooltip-data';

@Component({
  selector: 'app-savings-chart',
  templateUrl: './savings-chart.component.html',
  styleUrls: ['./savings-chart.component.scss']
})
export class SavingsChartComponent implements OnInit, OnDestroy, OnChanges {
  @Input() xAxisLegend: string[] = [];
  @Input() seriesData: number[][] = [];
  @Input() seriesLabels: string[] = [];
  @Input() tooltipData: TooltipData[] = [];
  @Input() showLegendTooltip = true;
  @Input() fullWidth = false;
  wide = true;
  subs = new Subscription();

  tooltipFormatter = (p: any) => {
    if (!this.showLegendTooltip) {
      return '';
    }
    let ttd = this.tooltipData;
    let text = p.name + '<br />';
    text += `Including: ${ttd[p.legendIndex].total_tenant} Tenants , ${ttd[p.legendIndex].total_subscription} subscription, ${ttd[p.legendIndex].total_instance} Instances/ VMs<br />`;
    text += `Total Savings: ${ttd[p.legendIndex].percent_saving}% - U$ ${ttd[p.legendIndex].total_saving}<br />`;
    text += `Recommendations: ${ttd[p.legendIndex].recommendations}`;
    return text;
  }

  option: any = {
    backgroundColor: 'rgb(255, 255, 255)',
    title: {
      text: ''
    },
    tooltip: {
      trigger: 'axis',
      valueFormatter: (value: any) => this.router.url === '/reports/cpu-usage'? '% ' + value : '$ ' + value
    },
    legend: {
      data: ['Account 1', 'Account 2', 'Account 3', 'Others'],
      textStyle: {
        color: 'black'
      },
      tooltip: {
        show: true,
        position: 'bottom',
        backgroundColor: 'rgb(42, 63, 84, 1)',
        borderWidth: 2,
        borderColor: 'rgb(59, 204, 203)',
        textStyle: {
          color: 'rgb(255, 255, 255)'
        },
        formatter: function (p: any) {
          let text = p.name + '<br />';
          //text += `tt: ${this.tt[p.legendIndex]}<br />`;
          text += `Including: 3 Tenants , 6 subscription, 1000 Instances/ VMs<br />`;
          text += `Total Savings: XXX% - U$ X.XXX,00<br />`;
          text += `Recommendations: (apeears only the number if there is any)`;
          return text;
        }
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '25px',
      containLabel: true,
      show: true,
    },
    toolbox: {
      top: '-3%',
      feature: {
        saveAsImage: {}
      }
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: [],
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: this.router.url === '/reports/cpu-usage'? '%{value}' : '${value}'
      }
    },
    series: [
      {
        name: 'Account 1',
        type: 'line',
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
      {
        name: 'Account 2',
        type: 'line',
        symbol: 'circle',
        symbolSize: 10,
        itemStyle: {
          color: 'rgb(109, 250, 216)'
        },
        lineStyle: {
          color: 'rgb(109, 250, 216)',
          width: 2,
          type: 'solid'
        },
        endLabel: {
          show: true,
          offset: [-70, -10],
          formatter: '{a}',
          color: 'rgb(109, 250, 216)'
        },
        data: []
      },
      {
        name: 'Account 3',
        type: 'line',
        symbol: 'circle',
        symbolSize: 10,
        itemStyle: {
          color: 'rgb(250, 253, 123)'
        },
        lineStyle: {
          color: 'rgb(250, 253, 123)',
          width: 2,
          type: 'solid'
        },
        endLabel: {
          show: true,
          offset: [-70, -10],
          formatter: '{a}',
          color: 'rgb(250, 253, 123)'
        },
        data: []
      },
      {
        name: 'Others',
        type: 'line',
        symbol: 'circle',
        symbolSize: 10,
        itemStyle: {
          color: 'rgb(233, 126, 251)'
        },
        lineStyle: {
          color: 'rgb(233, 126, 251)',
          width: 2,
          type: 'solid'
        },
        endLabel: {
          show: true,
          offset: [-70, -10],
          formatter: '{a}',
          color: 'rgb(233, 126, 251)'
        },
        data: []
      },
    ]
  };

  constructor(
    private sideNavService: SideNavService,
    private router: Router
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
      boundaryGap: false,
      data: this.xAxisLegend,
    };
    this.seriesLabels.forEach((label, index) => {
      this.option.series![index].data = this.seriesData[index] as SeriesOption[];
      this.option.series![index].name = label;
    });
    this.option.legend!.data = this.seriesLabels;
    this.option.legend.tooltip.formatter = this.tooltipFormatter;
    this.option = { ...this.option };
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

}
