import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { State, DataResult } from '@progress/kendo-data-query';
import { ColumnSettings } from '../../../shared/utils/column-settings.interface';
import { TreasuryConstant } from '../../../constant/treasury/treasury.constant';
import { PredicateFormat } from '../../../shared/utils/predicate';
import { Currency } from '../../../models/administration/currency.model';
import { DocumentEnumerator } from '../../../models/enumerators/document.enum';
import { Router } from '@angular/router';
import { DocumentUtilityService } from '../../services/document-utility.service';
import { LanguageService } from '../../../shared/services/language/language.service';
import { TranslateService } from '@ngx-translate/core';
import {LocalStorageService} from '../../../login/Authentification/services/local-storage-service';

@Component({
  selector: 'app-pop-up-settlement-replacement',
  templateUrl: './pop-up-settlement-replacement.component.html',
  styleUrls: ['./pop-up-settlement-replacement.component.scss']
})
export class PopUpSettlementReplacementComponent implements OnInit {
  @Input() ListSettlement;
  @Input() TotalAmountTTC;
  language: string;
  totalRemainingAmount = 0;
  tiersCurrency: Currency;
  public documentType = DocumentEnumerator;
  withholdingTax: number;
  residual: number;
  columnsConfig: ColumnSettings[] = [
    {
      field: TreasuryConstant.FINANCIAL_COMMITMENT_TYPE,
      title: TreasuryConstant.TYPE,
      tooltip: TreasuryConstant.TYPE_OF_FINANCIAL_COMMITMENT,
      filterable: true,
    },
    {
      field: TreasuryConstant.CODE_DOCUMENT_FROM_ID_DOCUMENT_NAVIGATION,
      title: TreasuryConstant.CODE_BILL_TITLE,
      tooltip: TreasuryConstant.CODE_BILL_TITLE,
      filterable: true,
    },
    {
      field: TreasuryConstant.CODE,
      title: TreasuryConstant.FINANCIAL_COMMITMENT_CODE_TITLE,
      tooltip: TreasuryConstant.FINANCIAL_COMMITMENT_CODE_TITLE,
      filterable: true,
    },
    {
      field: TreasuryConstant.COMMITMENT_DATE,
      title: TreasuryConstant.COMMITMENT_DATE_TITLE,
      tooltip: TreasuryConstant.COMMITMENT_DATE_TITLE,
      filterable: true,
    },
    {
      field: TreasuryConstant.AMOUNT_WITH_CURRENCY,
      title: TreasuryConstant.TOTAL_AMOUNT_UPPERCASE,
      tooltip: TreasuryConstant.TOTAL_AMOUNT_TO_BE_PAID,
      filterable: true,
    },
    {
      field: TreasuryConstant.REMAINING_AMOUNT_WITH_CURRENCY,
      title: TreasuryConstant.REMAINING_AMOUNT_TO_PAID,
      tooltip: TreasuryConstant.DOCUMENT_REMAINING_AMOUNT_TO_BE_PAID,
      filterable: true,
    },
  ];

  gridData: DataResult;

  predicate: PredicateFormat = new PredicateFormat();
  public gridState: State = {
    skip: 0,
    take: 10,
    // Initial filter descriptor
    filter: {
      logic: 'and',
      filters: []
    }
  };
  public formatDate = this.translate.instant(SharedConstant.DATE_FORMAT);

  constructor(private router: Router, private documentUtility: DocumentUtilityService,
              private localStorageService : LocalStorageService, private translate: TranslateService) {
    this.language = this.localStorageService.getLanguage();
  }

  ngOnInit() {
    this.gridData = this.ListSettlement;
    this.tiersCurrency = this.ListSettlement[0].IdCurrencyNavigation;
    this.getTotalAmountToBePaid();
  }


  public getTotalAmountToBePaid() {
    let totalToPaid = 0;
    this.ListSettlement.forEach(
      x => {
        if (x.IdDocumentNavigation.DocumentTypeCode === DocumentEnumerator.SalesInvoices
          || x.IdDocumentNavigation.DocumentTypeCode === DocumentEnumerator.PurchaseInvoices) {
          totalToPaid += x.RemainingAmountWithCurrency;
        } else if (x.IdDocumentNavigation.DocumentTypeCode === DocumentEnumerator.SalesInvoiceAsset
          || x.IdDocumentNavigation.DocumentTypeCode === DocumentEnumerator.PurchaseAsset) {
          totalToPaid -= x.RemainingAmountWithCurrency;
        }
      });
    totalToPaid = totalToPaid < 0 ? 0 : totalToPaid;
    const multiplier = Math.pow(10, 3 || 0);
    totalToPaid = Math.round(totalToPaid * multiplier) / multiplier;
    this.totalRemainingAmount = totalToPaid;
  }

  // Navigate to document detail
  showDocument(document) {
    const url = this.documentUtility.showDocument(document);
    this.router.navigate([]).then(result => { window.open(url, '_blank'); });
  }
}
