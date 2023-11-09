import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ScheduleApiResponse } from 'src/app/features/schedules/models/schedule-api-response';
import { ScheduleEvent, ScheduleEventItem } from 'src/app/features/schedules/models/schedule-event';
import { ScheduleEventApiResponse } from 'src/app/features/schedules/models/schedule-event-api-response';

@Component({
  selector: 'app-avms-scheduler',
  templateUrl: './avms-scheduler.component.html',
  styleUrls: ['./avms-scheduler.component.scss']
})
export class AvmsSchedulerComponent implements OnInit, OnChanges {
  @Input() schedule?: ScheduleApiResponse;
  @Input() scheduleEvents: ScheduleEventApiResponse[] = [];
  @Output() eventsScheduled = new EventEmitter<ScheduleEvent>();
  rowTemplate = new Array(49).fill('');
  workingTable = new Array(7).fill(0).map(() => new Array(48).fill('transparent'));
  savedDrag = new Array(7).fill(0).map(() => new Array(48).fill(''));
  // table = new Array(7).fill(0).map(() => new Array(48).fill(''));
  hours = new Array(24).fill('').map((_, i) => i < 10 ? `0${i}:00` : `${i}:00`);
  dragStartPosition: { row: number, col: number } = { row: 0, col: 0 };
  dragStartCoordinates: { x: number, y: number } = { x: 0, y: 0 };

  selecting = false;
  startingItem = { row: 0, col: 0 };
  selectedTable = [...this.workingTable];
  upHours = 0;
  downHours = 168;
  selectedColor = '#96E47A';
  previewColor = 'cyan';

  savings = 0;
  savingsTrigger = {};
  scheduleName?: string = '';
  previewColorEven = '#E6E7EB';

  constructor(private router: Router) {
    this.workingTable[0].unshift('MONDAY');
    this.workingTable[1].unshift('TUESDAY');
    this.workingTable[2].unshift('WEDNESDAY');
    this.workingTable[3].unshift('THURSDAY');
    this.workingTable[4].unshift('FRIDAY');
    this.workingTable[5].unshift('SATURDAY');
    this.workingTable[6].unshift('SUNDAY');
    this.selectedTable = JSON.parse(JSON.stringify(this.workingTable));
}

  ngOnInit(): void {
    this.emptyGraph();
  }

  emptyGraph() {
    for (let col = 0; col < 24; col++) {
      if (col % 2 === 0) {
        this.workingTable.forEach((row) => {
          row[2 * col + 1] = this.previewColorEven;
          row[2 * col + 2] = this.previewColorEven;
        });
      }
    }
    this.selectedTable = JSON.parse(JSON.stringify(this.workingTable));
  }

  getHeaderStyle(col: number): any {
    return `grid-column: ${2 * col + 2}/${2 * col + 4};`;
  }

  mouseDown(event: MouseEvent, row: number, col: number): void {
    if (col === 0) {
      return;
    }
    this.startingItem = { row, col };
    this.selecting = true;
  }

  mouseOver(event: MouseEvent, row: number, col: number): void {
    if (col === 0) {
      col = 1;
    }
    if (this.selecting) {
      this.selectedTable = JSON.parse(JSON.stringify(this.workingTable));
      const selStart = { row: Math.min(this.startingItem.row, row), col: Math.min(this.startingItem.col, col) };
      const selEnd = { row: Math.max(this.startingItem.row, row), col: Math.max(this.startingItem.col, col) };
      for (let i = selStart.row; i <= selEnd.row; i++) {
        for (let j = selStart.col; j <= selEnd.col; j++) {
          this.selectedTable[i][j] = this.previewColor;
        }
      }
    }
  }

