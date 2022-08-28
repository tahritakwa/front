import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { PredicateFormat, Filter, Operation } from '../../shared/utils/predicate';
import { SharedConstant } from '../../constant/shared/shared.constant';

@Component({
  selector: 'app-search-brand',
  templateUrl: './search-brand.component.html',
  styleUrls: ['./search-brand.component.scss']
})
export class SearchBrandComponent implements OnInit {
  brand: string;

  predicate: PredicateFormat;

  // the sender of the data to the parent
  @Output() sendData = new EventEmitter<any>();
  constructor() { }

  ngOnInit() {
    
  }
  public filter() {
    this.predicate = new PredicateFormat();
    this.predicate.Filter = new Array<Filter>();
    this.predicate.Filter.push(new Filter(SharedConstant.LABEL, Operation.contains, this.brand, false, true));
    this.predicate.Filter.push(new Filter(SharedConstant.CODE, Operation.contains, this.brand, false, true));
    this.sendData.emit({'predicate': this.predicate});
  }
}
