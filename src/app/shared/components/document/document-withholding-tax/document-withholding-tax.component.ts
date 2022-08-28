import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DataSourceRequestState } from '@progress/kendo-data-query';
import { GrowlService } from '../../../../../COM/Growl/growl.service';
import { WithholdingTaxConstant } from '../../../../constant/payment/withholding_tax_constant';
import { TreasuryConstant } from '../../../../constant/treasury/treasury.constant';
import { NumberConstant } from '../../../../constant/utility/number.constant';
import { Currency } from '../../../../models/administration/currency.model';
import { DocumentWithholdingTax } from '../../../../models/sales/document-withholding-tax.model';
import { Document } from '../../../../models/sales/document.model';
import { DocumentWithholdingTaxService } from '../../../../sales/services/document-withholding-tax/document-withholding-tax.service';
import { AmountFormatService } from '../../../../treasury/services/amount-format.service';
import { ColumnSettings } from '../../../utils/column-settings.interface';
import { GridSettings } from '../../../utils/grid-settings.interface';
import { PredicateFormat } from '../../../utils/predicate';
import { documentStatusCode } from '../../../../models/enumerators/document.enum';
import { WithholdingTaxService } from '../../../services/withholding-tax/withholding-tax.service';
import { AuthService } from '../../../../login/Authentification/services/auth.service';
import { PermissionConstant } from '../../../../Structure/permission-constant';
import {LocalStorageService} from '../../../../login/Authentification/services/local-storage-service';
import { WithHoldingTaxTypeEnumerator } from '../../../../models/enumerators/withHoldingTax-type.enum';
import { FinancialCommitmentService } from '../../../../sales/services/financial-commitment/financial-commitment.service';


@Component({
  selector: 'app-document-withholding-tax',
  templateUrl: './document-withholding-tax.component.html',
  styleUrls: ['./document-withholding-tax.component.scss']
})
export class DocumentWithholdingTaxComponent implements OnInit {

  @Input() idDocument: number;
  @Input() currentDocument: Document;
  @Input() tiersType;
  @Output() withholdingConfigHasBeenChanged = new EventEmitter();
  public statusCode = documentStatusCode;

  TotalAmountTtc = 0;
  TotalAmountVat = 0;
  TotalHoldingTax = 0;
  TotalAmountToBePaid = 0;
  public withholdingTaxTypeEnumerator = WithHoldingTaxTypeEnumerator;
  currency: Currency;
  /**
   * Grid state
   */
  public gridState: DataSourceRequestState = {
    skip: 0,
    take: 10,
    filter: { // Initial filter descriptor
      logic: 'and',
      filters: []
    }
  };

  public columnsConfig: ColumnSettings[] = [
    {
      field: '',
      title: '',
      filterable: true
    },
    {
      field: WithholdingTaxConstant.DEDUCTIONSMADEFROM,
      title: WithholdingTaxConstant.DEDUCTIONSMADEFROM_TITLE,
      filterable: true
    },
    {
      field: WithholdingTaxConstant.WITHHOLDING_TAX_TYPE,
      title: WithholdingTaxConstant.TYPE_TITLE,
      filterable: true
    },
    {
      field: '',
      title: WithholdingTaxConstant.AMOUNT,
      filterable: true,
      filter: 'numeric'

    },
    {
      field: '',
      title: TreasuryConstant.WITHHOLDING_TITLE,
      filterable: true,
      filter: 'numeric'
    },
    {
      field: '',
      title: WithholdingTaxConstant.AMOUNT_TO_BE_PAID_TITLE,
      filterable: true,
      filter: 'numeric'
    }
  ];

