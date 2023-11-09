import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteLabelComponent } from './delete-label.component';

describe('DeleteLabelComponent', () => {
  let component: DeleteLabelComponent;
  let fixture: ComponentFixture<DeleteLabelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteLabelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteLabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
