import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DataStateChangeEvent, GridComponent, PagerSettings } from '@progress/kendo-angular-grid';
import { removeFilter } from '@progress/kendo-angular-grid/dist/es2015/filtering/base-filter-cell.component';
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
import { DocumentEnumerator, documentStatusCode } from '../../../models/enumerators/document.enum';
import { TiersTypeEnumerator } from '../../../models/enumerators/tiers-type.enum';
import { SettlementCommitment } from '../../../models/payment/settlement-commitment.model';
import { DeadLineDocumentService } from '../../../sales/services/dead-line-document/dead-line-document.service';
import { DocumentService } from '../../../sales/services/document/document.service';
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

@Component({
  selector: 'app-invoice-commitment-not-billed',
  templateUrl: './invoice-commitment-not-billed.component.html',
  styleUrls: ['./invoice-commitment-not-billed.component.scss']
})
export class InvoiceCommitmentNotBilledComponent implements OnInit, OnChanges {

  @ViewChild(SupplierDropdownComponent) tiersData;
  @ViewChild('grid') grid: GridComponent;

  // Inputs
  @Input() tiersType;
  @Input() listFinancialCommitmentSelected: any[];
  @Input() selectedTiers: Tiers;
  @Input() displayAddButton: boolean;
  @Input() companyWithholdingTax;
  @Input() disableCheckBox: boolean;

  // Outputs
  @Output() itemSelectedChange = new EventEmitter<boolean>();
  @Output() tiersSelectedChange = new EventEmitter<Tiers>();
  @Output() openFormClicked = new EventEmitter<boolean>();

  @ViewChild('supplierViewChild') supplierViewChild: SupplierDropdownComponent;
  isTiersChangedProvidesFromThisComponent = false;
  isCheckedChangeProvidesFromThisComponent = false;
  documentCheckedState = DocumentCheckedState;
  apiForExport = TreasuryConstant.GET_INVOICES_NOT_TOTALLY_PAYED_FOR_EXPORT;
  predicateForExport: PredicateFormat;
  /** document Enumerator */
  documentEnumerator: DocumentEnumerator = new DocumentEnumerator();
  // PagerSettings
  pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;

  // formatDate
  dateFormat = this.translate.instant(SharedConstant.DATE_FORMAT);
  tiersTypeEnum = TiersTypeEnumerator;

  // predicate
  predicate: PredicateFormat;

  // Total ttc Amount
  TotalTtcAmount = 0;

  // Total Remaining Amount
  TotalRemainingAmount = 0;

  totalAmountToPaid = 0;

  // Selected items and counters

  // selected Tiers
  selectedClientForFinancialCommitment: Tiers;


  // same tiers
  sameTiers = false;

  public statusCode = documentStatusCode;

  financialCommitementNumberPerPage = 0;

  state: State;
  // numbre of selected financial commitment on the same page

  numberSamePageFinancialCommitmentSelected = 0;

  documentStatusFilterDataSource = [
    {
      Id: documentStatusCode.Valid,
      Value: this.translate.instant(TreasuryConstant.VALID)
    },
    {
      Id: documentStatusCode.PartiallySatisfied,
      Value: this.translate.instant(TreasuryConstant.PARTIALLY_PAID)
    }
  ];

  defaultDocumentStatus = {
    Id: 0,
    Value: this.translate.instant(TreasuryConstant.ALL)
  };

