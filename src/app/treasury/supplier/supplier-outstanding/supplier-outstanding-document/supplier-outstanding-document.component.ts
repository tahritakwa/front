import { Component, OnInit } from '@angular/core';
import { TiersTypeEnumerator } from '../../../../models/enumerators/tiers-type.enum';

@Component({
  selector: 'app-supplier-outstanding-document',
  templateUrl: './supplier-outstanding-document.component.html',
  styleUrls: ['./supplier-outstanding-document.component.scss']
})
export class SupplierOutstandingDocumentComponent implements OnInit {

  tiersTypeEnum = TiersTypeEnumerator;
  constructor() { }

  ngOnInit() {
  }

}
