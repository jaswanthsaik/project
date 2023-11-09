import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchRecommendationComponent } from './search-recommendation.component';

describe('SearchRecommendationComponent', () => {
  let component: SearchRecommendationComponent;
  let fixture: ComponentFixture<SearchRecommendationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchRecommendationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchRecommendationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
