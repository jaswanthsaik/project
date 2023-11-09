import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiRequestOptions } from 'src/app/models/api-request-options';
import { ApiResponse } from 'src/app/models/api-response';
import { environment } from 'src/environments/environment';
import { Account } from '../models/account';
import { AddAccount } from '../models/add-account';
import { AzureSubscription } from '../models/azure-subscription';
import { EditAccount } from '../models/edit-account';
import { Instance } from '../models/instance';
import { InstanceSize } from '../models/instance-size';
import { Postpone } from '../models/postpone';
import { Provider } from '../models/provider';
import { ResourceGroups } from '../models/resource-groups';
import { ScheduleApiResponse } from '../models/schedule-api-response';
import { Tenant } from '../models/tenant';

@Injectable({
  providedIn: 'root'
})
export class AccountsHttpService {
  accountApi = environment.baseAccountApiUrl;
  resourceApi = environment.baseResourceApiUrl;
  reportApi = environment.baseReportApiUrl;
  version = environment.apiVersion;

  constructor(
    private http: HttpClient,
    private datePipe: DatePipe
  ) { }
  
  getSingleAccount(accountId: number): Observable<ApiResponse<Account>> {
    const url = `${this.accountApi}Account/${this.version}/${accountId}/details`;
    return this.http.get(url) as Observable<ApiResponse<Account>>;
  }

  getAccounts(options:  ApiRequestOptions = new ApiRequestOptions()): Observable<ApiResponse<Account[]>> {
    let params = `?limit=${options.limit}&pageNo=${options.pageNo}`;
    params += options.provider ? `&provider=${options.provider}` : '';
    params += options.sortBy ? `&sortBy=${options.sortBy}` : '';
    params += options.sortDirection ? `&sortDirection=${options.sortDirection}` : '';
    params += options.filterText ? `&filterText=${options.filterText}` : '';
    const url = `${this.accountApi}Account/${this.version}${params}`;
    return this.http.get(url) as Observable<ApiResponse<Account[]>>;
  }

  addAzureAccount(account: AddAccount): Observable<ApiResponse<number>> {
    const url = `${this.accountApi}Account/${this.version}/azure`;
    return this.http.post(url, account) as Observable<ApiResponse<number>>;
  }

  editAccount(accountId: number, account: EditAccount): Observable<ApiResponse<number>> {
    const url = `${this.accountApi}Account/${this.version}/${accountId}`;
    return this.http.put(url, account) as Observable<ApiResponse<number>>;
  }

  deleteAccount(accountId: number): Observable<ApiResponse<boolean>> {
    const url = `${this.accountApi}Account/${this.version}/${accountId}`;
    return this.http.delete(url) as Observable<ApiResponse<boolean>>;
  }

  getTenantsByAccount(accountId: number, options:  ApiRequestOptions = new ApiRequestOptions()): Observable<ApiResponse<Tenant[]>> {
    let params = `?limit=${options.limit}&pageNo=${options.pageNo}`;
    params += options.sortBy ? `&sortBy=${options.sortBy}` : '';
    params += options.sortDirection ? `&sortDirection=${options.sortDirection}` : '';
    params += options.filterText ? `&filterText=${options.filterText}` : '';
    const url = `${this.resourceApi}Tenant/${this.version}/${accountId}${params}`;
    return this.http.get(url) as Observable<ApiResponse<Tenant[]>>;
  }

  getSingleSubscription(subscriptionId: number): Observable<ApiResponse<AzureSubscription>> {
    const url = `${this.resourceApi}Subscription/${this.version}/${subscriptionId}/details`;
    return this.http.get(url) as Observable<ApiResponse<AzureSubscription>>;
  }

  getSubscriptionsByAccountAndTenant(accountId: number, options:  ApiRequestOptions = new ApiRequestOptions()): Observable<ApiResponse<AzureSubscription[]>> {
    let params = `?tenant=${options.tenant}&limit=${options.limit}`;
    params += options.sortBy ? `&sortBy=${options.sortBy}` : '';
    params += options.sortDirection ? `&sortDirection=${options.sortDirection}` : '';
    const url = `${this.resourceApi}Subscription/${this.version}/${accountId}${params}`;
    return this.http.get(url) as Observable<ApiResponse<AzureSubscription[]>>;
  }

  getSchedules(options:  ApiRequestOptions = new ApiRequestOptions()): Observable<ApiResponse<ScheduleApiResponse[]>> {
    let params = `?limit=${options.limit}&pageNo=${options.pageNo}`;
    params += options.sortBy ? `&sortBy=${options.sortBy}` : '';
    params += options.sortDirection ? `&sortDirection=${options.sortDirection}` : '';
    params += options.filterText ? `&filterText=${options.filterText}` : '';
    const url = `${this.reportApi}Schedule/${this.version}${params}`;
    return this.http.get(url) as Observable<ApiResponse<ScheduleApiResponse[]>>;
  }

  applyScheduleToResourceGroup(resourceGroupId: number, scheduleId: number): Observable<ApiResponse<number>> {
    const url = `${this.reportApi}ScheduleResource/${this.version}/apply/${scheduleId}/resourcegroup/${resourceGroupId}`;
    return this.http.patch(url, {}) as Observable<ApiResponse<number>>;
  }

  applyScheduleToSubscription(subscriptionId: number, scheduleId: number): Observable<ApiResponse<number>> {
    const url = `${this.reportApi}ScheduleResource/${this.version}/apply/${scheduleId}/subscription/${subscriptionId}`;
    return this.http.patch(url, {}) as Observable<ApiResponse<number>>;
  }

