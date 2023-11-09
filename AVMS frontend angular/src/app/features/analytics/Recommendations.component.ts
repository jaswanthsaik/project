import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from '@angular/router';
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import * as am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import { BreadcrumbsItem } from "src/app/shared/models/breadcrumbs-item";
import * as Highcharts from 'highcharts';
import HighchartsMore from 'highcharts/highcharts-more';
import HighchartsTreemap from 'highcharts/modules/treemap';
import HC_exporting from 'highcharts/modules/exporting';
import { RecommendationsService } from "src/app/recommendations.service";
import { RecommendationData } from "src/app/data-models";

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
  selector: 'app-Recommendations',
  templateUrl: './Recommendations.component.html',
  styleUrls: ['./Recommendations.component.scss']
})

export class Recommendations implements OnInit {
  // tableData = [
  //   { resourceName: 'apigwvm 1', resourceType: 'Subscription', resourceTypeName: 'HighAvailability', impact: 'Medium', subscription: 'apigw', category: 'Azure subscription 1' },
  //   { resourceName: 'apigwvm 2', resourceType: 'Subscription', resourceTypeName: 'HighAvailability', impact: 'Medium', subscription: 'apigw', category: 'Azure subscription 1' },
  //   { resourceName: 'Fedora', resourceType: 'Subscription', resourceTypeName: 'HighAvailability', impact: 'Medium', subscription: 'Rgroup3', category: 'Azure subscription 1' },
  //   { resourceName: 'Kiran', resourceType: 'Subscription', resourceTypeName: 'HighAvailability', impact: 'Medium', subscription: 'myrg', category: 'Azure subscription 1' },
  //   { resourceName: 'Kiran2', resourceType: 'VirtualMachine', resourceTypeName: 'HighAvailability', impact: 'Low', subscription: 'myrg', category: 'Azure subscription 1' },
  //   { resourceName: 'Kiran3', resourceType: 'Subscription', resourceTypeName: 'Cost', impact: 'High', subscription: 'myrg', category: 'Azure subscription 1' },
  //   { resourceName: 'linux', resourceType: 'Subscription', resourceTypeName: 'HighAvailability', impact: 'Medium', subscription: 'myrg', category: 'Azure subscription 1' },
  //   { resourceName: 'project', resourceType: 'Subscription', resourceTypeName: 'HighAvailability', impact: 'Medium', subscription: 'apigw', category: 'Azure subscription 1' },
  //   { resourceName: 'RedHat', resourceType: 'Subscription', resourceTypeName: 'HighAvailability', impact: 'Medium', subscription: 'Rgroup2', category: 'Azure subscription 1' },
  //   { resourceName: 'ubntu', resourceType: 'Subscription', resourceTypeName: 'HighAvailability', impact: 'Medium', subscription: 'Rgroup1', category: 'Azure subscription 1' },
  // ];
  public tableData: RecommendationData[] = [];
  chart: any;

  breadcrumbs: BreadcrumbsItem[] = [
    { label: 'Home', url: '/' },
    { label: 'analytics', url: '' },
  ];

  selectedSummary: number | null = null;

  constructor(
    private router: Router,
    private recommendationService: RecommendationsService,
    ) { }

  showUserData(summaryIndex: number): void {
    this.selectedSummary = summaryIndex;
    if (summaryIndex === 1) {
      this.router.navigate(["/analytics"]);
    }
    if (summaryIndex === 2) {
      this.router.navigate(["/analytics."]);
    }
    if (summaryIndex === 3) {
      this.router.navigate(["/analytics.."]);
    }
    if (summaryIndex === 5) {
      this.router.navigate(["/analytics...."]);
    }
  }

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
    const defaultSummaryIndex = 4;
    this.showUserData(defaultSummaryIndex);
    this.showUserData(defaultSummaryIndex);
    this.recommendationService.fetchRecommendations()
    .subscribe(
      data => {
        this.tableData = data;
      },
      error => {
        console.error("Failed to fetch recommendations:", error);
      }
    );

    Highcharts.chart("container1", {
      series: [
        {
          type: "treemap",
          layoutAlgorithm: "stripes",
          layoutStartingDirection: "horizontal",
          alternateStartingDirection: true,
          borderColor: "#fff",
          borderRadius: 0,
          borderWidth: 2,
          dataLabels: {
            style: {
              textOutline: "none",
            },
            formatter: function () {
              if (this.point.name === "Medium") {
                return (
                  '<span style="color: #9f734f; font-size: 30px;">' +
                  this.point.name +
                  "</span>"
                );
              } else if (this.point.name === "High") {
                return (
                  '<span style="color: #a35251;">' +
                  this.point.name +
                  "</span>"
                );
              } else if (this.point.name === "Low") {
                return (
                  '<span style="color: #a7a561; font-size: 15px;">' +
                  this.point.name +
                  "</span>"
                );
              } else {
                return this.point.name;
              }
            },
          },
          levels: [
            {
              level: 1,
              layoutAlgorithm: "sliceAndDice",
              dataLabels: {
                enabled: true,
                align: "left",
                verticalAlign: "top",
                style: {
                  fontSize: "13px",
                  fontWeight: "normal",
                },
              },
            },
          ],
          data: [
            {
              id: "A",
              name: "Subscription",
              color: "#ffa65e",
              pointPadding: 2.2,
            },
            {
              id: "B",
              name: "Virtual Machine",
              color: "#fffa66",
            },
            {
              id: "C",
              name: "Subscription",
              color: "#ff5654",
            },
            {
              name: "Medium",
              title: "High Availability",
              parent: "A",
              value: 8,
            },
            {
              name: "Low",
              title: "High Availability",
              parent: "B",
              value: 1,
            },
            {
              name: "Low",
              title: "Cost",
              parent: "B",
              value: 1,
            },
            {
              name: "High",
              title: "Operational Expenses",
              parent: "C",
              value: 1,
            },
          ],
        },
      ],
      title: {
        text: "coloured by number of recommendations",
        align: "left",
        style: {
          fontSize: "15px",
          fontWeight: "normal",
        },
      },
      tooltip: {
        useHTML: true,
        pointFormat: "<b>{point.title}</b><b>{point.value}</b>",
      },
    });

    this.updateHeaderValues();
    this.selectedInstanceCount = this.instances.length;

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

  toggleResourceSelection(resource: Resource): void {
    resource.isSelected = !resource.isSelected;
    this.updateSelectedResourceCount();
    this.updateHeaderValues();
  }

  toggleInstanceSelection(instance: Instance): void {
    instance.isSelected = !instance.isSelected;
    this.updateSelectedInstanceCount();
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
    99999
    const allSelected = this.filteredSubscriptions.every(subscription => subscription.isSelected);

    if (allSelected) {
      this.filteredSubscriptions.forEach(subscription => (subscription.isSelected = false));
    } else {
      this.filteredSubscriptions.forEach(subscription => (subscription.isSelected = true));
    }

  }
}