import { Dialog } from '@angular/cdk/dialog';
import { ComponentPortal } from '@angular/cdk/portal';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { mergeMap, Subscription } from 'rxjs';
import { LoginService } from 'src/app/features/authentication/login.service';
import { LogoutConfirmationComponent } from 'src/app/features/authentication/logout-confirmation/logout-confirmation.component';
import { ModalDialogComponent } from '../dialogs/modal-dialog/modal-dialog.component';
import { ModalDialogData } from '../dialogs/models/modal-dialog-data';
import { ModalDialogResponseOptions } from '../dialogs/models/modal-dialog-reponse-options';

@Component({
  selector: 'app-dropdown-menu',
  templateUrl: './dropdown-menu.component.html',
  styleUrls: ['./dropdown-menu.component.scss']
})
export class DropdownMenuComponent implements OnInit, OnDestroy {
  @Output() closeComponentEvent = new EventEmitter<boolean>();
  subs = new Subscription();
@Input() showUserMenu: boolean = false;


  constructor(private loginService: LoginService, private router: Router, private dialog: Dialog) { }

  ngOnInit(): void {
  }

  showUserProfile() {
    this.router.navigate([`/profile/edit`]);
    this.showUserMenu = false;
    this.closeComponentEvent.emit(true);
  }

  logout(): void {
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
      this.showUserMenu = false;
      this.subs.add(sub);
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
