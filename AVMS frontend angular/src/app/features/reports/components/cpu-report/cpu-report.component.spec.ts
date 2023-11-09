import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CpuReportComponent } from './cpu-report.component';

describe('CpuReportComponent', () => {
  let component: CpuReportComponent;
  let fixture: ComponentFixture<CpuReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CpuReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CpuReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
