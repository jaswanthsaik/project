import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvmsMultiSelectComponent } from './avms-multi-select.component';

describe('AvmsMultiSelectComponent', () => {
  let component: AvmsMultiSelectComponent;
  let fixture: ComponentFixture<AvmsMultiSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AvmsMultiSelectComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AvmsMultiSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
