import { Component, OnInit } from '@angular/core';
import { AccountsService } from '../../services/accounts.service';

@Component({
  selector: 'app-refresh-account',
  templateUrl: './refresh-account.component.html',
  styleUrls: ['./refresh-account.component.scss']
})
export class RefreshAccountComponent implements OnInit {

  localTitle: string = ''; 
  localText: string = '';
  remoteTitle: string = ''; 
  remoteText: string = ''; 

  constructor(
    private accountsService: AccountsService
  ) { }

  ngOnInit(): void {
    this.localText = this.accountsService.hardRefrehLocalText;
    this.localTitle = this.accountsService.hardRefrehLocalTitle;
    // this.remoteText = this.accountsService.hardRefrehRemoteText;
    // this.remoteTitle = this.accountsService.hardRefrehRemoteTitle;
  }

}
