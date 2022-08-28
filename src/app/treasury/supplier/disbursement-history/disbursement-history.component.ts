import { Component, OnInit } from '@angular/core';
import { TiersTypeEnumerator } from '../../../models/enumerators/tiers-type.enum';

@Component({
  selector: 'app-disbursement-history',
  templateUrl: './disbursement-history.component.html',
  styleUrls: ['./disbursement-history.component.scss']
})
export class DisbursementHistoryComponent implements OnInit {
  tiersTypeEnum = TiersTypeEnumerator;
  constructor() { }

  ngOnInit() {
  }

}
