import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvmsDropdownSmallComponent } from './avms-dropdown-small.component';

describe('AvmsDropdownSmallComponent', () => {
  let component: AvmsDropdownSmallComponent;
  let fixture: ComponentFixture<AvmsDropdownSmallComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AvmsDropdownSmallComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AvmsDropdownSmallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
