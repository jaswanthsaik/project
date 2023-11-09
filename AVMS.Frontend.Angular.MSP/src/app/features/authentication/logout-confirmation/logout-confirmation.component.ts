import { DialogRef } from '@angular/cdk/dialog';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-logout-confirmation',
  templateUrl: './logout-confirmation.component.html',
  styleUrls: ['./logout-confirmation.component.scss']
})
export class LogoutConfirmationComponent implements OnInit {
  subs = new Subscription();
  
  constructor(private dialogRef: DialogRef) { }

  ngOnInit(): void {
  }
  cancelDialog(): void {
    this.dialogRef.close(false);
  }
//   confirmation(): void {
//     this.dialogRef.close(true);
// }
primary(): void {
  this.dialogRef.close('primary');
}
// logout(): void {
  //   const data: ModalDialogData = {
  //     title: 'Log out',
  //     primaryButtonText: 'YES',
  //     secondaryButtonText: '',
  //     cancelButtonText: 'CANCEL',
  //     portal: new ComponentPortal(LogoutConfirmationComponent)
  //   };
  //   const dialogRef = this.dialog.open<ModalDialogResponseOptions>(ModalDialogComponent, {
  //     width: '550px',
  //     data: data,
  //   });

  //   const sub: Subscription = dialogRef.closed.subscribe(result => {
  //       if (result === 'primary') {
  //         this.loginService.logout();
  //         return sub.closed;
  //       } else {
  //         return sub.closed;
  //       }
  //     });
  //     this.subs.add(sub);
  // }
}