import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseDropdownComponent } from './expense-dropdown.component';

describe('ExpenseDropdownComponent', () => {
  let component: ExpenseDropdownComponent;
  let fixture: ComponentFixture<ExpenseDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpenseDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpenseDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
