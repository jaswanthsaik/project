import { Component, OnInit } from "@angular/core";
import { Router } from '@angular/router';
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import * as am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import { BreadcrumbsItem } from "src/app/shared/models/breadcrumbs-item";
import * as Highcharts from 'highcharts';
import HighchartsMore from 'highcharts/highcharts-more';
import HighchartsTreemap from 'highcharts/modules/treemap';
import HC_exporting from 'highcharts/modules/exporting';
HC_exporting(Highcharts);
HighchartsMore(Highcharts);
HighchartsTreemap(Highcharts);


interface Instance {
  InstanceName: string;
  isSelected: boolean;
}
interface Account {
  AccountName: string;
  isSelected: boolean;
}
interface Tenant {
  TenantName: string;
  isSelected: boolean;
}

interface Subscription {
  SubscriptionName: string;
  isSelected: boolean;
}
interface Resource {
  ResourceName: string;
  isSelected: boolean;
}

const instancearray = [
  { "InstanceName": "Fedora" },
  { "InstanceName": "ProjectServer" },
  { "InstanceName": "ProjectServer2" },
  { "InstanceName": "RedHat" },
  { "InstanceName": "samplevirtualmachine" },
  { "InstanceName": "ubuntu" },
  { "InstanceName": "vpnvm1" },
  { "InstanceName": "windowstestvm" },

];
const resourcearray = [
  { "ResourceName": "apigw" },
  { "ResourceName": "Rgroup1" },
  { "ResourceName": "Rgroup2" },
  { "ResourceName": "Rgroup3" },
  { "ResourceName": "ST-rg" },
  { "ResourceName": "vnet" },
];

const accountarray = [
  { "AccountName": "Dev Ensar Accounts" },
];
const tenantarray = [
  { "TenantName": "Dev Ensar Account - Home Tenant" },
];
const subscriptionarray = [
  { "SubscriptionName": "Azure Subscription 1" },
];

@Component({
  selector: 'app-manageByExceptions',
  templateUrl: './manageByExceptions.html',
  styleUrls: ['./manageByExceptions.scss']
})
export class manageByExceptions implements OnInit {
  chart: any;
  breadcrumbs: BreadcrumbsItem[] = [
    { label: 'Home', url: '/' },
    { label: 'analytics', url: '' },
  ];
  selectedSummary: number | null = null;

  constructor(private router: Router) { }

  showUserData(summaryIndex: number): void {
    this.selectedSummary = summaryIndex;
    if (summaryIndex === 1) {
      this.router.navigate(["/analytics"]);
    }
    if (summaryIndex === 3) {
      this.router.navigate(["/analytics.."]);
    }
    if (summaryIndex === 4) {
      this.router.navigate(["/analytics..."]);
    }
    if (summaryIndex === 5) {
      this.router.navigate(["/analytics...."]);
    }
  }


  initialInstanceCount: number = 8;
  instances: Instance[] = instancearray.map(instance => ({ ...instance, isSelected: false }));
  selectedInstanceCount: number = 8;
  showFilterForm: boolean = false;
  searchQuery: string = "";
  filteredInstances: Instance[] = [];

  resources: Resource[] = resourcearray.map(resource => ({ ...resource, isSelected: false }));
  selectedResourceCount: number = 6;
  showFilterForm9: boolean = false;
  searchQuery9: string = "";
  filteredResources: Resource[] = [];


  accounts = accountarray.map(account => ({ ...account, isSelected: false }));
  showFilterForm6: boolean = false;
  selectedAccountCount: number = 1;
  searchQuery6: string = "";
  filteredAccounts = this.accounts;


  tenants = tenantarray.map(tenant => ({ ...tenant, isSelected: false }));
  showFilterForm7: boolean = false;
  selectedTenantCount: number = 1;
  searchQuery7: string = "";
  filteredTenants = this.tenants;

  subscriptions = subscriptionarray.map(subscription => ({ ...subscription, isSelected: false }));
  showFilterForm8: boolean = false;
  selectedSubscriptionCount: number = 1;
  searchQuery8: string = "";
  filteredSubscriptions = this.subscriptions;

