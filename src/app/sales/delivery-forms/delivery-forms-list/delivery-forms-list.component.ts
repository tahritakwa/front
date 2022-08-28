import { Component, OnInit, Input, ViewChild, ViewContainerRef } from '@angular/core';
import { DocumentEnumerator } from '../../../models/enumerators/document.enum';
import { DocumentConstant } from '../../../constant/sales/document.constant';

@Component({
  selector: 'app-delivery-forms-list',
  templateUrl: './delivery-forms-list.component.html',
  styleUrls: ['./delivery-forms-list.component.scss']
})
export class DeliveryFormsListComponent implements OnInit {
  @Input() isFromDeliveryModal: boolean;
  @Input() idClient: any;
  @ViewChild('container', { read: ViewContainerRef })
  public containerRef: ViewContainerRef;
  documentType = DocumentEnumerator.SalesDelivery;
  advencedAddLink = DocumentConstant.SALES_DELIVERY_ADD;
  translateFilterName = DocumentConstant.ALL_SALES_DELIVERY;
  ngOnInit() {
  }
}
