import { Component, OnInit } from '@angular/core';
import { AccountsService } from '../../services/accounts.service';

@Component({
  selector: 'app-manage-label',
  templateUrl: './manage-label.component.html',
  styleUrls: ['./manage-label.component.scss']
})
export class ManageLabelComponent implements OnInit {
  labels: string[];

  constructor(
    private accountsService: AccountsService
  ) {
    this.labels = this.accountsService.predefinedLabels;
  }

  labelSelected(label: string) {
    this.accountsService.newLabel = label;
  }

  ngOnInit(): void {
  }

}
