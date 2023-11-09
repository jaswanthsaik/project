import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StartStopInstanceComponent } from './start-stop-instance.component';

describe('StartStopAccountComponent', () => {
  let component: StartStopInstanceComponent;
  let fixture: ComponentFixture<StartStopInstanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StartStopInstanceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StartStopInstanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
