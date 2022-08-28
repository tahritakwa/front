import { Component, OnInit, ComponentRef } from '@angular/core';
import { IModalDialog, IModalDialogOptions } from 'ngx-modal-dialog';
import { ColumnSettings } from '../../../shared/utils/column-settings.interface';
import { TreasuryConstant } from '../../../constant/treasury/treasury.constant';
import { DataResult, State } from '@progress/kendo-data-query';
import { PredicateFormat } from '../../../shared/utils/predicate';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { Currency } from '../../../models/administration/currency.model';
import { DocumentEnumerator } from '../../../models/enumerators/document.enum';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { DocumentCheckedState } from '../../../models/enumerators/document-checked-state.enum';
import { ModalDialogInstanceService } from 'ngx-modal-dialog/src/modal-dialog-instance.service';
import { Router } from '@angular/router';
import { DocumentUtilityService } from '../../services/document-utility.service';
import { DeadLineDocumentService } from '../../../sales/services/dead-line-document/dead-line-document.service';
import { Tiers } from '../../../models/achat/tiers.model';
import { TiersTypeEnumerator } from '../../../models/enumerators/tiers-type.enum';
import { AmountFormatService } from '../../services/amount-format.service';
import { TranslateService } from '@ngx-translate/core';
import {LocalStorageService} from '../../../login/Authentification/services/local-storage-service';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { PermissionConstant } from '../../../Structure/permission-constant';

@Component({
  selector: 'app-pop-up-selected-financial-commitment',
  templateUrl: './pop-up-selected-financial-commitment.component.html',
  styleUrls: ['./pop-up-selected-financial-commitment.component.scss']
})
export class PopUpSelectedFinancialCommitmentComponent implements OnInit {

  selectedFinancialCommitment: any[];
  selectedItemsIds: any[];
  /*
   * dialog subject
   */
  dialogOptions: Partial<IModalDialogOptions<any>>;

  totalRemainingAmount = 0;
  holdingTaxAmount = 0;
  remainingAmountToBePaid = 0;
  tiersCurrency: Currency;
  tiersType: number;
  tiersTypeEnum = TiersTypeEnumerator;
  public documentType = DocumentEnumerator;
  language: string;
  documentCheckedState = DocumentCheckedState;

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
      field: TreasuryConstant.CODE_FIELD,
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
      tooltip: TreasuryConstant.TOTAL_AMOUNT_UPPERCASE,
      filterable: true,
    },
    {
      field: TreasuryConstant.REMAINING_AMOUNT_WITH_CURRENCY,
      title: TreasuryConstant.REMAINING_AMOUNT_TO_PAID,
      tooltip: TreasuryConstant.REMAINING_AMOUNT_TO_PAID,
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
  public havePermission: boolean;
  constructor(private modalService: ModalDialogInstanceService, private settlementService: DeadLineDocumentService,
    private router: Router, private documentUtilityService: DocumentUtilityService,
    private amountFormatService: AmountFormatService, private translate: TranslateService,
              private localStorageService : LocalStorageService,private authService: AuthService) {
     this.language = this.localStorageService.getLanguage();

  }

  ngOnInit() {
  }

  /**
   * Inialise Modal
   * @param reference
   * @param options
   */
  dialogInit(reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
    this.dialogOptions = options;
    this.selectedFinancialCommitment = this.dialogOptions.data['listFinancialCommitmentSelected'];
    this.selectedItemsIds = this.selectedFinancialCommitment.map(x => x.Id);
    this.tiersCurrency = this.selectedFinancialCommitment[0].IdCurrencyNavigation;
    const tiers: Tiers = this.selectedFinancialCommitment[0].IdTiersNavigation;
    this.tiersType = tiers ? tiers.IdTypeTiers : this.tiersTypeEnum.Customer;
    this.gridData = new Object() as DataResult;
    this.gridData.data = this.selectedFinancialCommitment;
    this.gridData.total = this.selectedFinancialCommitment.length;
    this.getAllAmounts();
  }


  public getAllAmounts() {
    let totalRemaining = 0;
    this.selectedFinancialCommitment.forEach(x => {
      if (x.IdDocumentNavigation.DocumentTypeCode === DocumentEnumerator.SalesInvoices
        || x.IdDocumentNavigation.DocumentTypeCode === DocumentEnumerator.PurchaseInvoices) {
        totalRemaining += x.RemainingAmountWithCurrency;
      } else {
        totalRemaining -= x.RemainingAmountWithCurrency;
      }
    });
    totalRemaining = totalRemaining < 0 ? 0 : totalRemaining;
    const listFinancialCommitmentIds = this.selectedFinancialCommitment.map(x => x.Id);
    this.settlementService.calculateWithholdingTaxToBePaid(listFinancialCommitmentIds).subscribe(
      res => {
        this.totalRemainingAmount = this.amountFormatService.format(this.tiersCurrency, totalRemaining + res);
        this.holdingTaxAmount = res;
        this.remainingAmountToBePaid = this.amountFormatService.format(this.tiersCurrency,
          (this.totalRemainingAmount - this.holdingTaxAmount));
      }
    );

  }

  removeHandler(data) {
    const index = this.selectedFinancialCommitment.findIndex(x => x.Id === data.dataItem.Id);
    const idIndex = this.selectedItemsIds.findIndex(x => x === data.dataItem.Id);
    data.dataItem.IsChecked = !data.dataItem.IsChecked;
    this.selectedFinancialCommitment.splice(index, NumberConstant.ONE);
    this.selectedItemsIds.splice(idIndex, NumberConstant.ONE);
    if (this.selectedItemsIds && this.selectedItemsIds.length > NumberConstant.ZERO) {
      this.getAllAmounts();
    } else {
      this.dialogOptions.onClose();
      this.modalService.closeAnyExistingModalDialog();
    }
  }

  deleteAll() {
    this.selectedFinancialCommitment.splice(NumberConstant.ZERO, this.selectedFinancialCommitment.length);
    this.dialogOptions.onClose();
    this.modalService.closeAnyExistingModalDialog();
    this.getAllAmounts();
  }

  showDocument(document) {
      if(document.DocumentTypeCode == this.documentType.SalesInvoices){
        this.havePermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.SHOW_INVOICE_SALES);
      }
        else if(document.DocumentTypeCode == this.documentType.SalesInvoiceAsset){
        this.havePermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.SHOW_INVOICE_ASSET_SALES);
      }
      else if(document.DocumentTypeCode == this.documentType.PurchaseInvoices){
        this.havePermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.SHOW_INVOICE_PURCHASE);
      }
      else if(document.DocumentTypeCode == this.documentType.PurchaseAsset){
        this.havePermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.SHOW_ASSET_PURCHASE);
      }
      if(this.havePermission){
    const url = this.documentUtilityService.showDocument(document);
    this.router.navigate([]).then(() => { window.open(url, '_blank'); });
      }
  }
}
