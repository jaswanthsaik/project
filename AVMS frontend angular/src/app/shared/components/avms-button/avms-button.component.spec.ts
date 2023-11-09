import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvmsButtonComponent } from './avms-button.component';

describe('AvmsButtonComponent', () => {
  let component: AvmsButtonComponent;
  let fixture: ComponentFixture<AvmsButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AvmsButtonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AvmsButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
