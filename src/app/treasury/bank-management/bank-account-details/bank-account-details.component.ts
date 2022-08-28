import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BankAccountService } from '../../../administration/services/bank-account/bank-account.service';
import { BankAccountConstant } from '../../../constant/Administration/bank-account.constant';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { BankAccount } from '../../../models/shared/bank-account.model';
import { ReducedBankAccountData } from '../../../models/shared/reduced-bank-account-data.model';
import { DeadLineDocumentService } from '../../../sales/services/dead-line-document/dead-line-document.service';
import { LanguageService } from '../../../shared/services/language/language.service';
import { Filter, Operation, PredicateFormat, Relation } from '../../../shared/utils/predicate';
import {LocalStorageService} from '../../../login/Authentification/services/local-storage-service';

@Component({
  selector: 'app-bank-account-details',
  templateUrl: './bank-account-details.component.html',
  styleUrls: ['./bank-account-details.component.scss']
})
export class BankAccountDetailsComponent implements OnInit {

  language: string;
  bankAccountDetailsData: ReducedBankAccountData;
  id: number;
  dataLoaded = false;
  currentBalance = 0;
  forecastBalance = 0;
  cumulOfUnreconciledRegulation = 0;
  constructor(private bankAccountService: BankAccountService, private activatedRoute: ActivatedRoute, private router: Router,
    private settlementService: DeadLineDocumentService,
              private localStorageService : LocalStorageService) {
    this.language = this.localStorageService.getLanguage();

    this.id = this.activatedRoute.snapshot.params['id'];
  }


  ngOnInit() {
    this.getBankAccountData();
    this.getBankAccountPrevisionnelAmount();
  }

  getBankAccountData() {
    let predicate = new PredicateFormat();
    predicate.Filter = new Array<Filter>();
    predicate.Filter.push(new Filter(BankAccountConstant.ID, Operation.eq, this.id));
    predicate.Relation = new Array<Relation>();
    predicate.Relation.push(new Relation(BankAccountConstant.ID_BANK_NAVIGATION));
    predicate.Relation.push(new Relation(BankAccountConstant.ID_CURRENCY_NAVIGATION));
    this.bankAccountService.getBankAccountWithCondition(predicate).subscribe((data) => {
      this.bankAccountDetailsData = data;
      this.dataLoaded = true;
    });
  }

  getBankAccountPrevisionnelAmount() {
    this.settlementService.getBankAccountPrevisionnelSold(this.id).subscribe((data) => {
      if (data) {
        this.currentBalance = data.CurrentBalance;
        this.cumulOfUnreconciledRegulation = data.CumulOfUnreconciledRegulations;
        this.forecastBalance = data.ForecastBalance;
      }
    });
  }

  refreshBankAccountAfterReconciliation($event) {
    this.getBankAccountPrevisionnelAmount();
  }

  goBackToList() {
    this.router.navigateByUrl(BankAccountConstant.NAVIGATE_TO_BANK_ACCOUNT_FROM_TREASURY);
  }
}
