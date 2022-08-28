import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DataStateChangeEvent, GridComponent, PagerSettings } from '@progress/kendo-angular-grid';
import { DataResult, State } from '@progress/kendo-data-query';
import { GrowlService } from '../../../../COM/Growl/growl.service';
import { CompanyService } from '../../../administration/services/company/company.service';
import { SettlementConstant } from '../../../constant/payment/settlement.constant';
import { FinancialCommitmentConstant } from '../../../constant/sales/financial-commitment.constant';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { FinancialCommitmentNotBilledConstant } from '../../../constant/treasury/financial-commitment-not-billed.constant';
import { TreasuryConstant } from '../../../constant/treasury/treasury.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { Tiers } from '../../../models/achat/tiers.model';
import { Currency } from '../../../models/administration/currency.model';
import { DocumentCheckedState } from '../../../models/enumerators/document-checked-state.enum';
import { DocumentEnumerator } from '../../../models/enumerators/document.enum';
import { OutstandingDocumentTypeEnumerator } from '../../../models/enumerators/outstanding-document-type.enum';
import { PaymentMethodEnumerator } from '../../../models/enumerators/payment-method.enum';
import { TiersTypeEnumerator } from '../../../models/enumerators/tiers-type.enum';
import { SettlementCommitment } from '../../../models/payment/settlement-commitment.model';
import { FinancialCommitment } from '../../../models/sales/financial-commitment.model';
import { DeadLineDocumentService } from '../../../sales/services/dead-line-document/dead-line-document.service';
import { FinancialCommitmentService } from '../../../sales/services/financial-commitment/financial-commitment.service';
import {
  PopUpFinancialCommitmentPaymentHistoryComponent
} from '../../../shared/components/pop-up-financial-commitment-payment-history/pop-up-financial-commitment-payment-history.component';
import { SupplierDropdownComponent } from '../../../shared/components/supplier-dropdown/supplier-dropdown.component';
import { SwalWarring } from '../../../shared/components/swal/swal-popup';
import { FormModalDialogService } from '../../../shared/services/dialog/form-modal-dialog/form-modal-dialog.service';
import { ColumnSettings } from '../../../shared/utils/column-settings.interface';
import { GridSettings } from '../../../shared/utils/grid-settings.interface';
import { Filter, Operation, Operator, PredicateFormat } from '../../../shared/utils/predicate';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { CustomerOutstandingService } from '../../services/customer-outstanding.service';
import { DocumentUtilityService } from '../../services/document-utility.service';
import {
  PopUpSelectedFinancialCommitmentComponent
} from '../pop-up-selected-financial-commitment/pop-up-selected-financial-commitment.component';
import {LocalStorageService} from '../../../login/Authentification/services/local-storage-service';

const DAYS_NUMBER_LEFT_FOR_COMMITMENT_DATE = NumberConstant.THREE;

@Component({
  selector: 'app-financial-commitment-not-billed',
  templateUrl: './financial-commitment-not-billed.component.html',
  styleUrls: ['./financial-commitment-not-billed.component.scss']
})
export class FinancialCommitmentNotBilledComponent implements OnInit, OnChanges {
  @ViewChild(SupplierDropdownComponent) tiersData;
  @ViewChild('grid') grid: GridComponent;

  // Inputs
  @Input() tiersType;
  @Input() documentType;
  @Input() selectedTiers: Tiers;
  @Input() listFinancialCommitmentSelected: FinancialCommitment[];
  @Input() displayAddButton: boolean;
  @Input() idForExportFile: string;
  @Input() fileExportname: string;
  @Input() apiForExport: string;
  @Input() isAsset: string;
  @Input() companyWithholdingTax;
  @Input() disableCheckBox: boolean;

  // Outputs
  @Output() tiersSelectedChange = new EventEmitter<Tiers>();
  @Output() itemSelectedChange = new EventEmitter<boolean>();
  @Output() openFormClicked = new EventEmitter<boolean>();
  @ViewChild('supplierViewChild') supplierViewChild: SupplierDropdownComponent;
  isTiersChangedProvidesFromThisComponent = false;
  currentDateWithTime = new Date();
  currentDate = new Date(this.currentDateWithTime.getFullYear(), this.currentDateWithTime.getMonth(),
    this.currentDateWithTime.getDate(), 0, 0, 0);
  deadLineInTreeDays = new Date(this.currentDateWithTime.getFullYear(), this.currentDateWithTime.getMonth(),
    this.currentDateWithTime.getDate() + DAYS_NUMBER_LEFT_FOR_COMMITMENT_DATE, 0, 0, 0);
  // SalesDeliveryForm, FinancialCommitment, settlment
  outstandingDocumentTypeEnumerator = OutstandingDocumentTypeEnumerator;
  paymentMethodEnumerator = PaymentMethodEnumerator;
  // PagerSettings
  pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;

