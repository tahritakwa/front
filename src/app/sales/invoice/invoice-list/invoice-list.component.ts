import { Component } from '@angular/core';
import { DocumentEnumerator } from '../../../models/enumerators/document.enum';
import { DocumentConstant } from '../../../constant/sales/document.constant';
@Component({
  selector: 'app-invoice-list',
  templateUrl: './invoice-list.component.html',
  styleUrls: ['./invoice-list.component.scss']
})

export class InvoiceListComponent {
  documentType = DocumentEnumerator.SalesInvoices;
  advencedAddLink = DocumentConstant.SALES_INVOICE_ADD;
  translateFilterName = DocumentConstant.ALL_INVOICES;
}
