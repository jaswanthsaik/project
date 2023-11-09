import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { PreviewDialogData } from '../models/preview-dialog-data';

@Component({
  selector: 'app-preview-dialog',
  templateUrl: './preview-dialog.component.html',
  styleUrls: ['./preview-dialog.component.scss']
})
export class PreviewDialogComponent implements OnInit {
  
  dialogType: string = "success";
  constructor(public dialogRef: DialogRef<string>, @Inject(DIALOG_DATA) public data: PreviewDialogData) { }

  close(): void {
    this.dialogRef.close('cancel');
  }

  ngOnInit(): void {
  }

}
