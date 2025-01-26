import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListNumUrgenceComponent } from './list-num-urgence.component';

describe('ListNumUrgenceComponent', () => {
  let component: ListNumUrgenceComponent;
  let fixture: ComponentFixture<ListNumUrgenceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListNumUrgenceComponent]
    });
    fixture = TestBed.createComponent(ListNumUrgenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