  // Grid settings
  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig,
    gridData: {
      data: [],
      total: 0
    }
  };

  public predicate: PredicateFormat = new PredicateFormat();
  language: string;
  public hasAddPermission = false;
  public amountEditMode = false;
  formatOptions: any;
  public haveOnlyDepositSettlement = false;

  constructor(public withholdingTaxService: WithholdingTaxService,
    public documentWithholdingTax: DocumentWithholdingTaxService,
    private growlService: GrowlService, private translate: TranslateService,
    private amountFormat: AmountFormatService, public authService: AuthService,
    private localStorageService: LocalStorageService, public financialCommitmentService: FinancialCommitmentService) {
     this.language = this.localStorageService.getLanguage();
  }

    ngOnInit() {
    this.hasAddPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.ADD_SALES_WITHHOLDING_TAX) || this.authService.hasAuthority(PermissionConstant.CommercialPermissions.ADD_PURCHASE_WITHHOLDING_TAX);
    this.initGridDataSource();
    if (this.currentDocument && this.currentDocument.IdTiersNavigation) {
      this.currency = this.currentDocument.IdTiersNavigation.IdCurrencyNavigation;
    }
    this.formatOptions = {
      minimumFractionDigits: this.currency.Precision
    };
  }

  public initGridDataSource(): void {
    this.preparePredicate();
    this.withholdingTaxService.processDataServerSide(this.predicate).subscribe(res => {
      res.data.forEach(x => {
        const documentwithholdingTax: DocumentWithholdingTax = new DocumentWithholdingTax();
        if (this.currentDocument.DocumentWithholdingTax &&
          this.currentDocument.DocumentWithholdingTax.findIndex(y => y.IdWithholdingTax === x.Id) >= NumberConstant.ZERO) {
          const withholdingDocument = this.currentDocument.DocumentWithholdingTax.find(d => d.IdWithholdingTax === x.Id);
          withholdingDocument.AmountToBePaid = this.amountFormat.format(this.currency,
            (withholdingDocument.AmountWithCurrency - withholdingDocument.WithholdingTaxWithCurrency));
          withholdingDocument.IsChecked = true;
          withholdingDocument.AmountToBePaid = this.amountFormat.format(this.currency, withholdingDocument.AmountToBePaid);
          withholdingDocument.editAmount = false;
          this.gridSettings.gridData.data.push(withholdingDocument);
          // check totals
          if (withholdingDocument.IdWithholdingTaxNavigation.Type === WithHoldingTaxTypeEnumerator.Ttc) {
            this.TotalAmountTtc = this.amountFormat.format(this.currency,
              (withholdingDocument.AmountWithCurrency + this.TotalAmountTtc));
          } else {
            this.TotalAmountVat = this.amountFormat.format(this.currency,
              (withholdingDocument.AmountWithCurrency + this.TotalAmountVat));
          }

          this.TotalHoldingTax = this.amountFormat.format(this.currency,
            (withholdingDocument.WithholdingTaxWithCurrency + this.TotalHoldingTax));
          this.TotalAmountToBePaid = this.amountFormat.format(this.currency,
            (this.TotalAmountToBePaid + withholdingDocument.AmountToBePaid));
        } else {
          documentwithholdingTax.IdDocument = this.idDocument;
          documentwithholdingTax.IdWithholdingTax = x.Id;
          documentwithholdingTax.IdWithholdingTaxNavigation = x;
          documentwithholdingTax.editAmount = false;
          this.gridSettings.gridData.data.push(documentwithholdingTax);
        }
      });
    });
  }

  public preparePredicate(): void {
    this.predicate = new PredicateFormat();
    this.predicate.pageSize = this.gridSettings.state.take;
    this.predicate.page = (this.gridSettings.state.skip / this.gridSettings.state.take) + 1;
  }

  // On select checkbox
  setHoldingTaxVerification(dataItem) {
    if (this.currentDocument && this.currentDocument.IdDocumentStatus && this.currentDocument.IdDocumentStatus === documentStatusCode.Valid) {
      this.setHoldingTax(dataItem);
    }else if(this.currentDocument && this.currentDocument.IdDocumentStatus == documentStatusCode.PartiallySatisfied)
   
          this.financialCommitmentService.isDcoumentHaveOnlyDepositSettlement(this.currentDocument.Id).subscribe(x=> {
            if(x){
              this.haveOnlyDepositSettlement = true;
              this.setHoldingTax(dataItem);
            }
          });
  }
    
    setHoldingTax(dataItem){
      if (dataItem.IsChecked) {
        if (dataItem.IdWithholdingTaxNavigation.Type === WithHoldingTaxTypeEnumerator.Ttc) {
          this.TotalAmountTtc = this.amountFormat.format(this.currency,
            (this.TotalAmountTtc - (+dataItem.AmountWithCurrency)));
        } else {
          this.TotalAmountVat = this.amountFormat.format(this.currency,
            (this.TotalAmountVat - (+dataItem.AmountWithCurrency)));
        }
        this.TotalAmountToBePaid = this.amountFormat.format(this.currency,
          (this.TotalAmountToBePaid - (+dataItem.AmountToBePaid)));
        this.TotalHoldingTax = this.amountFormat.format(this.currency,
          (this.TotalHoldingTax - (+dataItem.WithholdingTaxWithCurrency)));
        dataItem.AmountWithCurrency = 0;
        dataItem.WithholdingTaxWithCurrency = 0;
        dataItem.AmountToBePaid = 0;
      } else {
        if(dataItem.IdWithholdingTaxNavigation.Type == WithHoldingTaxTypeEnumerator.Vat && this.currentDocument.DocumentTotalVatTaxesWithCurrency == NumberConstant.ZERO){
          this.growlService.warningNotification(this.translate.instant(WithholdingTaxConstant.TOTAL_VAT_WARNING));
        } else {
          if(dataItem.IdWithholdingTaxNavigation.Type == WithHoldingTaxTypeEnumerator.Ttc){
            dataItem.AmountWithCurrency = this.amountFormat.format(this.currency,
              (this.currentDocument.DocumentTtcpriceWithCurrency - this.TotalAmountTtc));
          } else {
            dataItem.AmountWithCurrency = this.amountFormat.format(this.currency,
              (this.currentDocument.DocumentTotalVatTaxesWithCurrency - this.TotalAmountVat));
          }
          if (dataItem.AmountWithCurrency === NumberConstant.ZERO) {
            this.growlService.warningNotification(this.translate.instant(WithholdingTaxConstant.WITHHOLDING_TAX_SELECT_WARNING));
          } else {
            dataItem.WithholdingTaxWithCurrency = this.amountFormat.format(this.currency,
              ((dataItem.AmountWithCurrency * dataItem.IdWithholdingTaxNavigation.Percentage) / 100));
            dataItem.AmountToBePaid = this.amountFormat.format(this.currency,
              (dataItem.AmountWithCurrency - dataItem.WithholdingTaxWithCurrency));
              if(dataItem.IdWithholdingTaxNavigation.Type == WithHoldingTaxTypeEnumerator.Ttc){
                this.TotalAmountTtc = this.TotalAmountTtc + dataItem.AmountWithCurrency;
              }else {
                this.TotalAmountVat = this.TotalAmountVat + dataItem.AmountWithCurrency;
              }

            this.TotalAmountToBePaid = this.TotalAmountToBePaid + dataItem.AmountToBePaid;
            this.TotalHoldingTax = this.TotalHoldingTax + dataItem.WithholdingTaxWithCurrency;
          }
        }
      }
      dataItem.IsChecked = (dataItem.AmountWithCurrency === NumberConstant.ZERO ||  dataItem.AmountWithCurrency == undefined )? false : true;
    }

  // when the value of amount TTC input change
  changeDeductionAmount(dataItem) {
    dataItem.AmountWithCurrency = this.amountFormat.format(this.currency, dataItem.AmountWithCurrency);
    const oldTotalAmount = dataItem.IdWithholdingTaxNavigation.Type === WithHoldingTaxTypeEnumerator.Ttc
    ? this.TotalAmountTtc : this.TotalAmountVat;
    const oldDataItemAmount = dataItem.WithholdingTaxWithCurrency + dataItem.AmountToBePaid;
    if (dataItem.IdWithholdingTaxNavigation.Type === WithHoldingTaxTypeEnumerator.Ttc) {
      this.TotalAmountTtc = (this.amountFormat.format(this.currency,
        (this.TotalAmountTtc - oldDataItemAmount + (+dataItem.AmountWithCurrency))));
        if (this.TotalAmountTtc > this.currentDocument.DocumentTtcpriceWithCurrency || dataItem.AmountWithCurrency < NumberConstant.ZERO) {
          if (dataItem.AmountWithCurrency < NumberConstant.ZERO) {
            this.growlService.ErrorNotification(this.translate.instant(WithholdingTaxConstant.DOCUMENT_WITHHOLDING_TAX_AMOUNT_WARNING));
          } else {
            this.growlService.ErrorNotification(this.translate.instant(WithholdingTaxConstant.DOCUMENT_WITHHOLDING_TAX_TTC_WARNING));
          }
          this.TotalAmountTtc = oldTotalAmount;
          dataItem.AmountWithCurrency = oldDataItemAmount;
        } else {
          dataItem.WithholdingTaxWithCurrency = this.amountFormat.format(this.currency,
            ((dataItem.AmountWithCurrency * dataItem.IdWithholdingTaxNavigation.Percentage) / 100));
          dataItem.AmountToBePaid = this.amountFormat.format(this.currency,
            ((+dataItem.AmountWithCurrency) - dataItem.WithholdingTaxWithCurrency));
        }
    } else {
      this.TotalAmountVat = (this.amountFormat.format(this.currency,
         (this.TotalAmountVat - oldDataItemAmount + (+dataItem.AmountWithCurrency))));
        if (this.TotalAmountVat > this.currentDocument.DocumentTotalVatTaxesWithCurrency
          || dataItem.AmountWithCurrency < NumberConstant.ZERO) {
          if (dataItem.AmountWithCurrency < NumberConstant.ZERO) {
            this.growlService.ErrorNotification(this.translate.instant(WithholdingTaxConstant.DOCUMENT_WITHHOLDING_TAX_AMOUNT_WARNING));
          } else {
            this.growlService.ErrorNotification(this.translate.instant(WithholdingTaxConstant.DOCUMENT_WITHHOLDING_TAX_VAT_WARNING));
          }
          this.TotalAmountVat = oldTotalAmount;
          dataItem.AmountWithCurrency = oldDataItemAmount;
        } else {
          dataItem.WithholdingTaxWithCurrency = this.amountFormat.format(this.currency,
            ((dataItem.AmountWithCurrency * dataItem.IdWithholdingTaxNavigation.Percentage) / 100));
          dataItem.AmountToBePaid = this.amountFormat.format(this.currency,
            ((+dataItem.AmountWithCurrency) - dataItem.WithholdingTaxWithCurrency));
        }
    }


    this.TotalAmountToBePaid = 0;
    this.TotalHoldingTax = 0;
    this.gridSettings.gridData.data.forEach(x => {
      this.TotalHoldingTax = x.WithholdingTaxWithCurrency ? (this.TotalHoldingTax + (+x.WithholdingTaxWithCurrency)) : this.TotalHoldingTax;
      this.TotalAmountToBePaid = x.AmountToBePaid ? this.amountFormat.format(this.currency,
        this.TotalAmountToBePaid + +x.AmountToBePaid) : this.TotalAmountToBePaid;
    });

    if (+dataItem.AmountWithCurrency === NumberConstant.ZERO) {
      dataItem.IsChecked = false;
    }
  }

  // save withholding tax
  save() {
    if (this.amountFormat.format(this.currency, this.TotalAmountTtc)
      !== this.amountFormat.format(this.currency, this.currentDocument.DocumentTtcpriceWithCurrency)
      && this.amountFormat.format(this.currency, this.TotalAmountTtc) !== NumberConstant.ZERO) {
        this.growlService.ErrorNotification(this.translate.instant(WithholdingTaxConstant.WITHHOLDING_TAX_SAVE_ERROR));
      } else if (this.amountFormat.format(this.currency, this.TotalAmountVat )
      !== this.amountFormat.format( this.currency, this.currentDocument.DocumentTotalVatTaxesWithCurrency)
      && this.amountFormat.format(this.currency, this.TotalAmountVat) !== NumberConstant.ZERO) {
      this.growlService.ErrorNotification(this.translate.instant(WithholdingTaxConstant.WITHHOLDING_TAX_VAT_SAVE_ERROR));
    } else {
      let savedData = Object.assign([], this.gridSettings.gridData.data);
      savedData = savedData.filter(x => x.IsChecked);
      if (savedData.length === 0) {
        const documentWithholdingTax = new DocumentWithholdingTax();
        documentWithholdingTax.IdDocument = this.idDocument;
        savedData.push(documentWithholdingTax);
      }
      this.documentWithholdingTax.addDocumentsWithholdingTax(savedData).subscribe(() => {
        this.withholdingConfigHasBeenChanged.emit(true);
      });
    }
  }
  public cellClickHandler(dataItem) {
    dataItem.editAmount = true;
  }
  public closeinput(dataItem) {
    dataItem.editAmount = false;

  }
}
