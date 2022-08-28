import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ComboBoxComponent } from '@progress/kendo-angular-dropdowns';
import { EnumValues } from 'enum-values';
import { RepairOrderStateEnumerator } from '../../../models/enumerators/repair-order-state.enum';

@Component({
  selector: 'app-repair-order-status-dropdown',
  templateUrl: './repair-order-status-dropdown.component.html',
  styleUrls: ['./repair-order-status-dropdown.component.scss']
})
export class RepairOrderStatusDropdownComponent implements OnInit {

  @ViewChild(ComboBoxComponent) public repairOrderStatusComboBox: ComboBoxComponent;
  @Input() group: FormGroup;
  @Output() valueSelected: EventEmitter<any> = new EventEmitter<any>();
  repaireOrderStateDataSource: any[] = EnumValues.getNamesAndValues(RepairOrderStateEnumerator);
  repairOrderStateFilterDataSource: any[];
  constructor(private translateService: TranslateService) { }

  ngOnInit() {
    this.initGridDataSource();
  }

  initGridDataSource() {
    this.repaireOrderStateDataSource.forEach((element) => {
      element.name = this.translateService.instant(String(element.name).toUpperCase());
    });
    this.repairOrderStateFilterDataSource = this.repaireOrderStateDataSource.slice(0);
  }

  handleFilter(value) {
    this.repairOrderStateFilterDataSource = this.repaireOrderStateDataSource.filter((s) =>
      s.name.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }

  onValueChanged($event) {
    const selectedValue = this.repaireOrderStateDataSource.find(x => x.value === $event);
    this.valueSelected.emit(selectedValue);
  }

  public resetRepairOrderStateComboBox() {
    this.repairOrderStatusComboBox.reset();
    this.repairOrderStateFilterDataSource = this.repaireOrderStateDataSource.slice(0);
  }
}
