import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { EnumValues } from 'enum-values';
import { TransfertFundTypeEnum } from '../../../models/enumerators/cash-managment-hierarchy-test-data.enum';

@Component({
  selector: 'app-transfert-fund-type-dropdown',
  templateUrl: './transfert-fund-type-dropdown.component.html',
  styleUrls: ['./transfert-fund-type-dropdown.component.scss']
})
export class TransfertFundTypeDropdownComponent implements OnInit {

  @Input() group: FormGroup;
  @Output() fundTransfertSelected: EventEmitter<number> = new EventEmitter<number>();
  transfertFundTypeDataSource: any[];
  transfertFundTypeFiltredDataSource: any[];
  constructor() { }

  ngOnInit() {
    this.transfertFundTypeDataSource = EnumValues.getNamesAndValues(TransfertFundTypeEnum);
    this.transfertFundTypeFiltredDataSource = this.transfertFundTypeDataSource;
  }

  handleFilter($event) {

  }

  onSelect($event) {
    this.fundTransfertSelected.emit($event);
  }
}
