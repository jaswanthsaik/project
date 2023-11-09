import { Component, OnInit } from '@angular/core';
import { AccountsService } from '../../../services/accounts.service';

@Component({
  selector: 'app-postpone-shutdown',
  templateUrl: './postpone-shutdown.component.html',
  styleUrls: ['./postpone-shutdown.component.scss']
})
export class PostponeShutdownComponent implements OnInit {
  
  isPostponeActive: boolean = false;
  scheduleName: string = "";
  instanceName: string = "";
  postponeTimestamp: string = "";

  constructor(private accountsService: AccountsService) { }

  ngOnInit(): void {
    this.instanceName = this.accountsService.instanceName;
    this.scheduleName = this.accountsService.scheduleName;
    this.isPostponeActive = this.accountsService.postponeShutdown;
    this.postponeTimestamp = this.accountsService.postponeTimestamp;
  }

  statusChanged(isPostponeActive: boolean) {
    this.accountsService.postponeShutdown = isPostponeActive;
    this.isPostponeActive = isPostponeActive;
  }

  onDateChanged(value: string) {
    this.accountsService.postponeTimestamp = value;
    this.postponeTimestamp = value;
  }
}