  getAllInstances(options:  ApiRequestOptions = new ApiRequestOptions()): Observable<ApiResponse<Instance[]>> {
    let params = `?limit=${options.limit}&pageNo=${options.pageNo}`;
    params += options.sortBy ? `&sortBy=${options.sortBy}` : '';
    params += options.sortDirection ? `&sortDirection=${options.sortDirection}` : '';
    params += options.filterText ? `&filterText=${options.filterText}` : '';
    const url = `${this.resourceApi}VirtualMachine/${this.version}/${params}`;
    return this.http.get(url) as Observable<ApiResponse<Instance[]>>;
  }

  getInstancesByResourceGroup(options:  ApiRequestOptions = new ApiRequestOptions()): Observable<ApiResponse<Instance[]>> {
    let params = `?limit=${options.limit}&pageNo=${options.pageNo}`;
    params += `&resourcegroup=${options.resourcegroup}`;
    params += options.sortBy ? `&sortBy=${options.sortBy}` : '';
    params += options.sortDirection ? `&sortDirection=${options.sortDirection}` : '';
    params += options.filterText ? `&filterText=${options.filterText}` : '';
    const url = `${this.resourceApi}VirtualMachine/${this.version}/${params}`;
    return this.http.get(url) as Observable<ApiResponse<Instance[]>>;
  }

  refreshInstance(id: number): Observable<ApiResponse<any>> {
    const url = `${this.resourceApi}virtualmachine/${this.version}/refresh/${id}`;
    return this.http.patch(url, {}) as Observable<ApiResponse<string>>;
  }

  refreshResourceGroup(id: number): Observable<ApiResponse<any>> {
    const url = `${this.resourceApi}resourcegroup/${this.version}/refresh/${id}`;
    return this.http.patch(url, {}) as Observable<ApiResponse<string>>;
  }

  getResourceGroupsBySubscription(subscriptionId: any, options:  ApiRequestOptions = new ApiRequestOptions()): Observable<ApiResponse<ResourceGroups[]>> {
    let params = `?limit=${options.limit}&pageNo=${options.pageNo}`;
    // params += `&subscription=${options.subscription}`;
    params += options.sortBy ? `&sortBy=${options.sortBy}` : '';
    params += options.sortDirection ? `&sortDirection=${options.sortDirection}` : '';
    params += options.filterText ? `&filterText=${options.filterText}` : '';
    const url = `${this.resourceApi}ResourceGroup/${this.version}/${subscriptionId}/${params}`;
    return this.http.get(url) as Observable<ApiResponse<ResourceGroups[]>>;
  }

  lockInstance(instanceId: number): Observable<ApiResponse<string>> {
    const url = `${this.reportApi}ScheduleResource/${this.version}/lock/vm/${instanceId}`;
    return this.http.patch(url, {}) as Observable<ApiResponse<string>>;
  }

  unlockInstance(instanceId: number): Observable<ApiResponse<string>> {
    const url = `${this.reportApi}ScheduleResource/${this.version}/unlock/vm/${instanceId}`;
    return this.http.patch(url, {}) as Observable<ApiResponse<string>>;
  }

  applyScheduleToInstance(instanceId: number, scheduleId: number): Observable<ApiResponse<number>> {
    const url = `${this.reportApi}ScheduleResource/${this.version}/apply/${scheduleId}/vm/${instanceId}`;
    return this.http.patch(url, {}) as Observable<ApiResponse<number>>;
  }

  startInstance(instanceId: number): Observable<ApiResponse<string>> {
    const dateTimeString = this.datePipe.transform(new Date(Date.now()), 'yyyy-MM-ddTHH:mm');
    const url = `${this.resourceApi}VirtualMachine/${this.version}/${instanceId}/${dateTimeString}/poweron`;
    return this.http.patch(url, {}) as Observable<ApiResponse<string>>;
  }

  stopInstance(instanceId: number): Observable<ApiResponse<string>> {
    const dateTimeString = this.datePipe.transform(new Date(Date.now()), 'yyyy-MM-ddTHH:mm');;
    const url = `${this.resourceApi}VirtualMachine/${this.version}/${instanceId}/${dateTimeString}/poweroff`;
    return this.http.patch(url, {}) as Observable<ApiResponse<string>>;
  }

  getInstanceSizes(instanceId: number): Observable<ApiResponse<InstanceSize[]>> {
    const url = `${this.resourceApi}VirtualMachineSize/${this.version}/${instanceId}/instance`;
    return this.http.get(url) as Observable<ApiResponse<InstanceSize[]>>;
  }

  scaleInstance(instanceId: number, size: string): Observable<ApiResponse<string>> {
    const dateTimeString = this.datePipe.transform(new Date(Date.now()), 'yyyy-MM-ddTHH:mm');
    const url = `${this.resourceApi}VirtualMachineSize/${this.version}/${instanceId}/scale/${size}/${dateTimeString}`;
    return this.http.patch(url, {}) as Observable<ApiResponse<string>>;
  }

  refreshAccount(accountId: number): Observable<ApiResponse<string>> {
    const url = `${this.accountApi}Account/${this.version}/refresh/${accountId}`;
    return this.http.patch(url, {}) as Observable<ApiResponse<string>>;
  }

  postponeShutdown(postpone: Postpone): Observable<ApiResponse<string>> {
    const url = `${this.reportApi}Postpone/${this.version}`;
    return this.http.post(url, postpone) as Observable<ApiResponse<string>>
  }

  deletePostpone(instanceId: number): Observable<ApiResponse<string>> {
    const url = `${this.reportApi}Postpone/${this.version}/instance/${instanceId}/active`;
    return this.http.delete(url) as Observable<ApiResponse<string>>
  }

  getProviders(): Observable<ApiResponse<Provider[]>> {
    const url = `${this.accountApi}Provider/${this.version}`;
    return this.http.get(url) as Observable<ApiResponse<Provider[]>>;
  }

}
