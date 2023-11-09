import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { ActivatedRoute, Router } from '@angular/router';
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import * as am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import { BreadcrumbsItem } from "src/app/shared/models/breadcrumbs-item";
import { AnalyticsService } from "src/app/analytics.service";

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
const accountarray = [
  { "AccountName": "Dev Ensar Accounts" },
];
const tenantarray = [
  { "TenantName": "Dev Ensar Account - Home Tenant" },
];
const subscriptionarray = [
  { "SubscriptionName": "Azure Subscription 1" },
];
const resourcearray = [
  { "ResourceName": "apigw" },
  { "ResourceName": "Rgroup1" },
  { "ResourceName": "Rgroup2" },
  { "ResourceName": "Rgroup3" },
  { "ResourceName": "ST-rg" },
  { "ResourceName": "vnet" },
];


@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss']
})

export class analytics implements OnInit {
  chart: any;


  breadcrumbs: BreadcrumbsItem[] = [
    { label: 'Home', url: '/' },
    { label: 'analytics', url: '' },
  ];


  selectedSummary: number | null = null;
  isLoading: boolean = false;
  loadCounter: number = 0;
  loadStartTime: number = 0;



  constructor(private router: Router,
    private analyticsService: AnalyticsService,
  ) { }


  showUserData(summaryIndex: number): void {
    this.selectedSummary = summaryIndex;
    if (summaryIndex === 2) {
      this.router.navigate(["/analytics."]);
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

  initialResourceGroupCount: number = 6;
  initialScheduleInstanceCount: number = 6;
  initialScaledInstanceCount: number = 4;
  initialInstanceCount: number = 8;

  resourceGroupCount: number = 6;
  InstanceCount: number = 8;
  SelectedscheduleInstanceCount: number = 6;
  SelectedscaledInstanceCount: number = 4;

  instances: Instance[] = instancearray.map(instance => ({ ...instance, isSelected: false }));
  selectedInstanceCount!: number;
  showFilterForm: boolean = false;
  searchQuery: string = "";
  filteredInstances: Instance[] = [];

  resources: Resource[] = resourcearray.map(resource => ({ ...resource, isSelected: false }));
  selectedResourceCount!: number;
  showFilterForm9: boolean = false;
  searchQuery9: string = "";
  filteredResources: Resource[] = [];

  accounts = accountarray.map(account => ({ ...account, isSelected: false }));
  showFilterForm6: boolean = false;
  selectedAccountCount!: number;
  searchQuery6: string = "";
  filteredAccounts = this.accounts;


  tenants = tenantarray.map(tenant => ({ ...tenant, isSelected: false }));
  showFilterForm7: boolean = false;
  selectedTenantCount: number = 1;
  searchQuery7: string = "";
  filteredTenants = this.tenants;

  subscriptions = subscriptionarray.map(subscription => ({ ...subscription, isSelected: false }));
  showFilterForm8: boolean = false;
  selectedSubscriptionCount!: number;
  searchQuery8: string = "";
  filteredSubscriptions = this.subscriptions;

  scheduleInstanceCount!: number;
  scaledInstanceCount!: number;
  scheduledInstanceInDaysCount!: number;
  scaledInstanceInDaysCount!: number;
  peakUsageResourceCount!: number;
  IdleUsageResourceCount!:number

  ngOnInit(): void {
    const defaultSummaryIndex = 1;
    this.fetchAccountData();
    this.fetchSubscriptionData();
    this.fetchResourceGroupData();
    this.fetchInstanceData();
    this.fetchScheduledInstanceData();
    this.fetchScaledInstanceData();
    this.fetchScheduledInstanceInDaysData();
    this.fetchScaledInstanceInDaysData();
    this.fetchPeakUsageResourceData();
    this.fetchIdleUsageResourceData();
    this.showUserData(defaultSummaryIndex);
    this.showUserData(defaultSummaryIndex);



    // Chart 1 - chartdiv
    let root1 = am5.Root.new("chartdiv");

    let chart1 = root1.container.children.push(am5xy.XYChart.new(root1, {
      panX: false,
      panY: false,
      wheelX: "panX",
      wheelY: "zoomX",
      layout: root1.verticalLayout
    }));

    let xRenderer1 = am5xy.AxisRendererX.new(root1, {});

    let xAxis1 = chart1.xAxes.push(am5xy.CategoryAxis.new(root1, {
      categoryField: "year",
      renderer: xRenderer1,
      tooltip: am5.Tooltip.new(root1, {})
    }));

    xRenderer1.grid.template.setAll({
      location: 1
    });

    let data1 = [
      {
        "year": "East US",
        "scheduled and scaled": 0.110,
        "scheduled only": 0.18,
        "scaled only": 0.110,
        "neither": 0.110,
        "white": 3.1,
      }
    ];

    xAxis1.data.setAll(data1);

    let yAxis1 = chart1.yAxes.push(am5xy.ValueAxis.new(root1, {
      min: 0,
      max: 14,
      strictMinMax: true,
      calculateTotals: true,
      renderer: am5xy.AxisRendererY.new(root1, {
        strokeOpacity: 0.1
      })
    }));

    let legend1 = chart1.children.unshift(am5.Legend.new(root1, {
      centerX: am5.p50,
      x: am5.p50,
    }));

    function makeSeries1(name: string, fieldName: string, color: am5.Color, columnWidth: number) {
      let series1 = chart1.series.push(am5xy.ColumnSeries.new(root1, {
        name: name,
        stacked: true,
        xAxis: xAxis1,
        yAxis: yAxis1,
        valueYField: fieldName,
        valueYShow: "valueYTotalPercent",
        categoryXField: "year",
        fill: color,
      }));

      series1.columns.template.set("width", am5.percent(columnWidth * 18));

      series1.columns.template.setAll({
        tooltipText: "{categoryX}\n{name}:{valueYTotalPercent.formatNumber('#.#')}",
        tooltipY: am5.percent(1)
      });

      series1.data.setAll(data1);
      series1.appear();
      series1.bullets.push(function () {
        return am5.Bullet.new(root1, {
          sprite: am5.Label.new(root1, {
            text: "{valueYTotalPercent.formatNumber('#.#')}",
            fill: root1.interfaceColors.get("alternativeText"),
            centerY: am5.p50,
            centerX: am5.p50,
            populateText: true
          })
        });
      });

      legend1.data.push(series1);
    }

    makeSeries1("scheduled and scaled", "scheduled and scaled", am5.color("#006580"), 0.6);
    makeSeries1("scheduled only", "scheduled only", am5.color("#e0bd8d"), 0.6);
    makeSeries1("scaled only", "scaled only", am5.color("#10cfc9"), 0.6);
    makeSeries1("neither", "neither", am5.color("#87205d"), 0.6);
    makeSeries1("", "white", am5.color("#ffffff"), 0.6);

    chart1.appear(1000);

    // Chart 2 - chartdiv1
    let root2 = am5.Root.new("chartdiv1");

    let myTheme = am5.Theme.new(root2);

    myTheme.rule("Grid", ["base"]).setAll({
      strokeOpacity: 0.1
    });

    let chart2 = root2.container.children.push(am5xy.XYChart.new(root2, {
      panX: false,
      panY: false,
      wheelX: "panY",
      wheelY: "zoomY",
      layout: root2.verticalLayout
    }));

    let data2 = [{
      "year": "Dev Ensar Accounts",
      "europe": 8,
    }];

    let yRenderer2 = am5xy.AxisRendererY.new(root2, {});
    let yAxis2 = chart2.yAxes.push(am5xy.CategoryAxis.new(root2, {
      categoryField: "year",
      renderer: yRenderer2,
      tooltip: am5.Tooltip.new(root2, {})
    }));

    yRenderer2.grid.template.setAll({
      location: 1
    });

    yAxis2.data.setAll(data2);

    let xAxis2 = chart2.xAxes.push(am5xy.ValueAxis.new(root2, {
      min: 0,
      renderer: am5xy.AxisRendererX.new(root2, {
        strokeOpacity: 0.1
      })
    }));

    let legend2 = chart2.children.push(am5.Legend.new(root2, {
      centerX: am5.p50,
      x: am5.p50,
    }));

    function makeSeries2(name: string, fieldName: string, color: am5.Color,) {
      let series2 = chart2.series.push(am5xy.ColumnSeries.new(root2, {
        name: name,
        stacked: true,
        xAxis: xAxis2,
        yAxis: yAxis2,
        baseAxis: yAxis2,
        valueXField: fieldName,
        categoryYField: "year",
        fill: color
      }));

      series2.columns.template.set("width", am5.percent(100));
      series2.columns.template.set("height", am5.percent(30));

      series2.columns.template.setAll({
        tooltipText: "{name}, {categoryY}: {valueX}",
        tooltipY: am5.percent(90)
      });
      series2.data.setAll(data2);

      series2.appear();

      series2.bullets.push(function () {
        return am5.Bullet.new(root2, {
          sprite: am5.Label.new(root2, {
            text: "{valueX}",
            fill: root2.interfaceColors.get("alternativeText"),
            centerY: am5.p50,
            centerX: am5.p50,
            populateText: true
          })
        });
      });
    }

    makeSeries2("", "europe", am5.color("#006580"));

    chart2.appear(1000, 100);


    // this.updateHeaderValues();
    // this.selectedInstanceCount = this.instances.length;
    // this.initialResourceGroupCount = this.resourceGroupCount;
    // this.initialScheduleInstanceCount = this.scheduleInstanceCount;
    // this.initialScaledInstanceCount = this.scaledInstanceCount;
    // this.initialInstanceCount = this.initialInstanceCount;
    // this.selectedResourceCount = this.resources.length;

    // this.updateHeaderValuesForResource();
    // // this.selectedInstanceCount = this.instances.length;
    // // this.initialResourceGroupCount = this.resourceGroupCount;
    // // this.initialScheduleInstanceCount = this.scheduleInstanceCount;
    // // this.initialScaledInstanceCount = this.scaledInstanceCount;
    // // this.initialInstanceCount = this.initialInstanceCount;
    // this.selectedResourceCount = this.resources.length;
    // this.InstanceCount = this.instances.length;



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
    // this.updateSelectedInstanceCount();
  }

  toggleFilterForm9(): void {
    this.showFilterForm9 = !this.showFilterForm9;
    if (this.showFilterForm9) {
      this.filteredResources = this.resources;
    } else {
      this.filteredResources = [];
    }
    // this.updateSelectedResourceCount();
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
    // this.updateSelectedInstanceCount();
  }

  filterResources(): void {
    this.filteredResources = this.resources.filter(resource =>
      resource.ResourceName.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
    // this.updateSelectedResourceCount();
  }

  toggleInstanceSelection(instance: Instance): void {
    instance.isSelected = !instance.isSelected;
    // this.updateSelectedInstanceCount();
    // this.updateResourceGroupCount();
    // this.updateScheduleInstanceCount();
    // this.updateScaledInstanceCount();
    // this.updateHeaderValues();
  }

  toggleResourceSelection(resource: Resource): void {
    resource.isSelected = !resource.isSelected;
    // this.updateResourceGroupCount();
    // this.updateScheduleInstanceCount();
    // this.updateScaledInstanceCount();
    // this.updateHeaderValues();
    // this.updateHeaderValuesForResource();
    // this.updateSelectedResourceCount();
    // this.updateInstanceCount();
    // this.updateSelectedScheduleInstanceCount();
    // this.updateSelectedScaledInstanceCount();
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

  // updateSelectedInstanceCount(): void {
  //   this.selectedInstanceCount = this.instances.filter(instance => instance.isSelected).length;
  // }

  // updateSelectedResourceCount(): void {
  //   this.selectedResourceCount = this.resources.filter(resource => resource.isSelected).length;
  // }
  // updateInstanceCount(): void {
  //   this.InstanceCount = this.resources.filter(resource => resource.isSelected).length;
  // }
  // updateSelectedScheduleInstanceCount(): void {
  //   this.SelectedscheduleInstanceCount = this.resources.filter(resource => resource.isSelected).length;
  // }
  // updateSelectedScaledInstanceCount(): void {
  //   this.SelectedscaledInstanceCount = this.resources.filter(resource => resource.isSelected).length;
  // }
  // updateResourceGroupCount(): void {
  //   this.resourceGroupCount = this.instances.filter(instance => instance.isSelected).length;
  // }

  // updateScheduleInstanceCount(): void {
  //   this.scheduleInstanceCount = this.instances.filter(instance => instance.isSelected).length;
  // }

  // updateScaledInstanceCount(): void {
  //   this.scaledInstanceCount = this.instances.filter(instance => instance.isSelected).length;
  // }

  // updateHeaderValues(): void {
  //   const accountsHeader: Element | null = document.querySelector(".fields-header12.bold-blue1");
  //   const subscriptionsHeader: Element | null = document.querySelector(".fields-header12.bold-blue2");
  //   const resourceGroupHeader: Element | null = document.querySelector(".fields-header12.bold-blue3");
  //   const instancesHeader: Element | null = document.querySelector(".fields-header12.bold-blue4");
  //   const scheduleInstancesHeader: Element | null = document.querySelector(".fields-header12.bold-green");
  //   const scaledInstancesHeader: Element | null = document.querySelector(".fields-header12.bold-green1");

  //   if (accountsHeader) {
  //     accountsHeader.textContent;
  //   }
  //   if (subscriptionsHeader) {
  //     subscriptionsHeader.textContent;
  //   }
  //   if (resourceGroupHeader) {
  //     resourceGroupHeader.textContent = this.resourceGroupCount === 0 ? this.initialResourceGroupCount.toString() : this.resourceGroupCount.toString();
  //   }
  //   if (instancesHeader) {
  //     instancesHeader.textContent = this.selectedInstanceCount === 0 ? this.initialInstanceCount.toString() : this.selectedInstanceCount.toString();
  //   }
  //   if (scheduleInstancesHeader) {
  //     scheduleInstancesHeader.textContent = this.scheduleInstanceCount === 0 ? this.initialScheduleInstanceCount.toString() : this.scheduleInstanceCount.toString();
  //   }
  //   if (scaledInstancesHeader) {
  //     scaledInstancesHeader.textContent = this.scaledInstanceCount === 0 ? this.initialScaledInstanceCount.toString() : this.scaledInstanceCount.toString();
  //   }
  // }


  // updateHeaderValuesForResource(): void {
  //   const resourceGroupHeader: Element | null = document.querySelector(".fields-header12.bold-blue3");
  //   const instancesHeader: Element | null = document.querySelector(".fields-header12.bold-blue4");
  //   const scheduleInstancesHeader: Element | null = document.querySelector(".fields-header12.bold-green");
  //   const scaledInstancesHeader: Element | null = document.querySelector(".fields-header12.bold-green1");


  //   if (resourceGroupHeader) {
  //     resourceGroupHeader.textContent = this.selectedResourceCount === 0 ? this.initialResourceGroupCount.toString() : this.selectedResourceCount.toString();
  //   }
  //   if (instancesHeader) {
  //     instancesHeader.textContent = this.InstanceCount === 0 ? this.InstanceCount.toString() : this.InstanceCount.toString();
  //   }
  //   if (scheduleInstancesHeader) {
  //     scheduleInstancesHeader.textContent = this.SelectedscheduleInstanceCount === 0 ? this.SelectedscheduleInstanceCount.toString() : this.SelectedscheduleInstanceCount.toString();
  //   }
  //   if (scaledInstancesHeader) {
  //     scaledInstancesHeader.textContent = this.SelectedscaledInstanceCount === 0 ? this.SelectedscaledInstanceCount.toString() : this.SelectedscaledInstanceCount.toString();
  //   }
  // }


  deselectAllInstancesAndCloseForm(): void {
    this.instances.forEach(instance => (instance.isSelected = false));
    this.showFilterForm = false;
    // this.updateSelectedInstanceCount();
    // this.updateResourceGroupCount();
    // this.updateScheduleInstanceCount();
    // this.updateScaledInstanceCount();
    // this.updateHeaderValues();
  }

  deselectAllResourcesAndCloseForm(): void {
    this.resources.forEach(resource => (resource.isSelected = false));
    this.showFilterForm9 = false;
    // this.updateSelectedInstanceCount();
    // this.updateSelectedResourceCount();
    // this.updateResourceGroupCount();
    // this.updateScheduleInstanceCount();
    // this.updateScaledInstanceCount();
    // this.updateHeaderValues();
    // this.updateHeaderValuesForResource();
    // this.updateSelectedScheduleInstanceCount();
    // this.updateSelectedScaledInstanceCount();
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
    // this.updateSelectedInstanceCount();
    // this.updateResourceGroupCount();
    // this.updateScheduleInstanceCount();
    // this.updateScaledInstanceCount();
    // this.updateHeaderValues();

  }

  deselectAllResources(): void {
    this.resources.forEach(resource => (resource.isSelected = false));
    // this.updateSelectedInstanceCount();
    // this.updateSelectedResourceCount();
    // this.updateResourceGroupCount();
    // this.updateScheduleInstanceCount();
    // this.updateScaledInstanceCount();
    // this.updateHeaderValues();
    // this.updateHeaderValuesForResource();
    // this.updateSelectedScheduleInstanceCount();
    // this.updateSelectedScaledInstanceCount();
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
    // this.updateHeaderValues();
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
    this.filteredSubscriptions.forEach((subscription, index) => {
      this.subscriptions[index].isSelected = subscription.isSelected;
    });
    this.filteredResources.forEach((resource, index) => {
      this.resources[index].isSelected = resource.isSelected;
    });
    // this.updateSelectedResourceCount();
    // this.updateSelectedInstanceCount();
    // this.updateResourceGroupCount();
    // this.updateScheduleInstanceCount();
    // this.updateScaledInstanceCount();
    // this.updateHeaderValues();
    // this.updateHeaderValuesForResource();
    // this.updateSelectedScheduleInstanceCount();
    // this.updateSelectedScaledInstanceCount();
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

    // this.updateSelectedInstanceCount();
    // this.updateResourceGroupCount();
    // this.updateScheduleInstanceCount();
    // this.updateScaledInstanceCount();
    // this.updateHeaderValues();
  }

  toggleSelectAllResources(): void {
    const allSelected = this.filteredResources.every(resource => resource.isSelected);

    if (allSelected) {
      this.filteredResources.forEach(resource => (resource.isSelected = false));
    } else {
      this.filteredResources.forEach(resource => (resource.isSelected = true));
    }

    // this.updateSelectedResourceCount();
    // this.updateSelectedInstanceCount();
    // this.updateResourceGroupCount();
    // this.updateScheduleInstanceCount();
    // this.updateScaledInstanceCount();
    // this.updateHeaderValues();
    // this.updateHeaderValuesForResource();
    // this.updateSelectedScheduleInstanceCount();
    // this.updateSelectedScaledInstanceCount();
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
  startLoad() {
    this.loadStartTime = new Date().getTime(); 
    this.loadCounter++;
    this.isLoading = this.loadCounter > 0;
  }
  
  endLoad() {
    this.loadCounter--;
    this.isLoading = this.loadCounter > 0;
    if (!this.isLoading) {
      const endTime = new Date().getTime();
      const duration = (endTime - this.loadStartTime) / 1000; 
      console.log('Loader spin duration:', duration, 'seconds'); 
    }
  }
  
  fetchAccountData() {
    this.startLoad(); 
    const flDeleted = 0;
    const idCompany = 25;
    
    this.analyticsService.getAccounts(flDeleted, idCompany).subscribe({
      next: (data: any) => {
        this.selectedAccountCount = data.count;
        const endTime = new Date().getTime();
        const duration = (endTime - this.loadStartTime) / 1000; 
        console.log('Account Data fetched successfully in:', duration, 'seconds', data);
        this.endLoad();  
      },
      error: (error: any) => {
        const endTime = new Date().getTime();
        const duration = (endTime - this.loadStartTime) / 1000; 
        console.error('Error fetching account data:', error, 'Time taken:', duration, 'seconds');
        this.endLoad(); 
      }
    });
  }
  
  
  fetchSubscriptionData() {
    this.startLoad();  
    const flDeleted = 0;
    const idCompany = 25;
    
    this.analyticsService.getSubscriptions(flDeleted, idCompany).subscribe({
      next: (data: any) => {
        this.selectedSubscriptionCount = data.count;
        const endTime = new Date().getTime();
        const duration = (endTime - this.loadStartTime) / 1000;  
        console.log('Subscription data fetched successfully in:', duration, 'seconds', data);
        this.endLoad();  
      },
      error: (error: any) => {
        const endTime = new Date().getTime();
        const duration = (endTime - this.loadStartTime) / 1000;  
        console.error('Error fetching subscription data:', error, 'Time taken:', duration, 'seconds');
        this.endLoad();  
      }
    });
  }

fetchResourceGroupData() {
  this.startLoad();
  const idCompany = 25;

  this.analyticsService.getResourceGroup(idCompany).subscribe({
    next: (data: any) => {
      this.resourceGroupCount = data.count;
      const endTime = new Date().getTime();
      const duration = (endTime - this.loadStartTime) / 1000;
      console.log('Resource Group data fetched successfully in:', duration, 'seconds', data);
      this.endLoad();
    },
    error: (error: any) => {
      const endTime = new Date().getTime();
      const duration = (endTime - this.loadStartTime) / 1000;
      console.error('Error fetching resource group data:', error, 'Time taken:', duration, 'seconds');
      this.endLoad();
    }
  });
}

fetchInstanceData() {
  this.startLoad();
  const idCompany = 25;

  this.analyticsService.getInstance(idCompany).subscribe({
    next: (data: any) => {
      this.selectedInstanceCount = data.count;
      const endTime = new Date().getTime();
      const duration = (endTime - this.loadStartTime) / 1000;
      console.log('Instance data fetched successfully in:', duration, 'seconds', data);
      this.endLoad();
    },
    error: (error: any) => {
      const endTime = new Date().getTime();
      const duration = (endTime - this.loadStartTime) / 1000;
      console.error('Error fetching instance data:', error, 'Time taken:', duration, 'seconds');
      this.endLoad();
    }
  });
}
fetchScheduledInstanceData() {
  this.startLoad();
  const idCompany = 25;
  
  this.analyticsService.getScheduledInstance(idCompany).subscribe({
    next: (data: any) => {
      this.scheduleInstanceCount = data.count;
      const endTime = new Date().getTime();
      const duration = (endTime - this.loadStartTime) / 1000;
      console.log('Schedule instance data fetched successfully in:', duration, 'seconds', data);
      this.endLoad();
    },
    error: (error: any) => {
      const endTime = new Date().getTime();
      const duration = (endTime - this.loadStartTime) / 1000;
      console.error('Schedule Error fetching instance data:', error, 'Time taken:', duration, 'seconds');
      this.endLoad();
    }
  });
}

fetchScaledInstanceData() {
  this.startLoad();
  const idCompany = 25;

  this.analyticsService.getScaledInstance(idCompany).subscribe({
    next: (data: any) => {
      this.scaledInstanceCount = data.count;
      const endTime = new Date().getTime();
      const duration = (endTime - this.loadStartTime) / 1000;
      console.log('Scaled Instance data fetched successfully in:', duration, 'seconds', data);
      this.endLoad();
    },
    error: (error: any) => {
      const endTime = new Date().getTime();
      const duration = (endTime - this.loadStartTime) / 1000;
      console.error('Error fetching Scaled instance data:', error, 'Time taken:', duration, 'seconds');
      this.endLoad();
    }
  });
}
fetchScheduledInstanceInDaysData() {
  this.startLoad();
  const idCompany = 25;

  this.analyticsService.getScheduledInstanceInDays(idCompany).subscribe({
    next: (data: any) => {
      this.scheduledInstanceInDaysCount = data.count;
      const endTime = new Date().getTime();
      const duration = (endTime - this.loadStartTime) / 1000;
      console.log('ScheduledInstanceInDaysData data fetched successfully in:', duration, 'seconds', data);
      this.endLoad();
    },
    error: (error: any) => {
      const endTime = new Date().getTime();
      const duration = (endTime - this.loadStartTime) / 1000;
      console.error('Error fetching Scaled instance data:', error, 'Time taken:', duration, 'seconds');
      this.endLoad();
    }
  });
}

fetchScaledInstanceInDaysData() {
  this.startLoad();
  const idCompany = 25;

  this.analyticsService.getScaledInstanceInDays(idCompany).subscribe({
    next: (data: any) => {
      this.scaledInstanceInDaysCount = data.count;
      const endTime = new Date().getTime();
      const duration = (endTime - this.loadStartTime) / 1000;
      console.log('scaledInstanceInDaysCount data fetched successfully in:', duration, 'seconds', data);
      this.endLoad();
    },
    error: (error: any) => {
      const endTime = new Date().getTime();
      const duration = (endTime - this.loadStartTime) / 1000;
      console.error('Error fetching Scaled instance data:', error, 'Time taken:', duration, 'seconds');
      this.endLoad();
    }
  });
}

fetchPeakUsageResourceData() {
  this.startLoad();
  const idCompany = 25;

  this.analyticsService.getPeakUsageResource(idCompany).subscribe({
    next: (data: any) => {
      this.peakUsageResourceCount = data.count;
      const endTime = new Date().getTime();
      const duration = (endTime - this.loadStartTime) / 1000;
      console.log('peakUsageResourceCount data fetched successfully in:', duration, 'seconds', data);
      this.endLoad();
    },
    error: (error: any) => {
      const endTime = new Date().getTime();
      const duration = (endTime - this.loadStartTime) / 1000;
      console.error('Error fetching Scaled instance data:', error, 'Time taken:', duration, 'seconds');
      this.endLoad();
    }
  });
}
fetchIdleUsageResourceData() {
  this.startLoad();
  const idCompany = 25;

  this.analyticsService.getIdleUsageResource(idCompany).subscribe({
    next: (data: any) => {
      this.IdleUsageResourceCount = data.count;
      const endTime = new Date().getTime();
      const duration = (endTime - this.loadStartTime) / 1000;
      console.log('IdleUsageResourceCount data fetched successfully in:', duration, 'seconds', data);
      this.endLoad();
    },
    error: (error: any) => {
      const endTime = new Date().getTime();
      const duration = (endTime - this.loadStartTime) / 1000;
      console.error('Error fetching Scaled instance data:', error, 'Time taken:', duration, 'seconds');
      this.endLoad();
    }
  });
}
  

}