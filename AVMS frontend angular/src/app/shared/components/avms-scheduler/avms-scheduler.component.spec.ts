import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvmsSchedulerComponent } from './avms-scheduler.component';

describe('AvmsSchedulerComponent', () => {
  let component: AvmsSchedulerComponent;
  let fixture: ComponentFixture<AvmsSchedulerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AvmsSchedulerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AvmsSchedulerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
