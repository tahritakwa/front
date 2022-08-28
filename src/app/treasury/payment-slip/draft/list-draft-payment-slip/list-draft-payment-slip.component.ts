import {Component, OnInit, ViewChild, Output, EventEmitter, Input} from '@angular/core';
import { PaymentMethodEnumerator } from '../../../../models/enumerators/payment-method.enum';
import { FormGroup } from '@angular/forms';
import { ListPaymentSlipComponent } from '../../../components/list-payment-Slip/list-payment-slip.component';
@Component({
  selector: 'app-list-draft-payment-slip',
  templateUrl: './list-draft-payment-slip.component.html',
  styleUrls: ['./list-draft-payment-slip.component.scss']
})
export class ListDraftPaymentSlipComponent implements OnInit {
  @Output() settlementTotalNumberEmitter: EventEmitter<number> = new EventEmitter<number>();
  @ViewChild(ListPaymentSlipComponent) childListPaymentSlip;

  paymentEnum = PaymentMethodEnumerator ;
  @Input() predicateAdvancedSearch;
  @Input() isClickedSearch;
  @Input() isClickedReset;
  @Input() isActiveTab;
  constructor() { }

  ngOnInit() {
  }
  getSettlementNumber($event) {
    this.settlementTotalNumberEmitter.emit($event);
  }

}
