import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from '@angular/router';
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import * as am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import { BreadcrumbsItem } from "src/app/shared/models/breadcrumbs-item";
import * as Highcharts from 'highcharts';
import HighchartsMore from 'highcharts/highcharts-more';
import HighchartsTreemap from 'highcharts/modules/treemap';
import * as d3 from 'd3';
import { format } from 'd3';
import { CpuAnalysisService } from "src/app/cpu-analysis.service";

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
  selector: 'app-CPUusage',
  templateUrl: './CPUusage.component.html',
  styleUrls: ['./CPUusage.component.scss']
})


export class CPUusage implements OnInit {

 
  tableData = [
    { resourceName: ' 146024', resourceType: '97520', resourceTypeName: 'Fedora', impact: '0', subscription: '0.12', category: 'Linuxinstance' },
    { resourceName: ' 146024', resourceType: '97520', resourceTypeName: 'Fedora', impact: '0', subscription: '0.5', category: 'Linuxinstance' },
    { resourceName: '146024', resourceType: '97520', resourceTypeName: 'Fedora', impact: '0.02', subscription: '0.1', category: 'Linuxinstance' },
    { resourceName: '146024', resourceType: '97520', resourceTypeName: 'Fedora', impact: '0.02', subscription: '0.11', category: 'Linuxinstance' },
    { resourceName: '146024', resourceType: '97520', resourceTypeName: 'Fedora', impact: '0.06', subscription: '0.06', category: 'Linuxinstance' },
    { resourceName: '146024', resourceType: '97520', resourceTypeName: 'Fedora', impact: '0.1', subscription: '0.02', category: 'Linuxinstance' },
    { resourceName: '146024', resourceType: '97520', resourceTypeName: 'Fedora', impact: '0.17', subscription: '0.09', category: 'Linuxinstance' },
    { resourceName: '146024', resourceType: '97520', resourceTypeName: 'Fedora', impact: '0.17', subscription: '0.33', category: 'Linuxinstance' },
    { resourceName: '146024', resourceType: '97520', resourceTypeName: 'Fedora', impact: '0.25', subscription: '0.25', category: 'Linuxinstance' },
    { resourceName: '146024', resourceType: '97521', resourceTypeName: 'RedHat', impact: '0', subscription: '0.12', category: 'Linuxinstance' },
    { resourceName: '146024', resourceType: '97521', resourceTypeName: 'RedHat', impact: '0.01', subscription: '0.11', category: 'Linuxinstance' },
    { resourceName: '146024', resourceType: '97521', resourceTypeName: 'RedHat', impact: '0.01', subscription: '0.12', category: 'Linuxinstance' },
    { resourceName: '146024', resourceType: '97521', resourceTypeName: 'RedHat', impact: '0.01', subscription: '0.12', category: 'Linuxinstance' },
    { resourceName: '146024', resourceType: '97521', resourceTypeName: 'RedHat', impact: '0.01', subscription: '0.12', category: 'Linuxinstance' },
    { resourceName: '146024', resourceType: '97521', resourceTypeName: 'RedHat', impact: '0.01', subscription: '0.12', category: 'Linuxinstance' },
    { resourceName: '146024', resourceType: '97521', resourceTypeName: 'RedHat', impact: '0.01', subscription: '0.12', category: 'Linuxinstance' },
    { resourceName: '146024', resourceType: '97521', resourceTypeName: 'RedHat', impact: '0.01', subscription: '0.12', category: 'Linuxinstance' },
    { resourceName: '146024', resourceType: '97521', resourceTypeName: 'RedHat', impact: '0.01', subscription: '0.12', category: 'Linuxinstance' },
    { resourceName: '146024', resourceType: '97521', resourceTypeName: 'RedHat', impact: '0.01', subscription: '0.12', category: 'Linuxinstance' },
    { resourceName: '146024', resourceType: '97521', resourceTypeName: 'RedHat', impact: '0.01', subscription: '0.12', category: 'Linuxinstance' },
    { resourceName: '146024', resourceType: '97521', resourceTypeName: 'RedHat', impact: '0.01', subscription: '0.12', category: 'Linuxinstance' },
    { resourceName: '146024', resourceType: '97521', resourceTypeName: 'RedHat', impact: '0.01', subscription: '0.12', category: 'Linuxinstance' },
    { resourceName: '146024', resourceType: '97521', resourceTypeName: 'RedHat', impact: '0.01', subscription: '0.12', category: 'Linuxinstance' },
    { resourceName: '146024', resourceType: '97521', resourceTypeName: 'RedHat', impact: '0.01', subscription: '0.12', category: 'Linuxinstance' },
    { resourceName: '146024', resourceType: '97521', resourceTypeName: 'RedHat', impact: '0.01', subscription: '0.12', category: 'Linuxinstance' },
    { resourceName: '146024', resourceType: '97521', resourceTypeName: 'RedHat', impact: '0.01', subscription: '0.12', category: 'Linuxinstance' },
    { resourceName: '146024', resourceType: '97521', resourceTypeName: 'RedHat', impact: '0.01', subscription: '0.12', category: 'Linuxinstance' },
    { resourceName: '146024', resourceType: '97521', resourceTypeName: 'RedHat', impact: '0.01', subscription: '0.12', category: 'Linuxinstance' },
    { resourceName: '146024', resourceType: '97521', resourceTypeName: 'RedHat', impact: '0.01', subscription: '0.12', category: 'Linuxinstance' },
    { resourceName: '146024', resourceType: '97521', resourceTypeName: 'RedHat', impact: '0.01', subscription: '0.12', category: 'Linuxinstance' },
    { resourceName: '146024', resourceType: '97521', resourceTypeName: 'RedHat', impact: '0.01', subscription: '0.12', category: 'Linuxinstance' },
    { resourceName: '146024', resourceType: '97521', resourceTypeName: 'RedHat', impact: '0.01', subscription: '0.12', category: 'Linuxinstance' },
    { resourceName: '146024', resourceType: '97521', resourceTypeName: 'RedHat', impact: '0.01', subscription: '0.12', category: 'Linuxinstance' },
    { resourceName: '146024', resourceType: '97521', resourceTypeName: 'RedHat', impact: '0.01', subscription: '0.12', category: 'Linuxinstance' },
    { resourceName: '146024', resourceType: '97521', resourceTypeName: 'RedHat', impact: '0.01', subscription: '0.12', category: 'Linuxinstance' },
  ];

