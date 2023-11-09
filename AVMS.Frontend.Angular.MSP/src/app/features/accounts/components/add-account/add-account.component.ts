import { DialogRef } from '@angular/cdk/dialog';
import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { AddAccount } from '../../models/add-account';
import { EditAccount } from '../../models/edit-account';
import { AccountsService } from '../../services/accounts.service';

@Component({
  selector: 'app-add-account',
  templateUrl: './add-account.component.html',
  styleUrls: ['./add-account.component.scss']
})
export class AddAccountComponent implements OnInit {
  provider: 'azure' | '' = '';
  account = new AddAccount();
  editing = false;

  constructor(
    private accountsService: AccountsService,
    public dialogRef: MatDialogRef<AddAccountComponent>,
  ) {
  }

  selectProvider(provider: 'azure') {
    this.provider = provider;
    this.accountsService.provider = provider;
  }

  ngOnInit(): void {
    this.account = this.accountsService.newAccount;
    this.editing = this.accountsService.editing;
  }
  dialogclose() {
    this.dialogRef.close();
  }
}
