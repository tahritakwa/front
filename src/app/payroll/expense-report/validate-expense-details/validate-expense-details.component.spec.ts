import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ValidateExpenseDetailsComponent} from './validate-expense-details.component';

describe('ValidateExpenseDetailsComponent', () => {
  let component: ValidateExpenseDetailsComponent;
  let fixture: ComponentFixture<ValidateExpenseDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ValidateExpenseDetailsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidateExpenseDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