  // grid state
  gridState: State = new Object() as State;
  public columnsConfig: ColumnSettings[] = [
    {
      field: TreasuryConstant.CODE_FIELD,
      title: TreasuryConstant.CODE_INVOICE,
      tooltip: TreasuryConstant.CODE_FACTURE,
      filterable: true
    },
    {
      field: TreasuryConstant.NAME_FROM_ID_TIERS_NAVIGATION,
      title: this.getTiersTitle(),
      tooltip: this.getTiersTitle(),
      filterable: true
    },
    {
      field: TreasuryConstant.DOCUMENT_DATE,
      title: TreasuryConstant.DOCUMENT_DATE_TITLE,
      tooltip: TreasuryConstant.DOCUMENT_DATE_TITLE,
      filterable: true
    },

    {
      field: TreasuryConstant.DOCUMENT_TTC_PRICE_WITH_CURRENCY,
      title: TreasuryConstant.TOTAL_AMOUNT_UPPERCASE,
      tooltip: TreasuryConstant.TOTAL_AMOUNT_TO_BE_PAID,
      filterable: true
    },
    {
      field: TreasuryConstant.DOCUMENT_REMAINING_AMOUNT_WITH_CURRENCY,
      title: TreasuryConstant.REMAINING_AMOUNT,
      tooltip: TreasuryConstant.DOCUMENT_REMAINING_AMOUNT_TO_BE_PAID,
      filterable: true
    },
    {
      field: TreasuryConstant.NUMBER_OF_INVOICE,
      title: TreasuryConstant.NUMBER_OF_INVOICE_TITLE,
      tooltip: TreasuryConstant.NUMBER_OF_FINANCIAL_COMMITMENTS,
      filterable: true
    },
    {
      field: TreasuryConstant.DOCUMENT_STATUS,
      title: TreasuryConstant.DOCUMENT_STATUS_TITLE,
      tooltip: TreasuryConstant.INVOICE_ACTUAL_STATUS,
      filterable: true
    }
  ];
  // Grid details columns config
  public financialcolumnsConfig: ColumnSettings[] = [
    {
      field: TreasuryConstant.CODE_FIELD,
      title: TreasuryConstant.CODE,
      tooltip: TreasuryConstant.CODE_FINANCIAL_COMMITMENT,
      filterable: true
    },
    {
      field: FinancialCommitmentConstant.commitmentDate,
      title: FinancialCommitmentConstant.commitmentDateLabel,
      tooltip: FinancialCommitmentConstant.commitmentDateLabel,
      filterable: false,
      format: this.translate.instant(SharedConstant.DATE_FORMAT)
    },
    {
      field: FinancialCommitmentConstant.amountWithCurrency,
      title: TreasuryConstant.TOTAL_AMOUNT_UPPERCASE,
      tooltip: TreasuryConstant.TOTAL_AMOUNT_UPPERCASE,
      filterable: true,
      format: 'n3'
    },
    {
      field: FinancialCommitmentConstant.HOLDING_TAX,
      title: FinancialCommitmentConstant.WITH_HOLDING,
      tooltip: FinancialCommitmentConstant.WITH_HOLDING,
      filterable: true,
      format: 'n3'
    },
    {
      field: FinancialCommitmentConstant.RemainingWithholdingTaxWithCurrency,
      title: FinancialCommitmentConstant.REMAINING_WITHHOLDING_TAX,
      filterable: true,
      tooltip: TreasuryConstant.FORM_REMAINING_WITHHOLDING_TAX,
      format: 'n3'
    },
    {
      field: FinancialCommitmentConstant.AmountWithoutWithholdingTaxWithCurrency,
      title: FinancialCommitmentConstant.AMOUNT_TO_BE_PAID,
      tooltip: FinancialCommitmentConstant.AMOUNT_TO_BE_PAID,
      filterable: true,
      format: 'n3'
    },
    {
      field: FinancialCommitmentConstant.remainingAmountWithCurrency,
      title: TreasuryConstant.REMAINING_AMOUNT_TO_PAID,
      tooltip: TreasuryConstant.REMAINING_AMOUNT_TO_PAID,
      filterable: true,
      format: 'n3'
    },
    {
      field: FinancialCommitmentConstant.idStatus,
      title: FinancialCommitmentConstant.idStatusLabel,
      tooltip: FinancialCommitmentConstant.idStatusLabel,
      filterable: true
    },
  ];
  // Grid DATA
  gridData: DataResult = new Object() as DataResult;

  gridSettings: GridSettings = {
    gridData: this.gridData,
    state: this.gridState,
    columnsConfig: this.columnsConfig
  };

  // supplier dropdown disabled state
  supplierDropdownDisabled = false;
  userCurrency: Currency;
  // Permission
  public hasAddCustomerSettlementPermission : boolean;
  public hasAddSupplierSettlementPermission : boolean;
  public hasSendReminderMailPermission : boolean;
  public hasShowSalesInvoicePermission : boolean;
  public hasShowPurchaseInvoicePermission : boolean;
  public haveShowDetailsPermission = false ;
  language: string;

  constructor(public customerOutstandingService: CustomerOutstandingService,
    public documentService: DocumentService,
    public translate: TranslateService,
    private swalWarrings: SwalWarring,
    public growlService: GrowlService, private router: Router,
    private documentUtility: DocumentUtilityService,
    private settlementService: DeadLineDocumentService,
    private viewRef: ViewContainerRef,
    private formModalDialogService: FormModalDialogService,
      private companyService: CompanyService, private authService: AuthService,
              private localStorageService : LocalStorageService) {
     this.language = this.localStorageService.getLanguage();

  }

