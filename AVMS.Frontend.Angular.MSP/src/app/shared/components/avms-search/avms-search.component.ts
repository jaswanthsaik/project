import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-avms-search',
  templateUrl: './avms-search.component.html',
  styleUrls: ['./avms-search.component.scss']
})
export class AvmsSearchComponent {
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
