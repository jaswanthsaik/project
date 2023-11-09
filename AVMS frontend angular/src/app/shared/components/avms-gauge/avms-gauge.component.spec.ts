import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvmsGaugeComponent } from './avms-gauge.component';

describe('AvmsGaugeComponent', () => {
  let component: AvmsGaugeComponent;
  let fixture: ComponentFixture<AvmsGaugeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AvmsGaugeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AvmsGaugeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
