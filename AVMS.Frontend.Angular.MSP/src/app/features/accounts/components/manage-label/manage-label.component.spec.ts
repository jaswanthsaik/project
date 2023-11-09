import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageLabelComponent } from './manage-label.component';

describe('ManageLabelComponent', () => {
  let component: ManageLabelComponent;
  let fixture: ComponentFixture<ManageLabelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageLabelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageLabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
