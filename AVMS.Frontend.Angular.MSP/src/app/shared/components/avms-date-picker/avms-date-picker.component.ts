import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, OnChanges, Output } from '@angular/core';

@Component({
  selector: 'app-avms-date-picker',
  templateUrl: './avms-date-picker.component.html',
  styleUrls: ['./avms-date-picker.component.scss']
})
export class AvmsDatePickerComponent implements OnInit {
  @Input() selectedDate: string = "";
  @Output() dateChangedEvent = new EventEmitter<string>();

  constructor(
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    if (this.selectedDate) {
      const date = new Date(this.selectedDate);
      this.selectedDate = this.datePipe.transform(date, 'yyyy-MM-ddTHH:mm') ?? '';
    }
  }

  onValueChange(event: any) {
    this.dateChangedEvent.emit(event.target.value);
    this.selectedDate = event.target.value;
  }

}
