import { Component, OnInit } from '@angular/core';
import { Account } from '../../models/account';
import { AccountsTableRow } from '../../models/accounts-table-row';
import { AccountsService } from '../../services/accounts.service';

@Component({
  selector: 'app-remove-account',
  templateUrl: './remove-account.component.html',
  styleUrls: ['./remove-account.component.scss']
})
export class RemoveAccountComponent implements OnInit {
  data: Account;
  step: 'first' | 'second' | 'final';

  constructor(
    private accountsService: AccountsService,
  ) { 
    this.data = this.accountsService.accountsToBeRemoved[0];
    this.step = this.accountsService.removeStep;
  }

  ngOnInit(): void {
  }

}
