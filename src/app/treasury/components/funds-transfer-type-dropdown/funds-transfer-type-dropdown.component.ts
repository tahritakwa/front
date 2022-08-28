import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ComboBoxComponent } from '@progress/kendo-angular-dropdowns';
import { EnumValues } from 'enum-values';
import { FundsTransferTypeEnum } from '../../../models/treasury/funds-transfer-type';

@Component({
  selector: 'app-funds-transfer-type-dropdown',
  templateUrl: './funds-transfer-type-dropdown.component.html',
  styleUrls: ['./funds-transfer-type-dropdown.component.scss']
})
export class FundsTransferTypeDropdownComponent implements OnInit {
  @Input() group: FormGroup;
  @Output() sendType: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild(ComboBoxComponent) public transferType: ComboBoxComponent;
  transferTypeDataSource: any[];
  transferTypeFiltredDataSource: any[];

  constructor(private translate: TranslateService) { }

  ngOnInit() {
    this.transferTypeDataSource = EnumValues.getNamesAndValues(FundsTransferTypeEnum);
    this.transferTypeDataSource.forEach(x => {
      x.name = x.name.toUpperCase();
      this.translate.get(x.name.toUpperCase()).subscribe(trans => x.name = trans);
    });
    this.transferTypeFiltredDataSource = this.transferTypeDataSource;
  }

  onSelect($event) {
    this.sendType.emit($event);
  }

  handleFilter($event) {
    this.transferTypeFiltredDataSource = this.transferTypeDataSource.filter(x =>
      x.name.toLowerCase().includes($event.toLowerCase()));
  }
}
