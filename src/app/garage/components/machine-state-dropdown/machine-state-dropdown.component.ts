import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { EnumValues } from 'enum-values';
import { MachineStateEnumerator } from '../../../models/enumerators/machine-state-enum';
const ALL_STATES = 'ALL_STATES';

@Component({
  selector: 'app-machine-state-dropdown',
  templateUrl: './machine-state-dropdown.component.html',
  styleUrls: ['./machine-state-dropdown.component.scss']
})
export class MachineStateDropdownComponent implements OnInit {
  stateDataSource: any[] = [];
  @Output() Selected = new EventEmitter<number>();
  @Input() addAllState;
  @Input() form: FormGroup;
  constructor(public translate: TranslateService) { }

  ngOnInit() {
    this.initDataSource();
  }
  initDataSource(): void {
    const stateEnum = EnumValues.getNamesAndValues(MachineStateEnumerator);
    stateEnum.forEach(elem => {
      elem.name = elem.name.toUpperCase();
      this.translate.get(elem.name.toUpperCase()).subscribe(trans => elem.name = trans);
      this.stateDataSource.push(elem);
    });
    if (this.addAllState) {
      this.translate.get(ALL_STATES).subscribe(trans =>
        this.stateDataSource.push({name : trans, value : 3})
      );
    }
  }
  onSelect($event) {
    this.Selected.emit($event);
  }
}
