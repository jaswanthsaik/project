import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-getting-started',
  templateUrl: './getting-started.component.html',
  styleUrls: ['./getting-started.component.scss']
})
export class GettingStartedComponent implements OnDestroy {

  constructor(
    private commonService: CommonService
  ) { }

  ngOnDestroy(): void {
    this.commonService.showGettingStarted = false;
  }

}
