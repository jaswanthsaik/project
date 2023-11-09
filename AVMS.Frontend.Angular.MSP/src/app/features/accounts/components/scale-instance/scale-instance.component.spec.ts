import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScaleInstanceComponent } from './scale-instance.component';

describe('ScaleInstanceComponent', () => {
  let component: ScaleInstanceComponent;
  let fixture: ComponentFixture<ScaleInstanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScaleInstanceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScaleInstanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
