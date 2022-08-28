import { Component, OnInit } from '@angular/core';
import { DocumentEnumerator } from '../../../models/enumerators/document.enum';
import { DocumentConstant } from '../../../constant/sales/document.constant';

@Component({
  selector: 'app-purchase-invoice-list',
  templateUrl: './purchase-invoice-list.component.html',
  styleUrls: ['./purchase-invoice-list.component.scss']
})
export class PurchaseInvoiceListComponent implements OnInit {
  documentType = DocumentEnumerator.PurchaseInvoices;
  advencedAddLink = DocumentConstant.PURCHASE_INVOICE_ADD;
  translateFilterName = DocumentConstant.ALL_INVOICES;
  constructor() { }

  ngOnInit() {
  }

}
