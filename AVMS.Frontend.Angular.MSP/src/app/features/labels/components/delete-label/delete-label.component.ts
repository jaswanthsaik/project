import { DialogRef } from '@angular/cdk/dialog';
import { Component, OnInit } from '@angular/core';
import { SubscriptionHttpService } from 'src/app/features/subscription/subscription-http.service';
import { CatalogHttpService } from 'src/app/shared/services/catalog-http.service';
import { LabelsService } from '../../service/labels.service';

@Component({
  selector: 'app-delete-label',
  templateUrl: './delete-label.component.html',
  styleUrls: ['./delete-label.component.scss']
})
export class DeleteLabelComponent implements OnInit {

  name: string = "";
  accountName: string = "";
  resource: string = "";

  constructor(
    private labelsService: LabelsService, 
    private subscriptionHttpService: SubscriptionHttpService,
    private catalogHttpService: CatalogHttpService,
    private dialogRef: DialogRef
  ) { }

  ngOnInit(): void {
    this.name = this.labelsService.label.name;

    this.subscriptionHttpService.getSubscriptionsByLabel(this.labelsService.label.label).subscribe(results => {
      const accounts: string[] = [];
      const resources: string[] = [];
      results.data.forEach(item => {
        item.virtual_machines.forEach(machine => {
          if(this.labelsService.label.label === machine.label) {
            resources.push(machine.name);
            this.catalogHttpService.getRouteByInstance(machine.virtual_machine).subscribe(route => {
              const routeInfo = route.data;
              const exists = accounts.find(account => account === routeInfo.account_name)
              if (!exists) {
                accounts.push(routeInfo.account_name);
              }
              this.accountName = accounts.join(", ");
            });
          }
        });
        this.resource = resources.join(", ");
        this.labelsService.label.resourcesNames = resources.join(", ");
      });
    });
  }
  cancelDialog(): void {
    this.dialogRef.close(false);
  }
  confirmation(): void {
    this.dialogRef.close(true);
  }
}
