import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableNavigationControlsComponent } from './table-navigation-controls.component';

describe('TableNavigationControlsComponent', () => {
  let component: TableNavigationControlsComponent;
  let fixture: ComponentFixture<TableNavigationControlsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TableNavigationControlsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableNavigationControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
