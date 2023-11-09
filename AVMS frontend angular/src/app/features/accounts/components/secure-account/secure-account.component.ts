import { Component, OnInit } from '@angular/core';
import { AccountsService } from '../../services/accounts.service';

@Component({
  selector: 'app-secure-account',
  templateUrl: './secure-account.component.html',
  styleUrls: ['./secure-account.component.scss']
})
export class SecureAccountComponent implements OnInit {
  lockedStatus = false;
  showdScheduleLockedWarning = false;

  constructor(
    private accountsService: AccountsService
  ) {
    this.lockedStatus = this.accountsService.lockedStatus;
    this.showdScheduleLockedWarning = this.accountsService.showdScheduleLockedWarning;
  }

  securityStatusChanged(locked: boolean) {
    this.accountsService.lockedStatus = locked;
  }

  ngOnInit(): void {
  }

}
