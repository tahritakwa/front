
import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../../../../COM/config/app.config';
import { ResourceService } from '../../../shared/services/resource/resource.service';
import { Expense } from '../../../models/purchase/expense.model';
import { DocumentExpenseLine } from '../../../models/purchase/document-expense-line.model';
import { Observable } from 'rxjs/Observable';
import { Operation } from '../../../../COM/Models/operations';
import { TotalLineExpense } from '../../../models/purchase/total-line-expense.model';
import { InputToCalculateCoefficientOfPriceCost } from '../../../models/purchase/input-to-calculate-coefficient-of-price-cost.model';
import { CostPriceConstant } from '../../../constant/purchase/cost-price-constant';
const CALCULATE_TTC_AMOUNT = 'calculateTtcAmount';
@Injectable()
export class DocumentExpenseLineService extends ResourceService<Expense> {

  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(
      httpClient, appConfig,
      'documentExpenseLine', 'DocumentExpenseLine', 'Sales');
  }

  public getDocumentExpenseLineTTCAmount(data: DocumentExpenseLine): Observable<any> {
    return this.callService(Operation.POST, CALCULATE_TTC_AMOUNT, data);
  }
  public calculateTotalExpense(data: TotalLineExpense): Observable<any> {
    return this.callService(Operation.POST, CostPriceConstant.CALCULATE_TOTAL_EXPENSE, data);
  }

  public calculateCoefficientOfCostPrice(data: InputToCalculateCoefficientOfPriceCost): Observable<any> {
    return this.callService(Operation.POST, CostPriceConstant.CALCULATE_COEFFICIENT_OF_COST_PRICE, data);
  }

  public changePercentageData(data: any): Observable<any> {
    return this.callService(Operation.POST, CostPriceConstant.CALCULATE_PERCENTAGE_COST_PRICE, data);
  }

  public changeAmountData(data: any): Observable<any> {
    return this.callService(Operation.POST, CostPriceConstant.CALCULATE_COST_PRICE_PERCENTAGE, data);
  }
}
