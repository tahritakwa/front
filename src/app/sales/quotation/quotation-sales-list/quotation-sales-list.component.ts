import { Component, OnInit } from '@angular/core';
import { DocumentEnumerator } from '../../../models/enumerators/document.enum';
import { DocumentConstant } from '../../../constant/sales/document.constant';

@Component({
  selector: 'app-quotation-sales-list',
  templateUrl: './quotation-sales-list.component.html',
  styleUrls: ['./quotation-sales-list.component.scss']
})
export class QuotationSalesListComponent implements OnInit {
  /**document type(quotation) */
  documentType = DocumentEnumerator.SalesQuotations;
  advencedAddLink = DocumentConstant.SALES_QUOTATION_ADD;
  translateFilterName = DocumentConstant.ALL_QUOTATIONS;
  constructor() { }

  ngOnInit() {
  }

}
