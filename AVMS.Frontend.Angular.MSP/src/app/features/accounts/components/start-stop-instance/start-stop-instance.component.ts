import { Component, OnInit } from '@angular/core';
import { AccountsService } from '../../services/accounts.service';

@Component({
  selector: 'app-start-stop-instance',
  templateUrl: './start-stop-instance.component.html',
  styleUrls: ['./start-stop-instance.component.scss']
})
export class StartStopInstanceComponent implements OnInit {
  instanceName = this.accountsService.instanceName;
  started = false;
  showConfirmation = false;

  constructor(
    private accountsService: AccountsService
  ) {
    this.started = this.accountsService.started;
    this.showConfirmation = this.accountsService.showConfirmation;
  }

  statusChanged(start: boolean) {
    this.accountsService.started = start;
  }

  ngOnInit(): void {
  }

}
