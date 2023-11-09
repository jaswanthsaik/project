import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeeklyFineTuningComponent } from './weekly-fine-tuning.component';

describe('WeeklyFineTuningComponent', () => {
  let component: WeeklyFineTuningComponent;
  let fixture: ComponentFixture<WeeklyFineTuningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WeeklyFineTuningComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WeeklyFineTuningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
