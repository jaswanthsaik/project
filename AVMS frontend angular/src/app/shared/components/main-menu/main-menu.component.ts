import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { environment } from 'src/environments/environment';
import { SideNavService } from '../side-nav/side-nav.service';
import { User } from '../../../features/profile/models/user';
import { UserService } from '../../../features/profile/user.service';
import { Dialog } from '@angular/cdk/dialog';
import { ComponentPortal } from '@angular/cdk/portal';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LoginService } from 'src/app/features/authentication/login.service';
import { LogoutConfirmationComponent } from 'src/app/features/authentication/logout-confirmation/logout-confirmation.component';
import { ModalDialogComponent } from '../dialogs/modal-dialog/modal-dialog.component';
import { ModalDialogData } from '../dialogs/models/modal-dialog-data';
import { ModalDialogResponseOptions } from '../dialogs/models/modal-dialog-reponse-options';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss']
})
export class MainMenuComponent implements OnInit {
  appVersion = environment.appVersion;
  @Output() closeComponentEvent = new EventEmitter<boolean>();
  subs = new Subscription();
  isToggle= false;

  showUserMenu: boolean = false;
  myProfile: User = {
    first_name: "",
    last_name: "",
    user: 0,
    password: '',
    email: '',
    company_name: undefined,
    country_name: undefined,
    country: 0,
    timezone_name: undefined,
    timezone: 0,
    role_index: '',
    role_name: undefined,
    teams: [],
    isMyUser: false,
    avatar: ''
  };

  constructor(
    public sideNavService: SideNavService,
    private userService: UserService,
    private loginService: LoginService,
    private router: Router,
    private dialog: Dialog
  ) { }

  openMenu(menuItem: string): void {
    this.sideNavService.openMenu(menuItem);
  }

  navigateTo(menuItem: string): void {
    this.sideNavService.navigateTo(menuItem);
  }

  closeMenu(): void {
    this.sideNavService.closeMenu();
  }
  
  showAlert(): void {
    alert('Feature not yet implemented');
  }

 toggleMenu(){
  this.isToggle = !this.isToggle;
 }

  mouseLeave(): void {
    // this.sideNavService.mouseLeave();
  }

  ngOnInit(): void {
    this.userService.getMyProfile().subscribe(result => {
      const userDetails = result.data;
      this.myProfile.user = userDetails.user;
      this.myProfile.first_name = userDetails.first_name;
      this.myProfile.last_name = userDetails.last_name;
      this.myProfile.avatar = 'data:image/jpeg;base64,' + result.data.avatar;
    });
  }

  openUserMenu(): void {
    this.showUserMenu = !this.showUserMenu;
  }

  closeUserMenu(): void {
    this.showUserMenu = false;
  }
  showUserProfile() {
    this.showUserMenu= false;
    // this.router.navigate([`/profile`]);
    this.router.navigate([`/profile/edit`]);
    this.closeComponentEvent.emit(true);
  }
  // logout(){
  //   this.dialog.open(LogoutConfirmationComponent);
  // }

  logout(): void {
    this.showUserMenu = false;
    const dialogRef = this.dialog.open<ModalDialogResponseOptions>(LogoutConfirmationComponent, {
    });

    const sub: Subscription = dialogRef.closed.subscribe(result => {
        if (result === 'primary') {
          this.loginService.logout();
          return sub.closed;
        } else {
          return sub.closed;
        }
      });
      this.subs.add(sub);
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
