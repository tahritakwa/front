import { Component, OnInit, Input, EventEmitter, Output, ViewChild } from '@angular/core';
import { EnumValues } from 'enum-values';
import { FormGroup } from '@angular/forms';
import { InterventionOrderStateEnumerator } from '../../../models/enumerators/intervention-order-state.enum';
import { ComboBoxComponent } from '@progress/kendo-angular-dropdowns';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-intervention-state-dropdown',
  templateUrl: './intervention-state-dropdown.component.html',
  styleUrls: ['./intervention-state-dropdown.component.scss']
})
export class InterventionStateDropdownComponent implements OnInit {

  @ViewChild(ComboBoxComponent) public interventionOrderStateComboBox: ComboBoxComponent;
  @Input() group: FormGroup;
  @Output() valueSelected: EventEmitter<any> = new EventEmitter<any>();
  interventionStateDataSource: any[] = EnumValues.getNamesAndValues(InterventionOrderStateEnumerator);
  interventionStateFilterDataSource: any[];
  constructor(private translateService: TranslateService) { }

  ngOnInit() {
    this.initGridDataSource();
  }

  initGridDataSource() {
    this.interventionStateDataSource.forEach((element) => {
      element.name = this.translateService.instant(String(element.name).toUpperCase());
    });
    this.interventionStateFilterDataSource = this.interventionStateDataSource.slice(0);
  }

  handleFilter(value) {
    this.interventionStateFilterDataSource = this.interventionStateDataSource.filter((s) =>
      s.name.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }

  onValueChanged($event) {
    const selectedValue = this.interventionStateDataSource.find(x => x.value === $event);
    this.valueSelected.emit(selectedValue);
  }

  public resetInterventionOrderStateComboBox(){
    this.interventionOrderStateComboBox.reset();
    this.interventionStateFilterDataSource = this.interventionStateDataSource.slice(0);
  }
}
