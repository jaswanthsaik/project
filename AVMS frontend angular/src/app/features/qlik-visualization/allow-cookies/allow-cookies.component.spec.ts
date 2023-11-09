import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllowCookiesComponent } from './allow-cookies.component';

describe('AllowCookiesComponent', () => {
  let component: AllowCookiesComponent;
  let fixture: ComponentFixture<AllowCookiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllowCookiesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllowCookiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
