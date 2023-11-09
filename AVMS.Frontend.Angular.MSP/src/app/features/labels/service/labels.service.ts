import { Injectable } from '@angular/core';
import { Account } from '../../accounts/models/account';
import { ScheduleApiResponse } from '../../accounts/models/schedule-api-response';
import { AddLabel } from '../models/add-label';
import { Label } from '../models/label';
import { ResourceLookup } from '../models/resource-lookup';

@Injectable({
  providedIn: 'root'
})
export class LabelsService {

  recordsPerPage = 10;
  editing = false;
  labelId = 0;
  label: Label = new Label();
  accounts: Account[] = new Array<Account>();
  schedules: ScheduleApiResponse[] = new Array<ScheduleApiResponse>();

  selectedResources: ResourceLookup[] = [];
  selectedSchedule: string = '0';
  selectedScheduleId: number = 0;
  
  constructor() { }

  convertToAddLabel(): AddLabel {
    return {
      label_name: this.label.name,
      resources: this.label.resources
    }
  }

  getSelectedLabels(): AddLabel {
    this.selectedResources = this.selectedResources.filter(resource => +resource.id > 0);
    return {
      label_name: this.label.name,
      resources: this.selectedResources.map(item => {
        return {
          resource: +item.id,
          resource_type: 2
        }
      })
    }
  }
}
