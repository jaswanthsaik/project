import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvmsFilterComponent } from './avms-filter.component';

describe('AvmsFilterComponent', () => {
  let component: AvmsFilterComponent;
  let fixture: ComponentFixture<AvmsFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AvmsFilterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AvmsFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
