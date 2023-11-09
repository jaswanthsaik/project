import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { SubscriptionHttpService } from 'src/app/features/subscription/subscription-http.service';
import { LabelResource } from '../../models/label-resource';
import { LabelsService } from '../../service/labels.service';

@Component({
  selector: 'app-edit-label',
  templateUrl: './edit-label.component.html',
  styleUrls: ['./edit-label.component.scss']
})
export class EditLabelComponent implements OnInit, OnDestroy {

  name: string = "";
  providerTag: string = "";
  resource: string = "";
  accountName: string | undefined = "";
  selectedResource: string = "";

  availableAccounts = [
    { id: '0', description: 'Select an account' }
  ];

  availableResources = [
    { id: '0', description: 'Select a resource' }
  ];

  constructor(private labelsService: LabelsService, private subscriptionHttpService:SubscriptionHttpService,
    private dialogRef: DialogRef) { }

  ngOnInit(): void {
    this.name = this.labelsService.label.name;
    this.availableAccounts = this.availableAccounts.concat(this.labelsService.accounts.map(item => {
      return {id: String(item.account), description: item.account_name};
    }));

    this.subscriptionHttpService.getSubscriptionsByLabel(this.labelsService.label.label).subscribe(results => {
      results.data.forEach(item => {
        this.availableResources =  this.availableResources.concat(item.virtual_machines.map(machine => {
          return {id: String(machine.virtual_machine), description: machine.name};
        }));
        item.virtual_machines.forEach(machine => {
          if(this.labelsService.label.label === machine.label) {
            this.selectedResource = String(machine.virtual_machine);
          }
        });
      });
    });

    this.labelsService.label.resourcesNames = this.availableResources.find(p => p.id === this.selectedResource)?.description;
  }

  accountChanged(account: string): void {
    this.accountName = this.availableAccounts.find(p => p.id === account)?.description;
    this.subscriptionHttpService.getSubscriptionsByAccounts([Number(account)]).subscribe(result => {
      result.data.forEach(subscription => {
        this.availableResources =  this.availableResources.concat(subscription.virtual_machines.map(machine => {
          return {id: String(machine.virtual_machine), description: machine.name};
        }));
      })
    })
  }

  resourceChanged(selectedResource: string): void{
    const resource = new LabelResource();
    resource.resource = Number(selectedResource);
    resource.resource_type = 2;
    this.labelsService.label.resources = [resource];
    this.labelsService.label.resourcesNames = this.availableResources.find(p => p.id === selectedResource)?.description;

    this.labelsService.label.resourcesNames = this.availableResources.find(p => p.id === selectedResource)?.description;
  }

  ngOnDestroy(): void {
    this.labelsService.label.name = this.name;
  }
  dialogclose() {
    this.dialogRef.close();
  }
}
