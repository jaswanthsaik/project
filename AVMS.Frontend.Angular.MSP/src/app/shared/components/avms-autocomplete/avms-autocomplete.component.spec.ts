import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvmsAutocompleteComponent } from './avms-autocomplete.component';

describe('AvmsAutocompleteComponent', () => {
  let component: AvmsAutocompleteComponent;
  let fixture: ComponentFixture<AvmsAutocompleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AvmsAutocompleteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AvmsAutocompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
