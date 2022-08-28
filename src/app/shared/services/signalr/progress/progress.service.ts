import { Injectable } from '@angular/core';
import { SignalrHubService } from '../signalr-hub/signalr-hub.service';
import { Subject } from 'rxjs/Subject';
import { ProgressBar } from '../../../../models/payroll/progress-bar.model';
import { isNullOrUndefined } from 'util';

@Injectable()
export class ProgressService {
  /* */
  payslipSessionProgressionSubject: Subject<ProgressBar> = new Subject<ProgressBar>();
  payslipSessionProgressionObject: ProgressBar;

  /** */
  billingSessionProgressionSubject: Subject<ProgressBar> = new Subject<ProgressBar>();
  billingSessionProgressionObject: ProgressBar;

  /** */
  sourceDeductionSessionProgressionSubject: Subject<ProgressBar> = new Subject<ProgressBar>();
  sourceDeductionProgressionObject: ProgressBar;
 
   /** */
   leaveBalanceRemainingProgressionSubject: Subject<ProgressBar> = new Subject<ProgressBar>();
   leaveBalanceRemainingProgressionObject: ProgressBar;

   



  /**
   * Progress service constructor
   */
  constructor(private signalrHubService: SignalrHubService) {
    this.emitPayslipSessionProgressObject();
    this.emitBillingSessionProgressObject();
  }
  /**
   * Emit projgress object
   */
  emitPayslipSessionProgressObject() {
    this.payslipSessionProgressionSubject.next(this.payslipSessionProgressionObject);
  }

  /**
   * Emit projgress object
   */
  emitBillingSessionProgressObject() {
    this.billingSessionProgressionSubject.next(this.billingSessionProgressionObject);
  }
  /**
   * Emit projgress object
   */
  emitSourceDeductionSessionProgressObject() {
    this.sourceDeductionSessionProgressionSubject.next(this.sourceDeductionProgressionObject);
  }

  /**
   * Initiate progress hub connection
   */
  initPayslipSessionProgressHubConnection() {
    if (!this.signalrHubService.connectionProgressEstablished) {
      this.signalrHubService.createPayslipSessionProgressHubConnection();
      this.signalrHubService.startPayslipSessionProgressHubConnection();
    }
  }
  /**
 * Initiate progress hub connection
 */
  initBillingSessionProgressHubConnection() {
    if (!this.signalrHubService.connectionProgressEstablished) {
      this.signalrHubService.createBillingSessionProgressHubConnection();
      this.signalrHubService.startBillingSessionProgressHubConnection();
    }
  }
  /**
 * Initiate progress hub connection
 */
  initSourceDeductionSessionProgressHubConnection() {
  if (!this.signalrHubService.connectionProgressEstablished) {
    this.signalrHubService.createSourceDeductionSessionProgressHubConnection();
    this.signalrHubService.startSourceDeductionSessionProgressHubConnection();
  }
}
  /**
   * Destroy progress hub connection
   */
  destroyPayslipSessionProgressHubConnection() {
    this.signalrHubService.stopPayslipSessionProgressHubConnection();
  }
  /**
 * Destroy progress hub connection
 */
  destroyBillingSessionProgressHubConnection() {
    this.signalrHubService.stopBillingSessionProgressHubConnection();
  }

   /**
 * Destroy progress hub connection
 */
  destroySourceDeductionProgressHubConnection() {
  this.signalrHubService.stopSourceDeductionSessionProgressHubConnection();
  }

  
  /**
   * Payslip session Progress bar listener event
   */
  registerOnPayslipSessionProgressBarProgressionEvent() {
    this.signalrHubService.hubPayslipSessionProgressConnection.on('PayslipSessionProgression', (data) => {
      if (!isNullOrUndefined(data)) {
        this.payslipSessionProgressionObject = JSON.parse(data);
        this.emitPayslipSessionProgressObject();
      }
    });
  }

  /**
   * Billing session Progress bar listener event
   */
  registerOnBillingSessionProgressBarProgressionEvent() {
    this.signalrHubService.hubBillingSessionProgressConnection.on('BillingSessionProgression', (data) => {
      if (!isNullOrUndefined(data)) {
        this.billingSessionProgressionObject = JSON.parse(data);
        this.emitBillingSessionProgressObject();
      }
    });
  }

  /**
   * Source deduction session Progress bar listener event
   */
  registerOnSourceDeductionSessionProgressBarProgressionEvent() {
    this.signalrHubService.hubSourceDeductionSessionProgressConnection.on('SourceDeductionSessionProgression', (data) => {
      if (!isNullOrUndefined(data)) {
        this.sourceDeductionProgressionObject = JSON.parse(data);
        this.emitSourceDeductionSessionProgressObject();
      }
    });
  }


  emitLeaveBalanceRemainingProgressObject() {
    this.leaveBalanceRemainingProgressionSubject.next(this.leaveBalanceRemainingProgressionObject);
  }

  /**
   * Initiate progress hub connection
   */
  initLeaveBalanceRemainingProgressHubConnection() {
    if (!this.signalrHubService.connectionProgressEstablished) {
      this.signalrHubService.createLeaveBalanceRemainingProgressHubConnection();
      this.signalrHubService.startLeaveBalanceRemainingProgressHubConnection();
    }
  }


  destroyLeaveBalanceRemainingProgressHubConnection() {
    this.signalrHubService.stopLeaveBalanceRemainingProgressHubConnection();
  }

  registerOnLeaveBalanceRemainingProgressBarProgressionEvent() {
    this.signalrHubService.hubLeaveBalanceRemainingProgressConnection.on('LeaveBalanceRemainingProgression', (data) => {
      if (!isNullOrUndefined(data)) {
        this.leaveBalanceRemainingProgressionObject = JSON.parse(data);
        this.emitLeaveBalanceRemainingProgressObject();
      }
    });
  }


}
