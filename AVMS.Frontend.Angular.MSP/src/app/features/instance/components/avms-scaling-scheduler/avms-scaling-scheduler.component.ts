import { Dialog } from '@angular/cdk/dialog';
import { ComponentPortal } from '@angular/cdk/portal';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, first, of, throwError, timer } from 'rxjs';
import { InstanceSize } from 'src/app/features/accounts/models/instance-size';
import { AccountsHttpService } from 'src/app/features/accounts/services/accounts-http.service';
import { InstanceApiResponse } from 'src/app/features/instance/models/instance-api-response';
import { ScheduleApiResponse } from 'src/app/features/schedules/models/schedule-api-response';
import { ScheduleEvent, ScheduleEventItem } from 'src/app/features/schedules/models/schedule-event';
import { ScheduleEventApiResponse } from 'src/app/features/schedules/models/schedule-event-api-response';
import { ApiError } from 'src/app/models/api-error';
import { ToasterService } from 'src/app/shared/components/avms-toaster/services/toaster.service';
import { ModalDialogComponent } from 'src/app/shared/components/dialogs/modal-dialog/modal-dialog.component';
import { ModalDialogData } from 'src/app/shared/components/dialogs/models/modal-dialog-data';
import { ModalDialogResponseOptions } from 'src/app/shared/components/dialogs/models/modal-dialog-reponse-options';
import { CatalogHttpService } from 'src/app/shared/services/catalog-http.service';
import { NotifierService } from 'src/app/shared/services/notifier.service';
import { ScalingScheduleApiResponse, ScalingScheduleEventApiResponse } from '../../models/scaling-schedule-api-response';
import { ScalingScheduleEvent, ScalingScheduleEventItem } from '../../models/scaling-schedule-event';
import { InstanceHttpService } from '../../services/instance-http.service';
import { InstanceService } from '../../services/instance.service';
import { ScalingScheduleDeleteConfirmComponent } from '../scaling-schedule-delete-confirm/scaling-schedule-delete-confirm.component';
import { ScalingScheduleSaveConfirmComponent } from '../scaling-schedule-save-confirm/scaling-schedule-save-confirm.component';
import { FineTuningScheduleEvent, FineTuningScheduleEventItem } from '../../models/fine-tuning-schedule-events';
import { FineTuningEventAPIResponse, events } from '../../models/fine-tuning-api-response'
import { DeleteConfirmationDialogComponent } from '../../components/delete-confirmation-dialog/delete-confirmation-dialog.component'
import moment from 'moment';
import { ConfirmationDialogData } from 'src/app/shared/components/dialogs/models/confirmation-dialog-data';
import { ConfirmationDialogComponent } from 'src/app/shared/components/dialogs/confirmation-dialog/confirmation-dialog.component';


@Component({
  selector: 'app-avms-scaling-scheduler',
  templateUrl: './avms-scaling-scheduler.component.html',
  styleUrls: ['./avms-scaling-scheduler.component.scss']
})
export class AvmsScalingSchedulerComponent implements OnInit, OnChanges {
  @Input() instance?: InstanceApiResponse;
  @Input() subscriptionId = 0;
  @Input() resourceGroupId = 0;
  @Input() isWeeklyFineTuningModule: any;
  @Input() fineTuningScheduleEvents: events[] = [];

  schedule?: ScalingScheduleApiResponse;
  scheduleEvents: ScalingScheduleEventApiResponse[] = [];
  //@Output() eventsScheduled = new EventEmitter<ScheduleEvent>();
  rowTemplate = new Array(49).fill('');
  workingTable = new Array(7).fill(0).map(() => new Array(48).fill('transparent'));
  savedDrag = new Array(7).fill(0).map(() => new Array(48).fill(''));
  hours = new Array(24).fill('').map((_, i) => i < 10 ? `0${i}:00` : `${i}:00`);
  dragStartPosition: { row: number, col: number } = { row: 0, col: 0 };
  dragStartCoordinates: { x: number, y: number } = { x: 0, y: 0 };

  selecting = false;
  startingItem = { row: 0, col: 0 };
  selectedTable = [...this.workingTable];
  selectedColor = '#96E47A';
  pastTimeFrameColor = '#d3d3d3';
  fineTuningColor = '#57C54D'
  previewColor = 'cyan';

