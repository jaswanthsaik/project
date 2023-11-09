import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { ComponentPortal } from '@angular/cdk/portal';
import { Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CommonService } from 'src/app/services/common.service';
import { ModalDialogData } from '../models/modal-dialog-data';

@Component({
  selector: 'app-modal-dialog',
  templateUrl: './modal-dialog.component.html',
  styleUrls: ['./modal-dialog.component.scss']
})
export class ModalDialogComponent implements OnInit, OnDestroy {
  /*title = 'Title...';
  primaryButtonText = 'Primary';
  secondaryButtonText = 'Secondary';
  cancelButtonText = 'Cancel';
  portal?: ComponentPortal<any>;*/

  primaryButtonColumn = 3;
  secondaryButtonColumn = 2;
  cancelButtonColumn = 1;
  dialogType: string = "success";
  subs = new Subscription();

  constructor(
    public dialogRef: DialogRef<string>, 
    @Inject(DIALOG_DATA) public data: ModalDialogData,
    private commonService: CommonService) { }

  close(): void {
    this.dialogRef.close('cancel');
  }

  primary(): void {
    this.dialogRef.close('primary');
  }

  secondary(): void {
    this.dialogRef.close('secondary');
  }

  ngOnInit(): void {
    /*this.title = this.data.title;
    this.portal = this.data.portal;
    this.primaryButtonText = this.data.primaryButtonText;
    this.secondaryButtonText = this.data.secondaryButtonText;
    this.cancelButtonText = this.data.cancelButtonText;*/
    if (this.data.cancelButtonText || this.data.secondaryButtonText) {
      this.primaryButtonColumn = 3;
    } else {
      this.primaryButtonColumn = 2;
    }
    if (this.data.secondaryButtonText && this.data.cancelButtonText) {
      this.secondaryButtonColumn = 2;
      this.cancelButtonColumn = 1;
    }
    if (this.data.secondaryButtonText && !this.data.cancelButtonText) {
      this.secondaryButtonColumn = 1;
    }
    if(this.data.dialogType != null && this.data.dialogType !== "") {
      this.dialogType = this.data.dialogType;
    }
    
    const sub = this.commonService.closeModalDialogNotifier.subscribe(() => this.close());
    this.subs.add(sub);
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

}
