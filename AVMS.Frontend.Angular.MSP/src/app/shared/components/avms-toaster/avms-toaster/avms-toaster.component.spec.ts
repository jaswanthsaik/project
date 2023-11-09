import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvmsToasterComponent } from './avms-toaster.component';

describe('AvmsToasterComponent', () => {
  let component: AvmsToasterComponent;
  let fixture: ComponentFixture<AvmsToasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AvmsToasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AvmsToasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
