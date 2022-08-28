import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { EnumValues } from 'enum-values';
import { OperationValidateByEnumerator } from '../../../models/enumerators/operation-validate-by.enum';

@Component({
  selector: 'app-operation-validate-by-dropdown',
  templateUrl: './operation-validate-by-dropdown.component.html',
  styleUrls: ['./operation-validate-by-dropdown.component.scss']
})
export class OperationValidateByDropdownComponent implements OnInit {


  @Input() group: FormGroup;
  @Output() valueSelected: EventEmitter<any> = new EventEmitter<any>();
  operationValidateByDataSource: any[] = EnumValues.getNamesAndValues(OperationValidateByEnumerator);
  operationValidateByFilterDataSource: any[];
  constructor(private translateService: TranslateService) { }

  ngOnInit() {
    this.initGridDataSource();
  }

  initGridDataSource() {
    this.operationValidateByDataSource.forEach((element) => {
      element.name = this.translateService.instant(String(element.name).toUpperCase());
    });
    this.operationValidateByFilterDataSource = this.operationValidateByDataSource.slice(0);
  }

  handleFilter(value) {
    this.operationValidateByFilterDataSource = this.operationValidateByDataSource.filter((s) =>
      s.name.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }

  onValueChanged($event) {
    const selectedValue = this.operationValidateByDataSource.find(x => x.value === $event);
    this.valueSelected.emit(selectedValue);
  }

}
