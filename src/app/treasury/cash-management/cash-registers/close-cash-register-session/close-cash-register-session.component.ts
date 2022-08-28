import { Component, ComponentRef, OnInit, ViewContainerRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { NumberFormatOptions } from '@progress/kendo-angular-intl';
import { truncate } from 'fs';
import { IModalDialog, IModalDialogOptions } from 'ngx-modal-dialog';
import { ModalDialogInstanceService } from 'ngx-modal-dialog/src/modal-dialog-instance.service';
import { CompanyService } from '../../../../administration/services/company/company.service';
import { SharedConstant } from '../../../../constant/shared/shared.constant';
import { CashRegisterConstant } from '../../../../constant/treasury/cash-register.constant';
import { NumberConstant } from '../../../../constant/utility/number.constant';
import { LocalStorageService } from '../../../../login/Authentification/services/local-storage-service';
import { Currency } from '../../../../models/administration/currency.model';
import { ReducedCurrency } from '../../../../models/administration/reduced-currency.model';
import { SessionCash } from '../../../../models/payment/session-cash.model';
import { FormModalDialogService } from '../../../../shared/services/dialog/form-modal-dialog/form-modal-dialog.service';
import { ValidationService } from '../../../../shared/services/validation/validation.service';
import { SessionCashService } from '../../../services/session-cash/session-cash.service';
import { CashRegistersAddComponent } from '../cash-registers-add/cash-registers-add.component';
import { OpenCashRegisterSessionComponent } from '../open-cash-register-session/open-cash-register-session.component';

@Component({
  selector: 'app-close-cash-register-session',
  templateUrl: './close-cash-register-session.component.html',
  styleUrls: ['./close-cash-register-session.component.scss']
})
export class CloseCashRegisterSessionComponent implements OnInit, IModalDialog {

  public sessionCash: any;
  public openedSession: any;
  public dateFormat = this.translate.instant("DATE_AND_TIME_FORMAT");
  public companyCurrency: ReducedCurrency;
  sessionCashFormGroup: FormGroup;
  public formatNumberOptions: NumberFormatOptions;
  public dialogOptions: Partial<IModalDialogOptions<any>>;
  public language : string;
  constructor(private sessionCashService: SessionCashService, private localStorageService: LocalStorageService,
    private companyService: CompanyService, private translate : TranslateService, private fb : FormBuilder,
    private validationService: ValidationService,private modalDialogInstanceService: ModalDialogInstanceService,
    private modalDialogService: FormModalDialogService, private viewContainerRef: ViewContainerRef) { }

  ngOnInit() {

  }
  dialogInit(reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
    this.createAddFormGroup();
    this.companyService.getDefaultCurrencyDetails().subscribe((currency: ReducedCurrency) => {
      this.setSelectedCurrency(currency);
    });
    this.sessionCashService.getDataForClosingSession(this.localStorageService.getEmail()).subscribe(data =>{
      this.sessionCash = data.objectData;
      if(data.objectData)
      {
        this.sessionCashFormGroup.patchValue(data.objectData);
        this.sessionCashFormGroup.controls.CalculatedTotalAmount.setValue(data.objectData.total);
      }
    });
    this.dialogOptions = options;
    this.openedSession = this.dialogOptions.data.openedSession;
    this.language = this.localStorageService.getLanguage();
  }

  createAddFormGroup() {
    this.sessionCashFormGroup = this.fb.group({
      Id: [0],
      IdCashRegister: [0],
      ClosingDate: [{value: new Date, disabled: true}],
      ClosingAmount: ['', Validators.required],
      ClosingCashAmount: ['', Validators.required],
      TotalAmountGap: [{value: '', disabled: true}],
      CalculatedTotalAmount: [0]
    });
  }
  private setSelectedCurrency(currency: ReducedCurrency) {
    this.companyCurrency = currency;
    this.formatNumberOptions = {
      style: 'decimal',
      maximumFractionDigits: currency.Precision,
      minimumFractionDigits: currency.Precision
    };
  }

  onCloseSessionCashClick(){
    if (this.sessionCashFormGroup.valid) {
      const sessionCash: SessionCash = this.sessionCashFormGroup.getRawValue();
      this.sessionCashService.save(sessionCash, false).subscribe(() => {
        this.cancel(true);
      });
    } else {
      this.validationService.validateAllFormFields(this.sessionCashFormGroup as FormGroup);
    }
  }
  cancel(sessionClosed? : boolean) {
    if(sessionClosed){
      this.dialogOptions.data['exit'] = true;
    }  
    this.cancelDialog();
  }

  cancelDialog() {
    this.dialogOptions.onClose();
    this.dialogOptions.closeDialogSubject.next();
  }
  closingAmountChange($event) {
    if (this.sessionCashFormGroup.controls.ClosingAmount.valid) {
      const gapValue = this.sessionCashFormGroup.controls.ClosingAmount.value - (this.sessionCash ? this.sessionCash.total : 0);
      this.sessionCashFormGroup.controls.TotalAmountGap.setValue(gapValue);
    } else {
      this.sessionCashFormGroup.controls.TotalAmountGap.setValue(undefined);
    }
  }
}
