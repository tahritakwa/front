import { Component, OnInit } from '@angular/core';
import { DocumentEnumerator } from '../../../models/enumerators/document.enum';
import { DocumentConstant } from '../../../constant/sales/document.constant';

@Component({
  selector: 'app-purchase-final-order-list',
  templateUrl: './purchase-final-order-list.component.html',
  styleUrls: ['./purchase-final-order-list.component.scss']
})
export class PurchaseFinalOrderListComponent implements OnInit {
  documentType = DocumentEnumerator.PurchaseFinalOrder;
  advencedAddLink = DocumentConstant.PURCHASE_FINAL_ORDER_ADD;
  translateFilterName = DocumentConstant.ALL_PURCHASE_FINAL_ORDER;
  ngOnInit() {
  }

}
