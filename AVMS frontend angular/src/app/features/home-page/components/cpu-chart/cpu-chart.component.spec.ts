import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CPUChartComponent } from './cpu-chart.component';

describe('CPUChartComponent', () => {
  let component: CPUChartComponent;
  let fixture: ComponentFixture<CPUChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CPUChartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CPUChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
