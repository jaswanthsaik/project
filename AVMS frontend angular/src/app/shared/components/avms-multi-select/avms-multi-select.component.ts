import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-avms-multi-select',
  templateUrl: './avms-multi-select.component.html',
  styleUrls: ['./avms-multi-select.component.scss']
})
export class AvmsMultiSelectComponent implements OnInit, OnChanges {
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

  ngOnChanges(): void {
    if (this.lookup.length === 1) {
      this.selectedValue = this.lookup[0].id;
    }
  }

}
