import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { Tiers } from '../../../models/achat/tiers.model';
import { DocumentEnumerator } from '../../../models/enumerators/document.enum';
import { TiersTypeEnumerator } from '../../../models/enumerators/tiers-type.enum';
import { FinancialCommitment } from '../../../models/sales/financial-commitment.model';
import { DeadLineDocumentService } from '../../../sales/services/dead-line-document/dead-line-document.service';
import { DeliveryFormNotBilledComponent } from '../../customer/customer-outstanding/delivery-form-not-billed/delivery-form-not-billed.component';
import { AmountFormatService } from '../../services/amount-format.service';
import { AssetFinancialCommitmentNotBilledComponent } from '../asset-financial-commitment-not-billed/asset-financial-commitment-not-billed.component';
import { InvoiceCommitmentNotBilledComponent } from '../invoice-commitment-not-billed/invoice-commitment-not-billed.component';
import { InvoiceFinancialCommitmentNotBilledComponent } from '../invoice-financial-commitment-not-billed/invoice-financial-commitment-not-billed.component';
import { Currency } from '../../../models/administration/currency.model';
import { CompanyService } from '../../../administration/services/company/company.service';
import { LocalStorageService } from '../../../login/Authentification/services/local-storage-service';
import { ReducedTicket } from '../../../models/treasury/reduced-ticket';
import { TicketListComponent } from '../ticket-list/ticket-list.component';
import { SwalWarring } from '../../../shared/components/swal/swal-popup';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { TreasuryConstant } from '../../../constant/treasury/treasury.constant';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-outstanding-document',
  templateUrl: './outstanding-document.component.html',
  styleUrls: ['./outstanding-document.component.scss']
})
export class OutstandingDocumentComponent implements OnInit {

  @ViewChild(InvoiceCommitmentNotBilledComponent) invoiceCommitment: InvoiceCommitmentNotBilledComponent;
  @ViewChild(InvoiceFinancialCommitmentNotBilledComponent) invoiceFinancialCommitment: InvoiceFinancialCommitmentNotBilledComponent;
  @ViewChild(AssetFinancialCommitmentNotBilledComponent) assetFinancialCommitment: AssetFinancialCommitmentNotBilledComponent;
  @ViewChild(DeliveryFormNotBilledComponent) deliveryForm: DeliveryFormNotBilledComponent;
  @ViewChild(TicketListComponent) ticketList: TicketListComponent;


  @Input() tiersType: number;
  listFinancialCommitmentSelected: FinancialCommitment[] = [];
  listTicketsSelected: ReducedTicket[] = [];
  language: string;
  totalAmount = 0;
  totalAmountWithholdingTax = 0;
  displayForm: boolean;
  tiersTypeEnum = TiersTypeEnumerator;
  selectedTiers: Tiers;
  selectedTiersFromPos: Tiers;
  tiersCurrency: Currency;
  activeTabCashRegister = false;
  activeCashTab = false;
  isActiveTab = false;

  companyWithholdingTax = false;
  isForPos = false;
  selectedPaymentType: any;

  constructor(public settlementService: DeadLineDocumentService,
    private companyService: CompanyService,
    private amountFormat: AmountFormatService,
    private localStorageService: LocalStorageService, private swalWarrings: SwalWarring,
    private translate: TranslateService) {
    this.language = this.localStorageService.getLanguage();
  }

  ngOnInit() {
    this.companyService.getCurrentCompany().subscribe((data) => {
      this.companyWithholdingTax = data.WithholdingTax;
    });
  }
  
  clickTab(label, event) {
    // if ticket  or invoice commitment checked
    if ((this.invoiceCommitment.numberSamePageFinancialCommitmentSelected > NumberConstant.ZERO
      && label === TreasuryConstant.CASH_REGISTER) || this.ticketList.numberSamePageTicketsSelected > NumberConstant.ZERO && label !== TreasuryConstant.CASH_REGISTER) {
      this.onCheckTab(event, label);
    } else {
      this.onChangeTab(label);
    }
  }

   onCheckTab(event, label) {
    if (!this.isActiveTab) {
      event.preventDefault();
      event.stopPropagation();
      this.swalWarrings.CreateSwal(this.translate.instant(TreasuryConstant.DO_YOU_CONFIRM_THE_SWITCHOVER),
        this.translate.instant(TreasuryConstant.SWITCHOVER),
        SharedConstant.YES, SharedConstant.NO).then((result) => {
          if (result.value) {
            this.isActiveTab = true;
            event.target.click();
            this.initialiseComponent();
            this.onChangeTab(label);
          }
        });
    } else {
      this.isActiveTab = false;
    }
  }
  onChangeTab(label){
    if (label === TreasuryConstant.CASH_REGISTER ) {
      if(!this.activeCashTab){
        this.ticketList.initialiseComponent(false);
        this.activeCashTab = true;
      }     
      this.isForPos = true;
      this.displayForm = false;
    } else if (label !== TreasuryConstant.CASH_REGISTER) {
      this.isForPos = false;
    }
  }

  openForm($event) {
    this.displayForm = $event;
  }

  /**
   * Method called after the second selection and more, or called at the first selection if the supplier is already selected
   * @param $event
   */
  onSelectedFinancialCommitmentChange($event) {
    this.disabledSupplierDropdown();
    this.updateViewChildsGridCheckState();
    // Get the currency if it's not exist
    if (!this.tiersCurrency && this.listFinancialCommitmentSelected.length > 0) {
      this.tiersCurrency = this.listFinancialCommitmentSelected[0].IdCurrencyNavigation;
    }
    this.calculTotal();
  }

