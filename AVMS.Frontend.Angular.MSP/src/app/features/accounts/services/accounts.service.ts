import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Account } from '../models/account';
import { AccountsTableRow } from '../models/accounts-table-row';
import { AddAccount } from '../models/add-account';
import { EditAccount } from '../models/edit-account';
import { InstanceSize } from '../models/instance-size';
import { ScheduleApiResponse } from '../models/schedule-api-response';
import { TenantsTableRow } from '../models/tenants-table-row';

@Injectable({
  providedIn: 'root'
})
export class AccountsService {
  // Variables used to communicate with the modal dialog
  accountsToBeRemoved: Account[] = [];
  removeStep: 'first' | 'second' | 'final' = 'first';

  // Add account specific variables
  recordsPerPage = 10;
  newAccount = new AddAccount();
  editAccount = new EditAccount();
  provider: 'azure' | '' = '';
  editing = false;

  // Hardrefresh specific variables
  hardRefrehLocalTitle: string = '';
  hardRefrehLocalText: string = '';
  // hardRefrehRemoteTitle: string = '';
  // hardRefrehRemoteText: string = '';

  // Apply Schedule specific variables
  subscriptionsToBeRescheduled: TenantsTableRow[] = [];
  scheduleStep: 'first' | 'second' | 'final' = 'first';
  selectedSchedule: string = '0';
  postponeShutdown: boolean = false;
  overwriteSchedule: boolean = false;
  showPostponeShutdown: boolean = false;
  numberOfScheduledInstances: number = 0;
  schedules: ScheduleApiResponse[] = [];

  // Lock and Start/Stop specific variables
  lockedStatus: boolean = false;
  started: boolean = false;
  showConfirmation = false;
  showdScheduleLockedWarning = false;
  
  // Lock, Start/Stop, Scale, Postpone Shutdown specific variables
  instanceName: string = '';

  // Scale specific variables
  instanceSizes: InstanceSize[] = [];
  size = '0';
  previousSize = '';
  previousCores = '';
  previousMemory = '';

  scalingFinal = false;

  predefinedLabels: string[] = ['label1', 'label2', 'label3', 'label8', 'label9', 'label10', 'tag4', 'tag5', 'tag6', 'tag7'];
  newLabel = '';

  //Postpone Shutdown specific variables
  scheduleName: string = "";
  postponeTimestamp: string = "";
  postpone = 0;

  // End - Variables used to communicate with the modal dialog

  constructor(
  ) { }

  
  addAccount(account: AddAccount, provider: 'azure'): Observable<string> {
    if (provider === 'azure') {
    }
    return of('added');
  }


  removeAccounts(): Observable<string> {
    console.log('TODO: remove account');
    return of('removed');
  }

  refreshAccounts(): Observable<string> {
    console.log('TODO: refresh account');
    return of('refreshed');
  }

  schedule(): Observable<string> {
    console.log('TODO: schedule - selectedSchedule: ' + this.selectedSchedule + ', postponeShutdown: ' + this.postponeShutdown + ', overwriteSchedule: ' + this.overwriteSchedule);
    return of('scheduled');
  }

  addLabel(): Observable<string> {
    console.log('TODO: add label - ' + this.newLabel);
    return of('added');
  }

  secureAccount(): Observable<string> {
    console.log('TODO: secure account');
    return of('secured');
  }

  scaleInstance(): Observable<string> {
    console.log('TODO: scale instance');
    return of('scaled');
  }

  executePostponeShutdown(): Observable<string> {
    console.log('TODO: scale instance');
    return of('scaled');
  }

}
