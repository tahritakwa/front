import { Component, OnInit } from '@angular/core';
import { TiersTypeEnumerator } from '../../../../models/enumerators/tiers-type.enum';

@Component({
  selector: 'app-customer-outstanding-document',
  templateUrl: './customer-outstanding-document.component.html',
  styleUrls: ['./customer-outstanding-document.component.scss']
})
export class CustomerOutstandingDocumentComponent implements OnInit {

  tiersTypeEnum = TiersTypeEnumerator;
  constructor() { }

  ngOnInit() {
  }

}
