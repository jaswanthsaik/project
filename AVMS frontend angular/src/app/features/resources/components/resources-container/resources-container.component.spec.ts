import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourcesContainerComponent } from './resources-container.component';

describe('ResourcesContainerComponent', () => {
  let component: ResourcesContainerComponent;
  let fixture: ComponentFixture<ResourcesContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResourcesContainerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResourcesContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
