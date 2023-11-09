import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { SideNavService } from './side-nav.service';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss']
})
export class SideNavComponent implements OnInit {
  @Output() onExpand = new EventEmitter<string>();

  cloudExpanded = false;

  constructor(
    public sideNavService: SideNavService
  ) { }
  
  navigateTo(menuItem: string): void {
    this.sideNavService.navigateTo(menuItem);
  }

  expandMenu(menuItem: string): void {
    this.onExpand.emit(menuItem);
  }

  showAlert(): void {
    alert('Feature not yet implemented');
  }

  mouseOver(): void {
    // this.sideNavService.mouseOver();
  }

  ngOnInit(): void {
  }

}
