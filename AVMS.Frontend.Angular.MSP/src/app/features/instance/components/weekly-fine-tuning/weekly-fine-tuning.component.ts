import { Component, OnDestroy, OnInit } from '@angular/core';
import { BreadcrumbsItem } from 'src/app/shared/models/breadcrumbs-item';
import { CatalogHttpService } from 'src/app/shared/services/catalog-http.service';
import { ActivatedRoute, Router } from '@angular/router';
import { InstanceHttpService } from '../../services/instance-http.service';
import { catchError, concatMap, delay, mergeMap, of, Subscription, tap, timer } from 'rxjs';
import { InstanceApiResponse } from '../../models/instance-api-response';
import { FineTuningEventAPIResponse } from '../../models/fine-tuning-api-response';
import { FineTuningScheduleEvent } from '../../models/fine-tuning-schedule-events';
import { NotifierService } from 'src/app/shared/services/notifier.service';
import { ApiError } from 'src/app/models/api-error';

@Component({
  selector: 'app-weekly-fine-tuning',
  templateUrl: './weekly-fine-tuning.component.html',
  styleUrls: ['./weekly-fine-tuning.component.scss']
})
export class WeeklyFineTuningComponent implements OnInit {
  breadcrumbs: BreadcrumbsItem[] = [
    { label: 'Home', url: '/' },
    { label: 'Accounts', url: '/accounts' },
    { label: 'Account', url: '' },
    { label: 'Tenant', url: '' },
    { label: 'Subscription', url: '' },
    { label: 'Resource Group', url: '' },
    { label: 'Instance', url: '' },
  ];
  instanceId = 0;
  subscriptionId = 0;
  resourceGroupId = 0;
  scheduleId = 0;
  subs = new Subscription();
  instance?: InstanceApiResponse;
  fineTuningScheduleEvents: any;
  timezone: any={};
  dataReceived: boolean = false;

  constructor(    
    private catalogHttpService: CatalogHttpService,
    private route: ActivatedRoute,
    private httpService: InstanceHttpService,
    private router: Router,
    private toaster: NotifierService,
    ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.scheduleId = params['scheduleId'];
    });
    this.instanceId = +(this.route.snapshot.paramMap.get('id') || '0');
    this.getRoute().then(() => {
      return this.getInstanceComplete();
    }).then(() => {
      return this.getFineTuningEvents();
    }).catch((error) => {
      console.log(error);
    });
  }

  async getRoute(): Promise<any> {
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

async getInstanceComplete(): Promise<any> {
  const sub = this.httpService.getInstanceComplete(this.instanceId).subscribe(res => {
    this.instance = res.data;
  });
  this.subs.add(sub);
}

async getFineTuningEvents(): Promise<any> {
  this.httpService.fineTuning(this.instanceId).subscribe(res => {
    this.fineTuningScheduleEvents = res.data.events;
    this.timezone = res.data.timeZone;
    this.dataReceived = true;
  });
}

eventsScheduled(events: FineTuningScheduleEvent): void {
  events.schedule = this.scheduleId;
  events.schedule_name = this.instance?.schedule_name;
  const virtualMachineID = this.instance?.instance
  this.httpService.addFineTuningScheduleEvents(virtualMachineID, events).pipe(
    catchError(err => {
      const error = err.error as ApiError;
      this.toaster.showError('Failed', error.message.join('\n'));
      throw err;
    }),
    tap(() => {
      this.toaster.showSuccess('Well done!', 'Your schedule was successfully updated.');
    }),
    delay(3000)
  ).subscribe(res => {
    this.close();
  });
}

close(): void {
  this.router.navigate(['/accounts/resourceGroup', this.resourceGroupId]);
}

ngOnDestroy(): void {
  this.subs.unsubscribe();
}

}
