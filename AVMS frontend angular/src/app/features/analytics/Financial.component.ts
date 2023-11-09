import { Component, OnInit } from "@angular/core";
import { Router } from '@angular/router';
import { BreadcrumbsItem } from "src/app/shared/models/breadcrumbs-item";
import { format } from 'd3';



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
  selector: 'app-Financial',
  templateUrl: './Financial.component.html',
  styleUrls: ['./Financial.component.scss']
})
export class Financial implements OnInit {
  tableData = [
    { resourceName: 'Fedora', resourceType: '$50.64', resourceTypeName: '$122.40', },
    { resourceName: 'ProjectServer', resourceType: '$33.84', resourceTypeName: '$44.16', },
    { resourceName: 'ProjectServer2', resourceType: '$113.28', resourceTypeName: '$225.84', },
    { resourceName: 'RedHat', resourceType: '$60.48', resourceTypeName: '$79.20', },
    { resourceName: 'samplevirtualmachine', resourceType: '0.00', resourceTypeName: '$2.88', },
    { resourceName: 'ubuntu', resourceType: '$140.64', resourceTypeName: '$64.56', },
    { resourceName: 'vpnvm1', resourceType: '$6.96', resourceTypeName: '$2.16', },
    { resourceName: 'windowstestvm', resourceType: '$6.24', resourceTypeName: '$1.92', },
  ];

  chart: any;

  breadcrumbs: BreadcrumbsItem[] = [
    { label: 'Home', url: '/' },
    { label: 'analytics', url: '' },
  ];

  selectedSummary: number | null = null;



  mainChartData = [
    {
      name: 'Series 1',
      series: [
        { name: '1', value: 4 },
        { name: '2', value: 1.5 },
        { name: '3', value: 11.5 },
        { name: '4', value: 10.8 },
        { name: '6', value: 14 },
        { name: '8', value: 8 },
        { name: '9', value: 13 },
        { name: '11', value: 5 },
        { name: '13', value: 7 },
        { name: '14', value: 11.8 },
        { name: '16', value: 7.5 },
        { name: '18', value: 10 },
        { name: '19', value: 8.5 },
        { name: '20', value: 10 },
        { name: '22', value: 15.5 },
        { name: '24', value: 4 },
        { name: '26', value: 11 },
        { name: '27', value: 6.8 },
        { name: '29', value: 7 },
        { name: '31', value: 3 },
        { name: '32', value: 8 },
        { name: '33', value: 7 },
        { name: '34', value: 10 },
        { name: '36', value: 11.5 },
        { name: '38', value: 14.2 },
        { name: '39', value: 12.5 },
        { name: '41', value: 16.5 },
        { name: '43', value: 12 },
        { name: '44', value: 10 },
        { name: '46', value: 14 },
        { name: '48', value: 12 },
        { name: '49', value: 12.4 },
        { name: '50', value: 20 },
        { name: '51', value: 18 },
        { name: '52', value: 9 },
        { name: '53', value: 15 },
        { name: '54', value: 14 },
        { name: '55', value: 8 },
        { name: '56', value: 8.5 },
        { name: '57', value: 18 },
        { name: '58', value: 7 },
      ],
    },
  ];

  miniChartData = [
    {
      name: 'Series 1',
      series: [
        { name: '1', value: 4 },
        { name: '2', value: 1.5 },
        { name: '3', value: 11.5 },
        { name: '4', value: 10.8 },
        { name: '6', value: 14 },
        { name: '8', value: 8 },
        { name: '9', value: 13 },
        { name: '11', value: 5 },
        { name: '13', value: 7 },
        { name: '14', value: 11.8 },
        { name: '16', value: 7.5 },
        { name: '18', value: 10 },
        { name: '19', value: 8.5 },
        { name: '20', value: 10 },
        { name: '22', value: 15.5 },
        { name: '24', value: 4 },
        { name: '26', value: 11 },
        { name: '27', value: 6.8 },
        { name: '29', value: 7 },
        { name: '31', value: 3 },
        { name: '32', value: 8 },
        { name: '33', value: 7 },
        { name: '34', value: 10 },
        { name: '36', value: 11.5 },
        { name: '38', value: 14.2 },
        { name: '39', value: 12.5 },
        { name: '41', value: 16.5 },
        { name: '43', value: 12 },
        { name: '44', value: 10 },
        { name: '46', value: 14 },
        { name: '48', value: 12 },
        { name: '49', value: 12.4 },
        { name: '50', value: 12 },
        { name: '51', value: 18 },
        { name: '52', value: 9 },
        { name: '53', value: 15 },
        { name: '54', value: 14 },
        { name: '55', value: 8 },
        { name: '56', value: 8.5 },
        { name: '57', value: 18 },
        { name: '58', value: 7 },
      ],
    },
  ];

