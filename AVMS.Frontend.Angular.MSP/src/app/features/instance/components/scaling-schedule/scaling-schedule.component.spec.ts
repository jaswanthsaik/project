import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScalingScheduleComponent } from './scaling-schedule.component';

describe('ScalingScheduleComponent', () => {
  let component: ScalingScheduleComponent;
  let fixture: ComponentFixture<ScalingScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScalingScheduleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScalingScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
