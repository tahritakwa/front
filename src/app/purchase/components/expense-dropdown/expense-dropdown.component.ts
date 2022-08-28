import { Component, OnInit, Input, EventEmitter, Output, ViewContainerRef } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { PredicateFormat, Relation } from '../../../shared/utils/predicate';
import { Expense } from '../../../models/purchase/expense.model';
import { ExpenseService } from '../../services/expense/expense.service';
import { ExpenseConstant } from '../../../constant/purchase/expense.contant';
import { FormModalDialogService } from '../../../shared/services/dialog/form-modal-dialog/form-modal-dialog.service';
import { AddExpenseComponent } from '../../expense/add-expense/add-expense.component';
import { ReducedExpense } from '../../../models/purchase/reduced-expense.model';

@Component({
  selector: 'app-expense-dropdown',
  templateUrl: './expense-dropdown.component.html',
  styleUrls: ['./expense-dropdown.component.scss']
})
export class ExpenseDropdownComponent implements OnInit {
  @Input() allowCustom;
  @Input() form: FormGroup;
  @Input() selectedValue;
  @Input() isInGrid;
  @Input() hideBtn: boolean;
  @Output() selected = new EventEmitter<boolean>();
  @Output() addClicked = new EventEmitter<boolean>();
  predicate: PredicateFormat;

  // data sources
  public ExpensesDataSource: ReducedExpense[];
  public ExpensesFiltredDataSource: ReducedExpense[];

  constructor(private expenseService: ExpenseService, private viewRef: ViewContainerRef,
    private formModalDialogService: FormModalDialogService) { }

  ngOnInit() {
    this.initDataSource();
  }

  public onSelect($event): void {
    this.selected.emit($event);
  }

  preparePredicate(): void {
    this.predicate = new PredicateFormat();
    this.predicate.Relation = new Array<Relation>();
    this.predicate.Relation.push.apply(this.predicate.Relation, [new Relation(ExpenseConstant.ID_ITEM_NAVIGATION),
    new Relation(ExpenseConstant.ID_TIERS_NAVIGATION_FROM_ID_ITEM_NAVIGATION),
    new Relation(ExpenseConstant.ID_CURRENCY_NAVIGATION),
    new Relation(ExpenseConstant.ID_TAXE_NAVIGATION)]);
  }
  public initDataSource(): void {
    this.preparePredicate();
    this.expenseService.readDropdownPredicateData(this.predicate).subscribe((data: any) => {
      this.ExpensesDataSource = data;
      this.ExpensesFiltredDataSource = this.ExpensesDataSource.slice(0);
    });
  }

  /**
   * filter by name
   * @param value
   */
  handleFilter(value: string) {
    this.ExpensesFiltredDataSource = this.ExpensesDataSource.filter((s) =>
      s.Description.toLowerCase().includes(value.toLowerCase()) || s.Code.toLowerCase().includes(value.toLowerCase())
    );
  }
  addNew() {
    if (this.isInGrid) {
      // notice the grid to treat the add event
      this.addClicked.emit();
    } else {
      const modalTitle = ExpenseConstant.ADD_EXPENSE;
      this.formModalDialogService.openDialog(modalTitle, AddExpenseComponent, this.viewRef, this.initDataSource.bind(this));
    }
  }
}
