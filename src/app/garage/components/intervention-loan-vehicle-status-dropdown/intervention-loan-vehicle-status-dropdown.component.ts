import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ComboBoxComponent } from '@progress/kendo-angular-dropdowns';
import { EnumValues } from 'enum-values';
import { InterventionLoanVehicleStatusEnumerator } from '../../../models/enumerators/intervention-loan-vehicle-status-.enum';
const STATUS = 'Status';
@Component({
  selector: 'app-intervention-loan-vehicle-status-dropdown',
  templateUrl: './intervention-loan-vehicle-status-dropdown.component.html',
  styleUrls: ['./intervention-loan-vehicle-status-dropdown.component.scss']
})
export class InterventionLoanVehicleStatusDropdownComponent implements OnInit {

  @ViewChild(ComboBoxComponent) public interventionLoanVehicleStatusComboBox: ComboBoxComponent;
  @Input() group: FormGroup;
  @Input() fieldName: string;
  @Output() valueSelected: EventEmitter<any> = new EventEmitter<any>();
  interventionLoanVehicleStatusDataSource: any[] = EnumValues.getNamesAndValues(InterventionLoanVehicleStatusEnumerator);
  interventionLoanVehicleStatusFilterDataSource: any[];

  constructor(private translateService: TranslateService) { }

  ngOnInit() {
    if (!this.fieldName) {
      this.fieldName = STATUS;
    }
    this.initGridDataSource();
  }

  initGridDataSource() {
    this.interventionLoanVehicleStatusDataSource.forEach((element) => {
      element.name = this.translateService.instant(String(element.name).toUpperCase());
    });
    this.interventionLoanVehicleStatusFilterDataSource = this.interventionLoanVehicleStatusDataSource.slice(0);
  }

  handleFilter(value) {
    this.interventionLoanVehicleStatusFilterDataSource = this.interventionLoanVehicleStatusDataSource.filter((s) =>
      s.name.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }

  onValueChanged($event) {
    const selectedValue = this.interventionLoanVehicleStatusDataSource.find(x => x.value === $event);
    this.valueSelected.emit(selectedValue);
  }

  public resetLoanComboBox(){
    this.interventionLoanVehicleStatusComboBox.reset();
    this.interventionLoanVehicleStatusFilterDataSource = this.interventionLoanVehicleStatusDataSource.slice(0);
  }
}
