import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAccountAzureComponent } from './add-account-azure.component';

describe('AddAccountAzureComponent', () => {
  let component: AddAccountAzureComponent;
  let fixture: ComponentFixture<AddAccountAzureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddAccountAzureComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddAccountAzureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
