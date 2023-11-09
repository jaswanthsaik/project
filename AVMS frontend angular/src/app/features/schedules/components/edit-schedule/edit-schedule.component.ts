import { Dialog } from '@angular/cdk/dialog';
import { ComponentPortal } from '@angular/cdk/portal';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, concatMap, delay, mergeMap, of, Subscription, tap, timer } from 'rxjs';
import { ApiError } from 'src/app/models/api-error';
import { ApiResponse } from 'src/app/models/api-response';
import { ToasterService } from 'src/app/shared/components/avms-toaster/services/toaster.service';
import { ModalDialogComponent } from 'src/app/shared/components/dialogs/modal-dialog/modal-dialog.component';
import { ModalDialogData } from 'src/app/shared/components/dialogs/models/modal-dialog-data';
import { ModalDialogResponseOptions } from 'src/app/shared/components/dialogs/models/modal-dialog-reponse-options';
import { BreadcrumbsItem } from 'src/app/shared/models/breadcrumbs-item';
import { Timezone } from 'src/app/shared/models/timezone';
import { CatalogHttpService } from 'src/app/shared/services/catalog-http.service';
import { NotifierService } from 'src/app/shared/services/notifier.service';
import { AddSchedule } from '../../models/add-schedule';
import { ScheduleApiResponse } from '../../models/schedule-api-response';
import { ScheduleEvent, ScheduleEventItem } from '../../models/schedule-event';
import { ScheduleEventApiResponse } from '../../models/schedule-event-api-response';
import { SchedulesHttpService } from '../../services/schedules-http.service';
import { SchedulesService } from '../../services/schedules.service';
import { AddScheduleComponent } from '../add-schedule/add-schedule.component';

@Component({
  selector: 'app-edit-schedule',
  templateUrl: './edit-schedule.component.html',
  styleUrls: ['./edit-schedule.component.scss']
})
export class EditScheduleComponent implements OnInit, OnDestroy {
  scheduleId = 0;
  schedule?: ScheduleApiResponse;
  scheduleEvents: ScheduleEventApiResponse[] = [];
  // eventsScheduled = new EventEmitter<ScheduleEvent>();
  breadcrumbs: BreadcrumbsItem[] = [
    { label: 'Home', url: '/' },
    { label: 'Schedules', url: '/schedules' },
  ];

  timezones: Timezone[] = [];
  currentSchedule = '';
  closing = false;

  subs = new Subscription();
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
  selectedColor = 'green';
  previewColor = 'cyan';

  savings = 0;
  savingsTrigger = {};
  scheduleName?: string = '';

  constructor(
    private httpService: SchedulesHttpService,
    private router: Router,
    private route: ActivatedRoute,
    private toaster: NotifierService,
    private dialog: Dialog,
    private scheduleService: SchedulesService,
    private catalogHttpService: CatalogHttpService,
  )
    {
      this.workingTable[0].unshift('MONDAY');
      this.workingTable[1].unshift('TUESDAY');
      this.workingTable[2].unshift('WEDNESDAY');
      this.workingTable[3].unshift('THURSDAY');
      this.workingTable[4].unshift('FRIDAY');
      this.workingTable[5].unshift('SATURDAY');
      this.workingTable[6].unshift('SUNDAY');
      this.selectedTable = JSON.parse(JSON.stringify(this.workingTable));
    }

  getSchedule(): void {
    const sub = this.httpService.getSingleSchedule(this.scheduleId).subscribe(res => {
      this.schedule = res.data;
      this.breadcrumbs.push({ label: this.schedule.schedule_name, url: '' });
    });
    this.subs.add(sub);
    const eventSub = this.httpService.getScheduleEvents(this.scheduleId).subscribe(res => {
      this.scheduleEvents = res.data;
    });
  }

  eventsScheduled(events: ScheduleEvent): void {
    events.schedule = this.scheduleId;
    this.httpService.addScheduleEvents(events).pipe(
      tap(() => {
        this.closing = true;
        this.toaster.showSuccess('Well done!', 'Your schedule was successfully updated.');
      }),
      delay(3000)
    ).subscribe(res => {
      this.close();
    });
  }

  close(): void {
    this.router.navigate(['/schedules']);
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
  clearSchedule(): void {
    for (let i = 0; i < 7; i++) {
      this.clearRow(i);
    }
    this.calcUptime();
  }
  clearRow(row: number): void {
    for (let i = 1; i < 49; i++) {
      this.workingTable[row][i] = '';
    }
    this.selectedTable = JSON.parse(JSON.stringify(this.workingTable));
    this.calcUptime();
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


  ngOnInit(): void {
    this.scheduleId = +(this.route.snapshot.paramMap.get('id') || '0');
    this.getSchedule();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
  addSchedule(): void {
    this.scheduleService.scheduleName = '';
    this.scheduleService.scheduleDescription = '';
    this.scheduleService.selectedTimezone = '0';
    const data: ModalDialogData = {
      title: 'Add Schedule',
      primaryButtonText: 'Save Schedule',
      secondaryButtonText: '',
      cancelButtonText: 'Cancel',
      portal: new ComponentPortal(AddScheduleComponent)
    };

    let isError = false;
    const sub = this.catalogHttpService.getTimezones().pipe(
      concatMap(res => {
        this.timezones = res.data;
        this.scheduleService.timezones = res.data;
        const dialogRef = this.dialog.open<ModalDialogResponseOptions>(ModalDialogComponent, {
          width: '800px',
          data: data,
        });
        return dialogRef.closed;
      }),
      mergeMap(result => {
        if (result === 'primary') {
          const newSchedule = new AddSchedule();
          newSchedule.schedule_description = this.scheduleService.scheduleDescription;
          newSchedule.schedule_name = this.scheduleService.scheduleName;
          newSchedule.timezone = +this.scheduleService.selectedTimezone;
          this.currentSchedule = this.scheduleService.scheduleName
          return this.httpService.addSchedule(newSchedule).pipe(
            catchError(err =>{
              isError=true;
              return of(err.error as ApiError);
            },),
            
          );
        } else {
          return of(null);
        }
      }),
      mergeMap(result => {
        if (isError) {
          const error = result as ApiError;
          data.confirmMessage = error.message.join('\n');
          let finishDialog : any;
          return finishDialog.closed;
        }
        else if (result) {
          const validResult = result as ApiResponse<string>;
          this.scheduleId = +validResult.data;
          this.getSchedule();
          data.primaryButtonText = 'Edit Schedule';
          data.secondaryButtonText = 'Add New Schedule';
          data.cancelButtonText = 'CLOSE';
          
          const finishDialog = this.dialog.open<ModalDialogResponseOptions>(ModalDialogComponent, {
            width: '800px',
            data: data,
          });
          let confirmMessage = `The schedule ${ this.currentSchedule } was successfully created.`;
          this.toaster.showSuccess('Success!', confirmMessage);
          return finishDialog.closed;
        }
        else {
          return of(null);
        }
      })
    ).subscribe(result => {
      if(!isError){
        if (result === 'primary') {
          this.router.navigate(['schedules/' + this.scheduleId]);
        }
        if (result === 'secondary') {
          this.addSchedule();
        }
      }
    });
    this.subs.add(sub);
  }

}
