import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvmsDropdownComponent } from './avms-dropdown.component';

describe('AvmsDropdownComponent', () => {
  let component: AvmsDropdownComponent;
  let fixture: ComponentFixture<AvmsDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AvmsDropdownComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AvmsDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
