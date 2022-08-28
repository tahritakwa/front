import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { PagerSettings } from '@progress/kendo-angular-grid';
import { IntlService } from '@progress/kendo-angular-intl';
import { DataResult, DataSourceRequestState, State } from '@progress/kendo-data-query';
import { GrowlService } from '../../../../COM/Growl/growl.service';
import { CounterSalesConstant } from '../../../constant/sales/counter-sales.constant';
import { DocumentConstant } from '../../../constant/sales/document.constant';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { TicketConstant } from '../../../constant/treasury/ticket.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { Tiers } from '../../../models/achat/tiers.model';
import { DocumentCheckedState } from '../../../models/enumerators/document-checked-state.enum';
import { DocumentEnumerator, documentStatusCode, DocumentTypesEnumerator, InvoicingTypeEnumerator } from '../../../models/enumerators/document.enum';
import { TiersTypeEnumerator } from '../../../models/enumerators/tiers-type.enum';
import { Document } from '../../../models/sales/document.model';
import { FilterSearchTicket } from '../../../models/treasury/filter-search-ticket-model';
import { ReducedTicket } from '../../../models/treasury/reduced-ticket';
import { ColumnSettings } from '../../../shared/utils/column-settings.interface';
import { GridSettings } from '../../../shared/utils/grid-settings.interface';
import { OrderBy, OrderByDirection } from '../../../shared/utils/predicate';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { TicketService } from '../../services/ticket/ticket.service';
import { CashRegisterDropdownComponent } from '../cash-register-dropdown/cash-register-dropdown.component';
import swal from 'sweetalert2';
import { DocumentService } from '../../../sales/services/document/document.service';


@Component({
  selector: 'app-ticket-list',
  templateUrl: './ticket-list.component.html',
  styleUrls: ['./ticket-list.component.scss']
})
export class TicketListComponent implements OnInit {
  @ViewChild('cashRegisterReceipChild') cashRegisterReceipChild: CashRegisterDropdownComponent;
  @ViewChild('cashRegisterPrincipalChild') cashRegisterPrincipalChild: CashRegisterDropdownComponent;
  // Inputs

  @Input() displayAddButton: boolean;
  @Input() listSelectedTicket: ReducedTicket[];
  @Input() disableCheckBox: boolean;
  @Input() activeCashTab: boolean;

  // outputs

  @Output() openFormClicked = new EventEmitter<boolean>();
  @Output() tiersSelectedChange = new EventEmitter();
  @Output() isForPosNotification = new EventEmitter();
  @Output() itemSelectedChange = new EventEmitter();


  tiersTypeEnum = TiersTypeEnumerator;
  documentTypeEnum = DocumentTypesEnumerator;
  documentCheckedState = DocumentCheckedState;
  // same tiers
  sameTiers = false;
  selectedTiers: Tiers;
  selectedPaymentType: any;
  numberSamePageTicketsSelected = 0;
  filterSearchTicket: FilterSearchTicket;
  // Format Date
  public formatDate: string = this.translate.instant(SharedConstant.DATE_FORMAT);
  // Boolean Value
  idCashRegister: number;
  idParentCash: number;
  creationDate: Date;
  invoiceBLCode: string;
  public billedTicketsListData: Array<any> = [
    { id: NumberConstant.ONE, name: this.translate.instant(TicketConstant.BILLED_TICKETS) },
    { id: NumberConstant.TWO, name: this.translate.instant(TicketConstant.UNBILLED_TICKETS) },
    { id: NumberConstant.THREE, name: this.translate.instant(TicketConstant.ALL) }
  ];
  public selectedBilledTickets: any = this.billedTicketsListData[NumberConstant.ZERO];
  public paidTicket: boolean = true;
  public ticketCode: string;
  public showGenerateInvoice: boolean = false
  public showAll: boolean = true


