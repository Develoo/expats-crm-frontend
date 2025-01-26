import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUserProComponent } from './add-user-pro.component';

describe('AddUserProComponent', () => {
  let component: AddUserProComponent;
  let fixture: ComponentFixture<AddUserProComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddUserProComponent]
    });
    fixture = TestBed.createComponent(AddUserProComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
