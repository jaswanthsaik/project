import { AfterContentInit, AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { first, timer } from 'rxjs';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-terms-and-conditions',
  templateUrl: './terms-and-conditions.component.html',
  styleUrls: ['./terms-and-conditions.component.scss']
})
export class TermsAndConditionsComponent implements OnInit, AfterViewInit {
  @ViewChild('container') container!: ElementRef;
  @ViewChild('printSection') printSection!: ElementRef;
  tcText = ` `;
  showWarning = false;
  tcAccepted = false;

  constructor(
    private commonService: CommonService,
    public dialogRef: MatDialogRef<TermsAndConditionsComponent>
  ) { }

  changeAcceptedStatus(): void {
    this.tcAccepted = this.tcAccepted;
    if (this.tcAccepted) {
      this.showWarning = false;
    }
  }

  ngOnInit(): void {
  }

  cancelDialog(): void {
    this.showWarning = true;
  }

  primary() {
    if (!this.tcAccepted) {
      this.showWarning = true;
    } else {
      this.showWarning = false;
      this.commonService.acceptTermsAndConditionsUser().subscribe(res => {
        this.dialogRef.close();
      })
    }
  }

  ngAfterViewInit(): void {
    timer(100).pipe(first()).subscribe(() => {
      this.container.nativeElement.scrollTop = 0;
    });
  }
  printPage() {
    window.print();
}
onClipboardCopy() {
  navigator.clipboard.writeText(this.tcText);
}

 printElement (elem: any)
{
    const mywindow = window.open('', 'PRINT');

    mywindow?.document.write('<html><head><title>' + document.title  + '</title>');
    mywindow?.document.write('</head><body >');
    // mywindow?.document.write('<h1>' + document.title  + '</h1>');
    mywindow?.document.write(this.printSection.nativeElement.innerHTML);
    mywindow?.document.write('</body></html>');

    mywindow?.document.close(); // necessary for IE >= 10
    mywindow?.focus(); // necessary for IE >= 10*/

    mywindow?.print();
    mywindow?.close();

    return true;
}
}
