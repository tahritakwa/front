import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseGridComponent } from './expense-grid.component';

describe('ExpenseGridComponent', () => {
  let component: ExpenseGridComponent;
  let fixture: ComponentFixture<ExpenseGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpenseGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpenseGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
