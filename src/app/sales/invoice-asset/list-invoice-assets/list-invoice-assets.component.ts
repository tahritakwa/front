import { Component, OnInit } from '@angular/core';
import { DocumentEnumerator } from '../../../models/enumerators/document.enum';
import { DocumentConstant } from '../../../constant/sales/document.constant';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-list-invoice-assets',
  templateUrl: './list-invoice-assets.component.html',
  styleUrls: ['./list-invoice-assets.component.scss']
})
export class ListInvoiceAssetsComponent implements OnInit {
  documentType = DocumentEnumerator.SalesInvoiceAsset;
  advencedAddLink = DocumentConstant.SALES_INVOICE_ASSEST_ADD;
  translateFilterName = DocumentConstant.ALL_INVOICEASSETS;
  isRestaurn = false;
  /**
   *
   */
  constructor(private activatedroute: ActivatedRoute) {
    this.activatedroute.data.subscribe(data => {
      this.isRestaurn = data.assetFinancial;
    });
  }
  ngOnInit(): void {
    if (this.isRestaurn) {
      this.advencedAddLink = DocumentConstant.SALES_ASSEST_FINACIAL_ADD;
      this.translateFilterName = DocumentConstant.ALL_ASSETS_FINACIAL;
    }
  }
}
