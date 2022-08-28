import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ComboBoxComponent } from '@progress/kendo-angular-dropdowns';
import { EnumValues } from 'enum-values';
import { FundsTransferStateEnum } from '../../../models/treasury/funds-transfer-state';

@Component({
  selector: 'app-funds-transfer-state-dropdown',
  templateUrl: './funds-transfer-state-dropdown.component.html',
  styleUrls: ['./funds-transfer-state-dropdown.component.scss']
})
export class FundsTransferStateDropdownComponent implements OnInit {

  @Input() group: FormGroup;
  @Output() valueSelected: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild(ComboBoxComponent) public status: ComboBoxComponent;
  transferStateDataSource: any[] = EnumValues.getNamesAndValues(FundsTransferStateEnum);
  transferStateFilterDataSource: any[];
  constructor(private translateService: TranslateService) { }

  ngOnInit() {
    this.initGridDataSource();
  }

  initGridDataSource() {
    this.transferStateDataSource.forEach((element) => {
      element.name = element.name.toUpperCase();
      this.translateService.get(element.name.toUpperCase()).subscribe(trans => element.name = trans);
    });
    this.transferStateFilterDataSource = this.transferStateDataSource;
  }

  handleFilter(value) {
    this.transferStateFilterDataSource = this.transferStateDataSource.filter((s) =>
      s.name.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }

  onValueChanged($event) {
    this.valueSelected.emit($event);
  }

}
