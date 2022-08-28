import { Component, ComponentRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NumberFormatOptions } from '@progress/kendo-angular-intl';
import { IModalDialog, IModalDialogOptions } from 'ngx-modal-dialog';
import { ModalDialogInstanceService } from 'ngx-modal-dialog/src/modal-dialog-instance.service';
import { CompanyService } from '../../../../administration/services/company/company.service';
import { ReducedCurrency } from '../../../../models/administration/reduced-currency.model';
import { CashRegisterStatusEnumerator } from '../../../../models/enumerators/cash-managment-hierarchy-test-data.enum';
import { SessionCash } from '../../../../models/payment/session-cash.model';
import { ValidationService } from '../../../../shared/services/validation/validation.service';
import { CashRegisterDropdownComponent } from '../../../components/cash-register-dropdown/cash-register-dropdown.component';
import { SessionCashService } from '../../../services/session-cash/session-cash.service';

@Component({
  selector: 'app-open-cash-register-session',
  templateUrl: './open-cash-register-session.component.html',
  styleUrls: ['./open-cash-register-session.component.scss']
})
export class OpenCashRegisterSessionComponent implements OnInit, IModalDialog {

  @ViewChild('cashRegisterChild') cashRegisterChild: CashRegisterDropdownComponent;
  public dialogOptions: Partial<IModalDialogOptions<any>>;
  sessionCashFormGroup: FormGroup;
  public disabled : boolean;

  public formatNumberOptions: NumberFormatOptions;
  precision: number;
  public openedSession : SessionCash;
  constructor(private fb: FormBuilder, private companyService: CompanyService, private validationService: ValidationService,
    private sessionCashService: SessionCashService, private modalDialogInstanceService: ModalDialogInstanceService) { }

  ngOnInit() {
    this.disabled =  false;
  }

  dialogInit(reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
    this.companyService.getDefaultCurrencyDetails().subscribe((currency: ReducedCurrency) => {
      this.setSelectedCurrency(currency);
    });
    this.dialogOptions = options;
    if(this.dialogOptions.data){
     this.disabled =  true;
    }
    this.createAddFormGroup(options.data);
  }

  createAddFormGroup(data?:SessionCash) {
    this.sessionCashFormGroup = this.fb.group({
      Id: [0],
      OpeningDate: [{value: new Date, disabled: true}],
      IdPrincipaleCashRegister: [{value:data? data.IdCashRegisterNavigation.IdParentCash : null,disabled:  this.disabled}, Validators.required],
      IdCashRegister: [{value: data? data.IdCashRegister : null, disabled: true}, Validators.required],
      OpeningAmount: ['', Validators.required],
      IdSeller: [{value:data? data.IdSeller : null, disabled: this.disabled}, Validators.required],
      State: [CashRegisterStatusEnumerator.Opened],
      LastCounter: [0]
    });
  }


  private setSelectedCurrency(currency: ReducedCurrency) {
    this.precision = currency.Precision;
    this.formatNumberOptions = {
      style: 'decimal',
      maximumFractionDigits: currency.Precision,
      minimumFractionDigits: currency.Precision
    };
  }

  onAddSessionCashClick() {
    if (this.sessionCashFormGroup.valid) {
      const sessionCash: SessionCash = this.sessionCashFormGroup.getRawValue();
      this.sessionCashService.save(sessionCash, true).subscribe(() => {
        if(this.dialogOptions.data){
          window.location.reload();
        } else {
          this.cancel();
        }
      });
    } else {
      this.validationService.validateAllFormFields(this.sessionCashFormGroup as FormGroup);
    }
  }

  cancel() {
    this.dialogOptions.onClose();
    this.modalDialogInstanceService.closeAnyExistingModalDialog();
  }
  principaleCashRegisterChange($event) {
    this.sessionCashFormGroup.controls.IdCashRegister.setValue(undefined);
    this.sessionCashFormGroup.controls.IdCashRegister.disable()
    if ($event) {
      this.sessionCashFormGroup.controls.IdCashRegister.enable(); 
      this.cashRegisterChild.initDataSource(this.sessionCashFormGroup.controls.IdPrincipaleCashRegister.value); 
    }
  }

}
