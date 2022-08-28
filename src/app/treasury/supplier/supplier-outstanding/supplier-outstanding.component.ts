import { Component, OnInit } from '@angular/core';
import { TiersTypeEnumerator } from '../../../models/enumerators/tiers-type.enum';

@Component({
  selector: 'app-supplier-outstanding',
  templateUrl: './supplier-outstanding.component.html',
  styleUrls: ['./supplier-outstanding.component.scss']
})
export class SupplierOutstandingComponent implements OnInit {
  tiersTypeEnum = TiersTypeEnumerator;
  constructor() { }

  ngOnInit() {
  }

}
