import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleLabelComponent } from './schedule-label.component';

describe('ScheduleLabelComponent', () => {
  let component: ScheduleLabelComponent;
  let fixture: ComponentFixture<ScheduleLabelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScheduleLabelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScheduleLabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
