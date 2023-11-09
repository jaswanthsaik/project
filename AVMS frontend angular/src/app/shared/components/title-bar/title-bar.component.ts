import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { LoginService } from 'src/app/features/authentication/login.service';

@Component({
  selector: 'app-title-bar',
  templateUrl: './title-bar.component.html',
  styleUrls: ['./title-bar.component.scss']
})
export class TitleBarComponent implements OnInit {

  showUserMenu: boolean = false;

  @Output() onExpand = new EventEmitter<string>();

  expandMenu(menuItem: string): void {
    this.onExpand.emit(menuItem);
  }

  constructor() { }

  ngOnInit(): void {
  }

  openUserMenu(): void {
    this.showUserMenu = !this.showUserMenu;
  }

  closeUserMenu(): void {
    this.showUserMenu = false;
  }
}
