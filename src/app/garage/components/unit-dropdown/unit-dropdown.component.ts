import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Unit } from '../../../models/garage/unit.model';
import { PredicateFormat } from '../../../shared/utils/predicate';
import { UnitService } from '../../services/unit/unit.service';

@Component({
  selector: 'app-unit-dropdown',
  templateUrl: './unit-dropdown.component.html',
  styleUrls: ['./unit-dropdown.component.scss']
})
export class UnitDropdownComponent implements OnInit {

  @Input() form: FormGroup;
  @Input() disabled;

  @Output() selectedValue: EventEmitter<Unit> = new EventEmitter<Unit>();
  unitDataSource: Unit[];
  unitFiltredDataSource: Unit[];
  constructor(private unitService: UnitService) { }

  ngOnInit() {
    this.initGridDataSource();
  }

  initGridDataSource() {
    this.unitService.readDropdownPredicateData(new PredicateFormat()).subscribe((data: any) => {
      this.unitDataSource = data;
      this.unitFiltredDataSource = this.unitDataSource.slice(0);
    });
  }

  handleFilter($event) {
    this.unitFiltredDataSource = this.unitDataSource.filter(x => x.Name.toLowerCase().includes($event.toLowerCase()));
  }

  onSelect($event) {
    const selectedUnit: Unit = this.unitDataSource.find(x => x.Id === $event);
    this.selectedValue.emit(selectedUnit);
  }
}
