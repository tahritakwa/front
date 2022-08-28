import { Component, OnInit } from '@angular/core';
import { DocumentEnumerator } from '../../../models/enumerators/document.enum';
import { DocumentConstant } from '../../../constant/sales/document.constant';

@Component({
  selector: 'app-sales-order-list',
  templateUrl: './sales-order-list.component.html',
  styleUrls: ['./sales-order-list.component.scss']
})
export class SalesOrderListComponent implements OnInit {
  documentType = DocumentEnumerator.SalesOrder;
  advencedAddLink = DocumentConstant.SALES_ORDER_ADD;
  translateFilterName = DocumentConstant.ALL_SALES_ORDERS;
  constructor() { }

  ngOnInit() {
  }

}
