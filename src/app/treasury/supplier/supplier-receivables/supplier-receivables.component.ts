import { Component, OnInit } from '@angular/core';
import { TiersTypeEnumerator } from '../../../models/enumerators/tiers-type.enum';

@Component({
  selector: 'app-supplier-receivables',
  templateUrl: './supplier-receivables.component.html',
  styleUrls: ['./supplier-receivables.component.scss']
})
export class SupplierReceivablesComponent implements OnInit {
  tiersTypeEnum = TiersTypeEnumerator;
  constructor() { }

  ngOnInit() {
  }

}