  instanceSizes: InstanceSize[] = [];
  scaleOptions = [
    { id: '0', description: 'Select a size to scale the instance' },
  ];
  oldSize = '0';
  newSize = '0';
  selectedTimezone: string = '0';
  timezoneOptions = [
    { id: '0', description: 'Please choose a timezone for the schedule' },
  ];
  isEditing = false;
  previewColorEven = '#E6E7EB';
  @Output() eventsScheduled = new EventEmitter<ScheduleEvent>();
  scheduleName?: string = '';
  @Input() timezone: any;
  enableDeleteBtn: boolean =false;
  showtooltipForPastTime: boolean = false;
  showTooltipText:any;

  constructor(
    private instanceService: InstanceService,
    private accountsHttpService: AccountsHttpService,
    private instanceHttpService: InstanceHttpService,
    private catalogHttpService: CatalogHttpService,
    private dialog: Dialog,
    private router: Router,
    private toaster: NotifierService,
  ) {
    this.workingTable[0].unshift('MONDAY');
    this.workingTable[1].unshift('TUESDAY');
    this.workingTable[2].unshift('WEDNESDAY');
    this.workingTable[3].unshift('THURSDAY');
    this.workingTable[4].unshift('FRIDAY');
    this.workingTable[5].unshift('SATURDAY');
    this.workingTable[6].unshift('SUNDAY');
    this.selectedTable = JSON.parse(JSON.stringify(this.workingTable));
}

  getHeaderStyle(col: number): string {
    return `grid-column: ${2 * col + 2}/${2 * col + 4};`;
  }
 
  emptyGraph () {
    for (let col = 0; col < 24; col++) {
      if (col % 2 === 0) {
        this.workingTable.forEach(row => {
            row[2 * col + 1] = this.previewColorEven;
            row[2 * col + 2] = this.previewColorEven;
        });
      }
    }
    this.selectedTable = JSON.parse(JSON.stringify(this.workingTable));
  }

  fineTuningEmptyGraph() {
        for (let col = 0; col < 24; col++) {
          if (col % 2 === 0) {
            this.workingTable.forEach(row => {
                row[2 * col + 1] = this.previewColorEven;
                row[2 * col + 2] = this.previewColorEven;
            });
          }
        }
      const dayNames = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
      const inputDateString = new Date(new Date().toUTCString().slice(0, -3))
      inputDateString.setHours(inputDateString.getHours() + this.timezone?.totalDifferenceHours);
      inputDateString.setMinutes(inputDateString.getMinutes() + this.timezone?.totalDifferenceMinutes);
      const currentTime = new Date(inputDateString);
      const currentHour = currentTime.getHours();
      const currentMinute = currentTime.getMinutes();
      const currentTimeNumber = currentHour * 2 + Math.floor(currentMinute / 30) + 1;
      const now = new Date();
      const dayN = now.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
      const weekday = dayNames.indexOf(dayN);
      for (let col = 1; col < 49; col++) {
          this.workingTable.forEach((row) => {
            const dayName = row[0];
            const dayNumber = dayNames.indexOf(dayName);
            if(dayNumber === weekday) {
              for (let i = 0; i < 48; i++) {
                if (i < currentTimeNumber) {
                  row[i + 1] = this.pastTimeFrameColor;
            }}
              }
            if (dayNumber < weekday) {
              row[col] = this.pastTimeFrameColor;
            }
          });
          }
          this.selectedTable = JSON.parse(JSON.stringify(this.workingTable));
  }

  mouseDown(event: MouseEvent, row: number, col: number): void {
    if (col === 0) {
      return;
    }
    this.startingItem = { row, col };
    this.selecting = true;
  }

