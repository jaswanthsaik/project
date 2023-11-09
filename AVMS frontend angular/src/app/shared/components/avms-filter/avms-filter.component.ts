import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-avms-filter',
  templateUrl: './avms-filter.component.html',
  styleUrls: ['./avms-filter.component.scss']
})
export class AvmsFilterComponent {
  @Output() filterChange = new EventEmitter<string>();
  filterText: string = '';

  constructor() { }

  keyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.applyFilter();
    }
  }

  applyFilter(): void {
    this.filterChange.emit(this.filterText);
  }

}
