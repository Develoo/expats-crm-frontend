import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditNumUrgencComponent } from './edit-num-urgenc.component';

describe('EditNumUrgencComponent', () => {
  let component: EditNumUrgencComponent;
  let fixture: ComponentFixture<EditNumUrgencComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditNumUrgencComponent]
    });
    fixture = TestBed.createComponent(EditNumUrgencComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
