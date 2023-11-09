import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-avms-toggle',
  templateUrl: './avms-toggle.component.html',
  styleUrls: ['./avms-toggle.component.scss']
})
export class AvmsToggleComponent implements OnInit {
  @Input() toggleStatus: boolean = false;
  @Input() offLabel = 'NO';
  @Input() onLabel = 'YES';
  @Output() toggleStatusChange = new EventEmitter<boolean>();

  constructor() { }

  statusChange(status: boolean) {
    this.toggleStatus = status;
    this.toggleStatusChange.emit(this.toggleStatus);
  }

  ngOnInit(): void {
  }

}