  mouseOver(event: MouseEvent, row: number, col: number): void {
    this.showtooltipForPastTime = false;
    if(this.workingTable[row][col] === this.pastTimeFrameColor) {
      this.showtooltipForPastTime = true;
      this.showTooltipText = "Past time frame is not editable!";
      return;
    }
      if(this.workingTable[row][col] === this.selectedColor) {
        this.showtooltipForPastTime = true;
        this.showTooltipText = "Already Scheduled!";
      return;
    };
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
    if(this.workingTable[row][col] === this.pastTimeFrameColor || 
      this.workingTable[row][col] === this.selectedColor) {
      return;
    }
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
      return
    }
    for (let i = selStart.row; i <= selEnd.row; i++) {
      for (let j = selStart.col; j <= selEnd.col; j++) {
        if(this.isWeeklyFineTuningModule) {
          if (this.workingTable[i][j] === this.pastTimeFrameColor ||
            this.workingTable[i][j] === this.selectedColor) {
            return;
          } else {
          this.workingTable[i][j] = this.fineTuningColor;
          }
        } else {
          this.workingTable[i][j] = this.selectedColor;
        }
      }
    }
    this.selectedTable = JSON.parse(JSON.stringify(this.workingTable));
  }

  mouseLeave(): void {
    this.showtooltipForPastTime = false;
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
  }

  selectCol(col: number): void {
    if(this.isWeeklyFineTuningModule) {
      return;
    } else {
    this.workingTable.forEach(row => {
      row[2 * col + 1] = this.selectedColor;
      row[2 * col + 2] = this.selectedColor;
    });
    this.selectedTable = JSON.parse(JSON.stringify(this.workingTable));
   }
  }

  clearCol(col: number): void {
    this.workingTable.forEach(row => {
      if (col % 2 === 0) {
        row[2 * col + 1] = this.previewColorEven;
        row[2 * col + 2] = this.previewColorEven;
      } else {
        row[2 * col + 1] = 'transparent';
        row[2 * col + 2] = 'transparent';
      }
    });
    this.selectedTable = JSON.parse(JSON.stringify(this.workingTable));
  }

  clearSchedule(): void {
    for (let i = 0; i < 7; i++) {
      this.clearRow(i);
    }
    this.emptyGraph();
  }

  cellClick(row: number, col: number): void {
    this.selectCell(row, col);
  }

  selectCell(row: number, col: number): void {
    if(this.isWeeklyFineTuningModule) {
      if(this.workingTable[row][col] === this.pastTimeFrameColor || 
        this.workingTable[row][col] === this.selectedColor) {
          return;
      }
    }
    if (!this.isWeeklyFineTuningModule && col === 0) {
      for (let i = 1; i < 49; i++) {
        this.workingTable[row][i] = this.selectedColor;
      }
      this.selectedTable = JSON.parse(JSON.stringify(this.workingTable));
    } else if (this.workingTable[row][col] === this.selectedColor || 
      this.workingTable[row][col] === this.fineTuningColor) {
      if ((col + 2) % 4 === 0 || (col + 3) % 4 === 0) {
        this.workingTable[row][col] = this.previewColorEven;
      } else {
        this.workingTable[row][col] = 'transparent';
      }
    } else {
      if(this.isWeeklyFineTuningModule && col !== 0) {
        this.workingTable[row][col] = this.fineTuningColor;
      } else if(!this.isWeeklyFineTuningModule) {
        this.workingTable[row][col] = this.selectedColor;
      }
    }
    this.selectedTable = JSON.parse(JSON.stringify(this.workingTable));
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
    }

  }

  clearPreview(): void {
    this.selectedTable = JSON.parse(JSON.stringify(this.workingTable));
  }

  confirmSave(): void {
    this.instanceService.scalingScheduleSize = this.oldSize || '';
    this.instanceService.scalingScheduleNewSize = this.newSize;
    const data: ModalDialogData = {
      title: 'Confirmation',
      primaryButtonText: 'Confirm',
      secondaryButtonText: '',
      cancelButtonText: 'Cancel',
      portal: new ComponentPortal(ScalingScheduleSaveConfirmComponent)
    };
    const dialogRef = this.dialog.open<ModalDialogResponseOptions>(ModalDialogComponent, {
      width: '850px',
      data: data,
    });
    dialogRef.closed.subscribe(result => {
      if (result === 'primary') {
        this.save();
      }
    });
  }

  save(): void {
    const events: ScalingScheduleEventItem[] = [];
    for (let i = 0; i < 7; i++) {
      let previousCellColor = this.previewColorEven;
      let newEvent = new ScalingScheduleEventItem();
      for (let j = 1; j < 49; j++) {
        let currentCellColor = this.workingTable[i][j];
        if (previousCellColor !== currentCellColor) {
          if (currentCellColor === this.selectedColor) {
            newEvent = new ScalingScheduleEventItem();
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
      let sEvent = new ScalingScheduleEvent();
      sEvent.virtual_machine = this.instance!.instance;
      sEvent.size_from_name = this.oldSize;
      sEvent.size_to_name = this.newSize;
      sEvent.events = events;
      sEvent.timezone = +this.selectedTimezone;
      this.instanceHttpService.addScalingSchedule(sEvent).pipe(
        first(),
        catchError(err => {
          const error = err.error as ApiError;
          this.toaster.showError('error', error.message.join('\n'));
          throw err;
        })
      ).subscribe(res => {
        this.toaster.showSuccess('Success!', 'The scaling schedule has been created successfully!');
        timer(3000).subscribe(() => (this.router.navigate(['/accounts/resourceGroup', this.resourceGroupId])));
      });
  }

  saveFineTuningSchedule(): void {
    const events: FineTuningScheduleEventItem[] = [];
    for (let i = 0; i < 7; i++) {
      let previousCellColor = this.previewColorEven;
      let newEvent = new FineTuningScheduleEventItem();
      for (let j = 1; j < 49; j++) {
        let currentCellColor = this.workingTable[i][j];
        if (previousCellColor !== currentCellColor) {
          if (currentCellColor === this.fineTuningColor) {
            newEvent = new FineTuningScheduleEventItem();
            newEvent.day_of_week = i;
            const hour = Math.floor((j - 1) / 2);
            if (j % 2 !== 0) {
              newEvent.event_start = hour + ':00';
            } else {
              newEvent.event_start = hour + ':30';
            }
          }
          if (previousCellColor === this.fineTuningColor) {
            const hour = Math.floor((j - 1) / 2);
            if (j % 2 !== 0) {
              newEvent.event_finish = hour + ':00';
            } else {
              newEvent.event_finish = hour + ':30';
            }
            events.push(newEvent);
          }
        } 
        if (j === 48 && currentCellColor === this.fineTuningColor) {
          newEvent.event_finish = '00:00';
          events.push(newEvent);
        }
        
        previousCellColor = currentCellColor;
      }
    }
      let sEvent = new FineTuningScheduleEvent();
      sEvent.events = events;
      this.eventsScheduled.emit(sEvent);
  }
  confirmDelete(): void {
    this.instanceService.scalingScheduleSize = this.oldSize || '';
    this.instanceService.scalingScheduleNewSize = this.newSize;
    this.instanceService.timezoneName = this.timezoneOptions.find(tz => tz.id === this.selectedTimezone)?.description || '';
    const data: ModalDialogData = {
      title: 'Confirmation',
      primaryButtonText: 'Confirm',
      secondaryButtonText: '',
      cancelButtonText: 'Cancel',
      portal: new ComponentPortal(ScalingScheduleDeleteConfirmComponent)
    };
    const dialogRef = this.dialog.open<ModalDialogResponseOptions>(ModalDialogComponent, {
      width: '850px',
      data: data,
    });
    dialogRef.closed.subscribe(result => {
      if (result === 'primary') {
        this.delete();
      }
    });
  }

  fineTuningConfirmDelete() {
    const data: ConfirmationDialogData = {
      title: 'Confirmation',
      primaryButtonText: 'Confirm',
      secondaryButtonText: '',
      cancelButtonText: 'Cancel',
      confirmMessage: 'Are you sure you want to proceed?',
      portal:new ComponentPortal(DeleteConfirmationDialogComponent)
    };
    const dialogRef = this.dialog.open<ModalDialogResponseOptions>(ConfirmationDialogComponent, {
      width: '400px',
      data: data,
    });
    dialogRef.closed.subscribe(result => {
      if (result === 'primary') {
        this.deleteFineTuningSchedule();
      }
    });
  }

  deleteFineTuningSchedule() {
    this.instanceHttpService.deleteFineTuningSchedule(this.instance!.instance).pipe(
      first(),
      catchError(err => {
        const error = err.error as ApiError;
        this.toaster.showError('error', error.message.join('\n'));
        throw err;
      })
    ).subscribe(res => {
      this.toaster.showSuccess('Success','Schedule successfully deleted!');
      timer(3000).subscribe(() => (this.router.navigate(['/accounts/resourceGroup',  this.resourceGroupId])));
    });
  }

  delete(): void {
    this.instanceService.scalingScheduleSize = this.oldSize || '';
    this.instanceService.scalingScheduleNewSize = this.newSize;
    this.instanceService.timezoneName = this.selectedTimezone;
    this.instanceHttpService.deleteScalingSchedule(this.instance!.instance).pipe(
      first(),
      catchError(err => {
        const error = err.error as ApiError;
        this.toaster.showError('error', error.message.join('\n'));
        throw err;
      })
    ).subscribe(res => {
      this.toaster.showSuccess('Schedule successfully deleted!', 'To start managing the instances sizes again, please create a new schedule from the instances list.');
      timer(3000).subscribe(() => (this.router.navigate(['/accounts/resourceGroup',  this.resourceGroupId])));
    });
  }

  populateTable(): void {
    if(this.isWeeklyFineTuningModule) {
          this.fineTuningScheduleEvents?.forEach(day => {
            day.scheduleeventperiods.forEach(period => {
              const startHour = parseInt(period.start?.split(':')[0]);
              const startMinute = parseInt(period.start?.split(':')[1]);
              let endHour = parseInt(period.end?.split(':')[0]);
              const endMinute = parseInt(period.end?.split(':')[1]);
              endHour = (endHour === 0 && endMinute === 0) ? 24 : endHour;
              const addStartHalfHour = startMinute === 30 ? 1 : 0;
              const startCol = startHour * 2 + 1 + addStartHalfHour;
              const addEndHalfHour = endMinute === 30 ? 1 : 0;
              const endCol = endHour * 2 + addEndHalfHour;
              for (let i = startCol; i <= endCol; i++) {
                this.workingTable[day.day][i] = this.selectedColor;
              }
   
            });
            day?.weeklyschedulefinetuningperiods?.forEach(period => {
              const startHour = parseInt(period.start?.split(':')[0]);
              const startMinute = parseInt(period.start?.split(':')[1]);
              let endHour = parseInt(period.end?.split(':')[0]);
              const endMinute = parseInt(period.end?.split(':')[1]);
              endHour = (endHour === 0 && endMinute === 0) ? 24 : endHour;
              const addStartHalfHour = startMinute === 30 ? 1 : 0;
              const startCol = startHour * 2 + 1 + addStartHalfHour;
              const addEndHalfHour = endMinute === 30 ? 1 : 0;
              const endCol = endHour * 2 + addEndHalfHour;
              for (let i = startCol; i <= endCol; i++) {
                this.workingTable[day.day][i] = this.fineTuningColor;
              }
            });
          });
    } else {
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
      }
    this.selectedTable = JSON.parse(JSON.stringify(this.workingTable));
  }

  getSchedule(): void {
    this.instanceHttpService.getScalingSchedule(this.instance!.instance).pipe(
      first(),
      catchError(err => {
        const error = err.error as ApiError;
        return of(null);
      })
    ).subscribe(res => {
      this.oldSize = res!.data.size_from_name;
      this.scaleOptions = [...this.scaleOptions];
      if (res && res.data.schedule) {
        this.isEditing = true;
        this.scheduleEvents = res.data.events;
        this.selectedTimezone = res.data.timezone.toString();
        this.newSize = res.data.size_to_name;
        this.populateTable();
      }
    });
  }

  getTimezones(): void {
    this.catalogHttpService.getTimezones().pipe(first()).subscribe(res => {
      const timezones = res.data.map(timezone =>({
        id: timezone.timezone.toString(),
        description: timezone.timezone_name,
      }));
      this.timezoneOptions = [...this.timezoneOptions, ...timezones];
    });
  }

  timezoneChanged(timezone: string): void {
    this.selectedTimezone = timezone;
  }

  getTimezoneName(timezone: string): string {
    return this.timezoneOptions.find(tz => tz.id === timezone)?.description || '';
  }

  getInstanceSizes(): void {
    this.accountsHttpService.getInstanceSizes(this.instance!.instance).pipe(first()).subscribe(res => {
      const sizes = res.data;
      sizes.forEach(size => {
        this.scaleOptions.push({ id: size.name, description: size.name + ' (' + size.cores + ' VCores -' + (parseInt(size.memory_megabyte)/1024).toFixed(2).toString() + ' GB)' });
      });
      this.scaleOptions = [...this.scaleOptions];
    });
  }

  oldScaleChanged(oldSize: string): void {
    this.oldSize = oldSize;
  }

  scaleChanged(newSize: string): void {
    this.newSize = newSize;
  }

  ngOnInit(): void {
    if(!this.isWeeklyFineTuningModule) {
      this.getTimezones();
      this.emptyGraph();
    }
  }

  ngOnChanges(): void {
      if(this.isWeeklyFineTuningModule) {
        this.fineTuningEmptyGraph();
        this.populateTable();
        this.disableFineTuningBtn();
      } else {
        if (this.instance) {
        this.getInstanceSizes();
        this.getSchedule();
        }
      }
  }

  disableFineTuningBtn() {
    this.fineTuningScheduleEvents?.forEach(day => {
      if(day?.weeklyschedulefinetuningperiods?.length) {
        this.enableDeleteBtn = true;
      };
    })
    }

}
