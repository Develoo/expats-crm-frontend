import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNotifiComponent } from './add-notifi.component';

describe('AddNotifiComponent', () => {
  let component: AddNotifiComponent;
  let fixture: ComponentFixture<AddNotifiComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddNotifiComponent]
    });
    fixture = TestBed.createComponent(AddNotifiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