  // formatDate
  dateFormat = this.translate.instant(SharedConstant.DATE_FORMAT);

  // predicate
  public predicate: PredicateFormat;

  // Total ttc Amount
  TotalTtcAmount = 0;

  // Total Remaining Amount
  TotalRemainingAmount = 0;

  // same tiers
  sameTiers = false;
  // grid state
  gridState: State = new Object() as State;

  documentCheckedState = DocumentCheckedState;

  // numbre of selected financial commitment on the same page

  numberSamePageFinancialCommitmentSelected = 0;

  // supplier dropdown disabled state
  supplierDropdownDisabled = false;

  public columnsConfig: ColumnSettings[] = [
    {
      field: TreasuryConstant.CODE_FIELD,
      title: TreasuryConstant.CODE,
      tooltip: this.getCodeTitle(),
      filterable: true
    },
    {
      field: TreasuryConstant.NAME_FROM_ID_TIERS_NAVIGATION,
      title: this.getTiersTitle(),
      tooltip: this.getTiersTitle(),
      filterable: true
    },
    {
      field: TreasuryConstant.DOCUMENT_DATE_FROM_DOCUMENT_NAVIGATION,
      title: TreasuryConstant.DOCUMENT_DATE_TITLE,
      tooltip: TreasuryConstant.DOCUMENT_DATE_TITLE,
      filterable: true
    },
    {
      field: TreasuryConstant.COMMITMENT_DATE,
      title: TreasuryConstant.COMMITMENT_DATE_TITLE,
      tooltip: TreasuryConstant.COMMITMENT_DATE_TITLE,
      filterable: true
    },
    {
      field: TreasuryConstant.AMOUNT_WITH_CURRENCY,
      title: TreasuryConstant.TOTAL_AMOUNT_UPPERCASE,
      tooltip: TreasuryConstant.TOTAL_AMOUNT_UPPERCASE,
      filterable: true
    },
    {
      field: FinancialCommitmentConstant.WITH_HOLDING_TAX_WITH_CURRENCY,
      title: FinancialCommitmentConstant.WITH_HOLDING,
      tooltip: TreasuryConstant.WITH_HOLDING_TAX,
      filterable: true,
      format: 'n3'
    },
    {
      field: FinancialCommitmentConstant.RemainingWithholdingTaxWithCurrency,
      title: FinancialCommitmentConstant.REMAINING_WITHHOLDING_TAX,
      tooltip: TreasuryConstant.FORM_REMAINING_WITHHOLDING_TAX,
      filterable: true,
      format: 'n3'
    },
    {
      field: FinancialCommitmentConstant.AmountWithoutWithholdingTaxWithCurrency,
      title: FinancialCommitmentConstant.AMOUNT_TO_BE_PAID,
      tooltip: TreasuryConstant.TOTAL_AMOUNT_TO_BE_PAID,
      filterable: true,
      format: 'n3'
    },
    {
      field: TreasuryConstant.REMAINING_AMOUNT_WITH_CURRENCY,
      title: TreasuryConstant.REMAINING_AMOUNT,
      tooltip: TreasuryConstant.DOCUMENT_REMAINING_AMOUNT_TO_BE_PAID,
      filterable: true
    }
  ];
  // Grid DATA
  gridData: DataResult = new Object() as DataResult;

  gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig,
    gridData: this.gridData
  };

  userCurrency: Currency;
  language: string;

  tiersTypeEnum = TiersTypeEnumerator;
  predicateForExport: PredicateFormat;
  // Permission
  public hasAddCustomerSettlementPermission: boolean;
  public hasAddSupplierSettlementPermission: boolean;
  public hasSendReminderMailPermission: boolean;
  public hasShowSalesInvoicePermission: boolean;
  public hasShowSalesInvoiceAssetsPermission: boolean;
  public hasShowPurchaseInvoicePermission: boolean;
  public hasShowPurchaseAssetPermission: boolean;

  constructor(public growlService: GrowlService,
    public translate: TranslateService,
    private swalWarrings: SwalWarring,
    public customerOutstandingService: CustomerOutstandingService,
      private viewContainerRef: ViewContainerRef, private authService: AuthService,
    private formModalDialogService: FormModalDialogService, private router: Router,
    private documentUtility: DocumentUtilityService,
    private settlementService: DeadLineDocumentService,
    public financialCommitmentService: FinancialCommitmentService,
    private companyService: CompanyService,
              private localStorageService : LocalStorageService) {
   this.language = this.localStorageService.getLanguage();
  }

  ngOnInit() {
    this.hasAddCustomerSettlementPermission = this.authService.hasAuthority(PermissionConstant.TreasuryPermissions.ADD_CUSTOMER_SETTLEMENT);
    this.hasAddSupplierSettlementPermission = this.authService.hasAuthority(PermissionConstant.TreasuryPermissions.ADD_SUPPLIER_SETTLEMENT);
    this.hasSendReminderMailPermission = this.authService.hasAuthority(PermissionConstant.TreasuryPermissions.SEND_REMINDER_MAIL);
    this.hasShowSalesInvoicePermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.SHOW_INVOICE_SALES);
    this.hasShowSalesInvoiceAssetsPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.SHOW_INVOICE_ASSET_SALES);
    this.hasShowPurchaseInvoicePermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.SHOW_INVOICE_PURCHASE);
    this.hasShowPurchaseAssetPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.SHOW_ASSET_PURCHASE);
    this.companyService.getCurrentCompany().subscribe(company => {
      this.userCurrency = company.IdCurrencyNavigation;
    });
    this.intialiseState();
    this.preparePredicateForExport();
    this.initGridDataSource();
  }

  // get financial commitment data and verify checked financialCommitment
  initGridDataSource() {
    this.grid.loading = true;
    this.numberSamePageFinancialCommitmentSelected = 0;
    this.customerOutstandingService.processDataForFinancialCommitment(this.gridSettings.state,
      this.predicate, this.tiersType, this.documentType)
      .subscribe(res => {
        if (res) {
          res.Data.forEach(
            (financialCommitment) => {
              financialCommitment.IsChecked =
                this.listFinancialCommitmentSelected.find((x: FinancialCommitment) => x.Id === financialCommitment.Id) ? true : false;
              if (financialCommitment.IsChecked) {
                this.numberSamePageFinancialCommitmentSelected++;
              }
              financialCommitment.CommitmentDate = new Date(financialCommitment.CommitmentDate);
            }
          );
          this.gridSettings.gridData = new Object() as DataResult;
          this.gridSettings.gridData.data = res.Data;
          this.gridSettings.gridData.total = res.Total;
          this.grid.loading = false;
          this.TotalTtcAmount = res.TotalAmount;
          this.TotalRemainingAmount = res.TotalRemainingAmount;
          this.changeFinancialCommitmentCheckedState();
          // Disable the tiers general filter
          this.supplierDropdownDisabled = this.getNumberOfSelectedFinancialCommitment() > NumberConstant.ZERO;
        }
      });
  }

  dataStateChange(state: DataStateChangeEvent) {
    this.gridSettings.state = state;
    this.initGridDataSource();
  }

  selectFinancialCommitment(dataItem) {
    let isFirstCheckOrLastUncheck = false;
    if (!dataItem.IsChecked) {
      // Take the tiers just on the first check
      if (!this.selectedTiers) {
        isFirstCheckOrLastUncheck = true;
        this.selectedTiers = dataItem.IdTiersNavigation;
      }
      // Add the checked financialCommitment to the selected financial commitment list if it's from the same tiers else show alert
      if (dataItem.IdTiers === this.selectedTiers.Id) {
        dataItem.IsChecked = !dataItem.IsChecked;
        this.listFinancialCommitmentSelected.push(dataItem);
        this.numberSamePageFinancialCommitmentSelected++;
      } else {
        const message = this.tiersType === this.tiersTypeEnum.Customer ?
          TreasuryConstant.CUSTOMER_OUTSTANDING_DOCUMENTS_FINANCIAL_COMMITMENT_SELECTION_ALERT
          : TreasuryConstant.SUPPLIER_OUTSTANDING_DOCUMENTS_FINANCIAL_COMMITMENT_SELECTION_ALERT;
        this.growlService.warningNotification(this.translate.instant(message));
      }
    } else {
      // Remove the unchecked financialCommitment from the selected financial commitment list
      const index = this.listFinancialCommitmentSelected.findIndex(x => x.Id === dataItem.Id);
      dataItem.IsChecked = !dataItem.IsChecked;
      this.listFinancialCommitmentSelected.splice(index, NumberConstant.ONE);
      this.numberSamePageFinancialCommitmentSelected--;
      // if is the last uncheck ==> selected financial commitment list is empty
      if (this.getNumberOfSelectedFinancialCommitment() === NumberConstant.ZERO) {
        isFirstCheckOrLastUncheck = true;
        this.selectedTiers = undefined;
      }
    }

    // If first check or last uncheck initialise the data grid and emit tiers
    if (isFirstCheckOrLastUncheck) {
      this.isTiersChangedProvidesFromThisComponent = true;
      this.supplierValueChange(this.selectedTiers);
      this.tiersSelectedChange.emit(this.selectedTiers);
    } else {
      // if is not the first check or last uncheck just emit event for to update datagrid selection
      this.itemSelectedChange.emit(true);
    }
  }

  // select all financialCommitment in the same page
  selectAllFinancialCommitment() {
    let isFirstCheckOrLastUncheck = false;
    if (this.checkSamePageSelectedFinancialCommitmentState() === DocumentCheckedState.NotChecked ||
      this.checkSamePageSelectedFinancialCommitmentState() === DocumentCheckedState.Intermediate) {
      if (this.gridSettings.gridData && this.gridSettings.gridData.data && this.gridSettings.gridData.data.length >= NumberConstant.ONE) {
        // Take the tiers just on the first check
        if (!this.selectedTiers) {
          isFirstCheckOrLastUncheck = true;
          this.selectedTiers = this.gridSettings.gridData[0].IdTiersNavigation;
        }
        // Add all checked financial commitment to the selected financial commitment list
        this.gridSettings.gridData.data.forEach(financialCommitment => {
          if (!financialCommitment.IsChecked) {
            financialCommitment.IsChecked = true;
            this.listFinancialCommitmentSelected.push(financialCommitment);
            this.numberSamePageFinancialCommitmentSelected++;
          }
        });
      }
    } else if (this.checkSamePageSelectedFinancialCommitmentState() === DocumentCheckedState.Checked) {
      // Remove all financial commitment on the same page from the selected financial commitment list
      if (this.gridSettings.gridData && this.gridSettings.gridData.data) {
        this.gridSettings.gridData.data.forEach(financialCommitment => {
          if (financialCommitment.IsChecked) {
            financialCommitment.IsChecked = false;
            const index = this.listFinancialCommitmentSelected.findIndex(f => f.Id === financialCommitment.Id);
            this.listFinancialCommitmentSelected.splice(index, NumberConstant.ONE);
            this.numberSamePageFinancialCommitmentSelected--;
          }
        });
        // If the selected financiancial commitment list is empty (doesn't containts financial commitment of type asset)
        if (this.getNumberOfSelectedFinancialCommitment() === NumberConstant.ZERO) {
          isFirstCheckOrLastUncheck = true;
          this.selectedTiers = undefined;
        }
      }
    }

    // If first check or last uncheck initialise the data grid and emit tiers
    if (isFirstCheckOrLastUncheck) {
      this.isTiersChangedProvidesFromThisComponent = true;
      this.supplierValueChange(this.selectedTiers);
      this.tiersSelectedChange.emit(this.selectedTiers);
    } else {
      // if is not the first check or last uncheck just emit event for to update datagrid selection
      this.itemSelectedChange.emit(true);
    }
  }

  // get data of specific tiers and change the tiers grid filter and tiers
  supplierValueChange($event) {
    this.gridSettings.state.skip = NumberConstant.ZERO;
    this.predicate = new PredicateFormat();
    this.predicate.Operator = Operator.and;
    this.predicate.Filter = new Array<Filter>();
    if ($event && $event.Id) {
      this.predicate.Filter.push(new Filter(TreasuryConstant.ID_TIERS, Operation.eq, $event.Id));
      this.sameTiers = true;
    } else {
      this.sameTiers = false;
    }
    this.preparePredicateForExport();
    this.documentUtility.changeTiersGridFilter($event, this.tiersData, this.gridSettings.state);
    this.initGridDataSource();
  }

  emitSupplier($event) {
    this.selectedTiers = $event.selectedTiers;
    this.isTiersChangedProvidesFromThisComponent = true;
    this.supplierValueChange($event.selectedTiers);
    this.tiersSelectedChange.emit($event.selectedTiers);
  }

  // update state of data
  public changeFinancialCommitmentCheckedState() {
    this.numberSamePageFinancialCommitmentSelected = 0;
    if (this.gridSettings.gridData) {
      this.gridSettings.gridData.data.forEach(
        (financialCommitment) => {
          financialCommitment.IsChecked =
            this.listFinancialCommitmentSelected.find((x: FinancialCommitment) => x.Id === financialCommitment.Id) ? true : false;
          if (financialCommitment.IsChecked) {
            this.numberSamePageFinancialCommitmentSelected++;
          }
        }
      );
    }
  }

  checkSamePageSelectedFinancialCommitmentState(): number {
    if (this.numberSamePageFinancialCommitmentSelected === 0) {
      return DocumentCheckedState.NotChecked;
    } else if (this.gridSettings.gridData.data &&
      this.numberSamePageFinancialCommitmentSelected === this.gridSettings.gridData.data.length) {
      return DocumentCheckedState.Checked;
    } else {
      return DocumentCheckedState.Intermediate;
    }
  }

  openSelectedFinancialCommitments() {
    if (this.listFinancialCommitmentSelected.length > 0) {
      const TITLE = FinancialCommitmentNotBilledConstant.LIST_SELECTED_FINANCIAL_COMMITMENTS;
      const data = {};
      data['listFinancialCommitmentSelected'] = this.listFinancialCommitmentSelected;
      this.formModalDialogService.openDialog(TITLE, PopUpSelectedFinancialCommitmentComponent, this.viewContainerRef,
        this.onCloseSelectedFinancialCommitmentModal.bind(this), data, true, SharedConstant.MODAL_DIALOG_SIZE_L);
    }
  }

  private onCloseSelectedFinancialCommitmentModal(data): void {
    this.changeFinancialCommitmentCheckedState();
    if (this.listFinancialCommitmentSelected.length > NumberConstant.ZERO) {
      this.itemSelectedChange.emit(true);
    } else {
      this.selectedTiers = undefined;
      this.isTiersChangedProvidesFromThisComponent = true;
      this.supplierValueChange(this.selectedTiers);
      this.tiersSelectedChange.emit(this.selectedTiers);
    }
  }

  getTiersTitle(): string {
    if (this.tiersTypeEnum) {
      return this.tiersType === this.tiersTypeEnum.Customer ? TreasuryConstant.CLIENT : TreasuryConstant.SUPPLIER;
    }
    return '';
  }

  getCodeTitle(): string {
    if (this.documentType) {
      return this.documentType === this.outstandingDocumentTypeEnumerator.AssetFinancialCommitment ?
        TreasuryConstant.CODE_ASSET_FINANCIAL_COMMITMENT : TreasuryConstant.CODE_FINANCIAL_COMMITMENT;
    }
    return '';
  }

  intialiseState() {
    this.gridSettings.state = {
      skip: 0,
      take: 20,
      filter: {
        logic: 'and',
        filters: []
      },
      sort: [
        {
          field: TreasuryConstant.COMMITMENT_DATE,
          dir: 'asc'
        }
      ],
      group: []
    };
  }

  preparePredicateForExport() {
    this.predicateForExport = new PredicateFormat();
    this.predicateForExport.Filter = new Array<Filter>();
    this.predicateForExport.Filter.push(new Filter(TreasuryConstant.TIERS_TYPE, Operation.eq, this.tiersType));
    this.predicateForExport.Filter.push(new Filter(TreasuryConstant.DOCUMENT_TYPE, Operation.eq, this.documentType));
    if (this.predicate && this.predicate.Filter) {
      this.predicate.Filter.forEach((filter) => {
        this.predicateForExport.Filter.push(filter);
      });
    }
  }

  public initialiseComponent() {
    this.selectedTiers = undefined;
    this.supplierDropdownDisabled = false;
    this.predicate = new PredicateFormat();
    this.preparePredicateForExport();
    this.intialiseState();
    this.initGridDataSource();
  }

  // send mail
  sendReminderMail() {
    const selectedFinancialCommitments = this.listFinancialCommitmentSelected.filter(x =>
      x.IdDocumentNavigation.DocumentTypeCode === DocumentEnumerator.SalesInvoices);
    if (this.getNumberOfSelectedFinancialCommitment() > 0 && selectedFinancialCommitments.length > 0) {
      this.swalWarrings.CreateSwal(SharedConstant.ARE_YOU_SURE_TO_CONTINUE,
        FinancialCommitmentNotBilledConstant.RELANCE_MAIL_CONFIRMATION,
        FinancialCommitmentNotBilledConstant.VALIDATION_CONFIRM, SharedConstant.NO, false, true).then((result) => {
          if (result.value) {
            this.customerOutstandingService.sendInvoiceRevivalMail(selectedFinancialCommitments).subscribe(() => {
              this.growlService.successNotification(this.translate
                .instant(FinancialCommitmentNotBilledConstant.MAIL_WAS_SEND_SUCCESSFULLY));
              this.initGridDataSource();
            });
          }
        });
    } else {
      this.swalWarrings.CreateSwal(FinancialCommitmentNotBilledConstant.NO_SELECTED_COMMITMENT_ALERT_INFO_FOR_RELANCE_MAIL,
        FinancialCommitmentNotBilledConstant.INFO, FinancialCommitmentNotBilledConstant.OK, '', true, true);
    }
  }

  showFinancialCommitmentPaymentDetails(id: number) {
    this.settlementService.getFinancialCommitmentPaymentHistory(id).subscribe(res => {
      const settlementCommitments = res as Array<SettlementCommitment>;
      this.formModalDialogService.openDialog(TreasuryConstant.FINANCIAL_COMMITMENT_PAYMENT_DETAIL,
        PopUpFinancialCommitmentPaymentHistoryComponent,
        this.viewContainerRef, null, settlementCommitments, true, SharedConstant.MODAL_DIALOG_SIZE_L);
    });
  }

  clearListOfSelectedFinancialCommitment(selectedTiersValue?) {
    this.listFinancialCommitmentSelected.splice(NumberConstant.ZERO, this.listFinancialCommitmentSelected.length);
    this.itemSelectedChange.emit(selectedTiersValue);
  }


  getSelectedFinancialCommitmentsCodes() {
    const codes = this.listFinancialCommitmentSelected.map(x => x.Code);
    return ((codes.length > 0) ? codes.toString() : this.translate.instant(TreasuryConstant.NO_FINANCIAL_COMMITMENT_SELECTED));
  }

  getNumberOfSelectedFinancialCommitment() {
    return this.listFinancialCommitmentSelected.length;
  }

  AddNewSettlement() {
    const moreThanOne = this.listFinancialCommitmentSelected.find((x: FinancialCommitment) =>
      x.IdDocumentNavigation.DocumentTypeCode === DocumentEnumerator.SalesInvoices
      || x.IdDocumentNavigation.DocumentTypeCode === DocumentEnumerator.PurchaseInvoices) ? true : false;
    if (moreThanOne) {
      this.openFormClicked.emit(true);
    } else {
      this.growlService.warningNotification(this.translate
        .instant(FinancialCommitmentNotBilledConstant.NO_FINANCIALCOMMITMENT_SELLECTED_TO_SETTLE_ALERT_INFO));
    }
  }

  showDocument(document) {
    const url = this.documentUtility.showDocument(document);
    this.router.navigate([]).then(() => {
      window.open(url, '_blank');
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes[SettlementConstant.SELECTED_TIERS]) {
      if (this.supplierViewChild) {
        this.supplierViewChild.supplierFiltredDataSource = this.supplierViewChild.supplierDataSource;
      }
      this.selectedTiers = changes[SettlementConstant.SELECTED_TIERS].currentValue;
      const previousTiers: Tiers = changes[SettlementConstant.SELECTED_TIERS].previousValue;
      // Update the data grid if tiers change event not provides from this component
      if (!this.isTiersChangedProvidesFromThisComponent &&
        ((!previousTiers && this.selectedTiers) || (previousTiers && !this.selectedTiers))) {
        this.supplierValueChange(this.selectedTiers);
      } else if (!this.isTiersChangedProvidesFromThisComponent && this.selectedTiers && previousTiers) {
        this.supplierValueChange(this.selectedTiers);
      } else if (this.isTiersChangedProvidesFromThisComponent) {
        this.isTiersChangedProvidesFromThisComponent = false;
      }
    }

    if (changes[SettlementConstant.DISPLAY_ADD_BUTTON]) {
      this.displayAddButton = changes[SettlementConstant.DISPLAY_ADD_BUTTON].currentValue;
    }
  }

  getToolipValueForReminderMail() {
    if (this.getSelectedFinancialCommitmentsCodes() === this.translate.instant(TreasuryConstant.NO_FINANCIAL_COMMITMENT_SELECTED)) {
      return this.translate.instant(TreasuryConstant.SEND_REMINDER_MAIL);
    } else {
      return this.getSelectedFinancialCommitmentsCodes();
    }
  }
}
