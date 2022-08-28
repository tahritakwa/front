import { Component, OnDestroy, OnInit } from '@angular/core';
import { ExpenseReportService } from '../../services/expense-report/expense-report.service';
import { GridSettings } from '../../../shared/utils/grid-settings.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { UserConstant } from '../../../constant/Administration/user.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { State } from '@progress/kendo-data-query';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { ExpenseReport } from '../../../models/payroll/expense-report.model';
import { ExpenseReportConstant } from '../../../constant/payroll/expense-resport.constant';
import { CompanyService } from '../../../administration/services/company/company.service';
import { Subscription } from 'rxjs/Subscription';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-validate-expense-details',
  templateUrl: './validate-expense-details.component.html',
  styleUrls: ['./validate-expense-details.component.scss']
})
export class ValidateExpenseDetailsComponent implements OnInit, OnDestroy {

  public Expenses: number[] = [];
  public listOfExpenses: ExpenseReport [];
  public UserPicture: any;
  dateFormat = this.translate.instant(SharedConstant.DATE_FORMAT);
  public companyCurrency;

  gridState: State = {
    skip: NumberConstant.ZERO,
    take: NumberConstant.TWENTY,
    // Initial filter descriptor
    filter: {
      logic: 'and',
      filters: []
    }
  };
  public gridSettings: GridSettings = {
    state: this.gridState,
  };
  private subscriptions: Subscription[] = [];

  constructor(private dataRoute: ActivatedRoute, private expenseReportService: ExpenseReportService, private router: Router,
    private companyService: CompanyService, private translate: TranslateService) {
      this.Expenses = this.dataRoute.snapshot.queryParams[UserConstant.LIST_ID];
   }

  ngOnInit() {
    this.subscriptions.push(this.companyService.getCurrentCompany().subscribe(company => {
      this.companyCurrency = company.IdCurrencyNavigation.Symbole;
    }));
    this.getExpensesFromListId();
  }

  getExpensesFromListId() {
    this.subscriptions.push(this.expenseReportService.getExpenseFromListId(this.Expenses).subscribe(result => {
      this.listOfExpenses = result;
    }));
  }

  deleteUserFromListUsersId(id: number) {
    this.listOfExpenses = this.listOfExpenses.filter(item => item.Id !== id);
  }

  validateMassiveExpenses(listOfExpenses: ExpenseReport []) {
    this.subscriptions.push(this.expenseReportService.validateMassiveExpenses(listOfExpenses).subscribe(() => {
      this.router.navigateByUrl(ExpenseReportConstant.EXPENSE);
    }));
  }

  ngOnDestroy(): void {
    if (this.subscriptions !== undefined) {
      this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }
  }
}