  tableData1 = [
    { resourceName: 'Fedora', resourceType: '1', resourceType1: '1', resourceType2: '1', resourceType3: '1', resourceType4: '1', resourceType5: '1', resourceType6: '1', resourceType7: '1', resourceType8: '1', },
    { resourceName: 'ProjectServer', resourceType: '-', resourceType1: '-', resourceType2: '-', resourceType3: '-', resourceType4: '-', resourceType5: '-', resourceType6: '-', resourceType7: '-', resourceType8: '-', },
    { resourceName: 'ProjectServer2', resourceType: '-', resourceType1: '-', resourceType2: '-', resourceType3: '-', resourceType4: '-', resourceType5: '-', resourceType6: '-', resourceType7: '-', resourceType8: '-', },
    { resourceName: 'RedHat', resourceType: '-', resourceType1: '-', resourceType2: '-', resourceType3: '1', resourceType4: '1', resourceType5: '1', resourceType6: '1', resourceType7: '1', resourceType8: '1', },
    { resourceName: 'samplevirtualmachine', resourceType: '-', resourceType1: '-', resourceType2: '-', resourceType3: '-', resourceType4: '-', resourceType5: '-', resourceType6: '-', resourceType7: '-', resourceType8: '-', },
    { resourceName: 'ubuntu', resourceType: '-', resourceType1: '-', resourceType2: '-', resourceType3: '1', resourceType4: '1', resourceType5: '1', resourceType6: '1', resourceType7: '1', resourceType8: '1', },
    { resourceName: 'vpnvm1', resourceType: '-', resourceType1: '-', resourceType2: '-', resourceType3: '1', resourceType4: '1', resourceType5: '1', resourceType6: '-', resourceType7: '-', resourceType8: '-', },
    { resourceName: 'windows', resourceType: '-', resourceType1: '-', resourceType2: '-', resourceType3: '-', resourceType4: '-', resourceType5: '-', resourceType6: '-', resourceType7: '-', resourceType8: '-', },
  ];
  tableData2 = [
    { resourceName: '-', resourceType: '0', },
  ];
  chart: any;

