import { Component, OnInit } from '@angular/core';
import { DocumentEnumerator } from '../../../models/enumerators/document.enum';
import { DocumentConstant } from '../../../constant/sales/document.constant';

@Component({
  selector: 'app-purchase-delivery-list',
  templateUrl: './purchase-delivery-list.component.html',
  styleUrls: ['./purchase-delivery-list.component.scss']
})
export class PurchaseDeliveryListComponent implements OnInit {
  documentType = DocumentEnumerator.PurchaseDelivery;
  advencedAddLink = DocumentConstant.PURCHASE_DELIVERY_ADD;
  translateFilterName = DocumentConstant.ALL_PURCHASE_DELIVERY;
  constructor() { }

  ngOnInit() {
  }

}
