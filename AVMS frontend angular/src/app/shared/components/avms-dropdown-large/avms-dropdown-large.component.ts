import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-avms-dropdown-large',
  templateUrl: './avms-dropdown-large.component.html',
  styleUrls: ['./avms-dropdown-large.component.scss']
})
export class AvmsDropdownLargeComponent implements OnInit, OnChanges {
  @Input() lookup: {id: string, description: string}[] = [];
  @Input() selectedValue: string = '';
  @Input() showIcon: boolean = false;
  @Output() selectedValueChange = new EventEmitter<string>();

  constructor() { }

  selectionChanged(): void {
    this.selectedValueChange.emit(this.selectedValue);
  }

  ngOnInit(): void {
    if (!this.selectedValue && this.lookup.length > 0) {
      this.selectedValue = this.lookup[0].id;
    }
  }

  ngOnChanges(): void {}

}
