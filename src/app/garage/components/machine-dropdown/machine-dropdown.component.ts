import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { GarageConstant } from '../../../constant/garage/garage.constant';

@Component({
  selector: 'app-machine-dropdown',
  templateUrl: './machine-dropdown.component.html',
  styleUrls: ['./machine-dropdown.component.scss']
})
export class MachineDropdownComponent implements OnInit {

  @Output() Selected = new EventEmitter<any>();
  @Input() form: FormGroup;
  @Input() selectedValue: any;
  machineDataSource: any[];

  constructor() {
    this.machineDataSource = JSON.parse(localStorage.getItem(GarageConstant.MACHINE_LIST));
  }

  ngOnInit() {
  }
  onSelectMachine($event) {
    this.Selected.emit($event);
  }

}
