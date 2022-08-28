import { Component, OnInit } from '@angular/core';
import { DocumentConstant } from '../../../constant/sales/document.constant';
import {  DocumentEnumerator } from '../../../models/enumerators/document.enum';


@Component({
  selector: 'app-purchase-order-list',
  templateUrl: './purchase-order-list.component.html',
  styleUrls: ['./purchase-order-list.component.scss']
})

export class PurchaseOrderListComponent implements OnInit {
  documentType = DocumentEnumerator.PurchaseOrder;
  advencedAddLink = DocumentConstant.PURCHASE_ORDER_ADD;
  translateFilterName = DocumentConstant.ALL_PURCHASE_ORDER;
  ngOnInit() {
  }
}
