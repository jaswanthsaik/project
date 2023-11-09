import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvmsToasterItemComponent } from './avms-toaster-item.component';

describe('AvmsToasterItemComponent', () => {
  let component: AvmsToasterItemComponent;
  let fixture: ComponentFixture<AvmsToasterItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AvmsToasterItemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AvmsToasterItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
