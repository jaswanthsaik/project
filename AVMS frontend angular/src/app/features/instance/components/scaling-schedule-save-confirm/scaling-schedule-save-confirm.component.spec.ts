import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScalingScheduleSaveConfirmComponent } from './scaling-schedule-save-confirm.component';

describe('ScalingScheduleSaveConfirmComponent', () => {
  let component: ScalingScheduleSaveConfirmComponent;
  let fixture: ComponentFixture<ScalingScheduleSaveConfirmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScalingScheduleSaveConfirmComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScalingScheduleSaveConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
