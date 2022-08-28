import { Component, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { FinancialCommitmentComponent } from '../financial-commitment/financial-commitment.component';
import { DocumentEnumerator } from '../../../models/enumerators/document.enum';

@Component({
  selector: 'app-dead-line-document',
  templateUrl: './dead-line-document.component.html',
  styleUrls: ['./dead-line-document.component.scss']
})
export class DeadLineDocumentComponent {

  @ViewChild(FinancialCommitmentComponent) financialCommitmentChild;

  @Input() idDocument: number;
  @Input() idTiers: number;
  @Input() documentType: string;
  @Input() formatOptions;
  @Input() showWithholdingTax;

  @Output() settlementAdded = new EventEmitter();

  /** document Enumerator */
  documentEnumerator: DocumentEnumerator = new DocumentEnumerator();
  public settlementAmount: number;

  constructor() {
  }
  public refreshFinancialCommitmentComponent() {
    if (this.financialCommitmentChild) {
        this.financialCommitmentChild.initGridDataSource();
    }
  }
}