  ngOnInit(): void {
    const defaultSummaryIndex = 2;
    this.showUserData(defaultSummaryIndex);
    this.showUserData(defaultSummaryIndex);

    // Chart 1 - chartdiv3
    const root3 = am5.Root.new('chartdiv3');
    const chart1 = root3.container.children.push(
      am5xy.XYChart.new(root3, {
        panX: false,
        panY: false,
        wheelX: 'panX',
        wheelY: 'zoomX',
        layout: root3.horizontalLayout,
      })
    );

    const yRenderer1 = am5xy.AxisRendererY.new(root3, {});
    const yAxis1 = chart1.yAxes.push(
      am5xy.CategoryAxis.new(root3, {
        categoryField: 'year',
        renderer: yRenderer1,
        tooltip: am5.Tooltip.new(root3, {}),
      })
    );

    yRenderer1.grid.template.setAll({
      location: 1,
    });

    const data1 = [
      {
        year: 'East US',
        'scheduled and scaled': 0.103,
        'scheduled only': 0.17,
        'scaled only': 0.068,
        'neither': 0.103,
        'white': 2.95,
      },
    ];

    yAxis1.data.setAll(data1);
    const xAxis1 = chart1.xAxes.push(
      am5xy.ValueAxis.new(root3, {
        min: 0,
        max: 13,
        strictMinMax: true,
        calculateTotals: true,
        renderer: am5xy.AxisRendererX.new(root3, {
          strokeOpacity: 0.1,
        }),
      })
    );

    function makeSeries1(
      name: string,
      fieldName: string,
      color: am5.Color,
      columnWidth: number,
      columnHeight: number
    ) {
      const series1 = chart1.series.push(
        am5xy.ColumnSeries.new(root3, {
          name: name,
          stacked: true,
          xAxis: xAxis1,
          yAxis: yAxis1,
          valueXField: fieldName,
          valueXShow: 'valueXTotalPercent',
          categoryYField: 'year',
          fill: color,
        })
      );
      series1.columns.template.set('width', am5.percent(columnWidth * 18));
      series1.columns.template.set('height', columnHeight);
      series1.columns.template.setAll({
        tooltipText:
          "{categoryY}\n{name}:{valueXTotalPercent.formatNumber('#.#')}",
        tooltipY: am5.percent(1),
      });
      series1.data.setAll(data1);
      series1.appear();
      series1.bullets.push(function () {
        return am5.Bullet.new(root3, {
          sprite: am5.Label.new(root3, {
            text: "{valueXTotalPercent.formatNumber('#.#')}",
            fill: root3.interfaceColors.get('alternativeText'),
            centerY: am5.p50,
            centerX: am5.p50,
            populateText: true,
          }),
        });
      });
    }
    makeSeries1('scheduled and scaled', 'scheduled and scaled', am5.color('#006580'), 0.6, 80);
    makeSeries1('scheduled only', 'scheduled only', am5.color('#e0bd8d'), 0.6, 80);
    makeSeries1('scaled only', 'scaled only', am5.color('#10cfc9'), 0.6, 80);
    makeSeries1('neither', 'neither', am5.color('#87205d'), 0.6, 80);
    makeSeries1('', 'white', am5.color('#ffffff'), 0, 0.1);
    chart1.appear(1000);

    // Chart 2 - container
    const chartConfig2: Highcharts.Options = {
      chart: {
        type: 'treemap',
        backgroundColor: '#f9f9f9'
      },
      title: {
        text: 'colored by number of available recommendations',
        align: 'left',
        style: {
          fontSize: '13px',
          fontWeight: 'normal',
          color: '#bca395'
        }
      },
      series: [{
        type: 'treemap',
        layoutAlgorithm: 'stripes',
        alternateStartingDirection: true,
        borderColor: '#fff',
        borderRadius: 0,
        borderWidth: 2,
        dataLabels: {
          style: {
            textOutline: 'none',
          }
        },
        levels: [{
          level: 1,
          layoutAlgorithm: 'sliceAndDice',
          dataLabels: {
            enabled: true,
            align: 'left',
            verticalAlign: 'top',
            style: {
              fontSize: '13px',
              fontWeight: 'normal'
            }
          }
        }],
        data: [{
          id: 'A',
          name: 'Subscription',
          color: '#10cfc9'
        }, {
          id: 'B',
          name: 'subscription',
          color: '#006580'
        }, {
          id: 'C',
          name: 'subscription',
          color: '#87205d'
        }, {
          name: 'Medium',
          parent: 'A',
          value: 60
        }, {
          name: 'Low',
          parent: 'A',
          value: 16
        }, {
          name: 'High',
          parent: 'B',
          value: 13
        }, {
          name: 'Low',
          parent: 'C',
          value: 13
        }]
      }],
      tooltip: {
        useHTML: true,
        pointFormat: 'The area of <b>{point.name}</b> is <b>{point.value} km<sup>2</sup></b>'
      }
    };

    Highcharts.chart('container', chartConfig2);
    
    // Chart 3 - container2
    const chartConfig3: Highcharts.Options = {
      chart: {
        type: 'bar'
      }, title: {
        text: 'times the instances hit the tresholds',
        align: 'left',
        style: {
          fontSize: '13px',
          fontWeight: 'normal',
          color: '#bca395'
        }
      },
      legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'top',
        symbolWidth: 12,
        symbolHeight: 12,
        symbolRadius: 0,
        y: 20
      },
      xAxis: {
        categories: ['Dev Ensar Accounts']
      },
      yAxis: {
        allowDecimals: false,
        min: 0,
        max: 6000,
        title: {
          text: 'over 75%...,below 20%compar...',
          style: {
            fontSize: '10px',
            fontWeight: 'normal',
            color: '#bca395'
          }
        },
        labels: {
          formatter: function () {

            const value = Number(this.value);
            return value >= 1000 ? (value / 1000).toString() + 'k' : value.toString();
          }
        }
      },
      tooltip: {
        format: '<b>{key}</b><br/>{series.name}: {y}<br/>' + 'Total: {point.stackTotal}'
      },
      plotOptions: {
        bar: {
          states: {
            inactive: {
              opacity: 1
            }
          },
          dataLabels: {
            enabled: true,
            inside: false,
            verticalAlign: 'middle',
            style: {
              fontWeight: 'bold'
            },
            formatter: function () {
              const value = this.y ?? 0;
              return value >= 1000 ? (value / 1000).toString() + 'k' : value.toString();
            }
          }
        }
      },
      series: [
        {
          type: 'bar',
          name: 'over 75% and',
          data: [4500],
          color: '#006580',
        },
        {
          type: 'bar',
          name: 'below 20% comparision',
          data: [4500],
          color: '#87205d'
        }
      ]
    };

