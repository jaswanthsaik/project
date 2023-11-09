import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-avms-dropdown',
  templateUrl: './avms-dropdown.component.html',
  styleUrls: ['./avms-dropdown.component.scss']
})
export class AvmsDropdownComponent implements OnInit {
  @Input() lookup: {id: string, description: string}[] = [];
  @Input() selectedValue: string = '';
  @Output() selectedValueChange = new EventEmitter<string>();
  filteredList:any=[];

  constructor() { }

  select(): void {
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
