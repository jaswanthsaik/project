import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScalingScheduleDeleteConfirmComponent } from './scaling-schedule-delete-confirm.component';

describe('ScalingScheduleDeleteConfirmComponent', () => {
  let component: ScalingScheduleDeleteConfirmComponent;
  let fixture: ComponentFixture<ScalingScheduleDeleteConfirmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScalingScheduleDeleteConfirmComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScalingScheduleDeleteConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
