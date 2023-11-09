import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SideNavService } from '../side-nav/side-nav.service';

@Component({
  selector: 'app-usage-info-widget',
  templateUrl: './usage-info-widget.component.html',
  styleUrls: ['./usage-info-widget.component.scss']
})
export class UsageInfoWidgetComponent implements OnInit, OnDestroy {
  wide = true;

  subs = new Subscription();

  constructor(
    private sideNavService: SideNavService
  ) { }

  ngOnInit(): void {
    this.subs.add(this.sideNavService.menuExpandedNotifier.subscribe(res => {
      this.wide = !res;
    }));
  }

  ngOnDestroy(): void {
      this.subs.unsubscribe();
  }

}
