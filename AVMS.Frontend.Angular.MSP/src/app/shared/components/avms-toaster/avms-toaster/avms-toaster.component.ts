import { Component, OnInit } from '@angular/core';
import { Toast } from '../models/toast';
import { ToasterService } from '../services/toaster.service';

@Component({
  selector: 'app-avms-toaster',
  templateUrl: './avms-toaster.component.html',
  styleUrls: ['./avms-toaster.component.scss']
})
export class AvmsToasterComponent implements OnInit {

  toasts: Toast[] = [];

  constructor(public toaster: ToasterService) {}

  ngOnInit() {
    this.toaster.toast$
      .subscribe(toast => {
        this.toasts = [toast!, ...this.toasts];
        setTimeout(() => this.toasts.pop(), toast!.delay || 5000);
      });
  }

  remove(index: number) {
    this.toasts = this.toasts.filter((v, i) => i !== index);
    //this.toasts.splice(index, 1);
  }
  
}
