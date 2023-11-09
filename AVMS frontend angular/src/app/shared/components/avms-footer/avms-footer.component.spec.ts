import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvmsFooterComponent } from './avms-footer.component';

describe('AvmsFooterComponent', () => {
  let component: AvmsFooterComponent;
  let fixture: ComponentFixture<AvmsFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AvmsFooterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AvmsFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
