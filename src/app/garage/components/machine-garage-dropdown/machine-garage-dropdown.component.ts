import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { PredicateFormat } from '../../../shared/utils/predicate';
import { MachineService } from '../../services/machine/machine.service';
const ID_MACHINE = 'IdMachine';
@Component({
  selector: 'app-machine-garage-dropdown',
  templateUrl: './machine-garage-dropdown.component.html',
  styleUrls: ['./machine-garage-dropdown.component.scss']
})
export class MachineGarageDropdownComponent implements OnInit {
  @Input() machineSelected;
  @Input() idGarage;
  @Input() form: FormGroup;
  @Input() fieldName: string;
  @Output() Selected = new EventEmitter<any>();

  predicate: PredicateFormat;
  machinesDataSource: any[];
  machinesFilterDataSource: any[];
  public selectedValue: any;

  constructor(public machineService: MachineService) { }
  ngOnInit() {
    if (!this.fieldName) {
      this.fieldName = ID_MACHINE;
    }
    this.initGridDataSource();
  }
  initGridDataSource() {
    this.predicate = new PredicateFormat();
    if (!this.machineSelected) {
      this.machineService.readDropdownPredicateData(this.predicate).subscribe(data => {
        this.machinesDataSource = data;
        this.machinesFilterDataSource = this.machinesDataSource.slice(0);
      });
    } else {
      this.machineService.readDropdownDataWithNotAffectedMachine(this.machineSelected, this.idGarage,
        this.form.controls[this.fieldName].value).subscribe(data => {
        this.machinesDataSource = data.listData;
        this.machinesFilterDataSource = this.machinesDataSource.slice(0);
      });
    }
  }
  handleFilter(value) {
    this.machinesFilterDataSource = this.machinesDataSource.filter((s) => s.Name.toLowerCase().indexOf(value.toLowerCase()) !== -1);
  }
  onSelectMachine($event) {
    this.selectedValue = this.machinesFilterDataSource.find(x => x.Id === $event);
    this.Selected.emit(this.selectedValue);
  }

}
