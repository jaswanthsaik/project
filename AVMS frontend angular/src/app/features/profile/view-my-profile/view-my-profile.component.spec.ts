import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewMyProfileComponent } from './view-my-profile.component';

describe('ViewMyProfileComponent', () => {
  let component: ViewMyProfileComponent;
  let fixture: ComponentFixture<ViewMyProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewMyProfileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewMyProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
