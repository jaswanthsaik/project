import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveNewFilterComponent } from './save-new-filter.component';

describe('SaveNewFilterComponent', () => {
  let component: SaveNewFilterComponent;
  let fixture: ComponentFixture<SaveNewFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaveNewFilterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaveNewFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