    Highcharts.chart('container2', chartConfig3);
    this.updateHeaderValues();
    this.selectedInstanceCount = this.instances.length;
    this.initialInstanceCount = this.initialInstanceCount;
    this.selectedResourceCount = this.resources.length;

    // console.log('selectedAccountCount:', this.selectedAccountCount);
    // this.selectedAccountCount = this.accounts.length;
    // console.log(accountarray);
    // console.log(this.accounts);

    // console.log('selectedTenantCount:', this.selectedTenantCount);
    // this.selectedTenantCount = this.tenants.length;
    // console.log(tenantarray);
    // console.log(this.tenants);

    // console.log('selectedSubscriptionCount:', this.selectedSubscriptionCount);
    // this.selectedSubscriptionCount = this.subscriptions.length;
    // console.log(subscriptionarray);
    // console.log(this.subscriptions);
  }

  toggleFilterForm(): void {
    this.showFilterForm = !this.showFilterForm;
    if (this.showFilterForm) {
      this.filteredInstances = this.instances;
    } else {
      this.filteredInstances = [];
    }
    this.updateSelectedInstanceCount();
  }

  toggleFilterForm9(): void {
    this.showFilterForm9 = !this.showFilterForm9;
    if (this.showFilterForm9) {
      this.filteredResources = this.resources;
    } else {
      this.filteredResources = [];
    }
    this.updateSelectedResourceCount();
  }

  toggleFilterForm6(): void {
    this.showFilterForm6 = !this.showFilterForm6;
  }
  toggleFilterForm7(): void {
    this.showFilterForm7 = !this.showFilterForm7;
  }
  toggleFilterForm8(): void {
    this.showFilterForm8 = !this.showFilterForm8;
  }
  filterInstances(): void {
    this.filteredInstances = this.instances.filter(instance =>
      instance.InstanceName.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
    this.updateSelectedInstanceCount();
  }
  filterResources(): void {
    this.filteredResources = this.resources.filter(resource =>
      resource.ResourceName.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
    this.updateSelectedResourceCount();
  }
  toggleInstanceSelection(instance: Instance): void {
    instance.isSelected = !instance.isSelected;
    this.updateSelectedInstanceCount();
    this.updateHeaderValues();
  }
  toggleResourceSelection(resource: Resource): void {
    resource.isSelected = !resource.isSelected;
    this.updateSelectedResourceCount();
    this.updateHeaderValues();
  }
  toggleAccountSelection(account: Account): void {
    account.isSelected = !account.isSelected;
  }
  toggleTenantSelection(tenant: Tenant): void {
    tenant.isSelected = !tenant.isSelected;
  }
  toggleSubscriptionSelection(subscription: Subscription): void {
    subscription.isSelected = !subscription.isSelected;
  }
  updateSelectedInstanceCount(): void {
    this.selectedInstanceCount = this.instances.filter(instance => instance.isSelected).length;
  }
  updateSelectedResourceCount(): void {
    this.selectedResourceCount = this.resources.filter(resource => resource.isSelected).length;
  }
  updateHeaderValues(): void {
    const instancesHeader: Element | null = document.querySelector(".fields-header12.bold-blue4");
    if (instancesHeader) {
      instancesHeader.textContent = this.selectedInstanceCount === 0 ? this.initialInstanceCount.toString() : this.selectedInstanceCount.toString();
    }
  }
  deselectAllInstancesAndCloseForm(): void {
    this.instances.forEach(instance => (instance.isSelected = false));
    this.showFilterForm = false;
    this.updateSelectedInstanceCount();
    this.updateHeaderValues();
  }
  deselectAllResourcesAndCloseForm(): void {
    this.resources.forEach(resource => (resource.isSelected = false));
    this.showFilterForm9 = false;
    this.updateSelectedResourceCount();
    this.updateHeaderValues();
  }
  deselectAllAccountsAndCloseForm(): void {
    this.accounts.forEach(account => (account.isSelected = false));
    this.showFilterForm6 = false;
  }
  deselectAllTenantsAndCloseForm(): void {
    this.tenants.forEach(tenant => (tenant.isSelected = false));
    this.showFilterForm7 = false;

  }
  deselectAllSubscriptionsAndCloseForm(): void {
    this.subscriptions.forEach(subscription => (subscription.isSelected = false));
    this.showFilterForm8 = false;

  }
  deselectAllInstances(): void {
    this.instances.forEach(instance => (instance.isSelected = false));
    this.selectedInstanceCount = 8;
    this.updateSelectedInstanceCount();
    this.updateHeaderValues();
  }
  deselectAllResources(): void {
    this.resources.forEach(resource => (resource.isSelected = false));
    this.updateSelectedInstanceCount();
    this.updateSelectedResourceCount();
    this.updateHeaderValues();
  }
  deselectAllAccounts(): void {
    this.accounts.forEach(account => (account.isSelected = false));
  }
  deselectAllTenants(): void {
    this.tenants.forEach(tenant => (tenant.isSelected = false));
  }
  deselectAllSubscriptions(): void {
    this.subscriptions.forEach(subscription => (subscription.isSelected = false));
  }
  saveAndCloseForm(): void {
    this.updateHeaderValues();
    this.showFilterForm = false;
    this.showFilterForm6 = false;
    this.showFilterForm7 = false;
    this.showFilterForm8 = false;
    this.showFilterForm9 = false;
    this.filteredInstances.forEach((instance, index) => {
      this.instances[index].isSelected = instance.isSelected;
    });
    this.filteredAccounts.forEach((account, index) => {
      this.accounts[index].isSelected = account.isSelected;
    });
    this.filteredTenants.forEach((tenant, index) => {
      this.tenants[index].isSelected = tenant.isSelected;
    });
    this.filteredSubscriptions.forEach((subscriptions, index) => {
      this.subscriptions[index].isSelected = subscriptions.isSelected;
    });
    this.filteredResources.forEach((resource, index) => {
      this.resources[index].isSelected = resource.isSelected;
    });
    this.updateSelectedResourceCount();
    this.updateSelectedInstanceCount();
    this.updateHeaderValues();
  }
  CloseForm(): void {
    this.toggleFilterForm();
    this.toggleFilterForm6();
    this.toggleFilterForm7();
    this.toggleFilterForm8();
    this.toggleFilterForm9();
  }
  toggleSelectAllInstances(): void {
    const allSelected = this.filteredInstances.every(instance => instance.isSelected);
    if (allSelected) {
      this.filteredInstances.forEach(instance => (instance.isSelected = false));
    } else {
      this.filteredInstances.forEach(instance => (instance.isSelected = true));
    }
    this.updateSelectedInstanceCount();
    this.updateHeaderValues();
  }
  toggleSelectAllResources(): void {
    const allSelected = this.filteredResources.every(resource => resource.isSelected);
    if (allSelected) {
      this.filteredResources.forEach(resource => (resource.isSelected = false));
    } else {
      this.filteredResources.forEach(resource => (resource.isSelected = true));
    }
    this.updateSelectedResourceCount();
    this.updateHeaderValues();
  }
  toggleSelectAllAccounts(): void {
    const allSelected = this.filteredAccounts.every(account => account.isSelected);

    if (allSelected) {
      this.filteredAccounts.forEach(account => (account.isSelected = false));
    } else {
      this.filteredAccounts.forEach(account => (account.isSelected = true));
    }
  }
  toggleSelectAllTenants(): void {
    const allSelected = this.filteredTenants.every(tenant => tenant.isSelected);

    if (allSelected) {
      this.filteredTenants.forEach(tenant => (tenant.isSelected = false));
    } else {
      this.filteredTenants.forEach(tenant => (tenant.isSelected = true));
    }
  }
  toggleSelectAllSubscriptions(): void {
    const allSelected = this.filteredSubscriptions.every(subscription => subscription.isSelected);
    if (allSelected) {
      this.filteredSubscriptions.forEach(subscription => (subscription.isSelected = false));
    } else {
      this.filteredSubscriptions.forEach(subscription => (subscription.isSelected = true));
    }
  }
}