  breadcrumbs: BreadcrumbsItem[] = [
    { label: 'Home', url: '/' },
    { label: 'analytics', url: '' },
  ];
  selectedSummary: number | null = null;

  mainChartData3 = [
    {
      name: 'Series 1',
      series: [
        { name: '1', value: 0.53 },
        { name: '2', value: 0.58 },
        { name: '3', value: 0.43 },
        { name: '4', value: 0.18 },
        { name: '6', value: 0.24 },
        { name: '8', value: 0.18 },
        { name: '9', value: 0.18 },
        { name: '11', value: 0.33 },
        { name: '13', value: 0.25 },
        { name: '14', value: 0.09 },
        { name: '16', value: 0.34 },
        { name: '18', value: 0.29 },
        { name: '19', value: 0.18 },
        { name: '20', value: 0.23 },
        { name: '22', value: 0.13 },
        { name: '24', value: 0.08 },
        { name: '26', value: 0.19 },
        { name: '27', value: 0.14 },
        { name: '29', value: 0.35 },
        { name: '31', value: 0.23 },
        { name: '32', value: 0.09 },
        { name: '33', value: 0.35 },
        { name: '34', value: 0.36 },
        { name: '36', value: 0.4 },
        { name: '38', value: 0.24 },
        { name: '39', value: 0.32 },
        { name: '41', value: 0.47 },
        { name: '43', value: 0.23 },
        { name: '44', value: 0.29 },
        { name: '46', value: 0 },
        { name: '48', value: 0.28 },
        { name: '49', value: 0.23 },
        { name: '50', value: 0.29 },
        { name: '51', value: 0.21 },
        { name: '52', value: 0.23 },
        { name: '53', value: 0 },
        { name: '54', value: 0.33 },
        { name: '55', value: 0.25 },
        { name: '56', value: 0.28 },
        { name: '57', value: 0.18 },
        { name: '58', value: 0.27 },
        { name: '59', value: 0.1 },
        { name: '60', value: 0.03 },
        { name: '67', value: 0.27 },
        { name: '61', value: 0.2 },
        { name: '62', value: 0.26 },
        { name: '63', value: 0.33 },
        { name: '64', value: 0.14 },
        { name: '65', value: 0.27 },
        { name: '66', value: 0.38 },
        { name: '69', value: 0.01 },
        { name: '70', value: 0.28 },
      ],
    },
  ];