  mouseUp(event: MouseEvent, row: number, col: number): void {
    if (this.startingItem.col === 0) {
      if (col === 0) {
        this.selectCell(row, col);
      }
      this.selecting = false;
      return;
    }
    if (col === 0) {
      col = 1;
    }
    this.selecting = false;
    const selStart = { row: Math.min(this.startingItem.row, row), col: Math.min(this.startingItem.col, col) };
    const selEnd = { row: Math.max(this.startingItem.row, row), col: Math.max(this.startingItem.col, col) };
    this.startingItem = { row: 0, col: 0 };
    if (selStart.row === selEnd.row && selStart.col === selEnd.col) {
      // this is handled by the cellClick
      return;
    }
    for (let i = selStart.row; i <= selEnd.row; i++) {
      for (let j = selStart.col; j <= selEnd.col; j++) {
        this.workingTable[i][j] = this.selectedColor;
      }
    }
    this.selectedTable = JSON.parse(JSON.stringify(this.workingTable));
    this.calcUptime();
  }

  mouseLeave(): void {
    this.selecting = false;
    this.startingItem = { row: 0, col: 0 };
    this.selectedTable = JSON.parse(JSON.stringify(this.workingTable));
  }

  clearRow(row: number): void {
    for (let i = 1; i < 49; i++) {
      this.workingTable[row][i] = '';
      if ((i + 2) % 4 === 0 || (i + 3) % 4 === 0) {
        this.workingTable[row][i] = this.previewColorEven;
      } else {
        this.workingTable[row][i] = 'transparent';
      }
    }
    this.selectedTable = JSON.parse(JSON.stringify(this.workingTable));
    this.calcUptime();
  }

  selectCol(col: number): void {
    this.workingTable.forEach(row => {
      row[2 * col + 1] = this.selectedColor;
      row[2 * col + 2] = this.selectedColor;
    });
    this.selectedTable = JSON.parse(JSON.stringify(this.workingTable));
    this.calcUptime();
  }

  clearCol(col: number): void {
    this.workingTable.forEach((row) => {
      if (col % 2 === 0) {
        row[2 * col + 1] = this.previewColorEven;
        row[2 * col + 2] = this.previewColorEven;
      } else {
        row[2 * col + 1] = 'transparent';
        row[2 * col + 2] = 'transparent';
      }
    });
    this.selectedTable = JSON.parse(JSON.stringify(this.workingTable));
    this.calcUptime();
  }

  clearSchedule(): void {
    for (let i = 0; i < 7; i++) {
      this.clearRow(i);
    }
    this.emptyGraph();
    this.calcUptime();
  }

  cellClick(row: number, col: number): void {
    this.selectCell(row, col);
  }

  selectCell(row: number, col: number): void {
    if (col === 0) {
      for (let i = 1; i < 49; i++) {
        this.workingTable[row][i] = this.selectedColor;
      }
      this.selectedTable = JSON.parse(JSON.stringify(this.workingTable));
    } else if (this.workingTable[row][col] === this.selectedColor) {
      if ((col + 2) % 4 === 0 || (col + 3) % 4 === 0) {
        this.workingTable[row][col] = this.previewColorEven;
      } else {
        this.workingTable[row][col] = 'transparent';
      }
    } else {
      this.workingTable[row][col] = this.selectedColor;
    }
    this.selectedTable = JSON.parse(JSON.stringify(this.workingTable));
    this.calcUptime();
  }

