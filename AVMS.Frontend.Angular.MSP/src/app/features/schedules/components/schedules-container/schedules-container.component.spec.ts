import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchedulesContainerComponent } from './schedules-container.component';

describe('SchedulesContainerComponent', () => {
  let component: SchedulesContainerComponent;
  let fixture: ComponentFixture<SchedulesContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SchedulesContainerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SchedulesContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