  yAxisTickFormatting(value: any): string {
    return '$' + format(',.2f')(value);
  }
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
  mainChartData1 = [
    {
      name: 'Series 1',
      series: [
        { name: '1', value: 0 },
        { name: '2', value: 1.5 },
        { name: '3', value: 0 },
        { name: '4', value: 10.1 },
        { name: '6', value: 7 },
        { name: '8', value: 8 },
        { name: '9', value: 1 },
        { name: '11', value: 11 },
        { name: '13', value: 4 },
        { name: '14', value: 5 },
        { name: '16', value: 11 },
        { name: '18', value: 8 },
        { name: '19', value: 2.5 },
        { name: '20', value: 6 },
        { name: '22', value: 2 },
        { name: '24', value: 6 },
        { name: '26', value: 11 },
        { name: '27', value: 6.5 },
        { name: '29', value: 5.8 },
        { name: '31', value: 6.6 },
        { name: '32', value: 8 },
        { name: '33', value: 9 },
        { name: '34', value: 7 },
        { name: '36', value: 10.5 },
        { name: '38', value: 5 },
        { name: '39', value: 4 },
        { name: '41', value: 7 },
        { name: '43', value: 10 },
        { name: '44', value: 12 },
        { name: '46', value: 3 },
        { name: '48', value: 16 },
        { name: '49', value: 15.6 },
        { name: '50', value: 3.8 },
        { name: '51', value: 8.1 },
        { name: '52', value: 9 },
        { name: '53', value: 18 },
        { name: '54', value: 9 },
        { name: '55', value: 8 },
        { name: '56', value: 8.1 },
        { name: '57', value: 15 },
        { name: '58', value: 16 },
      ],
    },
  ];

  miniChartData1 = [
    {
      name: 'Series 1',
      series: [
        { name: '1', value: 4 },
        { name: '2', value: 1.5 },
        { name: '3', value: 11.5 },
        { name: '4', value: 10.8 },
        { name: '6', value: 14 },
        { name: '8', value: 8 },
        { name: '9', value: 13 },
        { name: '11', value: 5 },
        { name: '13', value: 7 },
        { name: '14', value: 11.8 },
        { name: '16', value: 7.5 },
        { name: '18', value: 10 },
        { name: '19', value: 8.5 },
        { name: '20', value: 10 },
        { name: '22', value: 15.5 },
        { name: '24', value: 4 },
        { name: '26', value: 11 },
        { name: '27', value: 6.8 },
        { name: '29', value: 7 },
        { name: '31', value: 3 },
        { name: '32', value: 8 },
        { name: '33', value: 7 },
        { name: '34', value: 10 },
        { name: '36', value: 11.5 },
        { name: '38', value: 14.2 },
        { name: '39', value: 12.5 },
        { name: '41', value: 16.5 },
        { name: '43', value: 12 },
        { name: '44', value: 10 },
        { name: '46', value: 14 },
        { name: '48', value: 12 },
        { name: '49', value: 12.4 },
        { name: '50', value: 12 },
        { name: '51', value: 18 },
        { name: '52', value: 9 },
        { name: '53', value: 15 },
        { name: '54', value: 14 },
        { name: '55', value: 8 },
        { name: '56', value: 8.5 },
        { name: '57', value: 18 },
        { name: '58', value: 7 },
      ],
    },
  ];

  constructor(private router: Router) { }

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
    if (summaryIndex === 4) {
      this.router.navigate(["/analytics..."]);
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
    const defaultSummaryIndex = 5;
    this.showUserData(defaultSummaryIndex);
    this.showUserData(defaultSummaryIndex);

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
}