  presetSchedule(schedule: number, preview = false): void {
    let startHour = 0;
    let endHour = 23;
    let startDay = 0;
    let endDay = 6;
    if (schedule === 0) {
      startHour = 8;
      endHour = 17;
    }
    if (schedule === 1) {
      startHour = 8;
      endHour = 18;
    }
    if (schedule === 2) {
      startHour = 8;
      endHour = 17;
      endDay = 4;
    }
    if (schedule === 3) {
      startHour = 8;
      endHour = 18;
      endDay = 4;
    }
    if (schedule === 4) {
      startHour = 9;
      endHour = 18;
    }
    if (schedule === 5) {
      startHour = 6;
      endHour = 20;
    }
    if (schedule === 6) {
      startHour = 9;
      endHour = 18;
      endDay = 4;
    }
    if (schedule === 7) {
      startHour = 6;
      endHour = 20;
      endDay = 4;
    }

    const color = preview ? this.previewColor : this.selectedColor;
    const startCol = startHour * 2 + 1;
    const endCol = endHour * 2 + 2;
    this.selectedTable = JSON.parse(JSON.stringify(this.workingTable));
    for (let i = startDay; i <= endDay; i++) {
      for (let j = startCol; j <= endCol; j++) {
        if (preview) {
          this.selectedTable[i][j] = color;
        } else {
          this.workingTable[i][j] = color;
        }
      }
    }
    if (!preview) {
      this.selectedTable = JSON.parse(JSON.stringify(this.workingTable));
      this.calcUptime();
    }
  }

  clearPreview(): void {
    this.selectedTable = JSON.parse(JSON.stringify(this.workingTable));
  }

  calcUptime(): void {
    const uptime = this.workingTable.map(row => {
      return row.filter(cell => cell === this.selectedColor).length;
    }).reduce((a, b) => a + b, 0);
    this.upHours = uptime / 2;
    this.downHours = 168 - this.upHours;
    this.savings = +(this.downHours / 168 * 100).toFixed(0);
    this.savingsTrigger = new Object();
  }

  save(): void {
    const events: ScheduleEventItem[] = [];
    for (let i = 0; i < 7; i++) {
      let previousCellColor = this.previewColorEven;
      let newEvent = new ScheduleEventItem();
      for (let j = 1; j < 49; j++) {
        let currentCellColor = this.workingTable[i][j];
        if (previousCellColor !== currentCellColor) {
          if (currentCellColor === this.selectedColor) {
            newEvent = new ScheduleEventItem();
            newEvent.day_of_week = i;
            const hour = Math.floor((j - 1) / 2);
            if (j % 2 !== 0) {
              newEvent.event_start = hour + ':00';
            } else {
              newEvent.event_start = hour + ':30';
            }
          }
          if (previousCellColor === this.selectedColor) {
            const hour = Math.floor((j - 1) / 2);
            if (j % 2 !== 0) {
              newEvent.event_finish = hour + ':00';
            } else {
              newEvent.event_finish = hour + ':30';
            }
            events.push(newEvent);
          }
        }
        if (j === 48 && currentCellColor === this.selectedColor) {
          newEvent.event_finish = '00:00';
          events.push(newEvent);
        }
        previousCellColor = currentCellColor;
      }
    }
    let sEvent = new ScheduleEvent();
    sEvent.schedule_name = this.scheduleName ? this.scheduleName : '';
    sEvent.events = events;
    this.eventsScheduled.emit(sEvent);
  }

  populateTable(): void {
    this.scheduleEvents.forEach(day => {
      day.periods.forEach(period => {
        const startHour = parseInt(period.start.split(':')[0]);
        const startMinute = parseInt(period.start.split(':')[1]);
        let endHour = parseInt(period.end.split(':')[0]);
        const endMinute = parseInt(period.end.split(':')[1]);
        endHour = (endHour === 0 && endMinute === 0) ? 24 : endHour;
        const addStartHalfHour = startMinute === 30 ? 1 : 0;
        const startCol = startHour * 2 + 1 + addStartHalfHour;
        const addEndHalfHour = endMinute === 30 ? 1 : 0;
        const endCol = endHour * 2 + addEndHalfHour;
        for (let i = startCol; i <= endCol; i++) {
          this.workingTable[day.day][i] = this.selectedColor;
        }
      });
    });
    this.selectedTable = JSON.parse(JSON.stringify(this.workingTable));
    this.calcUptime();
  }

  ngOnChanges(): void {
    this.populateTable();
    this.scheduleName = this.schedule?.schedule_name;
  }
}
