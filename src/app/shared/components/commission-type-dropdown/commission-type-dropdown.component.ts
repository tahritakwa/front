import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { EnumValues } from 'enum-values';
import { CommissionType } from '../../../models/enumerators/commission-type.enum';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-commission-type-dropdown',
  templateUrl: './commission-type-dropdown.component.html',
  styleUrls: ['./commission-type-dropdown.component.scss']
})
export class CommissionTypeDropdownComponent implements OnInit {

  @Input() group;
  @Input() allowCustom;
  @Output() commissionTypeChange = new EventEmitter<number>();
  public commissionTypeDataSource: any;
  public commissionTypeFilterDataSource: any;
  CommissionTypeEnumValues = EnumValues.getNamesAndValues(CommissionType);
  constructor(private translate: TranslateService) { }

  ngOnInit() {
    this.initDataSource();
  }

  initDataSource(): void {
    this.commissionTypeDataSource = [];
    this.CommissionTypeEnumValues.forEach(element => {
      const elem = element;
      elem.name = this.translate.instant(elem.name.toUpperCase());
      this.commissionTypeDataSource.push(elem);
    });
  }

  public onValueChanged(event): void {
    this.commissionTypeChange.emit(event);
  }
}