  miniChartData3 = [
    {
      name: 'Series 1',
      series: [
        { name: '1', value: 0.53 },
        { name: '2', value: 0.58 },
        { name: '3', value: 0.43 },
        { name: '4', value: 0.18 },
        { name: '6', value: 0.24 },
        { name: '8', value: 0.18 },
        { name: '9', value: 0.18 },
        { name: '11', value: 0.33 },
        { name: '13', value: 0.25 },
        { name: '14', value: 0.09 },
        { name: '16', value: 0.34 },
        { name: '18', value: 0.29 },
        { name: '19', value: 0.18 },
        { name: '20', value: 0.23 },
        { name: '22', value: 0.13 },
        { name: '24', value: 0.08 },
        { name: '26', value: 0.19 },
        { name: '27', value: 0.14 },
        { name: '29', value: 0.35 },
        { name: '31', value: 0.23 },
        { name: '32', value: 0.09 },
        { name: '33', value: 0.35 },
        { name: '34', value: 0.36 },
        { name: '36', value: 0.4 },
        { name: '38', value: 0.24 },
        { name: '39', value: 0.32 },
        { name: '41', value: 0.47 },
        { name: '43', value: 0.23 },
        { name: '44', value: 0.29 },
        { name: '46', value: 0 },
        { name: '48', value: 0.28 },
        { name: '49', value: 0.23 },
        { name: '50', value: 0.29 },
        { name: '51', value: 0.21 },
        { name: '52', value: 0.23 },
        { name: '53', value: 0 },
        { name: '54', value: 0.33 },
        { name: '55', value: 0.25 },
        { name: '56', value: 0.28 },
        { name: '57', value: 0.18 },
        { name: '58', value: 0.27 },
        { name: '59', value: 0.1 },
        { name: '60', value: 0.03 },
        { name: '67', value: 0.27 },
        { name: '61', value: 0.2 },
        { name: '62', value: 0.26 },
        { name: '63', value: 0.33 },
        { name: '64', value: 0.14 },
        { name: '65', value: 0.27 },
        { name: '66', value: 0.38 },
        { name: '69', value: 0.01 },
        { name: '70', value: 0.28 },

      ],
    },
  ];

  yAxisTickFormatting(value: any) {
    return value.toFixed(1);
  };
  xAxisTickFormatting(value: any): string {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthIndex = parseInt(value, 10);
    if (value === '2') {
      return 'May';
    } else if (value === '29') {
      return 'June';
    } else {
      return monthNames[monthIndex - 1];
    }
  }

  avgOverallSavings!: number;
  overallSaving!: number;
  avgOverallCost!: number;
  avgCost!: number;
  average_CPU_Usage!: number;
  usageAnalysis!: number;
  avgUsageAnalysis!: number;
  avgCpuUsage!: number;
  usageAverage!: number;
  peakUsage!: number;
  idleUsage!: number;
  minValue: number = 0;
  maxValue: number = 250;
  currentValue!: number;
  currentValue1!: number;

  constructor(private router: Router,
    private cpuAnalysisService: CpuAnalysisService
  ) { }

  showUserData(summaryIndex: number): void {
    this.selectedSummary = summaryIndex;
    if (summaryIndex === 1) {
      this.router.navigate(["/analytics"]);
    }
    if (summaryIndex === 2) {
      this.router.navigate(["/analytics."]);
    }
    if (summaryIndex === 4) {
      this.router.navigate(["/analytics..."]);
    }
    if (summaryIndex === 5) {
      this.router.navigate(["/analytics...."]);
    }
  }
  private data = [
    { "Framework": "Vue", "Stars": "1.03", "Released": "2014" },
    { "Framework": "React", "Stars": "0.74", "Released": "2013" },
    { "Framework": "Angular", "Stars": "0.55", "Released": "2016" },
    { "Framework": "Backbone", "Stars": "0.4", "Released": "2010" },
    { "Framework": "Ember", "Stars": "0.16", "Released": "2011" },
    { "Framework": "HTML", "Stars": "0.16", "Released": "2018" },
    { "Framework": "css", "Stars": "0.02", "Released": "2018" },
    { "Framework": "java", "Stars": "0", "Released": "2018" },
  ];
  private svg: any;
  private margin = 50;
  private width = 750 - (this.margin * 2);
  private height = 205 - (this.margin * 2);

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
    this.createSvg();
    this.drawBars(this.data);
    const defaultSummaryIndex = 3;
    this.showUserData(defaultSummaryIndex);
    this.showUserData(defaultSummaryIndex);
    this.updateHeaderValues();
    this.selectedInstanceCount = this.instances.length;
    this.selectedResourceCount = this.resources.length;
    this.currentValue = this.avgOverallSavings;
    this.currentValue1 = this.avgOverallCost;
    this.fetchAverageSavings();
    this.fetchAverageCost();
    this.fetchTopOffenders();
    this.fetchUsageAnalysis();
    this.fetchUsageAverage();
    this.fetchPeakUsage();
    // this.fetchIdleUsage();


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

