import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecommendationDetailComponent } from './recommendations-popup.component';

describe('DeleteUserComponent', () => {
  let component: RecommendationDetailComponent;
  let fixture: ComponentFixture<RecommendationDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecommendationDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecommendationDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
