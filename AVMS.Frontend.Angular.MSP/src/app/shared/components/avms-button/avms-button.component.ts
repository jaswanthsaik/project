import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-avms-button',
  templateUrl: './avms-button.component.html',
  styleUrls: ['./avms-button.component.scss']
})
export class AvmsButtonComponent implements OnInit {
  @Input() text = '';
  @Input() selected = true;
  @Input() backgroundColor = "";
  @Input() fontColor = " #595959";
  @Input() wideButtons = false;
  @Output() onClick = new EventEmitter();

  width = 10;

  clicked(): void {
    this.onClick.emit();
  }

  ngOnInit(): void {
    this.width = this.wideButtons ? 130 : 103.25;
  }

}
