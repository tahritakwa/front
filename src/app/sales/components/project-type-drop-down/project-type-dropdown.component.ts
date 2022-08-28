import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ComboBoxComponent } from '@progress/kendo-angular-dropdowns';
import { EnumValues } from 'enum-values';
import { ProjectType } from '../../../models/enumerators/project-type.enum';

@Component({
  selector: 'app-project-type-dropdown',
  templateUrl: './project-type-dropdown.component.html',
  styleUrls: ['./project-type-dropdown.component.scss']
})
export class ProjectTypeDropdownComponent implements OnInit {
  @Input() group;
  @Input() allowCustom;
  @Output() Selected = new EventEmitter<any>();
  @ViewChild(ComboBoxComponent) public project: ComboBoxComponent;
  public projectTypeDataSource: any;
  public name;

  constructor(public translate: TranslateService) {
  }

  ngOnInit() {
    this.initDataSource();
  }
  initDataSource(): void {
    this.projectTypeDataSource = EnumValues.getNamesAndValues(ProjectType);
  }
  handleFilter(value: string): void {
    throw new Error('Method not implemented.');
  }
  addNew(): void {
    throw new Error('Method not implemented.');
  }
  onSelect($event) {
    this.Selected.emit($event);
  }
}
