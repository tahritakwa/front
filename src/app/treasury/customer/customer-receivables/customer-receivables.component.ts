import { Component, OnInit, Input } from '@angular/core';
import { TiersTypeEnumerator } from '../../../models/enumerators/tiers-type.enum';

@Component({
  selector: 'app-customer-receivables',
  templateUrl: './customer-receivables.component.html',
  styleUrls: ['./customer-receivables.component.scss']
})
export class CustomerReceivablesComponent implements OnInit {
  tiersTypeEnum = TiersTypeEnumerator;
  constructor() { }

  ngOnInit() {
  }
}
