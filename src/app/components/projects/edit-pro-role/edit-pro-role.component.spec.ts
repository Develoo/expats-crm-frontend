import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditProRoleComponent } from './edit-pro-role.component';

describe('EditProRoleComponent', () => {
  let component: EditProRoleComponent;
  let fixture: ComponentFixture<EditProRoleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditProRoleComponent]
    });
    fixture = TestBed.createComponent(EditProRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
