import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { PredicateFormat, Filter, Operation } from '../../../shared/utils/predicate';
import { PeriodConstant } from '../../../constant/Administration/period.constant';

@Component({
  selector: 'app-search-periode',
  templateUrl: './search-periode.component.html',
  styleUrls: ['./search-periode.component.scss']
})
export class SearchPeriodeComponent implements OnInit {
  periode: string;

  predicate: PredicateFormat;

  // the sender of the data to the parent
  @Output() sendData = new EventEmitter<any>();
  constructor() { }

  ngOnInit() {
  }
  public filter() {
    this.predicate = new PredicateFormat();
    this.predicate.Filter = new Array<Filter>();
    this.predicate.Filter.push(new Filter(PeriodConstant.LABEL, Operation.contains, this.periode, false, true));
    this.sendData.emit({'predicate': this.predicate});
  }
}
