import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms'; 
import { VehicleEnergy } from '../../../models/garage/vehicle-energy.model';
import { PredicateFormat } from '../../../shared/utils/predicate'; 
import { VehicleEnergyService } from '../../services/vehicle-energy/vehicle-energy.service';

@Component({
  selector: 'app-energy-dropdown',
  templateUrl: './energy-dropdown.component.html',
  styleUrls: ['./energy-dropdown.component.scss']
})
export class EnergyDropdownComponent implements OnInit {
  @Input() form: FormGroup;
  @Output() selectedValue: EventEmitter<VehicleEnergy> = new EventEmitter<VehicleEnergy>();
  energyDataSource: VehicleEnergy[];
  energyFiltredDataSource: VehicleEnergy[];
  constructor(private energyService: VehicleEnergyService) { }

  ngOnInit() {
    this.initGridDataSource();
  }

  initGridDataSource() {
    this.energyService.readDropdownPredicateData(new PredicateFormat()).subscribe((data: any) => {
      this.energyDataSource = data;
      this.energyFiltredDataSource = this.energyDataSource.slice(0);
    });
  }

  handleFilter($event) {
    this.energyFiltredDataSource = this.energyDataSource.filter(x => x.Name.toLowerCase().includes($event.toLowerCase()));
  }

  onSelect($event) {
    const selectedEnergy: VehicleEnergy = this.energyDataSource.find(x => x.Id === $event);
    this.selectedValue.emit(selectedEnergy);
  }
}