  ngOnInit() {
    this.haveShowDetailsPermission = this.authService.hasAuthority(PermissionConstant.TreasuryPermissions.CUSTOMER_PAYMENT_HISTORY)
    this.hasAddCustomerSettlementPermission = this.authService.hasAuthority(PermissionConstant.TreasuryPermissions.ADD_CUSTOMER_SETTLEMENT);
    this.hasAddSupplierSettlementPermission = this.authService.hasAuthority(PermissionConstant.TreasuryPermissions.ADD_SUPPLIER_SETTLEMENT);
    this.hasSendReminderMailPermission = this.authService.hasAuthority(PermissionConstant.TreasuryPermissions.SEND_REMINDER_MAIL);
    this.hasShowSalesInvoicePermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.SHOW_INVOICE_SALES);
    this.hasShowPurchaseInvoicePermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.SHOW_INVOICE_PURCHASE);
    this.companyService.getCurrentCompany().subscribe(company => {
      this.userCurrency = company.IdCurrencyNavigation;
    });
    this.intialiseState();
    if (!this.tiersType) {
      // Take costumer as default
      this.tiersType = this.tiersTypeEnum.Customer;
    }
    this.preparePredicateForExport();
    this.initGridDataSource();
  }

  // get financial commitment data and verify checked financialCommitment
  initGridDataSource() {
    this.grid.loading = true;
    this.selectedClientForFinancialCommitment = null;
    this.totalAmountToPaid = 0;
    this.numberSamePageFinancialCommitmentSelected = 0;
    this.financialCommitementNumberPerPage = 0;
    this.customerOutstandingService.processDataInvoicesNotTotallyPayed(this.gridSettings.state, this.predicate, this.tiersType)
      .subscribe(res => {
        if (res) {
          res.data.forEach(
            (document) => {
              document.NumberOfSelectedFinancialCommitment = 0;
              const financialCommitmentS = Object.assign([], document.FinancialCommitment);
              const FinancialCommitmentNotTotallySatisfiedLength =
                financialCommitmentS.filter(x => x.IdStatus !== this.statusCode.TotallySatisfied).length;
              this.financialCommitementNumberPerPage += FinancialCommitmentNotTotallySatisfiedLength;
              document.FinancialCommitment.forEach((financialCommitment) => {
                financialCommitment.IsChecked = this.listFinancialCommitmentSelected.find(
                  x => x.Id === financialCommitment.Id) ? true : false;
                if (financialCommitment.IsChecked) {
                  document.NumberOfSelectedInvoice++;
                  this.numberSamePageFinancialCommitmentSelected++;
                }
              });
              this.verifCheckedState(document);
            }
          );
          this.gridSettings.gridData = new Object() as DataResult;
          this.gridSettings.gridData.data = res.data;
          this.gridSettings.gridData.total = res.total;
          this.grid.loading = false;
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

  selectFinancialCommitment(financialCommitment, rowIndex) {
    let isFirstCheckOrLastUncheck = false;
    const dataItem = this.gridSettings.gridData.data[rowIndex % this.gridSettings.state.take];
    if (!financialCommitment.IsChecked) {
      // Take the tiers just on the first check
      if (!this.selectedTiers) {
        isFirstCheckOrLastUncheck = true;
        this.selectedTiers = dataItem.IdTiersNavigation;
      }
      // Add the checked financialCommitment to the selected financial commitment list if it's from the same tiers else show alert
      if (dataItem.IdTiers === this.selectedTiers.Id) {
        financialCommitment.IsChecked = !financialCommitment.IsChecked;
        dataItem.NumberOfSelectedFinancialCommitment++;
        this.numberSamePageFinancialCommitmentSelected++;
        this.listFinancialCommitmentSelected.push(financialCommitment);
      } else {
        const message = this.tiersType === this.tiersTypeEnum.Customer ?
          TreasuryConstant.CUSTOMER_OUTSTANDING_DOCUMENTS_FINANCIAL_COMMITMENT_SELECTION_ALERT
          : TreasuryConstant.SUPPLIER_OUTSTANDING_DOCUMENTS_FINANCIAL_COMMITMENT_SELECTION_ALERT;
        this.growlService.warningNotification(this.translate.instant(message));
      }
    } else {
      // Remove the unchecked financial commitment to the selected financial commitment list
      financialCommitment.IsChecked = !financialCommitment.IsChecked;
      dataItem.NumberOfSelectedFinancialCommitment--;
      this.numberSamePageFinancialCommitmentSelected--;
      const index = this.listFinancialCommitmentSelected.findIndex(x => x.Id === financialCommitment.Id);
      this.listFinancialCommitmentSelected.splice(index, NumberConstant.ONE);
      // if is the last uncheck ==> selected financial commitment list is empty
      if (this.getNumberOfSelectedFinancialCommitment() === NumberConstant.ZERO) {
        isFirstCheckOrLastUncheck = true;
        this.selectedTiers = undefined;
      }
    }

    // Verify the invoice check state
    this.verifCheckedState(dataItem);

    // If first check or last uncheck initialise the data grid
    if (isFirstCheckOrLastUncheck) {
      this.isTiersChangedProvidesFromThisComponent = true;
      this.supplierValueChange(this.selectedTiers);
      this.tiersSelectedChange.emit(this.selectedTiers);
    } else {
      // if is not the firs check or last uncheck just emit event for to update datagrid selection
      this.itemSelectedChange.emit(true);
    }
  }

  selectInvoice(dataItem) {
    let isFirstCheckOrLastUncheck = false;
    const financialCommitments = Object.assign([], dataItem.FinancialCommitment);
    const financialCommitmentNotTotallySatisfiedLength = financialCommitments.filter(
      x => x.IdStatus !== this.statusCode.TotallySatisfied).length;
    // Take the tiers just on the first check
    if (dataItem.CheckedState === DocumentCheckedState.NotChecked || dataItem.CheckedState === DocumentCheckedState.Intermediate) {
      if (!this.selectedTiers || (this.selectedTiers.Id !== dataItem.IdTiers)) {
        isFirstCheckOrLastUncheck = true;
        this.selectedTiers = dataItem.IdTiersNavigation;
      }
      // Add the checked financial commitment to the selected financial commitment list if it's from the same tiers else show alert
      if (dataItem.IdTiers === this.selectedTiers.Id) {
        dataItem.CheckedState = DocumentCheckedState.Checked;
        dataItem.FinancialCommitment.forEach(x => {
          if (!x.IsChecked && x.IdStatus !== this.statusCode.TotallySatisfied) {
            x.IsChecked = true;
            this.listFinancialCommitmentSelected.push(x);
            this.numberSamePageFinancialCommitmentSelected++;
          }
        });
        dataItem.NumberOfSelectedFinancialCommitment = financialCommitmentNotTotallySatisfiedLength;
      } else {
        const message = this.tiersType === this.tiersTypeEnum.Customer ?
          TreasuryConstant.CUSTOMER_OUTSTANDING_DOCUMENTS_FINANCIAL_COMMITMENT_SELECTION_ALERT
          : TreasuryConstant.SUPPLIER_OUTSTANDING_DOCUMENTS_FINANCIAL_COMMITMENT_SELECTION_ALERT;
        this.growlService.warningNotification(this.translate.instant(message));
      }
    } else {
      // Remove all the  financial commitment of the invoice from the selected financial commitment list
      dataItem.CheckedState = DocumentCheckedState.NotChecked;
      dataItem.FinancialCommitment.forEach(x => {
        if (x.IsChecked && x.IdStatus !== this.statusCode.TotallySatisfied) {
          x.IsChecked = false;
          const index = this.listFinancialCommitmentSelected.findIndex(f => f.Id === x.Id);
          this.listFinancialCommitmentSelected.splice(index, NumberConstant.ONE);
          this.numberSamePageFinancialCommitmentSelected--;
        }
      });
      dataItem.NumberOfSelectedFinancialCommitment = NumberConstant.ZERO;
      // if is the last uncheck ==> selected financial commitment list is empty
      if (this.getNumberOfSelectedFinancialCommitment() === NumberConstant.ZERO) {
        isFirstCheckOrLastUncheck = true;
        this.selectedTiers = undefined;
      }
    }

    // If first check or last uncheck initialise the data grid
    if (isFirstCheckOrLastUncheck) {
      this.isTiersChangedProvidesFromThisComponent = true;
      this.supplierValueChange(this.selectedTiers);
      this.tiersSelectedChange.emit(this.selectedTiers);
    } else {
      // if is not the firs check or last uncheck just emit event for to update datagrid selection
      this.itemSelectedChange.emit(true);
    }
  }

  // select all invoice in the same page
  selectAllInvoice() {
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
        this.gridSettings.gridData.data.forEach(document => {
          const financialCommitments = Object.assign([], document.FinancialCommitment);
          const financialCommitmentNotTotallySatisfiedLength = financialCommitments.filter(
            x => x.IdStatus !== this.statusCode.TotallySatisfied).length;
          document.FinancialCommitment.forEach(x => {
            if (!x.IsChecked && x.IdStatus !== this.statusCode.TotallySatisfied) {
              x.IsChecked = true;
              this.listFinancialCommitmentSelected.push(x);
              this.numberSamePageFinancialCommitmentSelected++;
            }
          });
          document.NumberOfSelectedFinancialCommitment = financialCommitmentNotTotallySatisfiedLength;
        });
      }
    } else if (this.checkSamePageSelectedFinancialCommitmentState() === DocumentCheckedState.Checked) {
      // Remove all financial commitment on the same page from the selected financial commitment list
      if (this.gridSettings.gridData && this.gridSettings.gridData.data && this.gridSettings.gridData.data.length >= NumberConstant.ONE) {
        this.gridSettings.gridData.data.forEach(document => {
          document.CheckedState = DocumentCheckedState.NotChecked;
          document.FinancialCommitment.forEach(x => {
            if (x.IsChecked && x.IdStatus !== this.statusCode.TotallySatisfied) {
              x.IsChecked = false;
              const index = this.listFinancialCommitmentSelected.findIndex(f => f.Id === x.Id);
              this.listFinancialCommitmentSelected.splice(index, NumberConstant.ONE);
              this.numberSamePageFinancialCommitmentSelected--;
            }
          });
          document.NumberOfSelectedFinancialCommitment = NumberConstant.ZERO;
        });
      }
      // If the selected financiancial commitment list is empty (doesn't containts financial commitment of type asset)
      if (this.getNumberOfSelectedFinancialCommitment() === NumberConstant.ZERO) {
        isFirstCheckOrLastUncheck = true;
        this.selectedTiers = undefined;
      }
    }

    // If first check or last uncheck initialise the data grid
    if (isFirstCheckOrLastUncheck) {
      this.isTiersChangedProvidesFromThisComponent = true;
      this.supplierValueChange(this.selectedTiers);
      this.tiersSelectedChange.emit(this.selectedTiers);
    } else {
      // if is not the firs check or last uncheck just emit event for to update datagrid selection
      this.itemSelectedChange.emit(true);
    }
  }

  verifCheckedState(dataItem) {
    const financialCommitmentS = Object.assign([], dataItem.FinancialCommitment);
    const financialCommitmentNotTotallySatisfiedLength = financialCommitmentS
      .filter(x => x.IdStatus !== this.statusCode.TotallySatisfied).length;
    if (dataItem.NumberOfSelectedFinancialCommitment === financialCommitmentNotTotallySatisfiedLength) {
      dataItem.CheckedState = DocumentCheckedState.Checked;
    } else if (dataItem.NumberOfSelectedFinancialCommitment === NumberConstant.ZERO) {
      dataItem.CheckedState = DocumentCheckedState.NotChecked;
    } else {
      dataItem.CheckedState = DocumentCheckedState.Intermediate;
    }
  }

  // update state of data
  public changeFinancialCommitmentCheckedState() {
    this.numberSamePageFinancialCommitmentSelected = 0;
    this.gridSettings.gridData.data.forEach(
      (document) => {
        document.NumberOfSelectedFinancialCommitment = 0;
        document.FinancialCommitment.forEach((financialCommitment) => {
          financialCommitment.IsChecked =
            this.listFinancialCommitmentSelected.find((x) => x.Id === financialCommitment.Id) ? true : false;
          if (financialCommitment.IsChecked) {
            document.NumberOfSelectedFinancialCommitment++;
            this.numberSamePageFinancialCommitmentSelected++;
          }
        });
        this.verifCheckedState(document);
      }
    );
  }

  public initialiseComponent() {
    this.selectedTiers = undefined;
    this.supplierDropdownDisabled = false;
    this.predicate = new PredicateFormat();
    this.preparePredicateForExport();
    this.intialiseState();
    this.initGridDataSource();
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

  clearListOfSelectedFinancialCommitment(selectedTiersValue?) {
    this.listFinancialCommitmentSelected.splice(NumberConstant.ZERO, this.listFinancialCommitmentSelected.length);
    this.itemSelectedChange.emit(selectedTiersValue);
  }

  documentStatusFilterChange($event) {
    removeFilter(this.gridSettings.state.filter, TreasuryConstant.DOCUMENT_STATUS);
    if ($event && ($event.Id !== NumberConstant.ZERO)) {
      this.gridSettings.state.filter.filters.push({ field: TreasuryConstant.DOCUMENT_STATUS, operator: 'eq', value: $event.Id });
    }
    this.gridSettings.state.skip = NumberConstant.ZERO;
    this.initGridDataSource();
  }

  // verify checked state of invoice financailCommitment
  checkSamePageSelectedFinancialCommitmentState(): number {
    if (this.numberSamePageFinancialCommitmentSelected === 0) {
      return DocumentCheckedState.NotChecked;
    } else if (this.financialCommitementNumberPerPage === this.numberSamePageFinancialCommitmentSelected) {
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
      this.formModalDialogService.openDialog(TITLE, PopUpSelectedFinancialCommitmentComponent, this.viewRef,
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

  showFinancialCommitmentPaymentDetails(id: number) {
    this.settlementService.getFinancialCommitmentPaymentHistory(id).subscribe(res => {
      const settlementCommitments = res as Array<SettlementCommitment>;
      this.formModalDialogService.openDialog(TreasuryConstant.FINANCIAL_COMMITMENT_PAYMENT_DETAIL,
        PopUpFinancialCommitmentPaymentHistoryComponent,
        this.viewRef, null, settlementCommitments, true, SharedConstant.MODAL_DIALOG_SIZE_L);
    });
  }

  preparePredicateForExport() {
    this.predicateForExport = new PredicateFormat();
    this.predicateForExport.Filter = new Array<Filter>();
    this.predicateForExport.Filter.push(new Filter(TreasuryConstant.TIERS_TYPE, Operation.eq, this.tiersType));
    if (this.predicate && this.predicate.Filter) {
      this.predicate.Filter.forEach((filter) => {
        this.predicateForExport.Filter.push(filter);
      });
    }
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
          field: TreasuryConstant.DOCUMENT_DATE,
          dir: 'asc'
        }
      ],
      group: [

      ]
    };
  }

  showDocument(document) {
    const url = this.documentUtility.showDocument(document);
    this.router.navigate([]).then(() => { window.open(url, '_blank'); });
  }

  getSelectedFinancialCommitmentsCodes() {
    const codes = this.listFinancialCommitmentSelected.map(x => x.Code);
    return ((codes.length > 0) ? codes.toString() : this.translate.instant(TreasuryConstant.NO_FINANCIAL_COMMITMENT_SELECTED));
  }

  getNumberOfSelectedFinancialCommitment() {
    return this.listFinancialCommitmentSelected.length;
  }

  AddNewSettlement() {
    const moreThanOne = this.listFinancialCommitmentSelected.find((x) =>
      x.IdDocumentNavigation.DocumentTypeCode === DocumentEnumerator.SalesInvoices
      || x.IdDocumentNavigation.DocumentTypeCode === DocumentEnumerator.PurchaseInvoices) ? true : false;
    if (moreThanOne) {
      this.openFormClicked.emit(true);
    } else {
      this.growlService.warningNotification(this.translate
        .instant(FinancialCommitmentNotBilledConstant.NO_FINANCIALCOMMITMENT_SELLECTED_TO_SETTLE_ALERT_INFO));
    }
  }

  getTiersTitle(): string {
    return this.tiersType === this.tiersTypeEnum.Customer ? TreasuryConstant.CLIENT : TreasuryConstant.SUPPLIER;
  }

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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes[SettlementConstant.SELECTED_TIERS]) {
      if (this.supplierViewChild) {
        this.supplierViewChild.supplierFiltredDataSource = this.supplierViewChild.supplierDataSource;
      }
      this.selectedTiers = changes[SettlementConstant.SELECTED_TIERS].currentValue;
      const previousTiers: Tiers = changes[SettlementConstant.SELECTED_TIERS].previousValue;
      // Update the data grid if tiers change event not provide from this component
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
