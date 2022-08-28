import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { EnumValues } from 'enum-values';
import { TypeUnitEnumerator } from '../../../models/enumerators/type-unit.enum';
const ALL_TYPES = 'ALL_TYPES';

@Component({
  selector: 'app-unit-type-dropdown',
  templateUrl: './unit-type-dropdown.component.html',
  styleUrls: ['./unit-type-dropdown.component.scss']
})
export class UnitTypeDropdownComponent implements OnInit {
  @Input() group: FormGroup;
  @Input() addAllState;
  @Input() disabled;
  @Output() Selected: EventEmitter<any> = new EventEmitter<any>();
  typeUnitDataSource: any[] = EnumValues.getNamesAndValues(TypeUnitEnumerator);
  typeUnitFilterDataSource: any[];


  constructor(private translate: TranslateService) { }

  ngOnInit() {
    this.initGridDataSource();
  }

  initGridDataSource() {
    this.typeUnitFilterDataSource = [];
    this.typeUnitDataSource.forEach(elem => {
      elem.name = elem.name.toUpperCase();
      this.translate.get(elem.name.toUpperCase()).subscribe(trans => elem.name = trans);
      this.typeUnitFilterDataSource.push(elem);
    });

    if (this.addAllState) {
      this.translate.get(ALL_TYPES).subscribe(trans => {
        const newElementId = this.typeUnitDataSource.length + 1;
        this.typeUnitDataSource.push({ name: trans, value: newElementId });
        this.typeUnitFilterDataSource.push({ name: trans, value: newElementId });
      }
      );
    }

  }

  handleFilter($event) {
    this.typeUnitFilterDataSource = this.typeUnitDataSource.filter((s) =>
      s.name.toLowerCase().indexOf($event.toLowerCase()) !== -1
    );
  }

  onValueChanged($event) {
    this.Selected.emit($event);
  }
}
