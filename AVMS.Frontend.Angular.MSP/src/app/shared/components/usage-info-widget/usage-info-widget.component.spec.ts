import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsageInfoWidgetComponent } from './usage-info-widget.component';

describe('UsageInfoWidgetComponent', () => {
  let component: UsageInfoWidgetComponent;
  let fixture: ComponentFixture<UsageInfoWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsageInfoWidgetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsageInfoWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
