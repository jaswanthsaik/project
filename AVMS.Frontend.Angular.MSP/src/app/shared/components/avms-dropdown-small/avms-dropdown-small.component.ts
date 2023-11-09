import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-avms-dropdown-small',
  templateUrl: './avms-dropdown-small.component.html',
  styleUrls: ['./avms-dropdown-small.component.scss']
})
export class AvmsDropdownSmallComponent implements OnInit, OnChanges {
  @Input() lookup: {id: string, description: string}[] = [];
  @Input() selectedValue: string = '';
  @Input() showIcon: boolean = false;
  @Output() selectedValueChange = new EventEmitter<string>();
  filteredList:any=[];
  constructor() { }

  selectionChanged(): void {
    this.selectedValueChange.emit(this.selectedValue);
  }

  ngOnInit(): void {
    if (!this.selectedValue && this.lookup.length > 0) {
      this.selectedValue = this.lookup[0].id;
    }
  }

  ngOnChanges(): void {
    this.filteredList = this.lookup.slice();
  }

}
