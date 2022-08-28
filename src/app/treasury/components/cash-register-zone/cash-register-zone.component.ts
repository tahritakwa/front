import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-cash-register-zone',
  templateUrl: './cash-register-zone.component.html',
  styleUrls: ['./cash-register-zone.component.scss']
})
export class CashRegisterZoneComponent implements OnInit {
  @Input() group: FormGroup;
  cashRegisterZoneDataSource: any[];
  cashRegisterZoneFiltredDataSource: any[];
  constructor() { }

  ngOnInit() {
  }

  handleFilter($event) {

  }

  onSelect($event) {

  }
}
