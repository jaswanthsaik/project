import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-avms-autocomplete',
  templateUrl: './avms-autocomplete.component.html',
  styleUrls: ['./avms-autocomplete.component.scss']
})
export class AvmsAutocompleteComponent implements OnInit {
  @Input() data: string[] = [];
  @Output() selected = new EventEmitter<string>();
  label: string = '';
  selectedLabels: string[] = [];

  constructor() { }

  onKeyUp(event: KeyboardEvent) {
    this.selectedLabels = this.data.filter(item => item.toLowerCase().includes(this.label.toLowerCase()));
    this.selected.emit(this.label);
  }

  onSelect(value: string) {
    this.label = value;
    this.selectedLabels = [];
    this.selected.emit(value);
  }

  ngOnInit(): void {
  }

}
