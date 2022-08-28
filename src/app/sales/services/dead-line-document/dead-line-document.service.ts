import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../../../../COM/config/app.config';
import { ResourceService } from '../../../shared/services/resource/resource.service';
import { Settlement } from '../../../models/payment/settlement.model';
import { ObjectToSave } from '../../../models/shared/objectToSend';
import { Observable } from 'rxjs/Observable';
import { Operation } from '../../../../COM/Models/operations';
import { SettlementConstant } from '../../../constant/payment/settlement.constant';
import { PredicateFormat } from '../../../shared/utils/predicate';
import { DataSourceRequestState } from '@progress/kendo-data-query';
import { BankAccountConstant } from '../../../constant/Administration/bank-account.constant';
import { BankAccount } from '../../../models/shared/bank-account.model';

@Injectable()
export class DeadLineDocumentService extends ResourceService<Settlement> {

  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(httpClient, appConfig, 'settlement', 'Settlement', 'Payment');
  }

  public saveSettlement(data: ObjectToSave): Observable<any> {
    return this.callService(Operation.POST, SettlementConstant.save, data);
  }
  public updateSettlement(data: Settlement): Observable<any> {
    return this.callService(Operation.POST, SettlementConstant.update, data);
  }

  public getSettlements(idDocument: number): Observable<any> {
    return this.callService(Operation.GET, SettlementConstant.getDocumentSettlements + String(idDocument));
  }

  public getDocumentPaymentHisotry(idDocument: number): Observable<any> {
    return this.callService(Operation.GET, SettlementConstant.GET_DOCUMENT_PAYMENT_HISTORY + String(idDocument));
  }

  public getAllSettlements(state: DataSourceRequestState, historyType: number, startDate: Date, endDate: Date,
    idInvoices: Array<number>, predicate: PredicateFormat): Observable<any> {
    super.prepareServerOptions(state, predicate);
    const data: any = {};
    data[SettlementConstant.START_DATE] = startDate;
    data[SettlementConstant.END_DATE] = endDate;
    data[SettlementConstant.PREDICATE] = predicate;
    data[SettlementConstant.TIERS_TYPE] = historyType;
    data[SettlementConstant.ID_INVOICES] = idInvoices;
    const objectToSave: ObjectToSave = new ObjectToSave();
    objectToSave.Model = data;
    return this.callService(Operation.POST, SettlementConstant.GET_SETTLEMENTS, objectToSave);
  }

  public getSettlementDetails(currentSettlement: Settlement): Observable<any> {
    return this.callService(Operation.POST, SettlementConstant.GET_SETTLEMENT_DETAILS_HISTORY, currentSettlement);
  }

  public replaceSettlement(id: number): Observable<any> {
    return this.callService(Operation.GET, SettlementConstant.REPLACE_SETTLEMENT.concat('/').concat(String(id)));
  }

  public getFinancialCommitmentPaymentHistory(idFinancialCommitment: number): Observable<any> {
    return this.callService(Operation.GET, SettlementConstant.GET_FINANCIALCOMMITMENT_PAYMENT_HISTORY + String(idFinancialCommitment));
  }
  public ReGenerateWithholdingTaxCertification(id): Observable<any>  {
    return this.callService(Operation.GET, SettlementConstant.REGENERATE_WITHHOLDING_TAX_CERTIFICATION.concat('/').concat(String(id)));
  }
  public getInvoicesBySettlement(historyType: number, predicate: PredicateFormat): Observable<any> {
    const data: any = {};
    data[SettlementConstant.PREDICATE] = predicate;
    data[SettlementConstant.TIERS_TYPE] = historyType;
    const objectToSave: ObjectToSave = new ObjectToSave();
    objectToSave.Model = data;
    return this.callService(Operation.POST, SettlementConstant.GET_SETTLEMENY_BY_INVOICES, objectToSave);
  }

  public calculateWithholdingTaxToBePaid(selectedFinancialCommitments: Array<number>): Observable<any> {
    return this.callService(Operation.POST, SettlementConstant.CALCULATE_WITHHOLDING_TAX_TO_BE_PAID, selectedFinancialCommitments);
  }

  public getBankAccountReconciliationSettlement(state: DataSourceRequestState, idBankAccount: number,
    unreconciledRegulations: boolean, reconciledRegulations: boolean): Observable<any> {
    const predicate = new PredicateFormat();
    super.prepareServerOptions(state, predicate);
    const data: any = {};
    data[BankAccountConstant.ID_BANK_ACCOUNT_TO_SEND] = idBankAccount;
    data[BankAccountConstant.UNRECONCILED_REGULATIONS] = unreconciledRegulations;
    data[BankAccountConstant.RECONCILED_REGULATIONS] = reconciledRegulations;
    data[BankAccountConstant.PREDICATE] = predicate;
    const objectToSave: ObjectToSave = new ObjectToSave();
    objectToSave.Model = data;
    return this.callService(Operation.POST, BankAccountConstant.GET_BANK_ACCOUNT_RECONCILIATION_SETTLEMENT, objectToSave);
  }

  public getBankAccountPrevisionnelSold(idBankAccount: number): Observable<any> {
    return this.callService(Operation.POST, BankAccountConstant.GET_BANK_ACCOUNT_PREVISIONNEL_SOLD, idBankAccount);
  }

  public getSettlementListToAddInPaymentSlip(state: DataSourceRequestState, predicate: PredicateFormat,
    isPaymentSlipStateProvisional: boolean, idPaymentSlip: number): Observable<any> {
    super.prepareServerOptions(state, predicate);
    const data: any = {};
    data[BankAccountConstant.PREDICATE] = predicate;
    data[BankAccountConstant.IS_PAYMENTSLIP_STATE_PROVISIONAL] = isPaymentSlipStateProvisional;
    data[BankAccountConstant.ID_PAYMENTSLIP] = idPaymentSlip;
    const objectToSave: ObjectToSave = new ObjectToSave();
    objectToSave.Model = data;
    return this.callService(Operation.POST, BankAccountConstant.GET_SETTLEMENT_LIST_TO_ADD_IN_PAYMENTSLIP, objectToSave);
  }

  public getSettlementToImport(filterSettlement: any): Observable<any> {
    return this.callService(Operation.POST, SettlementConstant.GET_SETTLEMENT_TO_IMPORT, filterSettlement);
  }

  public changeSettlementStatus(idSettlement: number): Observable<any> {
    return this.callService(Operation.POST, SettlementConstant.UPDATE_SETTLEMENT_STATUS, idSettlement);
  }

  public getSettlementNumberToAddInBankCheck(paymentMethod: string): Observable<any> {
    return this.callService(Operation.POST, SettlementConstant.GET_SETTLEMENT_NUMBER_TO_ADD_IN_PAYMENT_SLIP, paymentMethod);
  }
  public getSettlementById(id : number) : Observable<any> {
    return this.callService(Operation.GET, SettlementConstant.GET_SETTLEMENT_BY_ID.concat('/').concat(String(id)));

  }
  public validateDocumentAndGenerateSettlemnt( settlementToGenerate : Settlement, idDocument : number, documentStatus : number) : Observable<any> {
    const objectToSave : any = {
      'settlementToGenerate' : settlementToGenerate,
      'idDocument' :  idDocument,
      'documentStatus' : documentStatus
    }
    return this.callService(Operation.POST, SettlementConstant.VALIDATE_DOCUMENT_GENERATE_SETTLEMENT, objectToSave )
  }

}
