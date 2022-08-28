import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { NumberConstant } from './../../../../constant/utility/number.constant';
import { SharedConstant } from '../../../../constant/shared/shared.constant';
import { FundsTransfer } from '../../../../models/treasury/funds-transfer.model';
import { FundsTransferConstant } from '../../../../constant/treasury/funds-transfer.constant';
import { CashRegisterDestinationDropdownComponent } from '../../../components/cash-register-destination-dropdown/cash-register-destination-dropdown/cash-register-destination-dropdown.component';
import { FundsTransferTypeEnum } from '../../../../models/treasury/funds-transfer-type';
import { ActivatedRoute, Router } from '@angular/router';
import { FundsTransferService } from '../../../services/funds-transfer/funds-transfer.service';
import { ValidationService } from '../../../../shared/services/validation/validation.service';
import { Observable } from 'rxjs';
import { CashRegisterSourceDropdownComponent } from '../../../components/cash-register-source-dropdown/cash-register-source-dropdown.component';
import { Currency } from '../../../../models/administration/currency.model';
import { TransfertFundTypeEnum } from '../../../../models/enumerators/cash-managment-hierarchy-test-data.enum';
import { TranslateService } from '@ngx-translate/core';
import {LocalStorageService} from '../../../../login/Authentification/services/local-storage-service';

@Component({
  selector: 'app-funds-transfer-add',
  templateUrl: './funds-transfer-add.component.html',
  styleUrls: ['./funds-transfer-add.component.scss']
})
export class FundsTransferAddComponent implements OnInit {
  /**
  * Form Group
  */
  transferFormGroup: FormGroup;

  externeTransfer = false;
  fundsTransfer: FundsTransfer;
  isShowPOSResponsible = false;
  public formatDate = this.translate.instant(SharedConstant.DATE_FORMAT);
  public defaultDate = new Date();
  public fundsTransferList = FundsTransferConstant.NAVIGATE_TO_FUNDS_TRANSFER_LIST;
  @ViewChild(CashRegisterSourceDropdownComponent) childListSourceCash;
  @ViewChild(CashRegisterDestinationDropdownComponent) childListDestinationCash;
  isUpdateMode: boolean;
  id: number;
  transferToUpdate: FundsTransfer;
  isSaveOperation = false;
  language: string;


  constructor(private activatedRoute: ActivatedRoute, private fb: FormBuilder,
    private fundsTransferService: FundsTransferService, private router: Router, private translate: TranslateService,
    private validationService: ValidationService, private localStorageService : LocalStorageService) {
    this.language = this.localStorageService.getLanguage();
    this.activatedRoute.params.subscribe(params => {
      this.id = +params[SharedConstant.ID_LOWERCASE] || NumberConstant.ZERO;
      this.isUpdateMode = this.id > NumberConstant.ZERO;
    });
  }

  ngOnInit() {
    this.createFormGroup();
    this.cashierConditionallyRequiredValidator();
    this.isUpdateMode = this.id > NumberConstant.ZERO;
    if (this.isUpdateMode) {
      this.getDataToUpdate();
    }
  }

  private createFormGroup(transfer?: FundsTransfer): void {
    this.transferFormGroup = this.fb.group({
      Id: [transfer ? transfer.Id : NumberConstant.ZERO],
      TransferDate: [transfer ? transfer.TransferDate : new Date()],
      Type: [transfer ? transfer.Type : undefined, [Validators.required]],
      IdSourceCash: [transfer ? transfer.IdSourceCash : undefined, [Validators.required]],
      IdDestinationCash: [transfer ? transfer.IdDestinationCash : undefined, [Validators.required]],
      AmountWithCurrency: [transfer ? transfer.AmountWithCurrency : undefined, [Validators.required]],
      IdCurrency: [transfer ? transfer.IdCurrency : undefined, [Validators.required]],
      IdCashier: [transfer ? transfer.IdCashier : undefined]
    });
  }

  cashierConditionallyRequiredValidator() {
    this.transferFormGroup.get('Type').valueChanges.subscribe(val => {
      if (val === FundsTransferTypeEnum.Supply_POS) {
        this.transferFormGroup.controls['IdCashier'].setValidators([Validators.required]);
        this.isShowPOSResponsible = true;
      } else {
        this.transferFormGroup.controls['IdCashier'].clearValidators();
        this.transferFormGroup.controls.IdCashier.setValue(undefined);
        this.isShowPOSResponsible = false;
      }
      this.transferFormGroup.controls['IdCashier'].updateValueAndValidity();
    });
  }

  getDataToUpdate() {
    this.fundsTransferService.getById(this.id).subscribe((data) => {
      this.transferToUpdate = data;
      this.transferToUpdate.TransferDate = new Date(this.transferToUpdate.TransferDate);
      this.transferFormGroup.patchValue(this.transferToUpdate);
      this.childListSourceCash.initSourceCashData(this.Type.value);
      this.childListDestinationCash.initDestinationData(this.Type.value);
    });
  }

  receiveTypeData() {
    this.transferFormGroup.controls.IdSourceCash.setValue(undefined);
    this.transferFormGroup.controls.IdDestinationCash.setValue(undefined);
    this.childListSourceCash.initSourceCashData(this.Type.value);
    this.childListDestinationCash.initDestinationData(this.Type.value);
  }

  public save(): void {
    if (this.transferFormGroup.valid) {
      const fundsTransferAssign: FundsTransfer = Object.assign({}, this.transferToUpdate, this.transferFormGroup.getRawValue());
      this.fundsTransferService.save(fundsTransferAssign, !this.isUpdateMode).subscribe(() => {
        this.isSaveOperation = true;
        this.router.navigate([FundsTransferConstant.NAVIGATE_TO_FUNDS_TRANSFER_LIST]);
      });
    } else {
      this.validationService.validateAllFormFields(this.transferFormGroup);
    }
  }

  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    return this.validationService.handleCanDeactivateToLeaveCurrentComponent(this.isFormGroupChanged.bind(this));
  }
  private isFormGroupChanged(): boolean {
    return this.transferFormGroup.dirty && !this.isSaveOperation;
  }

  get TransferDate(): FormControl {
    return this.transferFormGroup.get(FundsTransferConstant.TRANSFER_DATE) as FormControl;
  }

  get Type(): FormControl {
    return this.transferFormGroup.get(FundsTransferConstant.TYPE) as FormControl;
  }

  get IdSourceCash(): FormControl {
    return this.transferFormGroup.get(FundsTransferConstant.ID_SOURCE_CASH) as FormControl;
  }

  get IdDestinationCash(): FormControl {
    return this.transferFormGroup.get(FundsTransferConstant.ID_DESTINATION_CASH) as FormControl;
  }

  get AmountWithCurrency(): FormControl {
    return this.transferFormGroup.get(FundsTransferConstant.AMOUNT_WITH_CURRENCY) as FormControl;
  }

  get IdCurrency(): FormControl {
    return this.transferFormGroup.get(FundsTransferConstant.ID_CURRENCY) as FormControl;
  }

  get IdCashier(): FormControl {
    return this.transferFormGroup.get(FundsTransferConstant.ID_CASHIER) as FormControl;
  }

}
