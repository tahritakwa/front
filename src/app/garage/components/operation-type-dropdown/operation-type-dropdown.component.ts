import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { GarageConstant } from '../../../constant/garage/garage.constant';
import { OperationType } from '../../../models/garage/operation-type.model';
import { PredicateFormat, Relation } from '../../../shared/utils/predicate';
import { OperationTypeService } from '../../services/operation-type/operation-type.service';

@Component({
  selector: 'app-operation-type-dropdown',
  templateUrl: './operation-type-dropdown.component.html',
  styleUrls: ['./operation-type-dropdown.component.scss']
})
export class OperationTypeDropdownComponent implements OnInit {

  @Input() form: FormGroup;
  @Output() selectedValue: EventEmitter<OperationType> = new EventEmitter<OperationType>();
  operationTypeDataSource: OperationType[];
  operationTypeFiltredDataSource: OperationType[];
  predicate: PredicateFormat;
  constructor(private operationTypeService: OperationTypeService) { }

  ngOnInit() {
    this.initGridDataSource();
  }

  initGridDataSource() {
    this.predicate = new PredicateFormat();
    this.predicate.Relation = new Array<Relation>();
    this.predicate.Relation.push.apply(this.predicate.Relation,
      [new Relation(GarageConstant.ID_UNIT_NAVIGATION)]);
    this.operationTypeService.readDropdownPredicateData(this.predicate).subscribe((data: any) => {
      this.operationTypeDataSource = data;
      this.operationTypeFiltredDataSource = this.operationTypeDataSource.slice(0);
    });
  }

  handleFilter($event) {
    this.operationTypeFiltredDataSource = this.operationTypeDataSource.filter(x => x.Name.toLowerCase().includes($event.toLowerCase()));
  }

  onSelect($event) {
    const selectedOperationType: OperationType = this.operationTypeDataSource.find(x => x.Id === $event);
    this.selectedValue.emit(selectedOperationType);
  }
}
