import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvmsDatePickerComponent } from './avms-date-picker.component';

describe('AvmsDatePickerComponent', () => {
  let component: AvmsDatePickerComponent;
  let fixture: ComponentFixture<AvmsDatePickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AvmsDatePickerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AvmsDatePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
