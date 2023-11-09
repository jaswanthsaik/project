import { Component, EventEmitter, Input, OnInit, OnDestroy, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { Instance } from 'src/app/features/accounts/models/instance';
import { AccountsHttpService } from 'src/app/features/accounts/services/accounts-http.service';
import { InstanceHttpService } from 'src/app/features/instance/services/instance-http.service';
import { ApiRequestOptions } from 'src/app/models/api-request-options';

@Component({
  selector: 'app-search-instance',
  templateUrl: './search-instance.component.html',
  styleUrls: ['./search-instance.component.scss']
})
export class SearchInstanceComponent implements OnInit, OnDestroy {
  instances: Instance[] = [];
  @Output() instanceClicked = new EventEmitter<Instance>();
  @Output() close = new EventEmitter<void>();

  subs = new Subscription();


  constructor(
    private httpService: AccountsHttpService,
  ) { }

  clicked(instance: Instance): void {
    this.instanceClicked.emit(instance);
  }

  closeClicked(): void {
    this.close.emit();
  }
  
  filterInstances(filter: string = ''): void {
    const options = new ApiRequestOptions();
    options.limit = 100;
    options.filterText = filter;
    options.sortBy = 'instance_impact';
    options.sortDirection = 'desc';
    const sub = this.httpService.getAllInstances(options).subscribe(res => {
      this.instances = res.data;
    });
    this.subs.add(sub);
  }

  ngOnInit(): void {
    this.filterInstances();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

}
