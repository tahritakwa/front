import { Component, EventEmitter, Input, OnInit, Output, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { Tiers } from '../../../models/achat/tiers.model';
import { OutstandingDocumentTypeEnumerator } from '../../../models/enumerators/outstanding-document-type.enum';
import { TiersTypeEnumerator } from '../../../models/enumerators/tiers-type.enum';
import { FinancialCommitmentNotBilledComponent } from '../financial-commitment-not-billed/financial-commitment-not-billed.component';
import { SettlementConstant } from '../../../constant/payment/settlement.constant';
import { FinancialCommitment } from '../../../models/sales/financial-commitment.model';
import { TreasuryConstant } from '../../../constant/treasury/treasury.constant';

@Component({
  selector: 'app-invoice-financial-commitment-not-billed',
  templateUrl: './invoice-financial-commitment-not-billed.component.html',
  styleUrls: ['./invoice-financial-commitment-not-billed.component.scss']
})
export class InvoiceFinancialCommitmentNotBilledComponent implements OnInit, OnChanges {

  @ViewChild(FinancialCommitmentNotBilledComponent) financialCommitment: FinancialCommitmentNotBilledComponent;

  // Inputs
  @Input() listFinancialCommitmentSelected: FinancialCommitment[];
  @Input() tiersType;
  @Input() selectedTiers: Tiers;
  @Input() displayAddButton: boolean;
  @Input() companyWithholdingTax;
  @Input() disableCheckBox: boolean;

  // Outputs
  @Output() itemSelectedChange = new EventEmitter();
  @Output() tiersSelectedChange = new EventEmitter();
  @Output() openFormClicked = new EventEmitter();
  tiersTypeEnum = TiersTypeEnumerator;
  apiForExport = TreasuryConstant.GET_FINANCIAL_COMMITMENT_FOR_OUT_STANDING_FOR_EXPORT;
  outstandingDocumentTypesEnumerator = OutstandingDocumentTypeEnumerator;

  constructor() { }

  ngOnInit() {
  }

  emitItemSelectedEvent($event) {
    this.itemSelectedChange.emit($event);
  }

  tiersSelectedChangeEvent($event) {
    this.tiersSelectedChange.emit($event);
  }

  changeFinancialCommitmentCheckedState() {
    if (this.financialCommitment) {
      this.financialCommitment.changeFinancialCommitmentCheckedState();
    }
  }


  public initialiseComponent() {
    if (this.financialCommitment) {
      this.financialCommitment.initialiseComponent();
    }
  }

  openForm($event) {
    this.openFormClicked.emit($event);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes[SettlementConstant.SELECTED_TIERS]) {
      this.selectedTiers = changes[SettlementConstant.SELECTED_TIERS].currentValue;
    }
    if (changes[SettlementConstant.DISPLAY_ADD_BUTTON]) {
      this.displayAddButton = changes[SettlementConstant.DISPLAY_ADD_BUTTON].currentValue;
    }
  }
}
