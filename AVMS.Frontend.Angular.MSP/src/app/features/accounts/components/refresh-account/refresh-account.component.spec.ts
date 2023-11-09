import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RefreshAccountComponent } from './refresh-account.component';

describe('RefreshAccountComponent', () => {
  let component: RefreshAccountComponent;
  let fixture: ComponentFixture<RefreshAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RefreshAccountComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RefreshAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
