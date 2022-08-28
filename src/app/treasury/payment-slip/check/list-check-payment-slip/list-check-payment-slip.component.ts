import {Component, OnInit, Output, ViewChild, EventEmitter, Input} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { PaymentMethodEnumerator } from '../../../../models/enumerators/payment-method.enum';
import { ListPaymentSlipComponent } from '../../../components/list-payment-Slip/list-payment-slip.component';

@Component({
  selector: 'app-list-check-payment-slip',
  templateUrl: './list-check-payment-slip.component.html',
  styleUrls: ['./list-check-payment-slip.component.scss']
})
export class ListCheckPaymentSlipComponent implements OnInit {
  @Output() settlementTotalNumberEmitter: EventEmitter<number> = new EventEmitter<number>();
  @ViewChild(ListPaymentSlipComponent) childListPaymentSlip;
  paymentEnum = PaymentMethodEnumerator;
  @Input() predicateAdvancedSearch;
  @Input() isClickedSearch;
  @Input() isClickedReset;
  @Input()  isActiveTab;
  constructor() { }

  ngOnInit() {
  }

  getSettlementNumber($event) {
    this.settlementTotalNumberEmitter.emit($event);
  }

}
