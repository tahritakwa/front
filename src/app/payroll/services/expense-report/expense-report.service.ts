import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AppConfig} from '../../../../COM/config/app.config';
import {ExpenseReport} from '../../../models/payroll/expense-report.model';
import {Observable} from 'rxjs/Observable';
import {Operation} from '../../../../COM/Models/operations';
import {ExpenseReportConstant} from '../../../constant/payroll/expense-resport.constant';
import {PredicateFormat} from '../../../shared/utils/predicate';
import {DataSourceRequestState} from '@progress/kendo-data-query';
import {ObjectToSave} from '../../../models/shared/objectToSend';
import {SharedConstant} from '../../../constant/shared/shared.constant';
import { ResourceServiceRhPaie } from '../../../shared/services/resource/resource.service.rhpaie';

@Injectable()
export class ExpenseReportService extends ResourceServiceRhPaie<ExpenseReport> {
  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(httpClient, appConfig,
      'expenseReport', 'ExpenseReport', 'PayRoll');
  }

  public saveExpenseReport(data): Observable<any> {
    return this.callService(Operation.POST, ExpenseReportConstant.SAVE_API_URL, data);
  }

  public updateExpenseReport(data): Observable<any> {
    return this.callService(Operation.PUT, ExpenseReportConstant.UPDATE_API_URL, data);
  }

  public validateExpenseReport(data): Observable<any> {
    return this.callService(Operation.POST, ExpenseReportConstant.VALIDATE_API_URL, data);
  }

  public calculateTotalAmount(data): Observable<any> {
    return this.callService(Operation.POST, ExpenseReportConstant.CALCULATE_TOTAL_AMOUNT_API_URL, data);
  }

  public getExpenseReportsRequestsWithHierarchy(state: DataSourceRequestState, predicate?: PredicateFormat,
                                                onlyFirstLevelOfHierarchy?: boolean, month?: Date): Observable<any> {
    super.prepareServerOptions(state, predicate);
    const data: any = {};
    data[SharedConstant.ONLY_FIRST_LEVEL_OF_HIERARCHY] = onlyFirstLevelOfHierarchy;
    data[SharedConstant.PREDICATE] = predicate;
    data[SharedConstant.MONTH_LOWER] = month;
    const objectToSave: ObjectToSave = new ObjectToSave();
    objectToSave.Model = data;
    return this.callService(Operation.POST, ExpenseReportConstant.GET_EXPENSE_REPORTS_REQUESTS_WITH_HIERARCHY, objectToSave);
  }

  /**
   * getExpenseFromListId
   * @param objectToSend
   */
  public getExpenseFromListId(objectToSend: Array<number>): Observable<any> {
    return super.callService(Operation.POST, ExpenseReportConstant.GET_EXPENSE_FROM_LIST_ID, objectToSend);
  }

  /**
   * validateMassiveExpenses
   * @param objectToSend
   */
  public validateMassiveExpenses(objectToSend: ExpenseReport[]): Observable<any> {
    return super.callService(Operation.POST, ExpenseReportConstant.VALIDATE_MASSIVE_EXPENSES, objectToSend);
  }

  /**
   * deleteMassiveexpenseReport
   * @param objectToSend
   */
  public deleteMassiveexpenseReport(objectToSend: number[]): Observable<any> {
    return super.callService(Operation.POST, ExpenseReportConstant.DELETE_MASSIVE_EXPENSE_REPORT, objectToSend);
  }

  /**
   * refuseMassiveexpenseReport
   * @param objectToSend
   */
  public refuseMassiveexpenseReport(objectToSend: number[]): Observable<any> {
    return super.callService(Operation.POST, ExpenseReportConstant.REFUSE_MASSIVE_EXPENSE_REPORT, objectToSend);
  }

  public DownloadExpenseReportDocumentsWar(idExpenseReport: number): Observable<any> {
    return super.callService(Operation.POST, ExpenseReportConstant.DOWNLOAD_EXPENSE_REPORT_DOCUMENTS_WAR, idExpenseReport);
  }
}
