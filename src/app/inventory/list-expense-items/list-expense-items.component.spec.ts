import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListExpenseItemsComponent } from './list-expense-items.component';

describe('ListExpenseItemsComponent', () => {
  let component: ListExpenseItemsComponent;
  let fixture: ComponentFixture<ListExpenseItemsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListExpenseItemsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListExpenseItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
