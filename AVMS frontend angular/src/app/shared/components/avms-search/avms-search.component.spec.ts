import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvmsSearchComponent } from './avms-search.component';

describe('AvmsSearchComponent', () => {
  let component: AvmsSearchComponent;
  let fixture: ComponentFixture<AvmsSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AvmsSearchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AvmsSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
