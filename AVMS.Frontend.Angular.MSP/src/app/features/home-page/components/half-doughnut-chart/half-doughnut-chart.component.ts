import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { SeriesOption } from 'echarts';
import { InstanceGraph } from 'src/app/models/instance-graph';

@Component({
  selector: 'app-half-doughnut-chart',
  templateUrl: './half-doughnut-chart.component.html',
  styleUrls: ['./half-doughnut-chart.component.scss']
})
export class HalfDoughnutChartComponent implements OnInit, OnChanges {
  @Input() data?: InstanceGraph;
  @Output() instanceClicked = new EventEmitter<void>();
  tooltipData: string[] = [];

  option: any = {
    tooltip: {
      trigger: 'item',
      position: 'inside',
      opacity: 0.6,
      formatter: function (p: any) {
        return `${p.name}: ${p.value}%`;
      }
    },
    legend: {
      show: false,
      orient: 'vertical',
      left: 10
    },  
    graphic: [
      {
        type: 'group',
        left: 'center',
        top: '35%',
        children: [
          {
            type: 'text',
            style: {
              fill: 'rgba(24, 252, 60, 1)',
              overflow: 'break',
              text: '97%',
              font: 'Poppins',
              fontWeight: 'bold',
              textAlign: 'middle'
            } as any
          },
          {
            type: 'text',
            top: '20px',
            style: {
              fill: 'rgba(185, 188, 202, 1)',
              overflow: 'break',
              text: 'in use',
              font: 'Poppins',
              fontWeight: 'bold',
              textAlign: 'center'
            } as any
          }
        ]
      }
    ],
    series: [
      {
        startAngle: 180,
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: 'outside',
          fontSize: '12',
          fontFamily: 'Poppins',
          formatter: function (x) {
            return `${x.name}\n${x.value}%`;
          }
        },
        emphasis: {
          label: {
            show: false,
            fontSize: '15',
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: true
        },
        data: [
          { value: 30, name: 'INSTANCE-1' },
          { value: 10, name: 'INSTANCE-2' },
          { value: 12, name: 'INSTANCE-3' },
          { value: 45, name: 'INSTANCE-4' },
          {
            value: 97,
            name: null,
            itemStyle: { opacity: 0 },
            tooltip: { show: false }
          }
        ]
      }
    ] as SeriesOption[]
  
  };

  constructor() { }

  chartClicked(event: any) {
    if (event.componentType === 'series') {
      this.instanceClicked.emit();
    }
  }

  ngOnInit(): void {
  }

  ngOnChanges(): void {
    this.tooltipData = [];
    this.data?.values.forEach(x => {
      this.tooltipData.push(`${x.instance_name} - ${x.percent_saving}%`);
    });
    this.option.series[0].data = [];
    if (this.data) {
      this.option.graphic[0].children[0].style.text = `${this.data.percent_total}%`;
      let sum = 0;
      this.data.values.forEach(x => {
        sum += x.percent_saving;
        this.option.series[0].data.push({ value: x.percent_saving, name: x.instance_name });
      });
      const lastData = {
        value: sum === 0 ? 1 : sum,
        name: null,
        itemStyle: { opacity: 0 },
        tooltip: { show: false }
      }
      this.option.series[0].data.push(lastData);
      this.option = {...this.option};
    }
  }

}