  private createSvg(): void {
    this.svg = d3.select("figure#bar")
      .append("svg")
      .attr("width", this.width + (this.margin * 2))
      .attr("height", this.height + (this.margin * 2))
      .append("g")
      .attr("transform", `translate(${this.margin},${this.margin})`);
  }

  private drawBars(data: any[]): void {
    const x: d3.ScaleBand<string> = d3.scaleBand()
      .range([0, this.width])
      .domain(data.map(d => d.Framework))
      .padding(0.1);
    const barWidthFactor = 0.4;
    const barSpacingFactor = 0.1;
    const adjustedBarWidth = x.bandwidth() * barWidthFactor;
    const adjustedBarSpacing = x.bandwidth() * (1 - barWidthFactor) * barSpacingFactor;
    const y: d3.ScaleLinear<number, number> = d3.scaleLinear()
      .domain([0, 1.1])
      .range([this.height, 0]);
    this.svg.append("g")
      .attr("transform", `translate(0,${this.height})`)
      .call(d3.axisBottom(x).tickValues([]));
    this.svg.append("g")
      .call(
        d3.axisLeft(y)
          .tickValues([0, 0.55, 1.1])
          .tickFormat(d3.format(".2f"))
      );
    this.svg.selectAll("bars")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", (d: any) => (x(d.Framework) || 0) + adjustedBarSpacing / 2)
      .attr("y", (d: any) => y(Number(d.Stars)))
      .attr("width", adjustedBarWidth)
      .attr("height", (d: any) => this.height - y(Number(d.Stars)))
      .attr("fill", "#d2d2d2");
    this.svg.selectAll(".bar-label")
      .data(data)
      .enter()
      .append("text")
      .attr("class", "bar-label")
      .attr("x", (d: any) => (x(d.Framework) || 0) + adjustedBarSpacing / 2 + adjustedBarWidth / 2)
      .attr("y", (d: any) => y(Number(d.Stars)) - 5)
      .attr("text-anchor", "middle")
      .text((d: any) => d.Stars)
      .style("fill", "black");
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

  updateSelectedResourceCount(): void {
    this.selectedResourceCount = this.resources.filter(resource => resource.isSelected).length;
  }

  updateSelectedInstanceCount(): void {
    this.selectedInstanceCount = this.instances.filter(instance => instance.isSelected).length;
  }

  updateHeaderValues(): void {
    const accountsHeader: Element | null = document.querySelector(".fields-header12.bold-blue1");
    const subscriptionsHeader: Element | null = document.querySelector(".fields-header12.bold-blue2");
    const resourceGroupHeader: Element | null = document.querySelector(".fields-header12.bold-blue3");
    const instancesHeader: Element | null = document.querySelector(".fields-header12.bold-blue4");
    const scheduleInstancesHeader: Element | null = document.querySelector(".fields-header12.bold-green");
    const scaledInstancesHeader: Element | null = document.querySelector(".fields-header12.bold-green1");

    if (accountsHeader) {
      accountsHeader.textContent = "1";
    }
    if (subscriptionsHeader) {
      subscriptionsHeader.textContent = "1";
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

  fetchAverageSavings(): void {
    const idCompany = 1;
    this.cpuAnalysisService.getAverageSavingsValues(idCompany).subscribe(response => {
      if (response && response.data && response.data.overallSaving && response.data.overallSaving.avgOverallSavings !== undefined) {
        this.avgOverallSavings = response.data.overallSaving.avgOverallSavings;
        console.log('avgOverallSavings Data fetched successfully: ', this.avgOverallSavings);
      } else {
        console.error('No data available or unexpected response format.', response);
      }
    }, error => {
      console.error('Error fetching data:', error);
    });
}


  fetchAverageCost(): void {
      const idCompany = 1;
      this.cpuAnalysisService.getAverageCostValues(idCompany).subscribe(response => {
        if (response && response.data && response.data.overallCost && response.data.overallCost.avgOverallCost !== undefined) {
          this.avgOverallCost = response.data.overallCost.avgOverallCost;
          console.log('avgOverallCost Data fetched successfully: ', this.avgOverallCost);
        } else {
          console.error('No data available or unexpected response format.', response);
        }
      }, error => {
        console.error('Error fetching data:', error);
      });
  }
  fetchTopOffenders(): void { 
      const idCompany = 1;
      this.cpuAnalysisService.getTopOffenderValues(idCompany).subscribe(response => {
        if (response && response.data && response.data.length > 0) {
          this.average_CPU_Usage = response.data[0].average_CPU_Usage;
          console.log('Top Offenders Data fetched successfully: ', this.average_CPU_Usage);
        } else {
          console.error('No data available or unexpected response format.', response);
        }
      }, error => {
        console.error('Error fetching data:', error);
      });
  }

  fetchUsageAverage(): void {
    const idCompany = 1;
    this.cpuAnalysisService.getUsageAverageValues(idCompany).subscribe(response => {
      if (response && response.data && response.data.length > 0 && response.data[0].usageAverage && response.data[0].usageAverage.avgCpuUsage !== undefined) {
        this.usageAverage = response.data[0].usageAverage.avgCpuUsage;
        console.log('Usage Average Data fetched successfully: ', this.usageAverage);
      } else {
        console.error('No data available or unexpected response format.', response);
      }
    }, error => {
      console.error('Error fetching data:', error);
    });
}


fetchUsageAnalysis(): void {
  const idCompany = 8;
  const referenceDate = new Date('2023-03-04');
  this.cpuAnalysisService.getUsageAnalysis(idCompany, referenceDate).subscribe(response => {
    if (response && response.data && response.data.length > 0 && response.data[0].usageAnalysis && response.data[0].usageAnalysis.avgUsageAnalysis !== undefined) {
      this.avgUsageAnalysis = response.data[0].usageAnalysis.avgUsageAnalysis;
      console.log('Usage Analysis Data fetched successfully:', this.avgUsageAnalysis); 
    } else {
      console.error('No data available or unexpected response format.', response);
    }
  },
  error => {
    console.error('Error fetching Usage Analysis Data:', error);
    alert('Failed to fetch Usage Analysis Data. Please try again later.');
  }
);
}


fetchPeakUsage(): void {
  const idCompany = 8;
  const referenceDate = new Date('2023-05-02');
  this.cpuAnalysisService.getPeakUsage(idCompany, referenceDate).subscribe(response => {
    if (response && response.data && response.data.length > 0 && response.data[0].peakResourceUsage && response.data[0].peakResourceUsage.usage !== undefined) {
      this.peakUsage = response.data[0].peakResourceUsage.usage;
      console.log('Peak Usage Data fetched successfully:', this.peakUsage);
    } else {
      console.error('No data available or unexpected response format.', response);
    }
  },
  error => {
    console.error('Error fetching Peak Usage Data:', error);
    alert('Failed to fetch Peak Usage Data. Please try again later.');
  }
);
}

  fetchIdleUsage(): void {
    const idCompany = 1;
    const referenceDate = new Date('2023-04-21');
    this.cpuAnalysisService.getIdleUsage(idCompany, referenceDate).subscribe(response => {
        this.idleUsage = response.data[0].usage;
        console.log('Idle Usage Data fetched successfully:', this.idleUsage);
      },
      error => {
        console.error('Error fetching Idle Usage Data:', error);
        // alert('Failed to fetch Idle Usage Data. Please try again later.');
      }
    );
  }
  
}