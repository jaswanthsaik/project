import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SideWidgetComponent } from './side-widget.component';

describe('SideWidgetComponent', () => {
  let component: SideWidgetComponent;
  let fixture: ComponentFixture<SideWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SideWidgetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SideWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
