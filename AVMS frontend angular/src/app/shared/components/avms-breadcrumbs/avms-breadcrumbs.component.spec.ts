import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvmsBreadcrumbsComponent } from './avms-breadcrumbs.component';

describe('AvmsBreadcrumbsComponent', () => {
  let component: AvmsBreadcrumbsComponent;
  let fixture: ComponentFixture<AvmsBreadcrumbsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AvmsBreadcrumbsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AvmsBreadcrumbsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
