import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { BreadcrumbsItem } from 'src/app/shared/models/breadcrumbs-item';
import { CatalogHttpService } from 'src/app/shared/services/catalog-http.service';
import { InstanceApiResponse } from '../../models/instance-api-response';
import { InstanceHttpService } from '../../services/instance-http.service';

@Component({
  selector: 'app-scaling-schedule',
  templateUrl: './scaling-schedule.component.html',
  styleUrls: ['./scaling-schedule.component.scss']
})
export class ScalingScheduleComponent implements OnInit, OnDestroy {
  subscriptionId = 0;
  resourceGroupId = 0;
  instanceId = 0;
  instance?: InstanceApiResponse;
  breadcrumbs: BreadcrumbsItem[] = [
    { label: 'Home', url: '/' },
    { label: 'Accounts', url: '/accounts' },
    { label: 'Account', url: '' },
    { label: 'Tenant', url: '' },
    { label: 'Subscription', url: '' },
    { label: 'Resource Group', url: '' },
    { label: 'Instance', url: '' },
  ];
  
  subs = new Subscription();
  
  constructor(
    private httpService: InstanceHttpService,
    private catalogHttpService: CatalogHttpService,
    private route: ActivatedRoute
    ) { }

    
  getInstanceComplete(): void {
    const sub = this.httpService.getInstanceComplete(this.instanceId).subscribe(res => {
      this.instance = res.data;
    });
    this.subs.add(sub);
  }

  getRoute(): void {
    const sub = this.catalogHttpService.getRouteByInstance(this.instanceId).subscribe(res => {
      this.resourceGroupId = res.data.resource_group;
      this.subscriptionId = res.data.subscription;
      this.breadcrumbs[6] = { label: res.data.instance_name, url: `/instance/${res.data.instance}` };
      this.breadcrumbs[5] = { label: res.data.resource_group_name, url: `/accounts/resourceGroup/${res.data.resource_group}` };
      this.breadcrumbs[4] = { label: res.data.subscription_name, url: `/accounts/subscription/${res.data.subscription}` };
      this.breadcrumbs[3] = { label: res.data.tenant_name, url: `` };
      this.breadcrumbs[2] = { label: res.data.account_name ?? 'Account', url: `/accounts/${res.data.account}` };
    });
    this.subs.add(sub);
  }

  ngOnInit(): void {
    this.instanceId = +(this.route.snapshot.paramMap.get('id') || '0');
    this.getRoute();
    this.getInstanceComplete();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

}
