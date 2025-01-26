import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNumUrgenceComponent } from './add-num-urgence.component';

describe('AddNumUrgenceComponent', () => {
  let component: AddNumUrgenceComponent;
  let fixture: ComponentFixture<AddNumUrgenceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddNumUrgenceComponent]
    });
    fixture = TestBed.createComponent(AddNumUrgenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
