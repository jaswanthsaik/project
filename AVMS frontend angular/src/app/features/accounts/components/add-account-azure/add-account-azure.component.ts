import { DialogRef } from '@angular/cdk/dialog';
import { Component, OnChanges, OnInit } from '@angular/core';
import { AddAccount } from '../../models/add-account';
import { EditAccount } from '../../models/edit-account';
import { AccountsService } from '../../services/accounts.service';

@Component({
  selector: 'app-add-account-azure',
  templateUrl: './add-account-azure.component.html',
  styleUrls: ['./add-account-azure.component.scss']
})
export class AddAccountAzureComponent implements OnInit {
  account = new AddAccount();
  editAccount = new EditAccount();
  editing = false;

  constructor(
    private accountsService: AccountsService,
    private dialogRef: DialogRef
  ) { }

  update(): void {
    this.accountsService.editAccount.name = this.account.name;
    this.accountsService.editAccount.client_id = this.account.client_id;
    this.accountsService.editAccount.client_secret = this.account.client_secret;
  }

  getData(): void {
    this.account = this.accountsService.newAccount;
    this.editAccount = this.accountsService.editAccount;
    this.editing = this.accountsService.editing;
    if (this.editing) {
      this.account.name = this.editAccount.name;
      this.account.client_id = this.editAccount.client_id;
      this.account.client_secret = this.editAccount.client_secret;
      this.account.tenant_domain = '';
    }
  }

  ngOnInit(): void {
    this.getData();
  }
dialogclose(){
  this.dialogRef.close();
}
}
