import { Injectable } from '@angular/core';
import { DocumentEnumerator } from '../../models/enumerators/document.enum';
import { DocumentConstant } from '../../constant/sales/document.constant';
import { removeFilter, filterByField } from '@progress/kendo-angular-grid/dist/es2015/filtering/base-filter-cell.component';
import { TreasuryConstant } from '../../constant/treasury/treasury.constant';

@Injectable()
export class DocumentUtilityService {
  public documentType = DocumentEnumerator;
  constructor() { }

  showDocument(document): string {
    let url: string;
    switch (document.DocumentTypeCode) {
      case this.documentType.SalesInvoices:
        url = DocumentConstant.SALES_INVOICE_URL.concat('/')
          .concat(DocumentConstant.SHOW).concat('/').concat(document.Id).concat('/').concat(document.IdDocumentStatus);
        break;
      case this.documentType.SalesInvoiceAsset:
        url = DocumentConstant.SALES_INOICE_ASSET_URL.concat('/')
          .concat(DocumentConstant.SHOW).concat('/').concat(document.Id).concat('/').concat(document.IdDocumentStatus);
        break;
      case this.documentType.PurchaseInvoices:
        url = DocumentConstant.PURCHASE_INVOICE_URL.concat('/')
          .concat(DocumentConstant.SHOW).concat('/').concat(document.Id).concat('/').concat(document.IdDocumentStatus);
        break;
      case this.documentType.PurchaseAsset:
        url = DocumentConstant.PURCHASE_ASSET_URL.concat('/')
          .concat(DocumentConstant.SHOW).concat('/').concat(document.Id).concat('/').concat(document.IdDocumentStatus);
        break;
    }
    return url;

  }

  changeTiersGridFilter($event, tiersData, gridState) {
    if ($event) {
      const tiers = tiersData.supplierDataSource.find(x => x.Id === $event.Id);
      if (filterByField(gridState.filter, TreasuryConstant.NAME_FROM_ID_TIERS_NAVIGATION)) {
        removeFilter(gridState.filter, TreasuryConstant.NAME_FROM_ID_TIERS_NAVIGATION);
      }
      gridState.filter.filters.push({
        field: TreasuryConstant.NAME_FROM_ID_TIERS_NAVIGATION,
        operator: 'contains', value: tiers.Name
      });

    } else {
      removeFilter(gridState.filter, TreasuryConstant.NAME_FROM_ID_TIERS_NAVIGATION);
    }
  }
}
