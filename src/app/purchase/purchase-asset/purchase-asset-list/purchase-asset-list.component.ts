import { Component, OnInit } from '@angular/core';
import { DocumentEnumerator } from '../../../models/enumerators/document.enum';
import { DocumentConstant } from '../../../constant/sales/document.constant';

@Component({
  selector: 'app-purchase-asset-list',
  templateUrl: './purchase-asset-list.component.html',
  styleUrls: ['./purchase-asset-list.component.scss']
})
export class PurchaseAssetListComponent implements OnInit {
  documentType = DocumentEnumerator.PurchaseAsset;
  advencedAddLink = DocumentConstant.PURCHASE_ASSET_ADD;
  translateFilterName = DocumentConstant.ALL_ASSETS;
  constructor() { }

  ngOnInit() {
  }

}
