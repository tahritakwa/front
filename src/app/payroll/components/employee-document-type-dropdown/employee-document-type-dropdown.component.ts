import { Component, OnInit, Input } from '@angular/core';
import { EnumValues } from 'enum-values';
import { EmployeeDocumentType } from '../../../models/enumerators/employee-document-type.enum';

@Component({
  selector: 'app-employee-document-type-dropdown',
  templateUrl: './employee-document-type-dropdown.component.html',
  styleUrls: ['./employee-document-type-dropdown.component.scss']
})
export class EmployeeDocumentTypeDropdownComponent implements OnInit {
  @Input() group;
  @Input() allowCustom;
  public employeeDocumentTypeDataSource: any;
  constructor() { }

  ngOnInit() {
    this.initDataSource();
  }
  /**
   * initialize employeeDocumentType DataSource
   * */
  initDataSource(): void {
    this.employeeDocumentTypeDataSource = EnumValues.getNamesAndValues(EmployeeDocumentType).sort((a,b)=>
    a.name.toUpperCase().localeCompare(b.name.toUpperCase())); 
  }

}
