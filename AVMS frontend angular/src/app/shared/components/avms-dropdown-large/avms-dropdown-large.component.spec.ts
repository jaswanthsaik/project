import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvmsDropdownLargeComponent } from './avms-dropdown-large.component';

describe('AvmsDropdownLargeComponent', () => {
  let component: AvmsDropdownLargeComponent;
  let fixture: ComponentFixture<AvmsDropdownLargeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AvmsDropdownLargeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AvmsDropdownLargeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
