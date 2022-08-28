import { Component, OnInit } from '@angular/core';
import { DocumentEnumerator } from '../../../models/enumerators/document.enum';
import { DocumentConstant } from '../../../constant/sales/document.constant';

@Component({
  selector: 'app-asset-list',
  templateUrl: './asset-list.component.html',
  styleUrls: ['./asset-list.component.scss']
})
export class AssetListComponent implements OnInit {
  documentType = DocumentEnumerator.SalesAsset;
  advencedAddLink = DocumentConstant.SALES_ASSET_ADD;
  translateFilterName = DocumentConstant.ALL_ASSETS;
  constructor() { }

  ngOnInit() {
  }

}