  public columnsConfig: ColumnSettings[] = [
    {
      field: TicketConstant.CODE,
      title: TicketConstant.CODE_TICKET_TITLE,
      filterable: false,
      _width: 150
    },
    {
      field: TicketConstant.INVOICE_CODE,
      title: TicketConstant.CODE_INVOICE_BL_TITLE,
      filterable: false,
      _width: 150
    },
    {
      field: TicketConstant.CASH_REGISTER_NAME,
      title: TicketConstant.CASH_REGISTER_TITLE,
      filterable: false,
      _width: 150
    },
    {
      field: TicketConstant.DATE,
      title: TicketConstant.TICKET_DATE_TITLE,
      format: this.translate.instant("DATE_AND_TIME_FORMAT"),
      filterable: false,
      _width: 150
    },
    {
      field: TicketConstant.CUSTOMER_LABEL,
      title: TicketConstant.CUSTOMER_TITLE,
      filterable: false,
      _width: 150
    },
    {
      field: TicketConstant.INVOICE_AMOUNT,
      title: TicketConstant.INVOICED_AMOUNT_TITLE,
      filterable: false,
      _width: 200
    },
    {
      field: TicketConstant.TICKET_AMOUNT,
      title: TicketConstant.TICKET_AMOUNT_TITLE,
      filterable: false,
      _width: 200
    },
    {
      field: TicketConstant.PAYED_AMOUNT,
      title: TicketConstant.PAYED_AMOUNT_TITLE,
      filterable: false,
      _width: 200
    },
    {
      field: TicketConstant.ID_PAYMENT_TYPE_NAVIGATION,
      title: TicketConstant.PAYMENT,
      filterable: false,
      _width: 200
    }
  ];
  pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
  // Grid DATA
  gridData: DataResult = new Object() as DataResult;
  // grid state
  gridState: State = new Object() as State;

  gridSettings: GridSettings = {
    gridData: this.gridData,
    state: this.gridState,
    columnsConfig: this.columnsConfig
  };
  // supplier dropdown disabled state
  supplierDropdownDisabled = false;
  // Permission
  public hasAddCustomerSettlementPermission: boolean;
  public hasShowSalesInvoicePermission: boolean;
  public hasShowSalesDeliveryPermission: boolean;

  constructor(private serviceTicket: TicketService, private translate: TranslateService, public intl: IntlService, private authService: AuthService,
    private router: Router, public growlService: GrowlService, public documentService: DocumentService) { }

