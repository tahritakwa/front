import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { OperationKit } from '../../../models/garage/operation-kit.model';
import { PredicateFormat } from '../../../shared/utils/predicate';
import { OperationKitService } from '../../services/operation-kit/operation-kit.service';
const ID_OPERATION_KIT = 'IdOperationKit';

@Component({
  selector: 'app-operation-kit-dropdown',
  templateUrl: './operation-kit-dropdown.component.html',
  styleUrls: ['./operation-kit-dropdown.component.scss']
})
export class OperationKitDropdownComponent implements OnInit {
  
  @Input() group: FormGroup;
  @Input() fieldName: string;
  @Output() Selected = new EventEmitter<any>();

  operationKitDataSource: OperationKit[];
  operationKitFilterDataSource: OperationKit[];
  constructor(private operationKitService: OperationKitService) { }
 
  ngOnInit() {
    if (!this.fieldName) {
      this.fieldName = ID_OPERATION_KIT;
    }
    this.intiGridDataSource();
  }

  intiGridDataSource() {
    this.operationKitService.readDropdownPredicateData(new PredicateFormat()).subscribe(data => {
      this.operationKitDataSource = data;
      this.operationKitFilterDataSource = this.operationKitDataSource.slice(0);
    });
  }

  handleFilter(value) {
    this.operationKitFilterDataSource = this.operationKitDataSource.filter((s) =>
      s.Name.toLowerCase().indexOf(value.toLowerCase()) !== -1);
  }

  onSelectValue($event) {
    const selectedValue = this.operationKitDataSource.find(x => x.Id === $event);
    this.Selected.emit(selectedValue);
  }

}
