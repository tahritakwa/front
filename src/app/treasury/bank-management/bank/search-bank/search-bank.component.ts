import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { PredicateFormat, Filter, Operation } from '../../../../shared/utils/predicate';
import { TreasuryConstant } from '../../../../constant/treasury/treasury.constant';

@Component({
  selector: 'app-search-bank',
  templateUrl: './search-bank.component.html',
  styleUrls: ['./search-bank.component.scss']
})
export class SearchBankComponent implements OnInit {
  bank: string;

  predicate: PredicateFormat;

  // the sender of the data to the parent
  @Output() sendData = new EventEmitter<any>();
  constructor() { }

  ngOnInit() {
  }
  public filter() {
    this.predicate = new PredicateFormat();
    this.predicate.Filter = new Array<Filter>();
    this.predicate.Filter.push(new Filter(TreasuryConstant.NAME, Operation.contains, this.bank, false, true));
    this.predicate.Filter.push(new Filter(TreasuryConstant.EMAIL, Operation.contains, this.bank, false, true));
    this.predicate.Filter.push(new Filter(TreasuryConstant.PHONE, Operation.contains, this.bank, false, true));
    this.predicate.Filter.push(new Filter(TreasuryConstant.ADDRESS, Operation.contains, this.bank, false, true));

    this.sendData.emit({'predicate': this.predicate});
  }
}
