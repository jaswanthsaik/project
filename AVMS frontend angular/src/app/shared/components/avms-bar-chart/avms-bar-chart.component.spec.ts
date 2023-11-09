import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvmsBarChartComponent } from './avms-bar-chart.component';

describe('AvmsBarChartComponent', () => {
  let component: AvmsBarChartComponent;
  let fixture: ComponentFixture<AvmsBarChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AvmsBarChartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AvmsBarChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
