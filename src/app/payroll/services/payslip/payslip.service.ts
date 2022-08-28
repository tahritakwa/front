import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Payslip} from '../../../models/payroll/payslip.model';
import {AppConfig} from '../../../../COM/config/app.config';
import {Operation} from '../../../../COM/Models/operations';
import {SessionConstant} from '../../../constant/payroll/session.constant';
import {Observable} from 'rxjs/Observable';
import {PayslipConstant} from '../../../constant/payroll/payslip.constant';
import {ObjectToSave} from '../../../models/shared/objectToSend';
import {PredicateFormat} from '../../../shared/utils/predicate';
import {SharedConstant} from '../../../constant/shared/shared.constant';
import {State} from '@progress/kendo-data-query';
import { ResourceServiceRhPaie } from '../../../shared/services/resource/resource.service.rhpaie';

const URL = 'url';
const ID_SESSION = 'idSession';
const PAYSLIP = 'payslip';

@Injectable()
export class PayslipService extends ResourceServiceRhPaie<Payslip> {

  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(
      httpClient, appConfig,
      'payslip', 'Payslip', 'PayRoll');
  }

  public generatePayslip(id: number, max: number): Observable<any> {
    return this.callService(Operation.GET, SessionConstant.GENERATE_PAYSLIP.concat(id.toString()).concat('/').concat(max.toString()));
  }

  public downloadPayslip(idPayslip: number): Observable<any> {
    return super.callService(Operation.GET, `${PayslipConstant.REPORT_ROOT}${idPayslip}`);
  }

  public downloadAllPayslip(idSession: number): Observable<any> {
    return super.callService(Operation.GET, `${PayslipConstant.ALL_REPORT_ROOT}${idSession}`);
  }

  public broadcastPayslips(idSession: number, url: string): Observable<any> {
    const data: any = {};
    data[URL] = url;
    data[ID_SESSION] = idSession;
    const objectToSave: ObjectToSave = new ObjectToSave();
    objectToSave.Model = data;
    return this.callService(Operation.POST, PayslipConstant.BROADCAST_PAYSLIPS_ROOT, objectToSave);
  }

  public brodcastOnePayslip(url: string, payslip: Payslip): Observable<any> {
    const data: any = {};
    data[URL] = url;
    data[PAYSLIP] = payslip;
    const objectToSave: ObjectToSave = new ObjectToSave();
    objectToSave.Model = data;
    return this.callService(Operation.POST, PayslipConstant.BROADCAST_ONE_PAYSLIPS_ROOT, objectToSave);
  }

  /**
   * Get payslip preview informations
   * @param idContract
   */
  public getPayslipPreviewInformation(payslip: Payslip): Observable<any> {
    return this.callService(Operation.POST, PayslipConstant.GET_PAYSLIP_PREVIEW_INFORMATION, payslip);
  }

  public checkAllPayslipIsCorrect(idSession: number): Observable<boolean> {
    return this.callService(Operation.GET, PayslipConstant.CHECK_ALL_PAYSLIP_IS_CORRECT.concat('/').concat(idSession.toString())) as Observable<boolean>;
  }

  public getPayslipHistory(state: State, predicate: PredicateFormat, startDate: Date, endDate: Date): Observable<any> {
    this.prepareServerOptions(state, predicate);
    const data: any = {};
    data[SharedConstant.PREDICATE] = predicate;
    data[SharedConstant.START_DATE] = startDate;
    data[SharedConstant.END_DATE] = endDate;
    const objectToSave: ObjectToSave = new ObjectToSave();
    objectToSave.Model = data;
    return this.callService(Operation.POST, PayslipConstant.GET_PAYSLIP_HISTORY, objectToSave);
  }

  public downloadAllPayslipOfSelectedEmployee(state: State, predicate: PredicateFormat, startDate: Date, endDate: Date): Observable<any> {
    this.prepareServerOptions(state, predicate);
    const data: any = {};
    data[SharedConstant.PREDICATE] = predicate;
    data[SharedConstant.START_DATE] = startDate;
    data[SharedConstant.END_DATE] = endDate;
    const objectToSave: ObjectToSave = new ObjectToSave();
    objectToSave.Model = data;
    return super.callService(Operation.POST, PayslipConstant.DOWNLOAD_ALL_PAYSLIP_OF_SELECTED_EMPLOYEE, objectToSave);
  }

  public checkIfThereAreSourceDeductionsToDelete(idSession: number): Observable<boolean> {
    return this.callService(Operation.GET, PayslipConstant.CHECK_iF_THERE_ARE_SOURCE_DEDUCTIONS_TO_DELETE.concat('/').concat(idSession.toString())) as Observable<boolean>;
  }
}
