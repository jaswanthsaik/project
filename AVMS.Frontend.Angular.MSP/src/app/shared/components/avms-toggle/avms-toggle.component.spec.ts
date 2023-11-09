import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvmsToggleComponent } from './avms-toggle.component';

describe('AvmsToggleComponent', () => {
  let component: AvmsToggleComponent;
  let fixture: ComponentFixture<AvmsToggleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AvmsToggleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AvmsToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
