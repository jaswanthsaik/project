import { Dialog } from '@angular/cdk/dialog';
import { Injectable } from '@angular/core';
import { ModalDialogComponent } from '../modal-dialog/modal-dialog.component';
import { ModalDialogData } from '../models/modal-dialog-data';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(private dialog: Dialog) { }

  xxxopenDialog(data: ModalDialogData): void {
    const dialogRef = this.dialog.open<string>(ModalDialogComponent, {
      width: '250px',
      data: data,
    });

    dialogRef.closed.subscribe(result => {});
  }

}
