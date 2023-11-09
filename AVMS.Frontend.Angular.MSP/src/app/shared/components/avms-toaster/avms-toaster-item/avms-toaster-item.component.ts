import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Toast } from '../models/toast';

@Component({
  selector: 'app-avms-toaster-item',
  templateUrl: './avms-toaster-item.component.html',
  styleUrls: ['./avms-toaster-item.component.scss']
})
export class AvmsToasterItemComponent {
  @Input() toast?: Toast ;
  @Input() index: number = 0;

  @Output() remove = new EventEmitter<number>();
}
