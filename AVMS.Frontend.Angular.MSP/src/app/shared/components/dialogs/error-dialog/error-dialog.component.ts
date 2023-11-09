import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { ErrorDialogData } from '../models/error-dialog-data';

@Component({
  selector: 'app-error-dialog',
  templateUrl: './error-dialog.component.html',
  styleUrls: ['./error-dialog.component.scss']
})
export class ErrorDialogComponent implements OnInit {

  dialogType: string = "success";
  constructor(public dialogRef: DialogRef<string>, @Inject(DIALOG_DATA) public data: ErrorDialogData) { }

  close(): void {
    this.dialogRef.close('cancel');
  }

  ngOnInit(): void {
  }

}
