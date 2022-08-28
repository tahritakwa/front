import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DataSourceRequestState } from '@progress/kendo-data-query';
import { GarageConstant } from '../../../constant/garage/garage.constant';
import { ReducedOperation } from '../../../models/garage/reduced-operation.model';
import { DropDownFooterComponent } from '../../../shared/components/drop-down-footer/drop-down-footer.component';
import { Filter, Operation, PredicateFormat, Relation } from '../../../shared/utils/predicate';
import { OperationService } from '../../services/operation/operation.service';
const ID_OPERATION = 'IdOperation';
@Component({
  selector: 'app-operation-dropdown',
  templateUrl: './operation-dropdown.component.html',
  styleUrls: ['./operation-dropdown.component.scss']
})
export class OperationDropdownComponent implements OnInit {

  @Input() group: FormGroup;
  @Input() fieldName: string;
  @Input() operationListIdsToIgnore: number[];

  // Selection properties
  @Output() Selected = new EventEmitter<any>();

  public selectedValue: ReducedOperation;

  // Paging properties
  @ViewChild(DropDownFooterComponent) dropDownFooterComponent: DropDownFooterComponent;
  total = 0;

  operationDataSource: ReducedOperation[];
  predicate: PredicateFormat;

  public gridState: DataSourceRequestState = {
    skip: 0,
    take: 10,

    // Initial filter descriptor
    filter: {
      logic: 'and',
      filters: []
    }
  };

  constructor(public operationService: OperationService) {
  }

  ngOnInit() {
    if (!this.fieldName) {
      this.fieldName = ID_OPERATION;
    }
    this.preparePredicate();
    this.intiGridDataSource();
  }

  intiGridDataSource() {
    this.operationService.reloadServerSideData(this.gridState, this.predicate).subscribe(data => {
      this.operationDataSource = data.data;
      this.total =  data.total;
      if (this.dropDownFooterComponent) {
        this.dropDownFooterComponent.initPagerData(this.total);
      }
    });
  }

  preparePredicate() {
    this.predicate = new PredicateFormat();
    this.predicate.Relation = new Array<Relation>();
    this.predicate.Relation.push.apply(this.predicate.Relation, [new Relation(GarageConstant.ID_OPERATION_TYPE_NAVIGATION)]);
    this.predicate.Filter = new Array<Filter>();
    if (this.operationListIdsToIgnore && this.operationListIdsToIgnore.length > 0) {
      this.operationListIdsToIgnore.forEach((x) => {
        this.predicate.Filter.push(new Filter(GarageConstant.ID_UPPER_CASE, Operation.neq, x));
      });
    }
  }

  handleFilter(value) {
    // initialize state
    this.gridState.skip = 0;
    this.preparePredicate();
    this.predicate.Filter.push(new Filter(GarageConstant.CODE, Operation.contains, value, false, true));
    this.predicate.Filter.push(new Filter(GarageConstant.NAME, Operation.contains, value, false, true));
    this.intiGridDataSource();
  }

  onSelectOperation($event) {
    this.selectedValue = this.operationDataSource.find(x => x.Id === $event);
    this.Selected.emit(this.selectedValue);
  }

  nextPage(sender): void {
    this.gridState.skip = ((sender.target.tabIndex) - 1) * this.gridState.take;
    this.intiGridDataSource();
  }

  Pager(step): void {
    const pageNumber = Math.floor(this.gridState.skip / this.gridState.take);
    const pageNumberFrom = Math.floor(pageNumber / 10) * 10;
    this.gridState.skip = (pageNumberFrom + (step * 10)) * this.gridState.take;
    this.intiGridDataSource();
  }

}
