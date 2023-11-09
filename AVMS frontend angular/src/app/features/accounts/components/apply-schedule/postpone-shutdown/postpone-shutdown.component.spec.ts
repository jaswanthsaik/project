import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostponeShutdownComponent } from './postpone-shutdown.component';

describe('PostponeShutdownComponent', () => {
  let component: PostponeShutdownComponent;
  let fixture: ComponentFixture<PostponeShutdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PostponeShutdownComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostponeShutdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