  ngOnInit() {
    this.hasShowSalesInvoicePermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.SHOW_INVOICE_SALES);
    this.hasShowSalesDeliveryPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.SHOW_DELIVERY_SALES);
    this.hasAddCustomerSettlementPermission = this.authService.hasAuthority(PermissionConstant.TreasuryPermissions.ADD_CUSTOMER_SETTLEMENT);
    this.intialiseState();
    this.filterSearchTicket = this.preparePredicate();
    if (this.activeCashTab) {
      this.initGridDataSource();
    }
  }
  /**
     * Data changed listener
     * @param state
     */
  public dataStateChange(state: any): void {
    if (!state.sort[NumberConstant.ZERO] || (state.sort[NumberConstant.ZERO] && !state.sort[NumberConstant.ZERO].dir)) {
      state.sort = [];
      this.filterSearchTicket.OrderBy = new Array<OrderBy>();
      this.filterSearchTicket.OrderBy.push(new OrderBy(TicketConstant.DATE, OrderByDirection.desc));
    }
    this.gridSettings.state = state;
    this.filterSearchTicket.pageSize = state.take;
    this.filterSearchTicket.page = (state.skip / state.take) + 1;
    if (state.sort.length > 0) {
      const dir = state.sort[NumberConstant.ZERO].dir;
      const field = state.sort[NumberConstant.ZERO].field;
      this.filterSearchTicket.OrderBy = new Array<OrderBy>();
      this.filterSearchTicket.OrderBy.push(new OrderBy(field, dir));
    }
    this.initGridDataSource();

  }

  public initGridDataSource() {
    this.numberSamePageTicketsSelected = 0;
    const paidTicket = this.filterSearchTicket.PaidTicket;
    this.serviceTicket.getTicketDataWithSpecificFilter(this.filterSearchTicket)
      .subscribe(res => {
        res.listData.forEach(
          (ticket) => {
            if (paidTicket) {
              ticket.IsChecked = this.listSelectedTicket.find((x: ReducedTicket) => x.Id === ticket.Id && x.IdPaymentTicket === ticket.IdPaymentTicket) ? true : false;
            } else {
              ticket.IsChecked = this.listSelectedTicket.find((x: ReducedTicket) => x.Id === ticket.Id) ? true : false;
            }
            if (ticket.IsChecked) {
              this.numberSamePageTicketsSelected++;
            }
          }
        );
        this.gridSettings.gridData = res;
        this.gridSettings.gridData.data = res.listData;
        // Disable the tiers general filter
        this.supplierDropdownDisabled = this.getNumberOfSelectedTickets() > NumberConstant.ZERO;
      });
  }

  preparePredicate($event?: any, idPaymentType?: any): FilterSearchTicket {
    const filterSearch = new FilterSearchTicket();
    if (idPaymentType) {
      filterSearch.IdPaymentType = idPaymentType;
    }
    if ($event && $event.Id) {
      filterSearch.IdTiers = $event.Id;
    }
    filterSearch.PaidTicket = this.paidTicket;
    filterSearch.pageSize = this.gridSettings.state.take;
    filterSearch.page = (this.gridSettings.state.skip / this.gridSettings.state.take) + 1;
    filterSearch.OrderBy = new Array<OrderBy>();
    filterSearch.OrderBy.push(new OrderBy(TicketConstant.DATE, OrderByDirection.desc));
    return filterSearch;
  }

  emitSupplier($event) {
    this.selectedTiers = $event.selectedTiers ? $event.selectedTiers : undefined;
    this.isForPosNotification.emit($event ? true : false);
    this.tiersSelectedChange.emit($event.selectedTiers);
  }

  paymentMethodChange($event) {
    this.selectedPaymentType = $event ? $event.Id : undefined;
  }

  supplierValueChange($event, idPaymentType?: any, isLastUncheck?: boolean) {
    this.selectedTiers = $event ? $event : undefined;
    this.selectedPaymentType = idPaymentType ? idPaymentType : undefined;
    if (idPaymentType) {
      this.filterSearchTicket.IdPaymentType = this.selectedPaymentType;
    }
    if (this.selectedTiers) {
      this.filterSearchTicket.IdTiers = $event.Id;
    }
    // show checkbox all button
    if (this.selectedTiers && !isLastUncheck) {
      this.sameTiers = true;
    } else {
      this.sameTiers = false;
    }
  }

  AddNewSettlement() {
    const moreThanOne = this.listSelectedTicket.length > NumberConstant.ZERO ? true : false;
    if (moreThanOne) {
      this.openFormClicked.emit(true);
    } else {
      this.growlService.warningNotification(this.translate
        .instant(TicketConstant.NO_TICKET_SELLECTED_TO_SETTLE_ALERT_INFO));
    }
  }

  public getDocumentCurrency(Code, Precision) {
    return {
      style: 'currency',
      currency: Code,
      currencyDisplay: 'symbol',
      minimumFractionDigits: Precision
    };
  }

  showDocument(id, status, type) {
    let url = type == DocumentTypesEnumerator.SALES_INVOICE ? DocumentConstant.SALES_INVOICE_URL : DocumentConstant.SALES_DELIVERY_URL;
    url = url.concat('/')
      .concat(DocumentConstant.SHOW).concat('/').concat(id).concat('/').concat(status);
    this.router.navigate([]).then(() => { window.open(url, '_blank'); });
  }

  // select all tickets in the same page
  selectAllTickets() {
    let isFirstCheckOrLastUncheck = false;
    let isLastUncheck = false;
    if (this.checkSamePageSelectedTicketsState() === DocumentCheckedState.NotChecked ||
      this.checkSamePageSelectedTicketsState() === DocumentCheckedState.Intermediate) {
      if (this.gridSettings.gridData && this.gridSettings.gridData.data && this.gridSettings.gridData.data.length >= NumberConstant.ONE) {
        let notBilledTicket = this.gridSettings.gridData.data.find(x => x.IdInvoice == null);
        if (notBilledTicket) {
          this.showGenerateInvoice = true;
          this.showAll = true;
        }
        // Take the tiers just on the first check
        if (!this.selectedTiers || (this.selectedTiers && this.getNumberOfSelectedTickets() === NumberConstant.ZERO)) {
          isFirstCheckOrLastUncheck = true;
          this.isForPosNotification.emit(true);
          this.selectedTiers = this.gridSettings.gridData.data[0].IdTiersNavigation;
          this.selectedPaymentType = this.gridSettings.gridData.data[0].IdPaymentTypeNavigation.Id;
        }
        // Add all checked Tickets to the selected Tickets list
        this.gridSettings.gridData.data.forEach(ticket => {
          if (!ticket.IsChecked) {
            ticket.IsChecked = true;
            this.listSelectedTicket.push(ticket);
            this.numberSamePageTicketsSelected++;
          }
        });
      }
    } else if (this.checkSamePageSelectedTicketsState() === DocumentCheckedState.Checked) {
      // Remove all tickets on the same page from the selected tickets list
      if (this.gridSettings.gridData && this.gridSettings.gridData.data) {
        this.gridSettings.gridData.data.forEach(ticket => {
          if (ticket.IsChecked) {
            ticket.IsChecked = false;
            const index = this.listSelectedTicket.findIndex(f => f.Id === ticket.Id);
            this.listSelectedTicket.splice(index, NumberConstant.ONE);
            this.numberSamePageTicketsSelected--;
          }
        });
        // If the selected ticket list is empty (doesn't containts ticket )
        if (this.getNumberOfSelectedTickets() === NumberConstant.ZERO) {
          isFirstCheckOrLastUncheck = true;
          isLastUncheck = true;
          this.onInvoicedFilterChanged();
          this.filterSearchTicket.PaidTicket = this.paidTicket;
        }
      }
    }

    // If first check or last uncheck initialise the data grid and emit tiers
    if (isFirstCheckOrLastUncheck) {
      this.supplierValueChange(this.selectedTiers, this.selectedPaymentType, isLastUncheck);
      this.initGridDataSource();
      this.tiersSelectedChange.emit(this.selectedTiers);
    } else {
      // if is not the first check or last uncheck just emit event for to update datagrid selection
      this.itemSelectedChange.emit(true);
    }
  }

  selectTicket(dataItem) {
    let isFirstCheckOrLastUncheck = false;
    let isLastUncheck = false;
    if (!dataItem.IsChecked) {
      this.showGenerateInvoiceOrAddButtons(dataItem);
      // Take the tiers just on the first check
      if (!this.selectedTiers || (this.selectedTiers && this.getNumberOfSelectedTickets() === NumberConstant.ZERO)) {
        isFirstCheckOrLastUncheck = true;
        this.isForPosNotification.emit(true);
        this.selectedTiers = dataItem.IdTiersNavigation;
        this.selectedPaymentType = dataItem.IdPaymentTypeNavigation.Id;
      }
      // Add the checked ticket to the selected ticket list if it's from the same tiers else show alert
      if (dataItem.IdTiersNavigation.Id === this.selectedTiers.Id) {
        dataItem.IsChecked = !dataItem.IsChecked;
        this.listSelectedTicket.push(dataItem);
        this.numberSamePageTicketsSelected++;
        // Add the tickets with same id with checked ticket to the selected ticket list 
        if (dataItem.IdInvoice == null) {
          const ticketsWithSameId = this.gridSettings.gridData.data.filter(x => x.Id == dataItem.Id && x.IsChecked == false);
          ticketsWithSameId.forEach(ticket => {
            ticket.IsChecked = true;
            this.listSelectedTicket.push(ticket);
            this.numberSamePageTicketsSelected++;
          });
        }
      }
    } else {
      // Remove the unchecked ticket from the selected ticket list
      const index = this.listSelectedTicket.findIndex(x => x.Id === dataItem.Id);
      dataItem.IsChecked = !dataItem.IsChecked;
      this.listSelectedTicket.splice(index, NumberConstant.ONE);
      // Remove  tickets with same id of unckecket selected tickets when the tickets is not billed
      if (dataItem.IdInvoice == null) {
        const ticketsWithSameId = this.gridSettings.gridData.data.filter(x => x.Id == dataItem.Id && x.IsChecked == true);
        ticketsWithSameId.forEach(ticket => {
          const index = this.listSelectedTicket.findIndex(x => x.Id === ticket.Id);
          ticket.IsChecked = false;
          this.listSelectedTicket.splice(index, NumberConstant.ONE);
          this.numberSamePageTicketsSelected--;
        });
      }
      this.numberSamePageTicketsSelected--;
      // if is the last uncheck ==> selected ticket list is empty
      if (this.getNumberOfSelectedTickets() === NumberConstant.ZERO) {
        isFirstCheckOrLastUncheck = true;
        isLastUncheck = true;
        this.onInvoicedFilterChanged();
        this.filterSearchTicket.PaidTicket = this.paidTicket;
      }
    }
    // If first check or last uncheck initialise the data grid and emit tiers
    if (isFirstCheckOrLastUncheck) {
      this.checkInvoicedTickets(dataItem, isLastUncheck)
      this.initGridDataSource();
      this.tiersSelectedChange.emit(this.selectedTiers);
    } else {
      // if is not the first check or last uncheck just emit event for to update datagrid selection
      this.itemSelectedChange.emit(true);
    }
  }

  checkInvoicedTickets(dataItem, isLastUncheck) {
    // If selected ticket is  billed
    if (dataItem.IdInvoice !== null) {
      this.supplierValueChange(this.selectedTiers, this.selectedPaymentType, isLastUncheck);
      if (!isLastUncheck) {
        this.filterSearchTicket.PaidTicket = true;
      }
    } // If selected ticket is not  billed
    else if (dataItem.IdInvoice === null) {
      this.supplierValueChange(this.selectedTiers, undefined, isLastUncheck);
      if (!isLastUncheck) {
        this.filterSearchTicket.PaidTicket = false;
      }
    }
  }

  showGenerateInvoiceOrAddButtons(dataItem) {
    this.showAll = true;
    if (dataItem.IdInvoice == null) {
      this.showGenerateInvoice = true;
    } else if (dataItem.IdInvoice !== null) {
      this.showGenerateInvoice = false;
    }
  }

  checkSamePageSelectedTicketsState(): number {
    if (this.numberSamePageTicketsSelected === 0) {
      return DocumentCheckedState.NotChecked;
    } else if (this.gridSettings.gridData.data &&
      this.numberSamePageTicketsSelected === this.gridSettings.gridData.data.length) {
      return DocumentCheckedState.Checked;
    } else {
      return DocumentCheckedState.Intermediate;
    }
  }

  getNumberOfSelectedTickets() {
    return this.listSelectedTicket.length;
  }
  intialiseState() {
    this.gridSettings.state = {
      skip: NumberConstant.ZERO,
      take: NumberConstant.ONE_HUNDRED,
      filter: { // Initial filter descriptor
        logic: 'and',
        filters: []
      }
    };
  }
  public initialiseComponent(saveDone?: boolean) {
    if (saveDone) {
      this.onInvoicedFilterChanged();
      this.filterSearchTicket.PaidTicket = this.paidTicket;
    } else {
      this.intialiseState();
      this.paidTicket = true;
      this.filterSearchTicket = this.preparePredicate();
      this.sameTiers = false;
      this.supplierDropdownDisabled = false;
    }
    this.showAddSettlementAndGenerateInvoiceButtons();
    this.initGridDataSource();
  }

  public onChangeFilterDate(event) {
    if (event) {
      this.creationDate = new Date(event);
    } else {
      this.creationDate = null;
    }
  }

  public onCashRegisterChange(event) {
    if (event) {
      this.idCashRegister = event.Id;
    } else {
      this.idCashRegister = NumberConstant.ZERO;
    }
  }

  public onParentCashRegisterChange(event) {
    if (event) {
      this.idParentCash = event.Id;
    } else {
      this.idParentCash = NumberConstant.ZERO;
    }
    this.idCashRegister = undefined;
    this.cashRegisterReceipChild.initDataSource(this.idParentCash);
    this.cashRegisterReceipChild.onClear();
  }

  public onInvoicedFilterChanged() {
    if (this.selectedBilledTickets && this.selectedBilledTickets.name === this.translate.instant(TicketConstant.BILLED_TICKETS)) {
      this.paidTicket = true;
    } else if (this.selectedBilledTickets && this.selectedBilledTickets.name === this.translate.instant(TicketConstant.UNBILLED_TICKETS)) {
      this.paidTicket = false;
    } else {
      this.paidTicket = undefined;
    }
  }

  public searchClick() {
    if (this.getNumberOfSelectedTickets() > NumberConstant.ZERO) {
      return;
    }
    this.intialiseState();
    this.filterSearchTicket = this.preparePredicate(this.selectedTiers, this.selectedPaymentType)
    this.sameTiers = false;
    this.filterSearchTicket.IdCashRegister = this.idCashRegister;
    this.filterSearchTicket.IdParentCash = this.idParentCash;
    this.filterSearchTicket.InvoiceBLCode = this.invoiceBLCode;
    this.filterSearchTicket.TicketCode = this.ticketCode;
    this.filterSearchTicket.CreationDate = this.creationDate;
    this.filterSearchTicket.PaidTicket = this.paidTicket;
    this.showAddSettlementAndGenerateInvoiceButtons();
    this.initGridDataSource();
  }

  public resetField() {
    if (this.getNumberOfSelectedTickets() > NumberConstant.ZERO) {
      this.listSelectedTicket.splice(NumberConstant.ZERO, this.listSelectedTicket.length);
    }
    this.openFormClicked.emit(false);
    this.selectedTiers = undefined;
    this.selectedPaymentType = undefined;
    this.idCashRegister = undefined;
    this.idParentCash = undefined;
    this.cashRegisterReceipChild.onClear();
    this.cashRegisterPrincipalChild.onClear();
    this.invoiceBLCode = undefined;
    this.ticketCode = undefined;
    this.creationDate = undefined;
    this.paidTicket = true;
    this.showGenerateInvoice = false;
    this.selectedBilledTickets = this.billedTicketsListData[NumberConstant.ZERO];
    this.supplierDropdownDisabled = false;
    this.sameTiers = false;
    this.showAddSettlementAndGenerateInvoiceButtons();
    this.intialiseState();
    this.filterSearchTicket = this.preparePredicate();
    this.initGridDataSource();
  }

  public showAddSettlementAndGenerateInvoiceButtons() {
    if (this.paidTicket !== undefined) {
      this.showAll = true;
      this.showGenerateInvoice = !this.paidTicket;
    } else {
      this.showAll = false;
    }
  }

  showCounterSales(dataItem) {
    let url;
    if (dataItem.Id > NumberConstant.ZERO) {
      url = CounterSalesConstant.COUNTER_SALES_SHOW_URL.concat(dataItem.Id);
    } else if (dataItem.IdDeliveryForm > NumberConstant.ZERO) {
      url = CounterSalesConstant.COUNTER_SALES_SHOW_BL_URL.concat(dataItem.IdDeliveryForm);
    }
    this.router.navigate([]).then(() => { window.open(url, '_blank'); });
  }

  public generateInvoice() {
    if (this.listSelectedTicket.length > NumberConstant.ZERO) {
      const invoice: Document = new Document();
      invoice.DocumentDate = new Date();
      invoice.DocumentTypeCode = DocumentEnumerator.SalesInvoices;
      invoice.IdDocumentStatus = documentStatusCode.Valid;
      invoice.IdTiers = this.selectedTiers.Id;
      invoice.IdCurrency = this.listSelectedTicket[0].IdUsedCurrencyNavigation.Id;
      invoice.IdUsedCurrency = this.listSelectedTicket[0].IdUsedCurrencyNavigation.Id;
      invoice.ValidationDate = new Date();
      invoice.IsForPos = true;
      invoice.DocumentAmountPaidWithCurrency = 0;
      invoice.DocumentHtpriceWithCurrency = 0;
      invoice.DocumentOtherTaxesWithCurrency = 0;
      invoice.DocumentPriceIncludeVatWithCurrency = 0;
      invoice.DocumentRemainingAmountWithCurrency = 0;
      invoice.DocumentTotalDiscountWithCurrency = 0;
      invoice.DocumentTotalExcVatTaxesWithCurrency = 0;
      invoice.DocumentTotalVatTaxesWithCurrency = 0;
      invoice.DocumentTtcprice = 0;
      invoice.DocumentTtcpriceWithCurrency = 0;
      invoice.InoicingType = InvoicingTypeEnumerator.Cash;
      const idsDelivery = this.listSelectedTicket.map(x => x.IdDeliveryForm);
      const idsTickets = this.listSelectedTicket.map(x => x.Id);
      this.documentService.generatePosInvoiceFromBl(invoice, true, undefined, undefined, idsDelivery, idsTickets)
        .subscribe(res => {
          this.filterSearchTicket.PaidTicket = this.paidTicket;
          this.listSelectedTicket.splice(NumberConstant.ZERO, this.listSelectedTicket.length);
          let message: string = this.translate.instant(
            CounterSalesConstant.SUCCESS_GENERATE_INVOICE_MESSAGE
          );
          message = message.concat(
            '<a target="_blank" rel="noopener noreferrer" href="' + this.getInvoiceUrl(res.Id) + '" > ' + res.Code + ' </a>');
          swal.fire({
            icon: SharedConstant.SUCCESS,
            html: message,
            onClose: () => this.initGridDataSource()
          });

        });
    } else {
      this.growlService.warningNotification(this.translate
        .instant(TicketConstant.AT_LEAST_ONE_TICKET_NOT_BILLED_MUST_BE_SELECTED));
    }
  }

  getInvoiceUrl(id) {
    return '/main/sales/invoice/show/' + id + '/' + documentStatusCode.Valid;
  }

}
