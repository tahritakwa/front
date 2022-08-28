import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CompanyService } from '../../../../../administration/services/company/company.service';
import { CashManagementConstant } from '../../../../../constant/cash-management/cash-management.constant';
import { SharedConstant } from '../../../../../constant/shared/shared.constant';
import { Currency } from '../../../../../models/administration/currency.model';
import {LocalStorageService} from '../../../../../login/Authentification/services/local-storage-service';

@Component({
  selector: 'app-cash-register-wallet-section',
  templateUrl: './cash-register-wallet-section.component.html',
  styleUrls: ['./cash-register-wallet-section.component.scss']
})
export class CashRegisterWalletSectionComponent implements OnInit, OnChanges {

  @Input() cashManagement;
  selectedDate;
  userCurrency: Currency;
  language: string;
  hiddenClientBankCheck = false;
  hiddenSupplierBankCheck = true;
  hiddenClientBankDraft = true;
  hiddenSupplierBankDraft = true;
  hiddenCash = true;
  customerBankCheckAmount = 0;
  supplierBankCheckAmount = 0;
  customerBankDraftAmount = 0;
  supplierBankDraftAmount = 0;
  cashAmount = 0;
  searchFormGroup: FormGroup;
  constructor(private fb: FormBuilder, private companyService: CompanyService,private localStorageService : LocalStorageService) {
    this.language = this.localStorageService.getLanguage();
  }


  ngOnInit() {
    this.companyService.getCurrentCompany().subscribe(company => {
      this.userCurrency = company.IdCurrencyNavigation;
    });
    this.createSearchForm();
  }


  createSearchForm() {
    this.searchFormGroup = this.fb.group({
      IdTiers: [],
      IdPaymentStatus: []
    });
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes[CashManagementConstant.CASH_MANAGEMENT]) {
      this.cashManagement = changes[CashManagementConstant.CASH_MANAGEMENT].currentValue;
    }
  }

  doSearch() {

  }
}
