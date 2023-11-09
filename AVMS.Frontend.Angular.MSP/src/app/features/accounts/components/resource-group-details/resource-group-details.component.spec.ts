import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceGroupDetailsComponent } from './resource-group-details.component';

describe('ResourceGroupDetailsComponent', () => {
  let component: ResourceGroupDetailsComponent;
  let fixture: ComponentFixture<ResourceGroupDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResourceGroupDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResourceGroupDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
