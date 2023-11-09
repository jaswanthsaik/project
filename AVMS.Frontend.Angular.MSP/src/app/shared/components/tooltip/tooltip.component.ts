import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-tooltip',
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.scss']
})
export class TooltipComponent implements OnInit {
  @Input() tooltipText = '';
  @Input() tooltipPosition: 'right' | 'top' | 'bottom' = 'right';
  @Input() showtooltipForPastTime: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

}