  onSelectedFTicketChange($event) {
    this.disabledSupplierDropdown();
    // Get the currency if it's not exist
    if (!this.tiersCurrency && this.listTicketsSelected.length > 0) {
      this.tiersCurrency = this.listTicketsSelected[0].IdUsedCurrencyNavigation;
    }
    this.calculTotal();
  }

  /**
   * Method call on:
   * - the supplier dropdown change
   * - the frist financial commitment check
   * - the last financial commitment uncheck
   * @param $event
   */
  onTiersChange($event) {
    if (this.isForPos) {
      this.selectedTiersFromPos = $event;
    } else {
      this.selectedTiers = $event;
    }

    // Get the currency if at least one financial commitment is selected
    if (!this.isForPos && this.selectedTiers && this.listFinancialCommitmentSelected.length > 0) {
      this.tiersCurrency = this.listFinancialCommitmentSelected[0].IdCurrencyNavigation;
      this.calculTotal();
    } else if (this.isForPos && this.selectedTiersFromPos && this.listTicketsSelected.length > 0) {
      this.tiersCurrency = this.listTicketsSelected[0].IdUsedCurrencyNavigation;
      this.selectedPaymentType = this.listTicketsSelected[0].IdPaymentTypeNavigation;
      this.calculTotal();
    } else {
      this.tiersCurrency = undefined;
      this.selectedPaymentType = undefined;
      this.totalAmount = 0;
      this.totalAmountWithholdingTax = 0;
    }
    this.disabledSupplierDropdown();
  }

  posNotify($event) {
    this.isForPos = $event;
  }

  /***
   * Calcul the total amount
   */
  calculTotal() {
    let totalToPaid = 0;
    if (!this.isForPos) {
      this.listFinancialCommitmentSelected.forEach(x => {
        if (x.IdDocumentNavigation.DocumentTypeCode === DocumentEnumerator.SalesInvoices
          || x.IdDocumentNavigation.DocumentTypeCode === DocumentEnumerator.PurchaseInvoices) {
          totalToPaid += x.RemainingAmountWithCurrency;
        } else {
          totalToPaid -= x.RemainingAmountWithCurrency;
        }
      });
    } else {
      this.listTicketsSelected.forEach(x => {
        totalToPaid += x.Amount;
      });
    }

    totalToPaid = totalToPaid < 0 ? 0 : totalToPaid;
    totalToPaid = this.amountFormat.format(this.tiersCurrency, totalToPaid);
    const listFinancialCommitmentIds = this.isForPos ? this.listTicketsSelected.map(x => x.IdInvoice) : this.listFinancialCommitmentSelected.map(x => x.Id);
    this.settlementService.calculateWithholdingTaxToBePaid(listFinancialCommitmentIds).subscribe(
      res => {
        this.totalAmount = this.amountFormat.format(this.tiersCurrency, totalToPaid + res);
        this.totalAmountWithholdingTax = res;
      }
    );
  }

  initialiseComponent() {
    this.displayForm = false;
    this.listFinancialCommitmentSelected = [];
    this.selectedPaymentType = undefined;
    this.listTicketsSelected = [];
    if (this.invoiceCommitment) {
      this.invoiceCommitment.initialiseComponent();
    }
    if (this.invoiceFinancialCommitment) {
      this.invoiceFinancialCommitment.initialiseComponent();
    }
    if (this.assetFinancialCommitment) {
      this.assetFinancialCommitment.initialiseComponent();
    }
    if (this.deliveryForm) {
      this.deliveryForm.initialiseComponent();
    }
    if (this.ticketList) {
      this.ticketList.initialiseComponent(true);
    }
  }

  updateViewChildsGridCheckState() {
    if (this.invoiceCommitment) {
      this.invoiceCommitment.changeFinancialCommitmentCheckedState();
    }
    if (this.invoiceFinancialCommitment) {
      this.invoiceFinancialCommitment.changeFinancialCommitmentCheckedState();
    }
    if (this.assetFinancialCommitment) {
      this.invoiceFinancialCommitment.changeFinancialCommitmentCheckedState();
    }
  }

  disabledSupplierDropdown() {
    if (this.invoiceCommitment) {
      this.invoiceCommitment.supplierDropdownDisabled = this.listFinancialCommitmentSelected &&
        (this.listFinancialCommitmentSelected.length >= NumberConstant.ONE) ? true : false;
    }
    if (this.invoiceFinancialCommitment) {
      this.invoiceFinancialCommitment.financialCommitment.supplierDropdownDisabled = this.listFinancialCommitmentSelected &&
        (this.listFinancialCommitmentSelected.length >= NumberConstant.ONE) ? true : false;
    }
    if (this.assetFinancialCommitment) {
      this.assetFinancialCommitment.financialCommitment.supplierDropdownDisabled = this.listFinancialCommitmentSelected &&
        (this.listFinancialCommitmentSelected.length >= NumberConstant.ONE) ? true : false;
    }
    if (this.deliveryForm) {
      this.deliveryForm.supplierDropdownDisabled = this.listFinancialCommitmentSelected &&
        (this.listFinancialCommitmentSelected.length >= NumberConstant.ONE) ? true : false;
    }
    if (this.ticketList) {
      this.ticketList.supplierDropdownDisabled = this.listTicketsSelected &&
        (this.listTicketsSelected.length >= NumberConstant.ONE) ? true : false;
    }
  }
}



