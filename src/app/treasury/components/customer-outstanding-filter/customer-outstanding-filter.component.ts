import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { PredicateFormat, Operator, Filter, Operation } from '../../../shared/utils/predicate';
import { TreasuryConstant } from '../../../constant/treasury/treasury.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-customer-outstanding-filter',
  templateUrl: './customer-outstanding-filter.component.html',
  styleUrls: ['./customer-outstanding-filter.component.scss']
})
export class CustomerOutstandingFilterComponent implements OnInit {

  @Output() filterValue = new EventEmitter<any>();
  customerOutstandingFilterFormGroup: FormGroup;
  formatDate: string = this.translate.instant(SharedConstant.DATE_FORMAT);

  constructor(private fb: FormBuilder, private translate: TranslateService) { }

  ngOnInit() {
    this.createFilterFormGroup();
  }

  createFilterFormGroup() {
    this.customerOutstandingFilterFormGroup = this.fb.group({
      IdTiers: [],
      OutstandingDocumentType: []
    });
  }

  public preparePredicate(): PredicateFormat {
    const predicate = new PredicateFormat();
    predicate.Operator = Operator.and;
    predicate.Filter = new Array<Filter>();
    if (this.IdTiers.value > NumberConstant.ZERO) {
      predicate.Filter.push(new Filter(TreasuryConstant.ID_TIERS, Operation.eq, this.IdTiers.value));
    }
    if (this.OutstandingDocumentType.value > NumberConstant.ZERO) {
      predicate.Filter.push(new Filter(TreasuryConstant.OUT_STANDING_DOCUMENT_TYPE, Operation.eq, this.OutstandingDocumentType.value));
    }
    return predicate;
  }

  onSearch() {
    this.filterValue.emit(this.preparePredicate());
  }

  get IdTiers(): FormControl {
    return this.customerOutstandingFilterFormGroup.get(TreasuryConstant.ID_TIERS) as FormControl;
  }

  get OutstandingDocumentType(): FormControl {
    return this.customerOutstandingFilterFormGroup.get(TreasuryConstant.OUT_STANDING_DOCUMENT_TYPE) as FormControl;
  }
}
