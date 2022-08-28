import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { EnumValues } from 'enum-values';
import { OperationStatusEnumerator } from '../../../models/enumerators/operation-status.enum';

@Component({
  selector: 'app-operation-status-dropdown',
  templateUrl: './operation-status-dropdown.component.html',
  styleUrls: ['./operation-status-dropdown.component.scss']
})
export class OperationStatusDropdownComponent implements OnInit {

  @Input() group: FormGroup;
  @Output() valueSelected: EventEmitter<any> = new EventEmitter<any>();
  operationStatusDataSource: any[] = EnumValues.getNamesAndValues(OperationStatusEnumerator);
  operationStatusFilterDataSource: any[];
  constructor(private translateService: TranslateService) { }

  ngOnInit() {
    this.initGridDataSource();
  }

  initGridDataSource() {
    this.operationStatusDataSource.forEach((element) => {
      element.name = this.translateService.instant(String(element.name).toUpperCase());
    });
    this.operationStatusFilterDataSource = this.operationStatusDataSource.slice(0);
  }

  handleFilter(value) {
    this.operationStatusFilterDataSource = this.operationStatusDataSource.filter((s) =>
      s.name.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }

  onValueChanged($event) {
    const selectedValue = this.operationStatusDataSource.find(x => x.value === $event);
    this.valueSelected.emit(selectedValue);
  }

}
