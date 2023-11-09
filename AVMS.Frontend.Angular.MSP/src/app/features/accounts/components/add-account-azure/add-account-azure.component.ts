import { DialogRef } from '@angular/cdk/dialog';
import { Component, OnChanges, OnInit } from '@angular/core';
import { AddAccount } from '../../models/add-account';
import { EditAccount } from '../../models/edit-account';
import { AccountsService } from '../../services/accounts.service';
import { MatDialogRef } from '@angular/material/dialog';
import { NotifierService } from 'src/app/shared/services/notifier.service';
import { AccountsHttpService } from '../../services/accounts-http.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-account-azure',
  templateUrl: './add-account-azure.component.html',
  styleUrls: ['./add-account-azure.component.scss']
})
export class AddAccountAzureComponent implements OnInit {
  account = new AddAccount();
  editAccount = new EditAccount();
  editing = false;
  reactiveForm!: FormGroup;

  constructor(
    private accountsService: AccountsService,
    private dialogRef: MatDialogRef<AddAccountAzureComponent>,
    private httpService: AccountsHttpService,
    private notifier: NotifierService,
    private formBuilder: FormBuilder,
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
    this.initForm();
  }
  initForm() {
    this.reactiveForm = this.formBuilder.group({
      accountName: ['', Validators.required],
      azureTenant: ['', Validators.required],
      appClientId: ['', Validators.required],
      appClientKey: ['', Validators.required],
    });
  }
dialogclose(){
  this.dialogRef.close();
}

  onSubmit() {
    if(!this.editing) {
      let account = {
        name: this.account.name,
        client_id: this.account.client_id,
        client_secret: this.account.client_secret,
        tenant_domain: this.account.tenant_domain
      }
      this.httpService.addAzureAccount(account).subscribe(data=> {
        if(data) {
          this.dialogclose();
          this.notifier.showSuccess('Account was Added Successfully', 'Sucess');
        }
      },
      error => {
        this.notifier.showError(error.error.message[0], 'Error');
      }
      )
    }
    else {
      let account: any;
      this.httpService.editAccount(account, this.accountsService.editAccount).subscribe(data=> {
        if(data) {
          this.dialogclose();
          this.notifier.showSuccess('Account was Saved Successfully', 'Sucess');
        }
      },
      error => {
        this.notifier.showError(error.error.message[0], 'Error');
      }
      )
    }
  }
}
