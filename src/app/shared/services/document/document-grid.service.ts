import { Injectable } from '@angular/core';
import { Item } from '../../../models/inventory/item.model';
import { DocumentLineUnitPrice } from '../../../models/sales/document-line-unit-price.model';
import { ReduisDocument } from '../../../models/sales/reduis-document.model';
import { DocumentTotalPrices } from '../../../models/sales/document-total-prices.model';
import { ItemPrice } from '../../../models/sales/item-price.model';
import { DocumentEnumerator } from '../../../models/enumerators/document.enum';
import { DocumentLine } from '../../../models/sales/document-line.model';
import { Warehouse } from '../../../models/inventory/warehouse.model';
import { DocumentConstant } from '../../../constant/sales/document.constant';
import { FormGroup } from '@angular/forms';
import { DocumentLineService } from '../../../sales/services/document-line/document-line.service';

@Injectable()
export class DocumentFormService {
  item: Item = new Item();
  DocLinePrices: DocumentLineUnitPrice;
  reduisDocument: ReduisDocument;
  documentTotalPrices: DocumentTotalPrices;
  itemPrice: ItemPrice;
  documentCode: DocumentEnumerator = new DocumentEnumerator();
  documentLine: DocumentLine;
  DiscountPercentage: number;
  HtAmountWithCurrency: number;
  formGroup: FormGroup;
  labelUnitSale: string;
  DocumentLineId: number;
  labelItem: string;
  warehouse: string;
  client: number;
  currency: number;
  taxArray: Array<any>;
  constructor(private service: DocumentLineService) { }

  /**Select item */
  itemSelect($event) {
    if ($event && $event.itemFiltredDataSource && $event.itemForm && $event.itemForm.value[DocumentConstant.ID_ITEM]) {
      const itemValue: any[] = ($event.itemFiltredDataSource.filter(c => c.Id ===
        $event.itemForm.value[DocumentConstant.ID_ITEM]));
      if (itemValue && itemValue.length > 0) {
        this.item = itemValue[0];
        this.labelItem = this.item.Code;
      }

    }

  }
  /* * Get itemWarehouse after select item */
  warehouseSelect($event): boolean {
    if ($event.warehouseFiltredDataSource && $event.parent && $event.parent.value[DocumentConstant.ID_WARE_HOUSE]) {
      const warehouseValue: Warehouse[] = ($event.warehouseFiltredDataSource.filter(c => c.Id ===
        $event.parent.value[DocumentConstant.ID_WARE_HOUSE]));
      if (warehouseValue && warehouseValue.length > 0) {
        this.warehouse = warehouseValue[0].WarehouseName;
        return false;
      }
    }
  }

  /**Prepare supplier to get supplier curtrency*/
  prepareSupplier($event): boolean {
    this.client = $event.selectedValue;
    if ($event.supplierFiltredDataSource && $event.itemForm && $event.itemForm.value[DocumentConstant.ID_TIER]) {
      const supplierValue = ($event.supplierFiltredDataSource.filter(c => c.Id === $event.itemForm.value[DocumentConstant.ID_TIER]));
      if (supplierValue && supplierValue.length > 0) {
        this.currency = supplierValue[0].IdCurrency;
        return true;
      } else {
        return false;
      }
    }
  }

  /**set item warhouse values */
  setWarehouse(dataItem) {
    if (dataItem.IdWarehouseNavigation) {
      this.formGroup.value[DocumentConstant.ID_WARE_HOUSE] = dataItem.IdWarehouseNavigation.Id;
      this.formGroup.value[DocumentConstant.WAREHOUSE_NAME] = dataItem.IdWarehouseNavigation.WarehouseName;
    }
  }
}
