import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchInstanceComponent } from './search-instance.component';

describe('SearchInstanceComponent', () => {
  let component: SearchInstanceComponent;
  let fixture: ComponentFixture<SearchInstanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchInstanceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchInstanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
