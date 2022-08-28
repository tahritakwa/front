import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms'; 
import { VehicleEnergyService } from '../../services/vehicle-energy/vehicle-energy.service';
import { PredicateFormat } from '../../../shared/utils/predicate'; 
import { VehicleEnergy } from '../../../models/sales/vehicle-energy.model';

@Component({
  selector: 'app-energy-combo-box',
  templateUrl: './energy-combo-box.component.html',
  styleUrls: ['./energy-combo-box.component.scss']
})
export class EnergyComboBoxComponent implements OnInit {
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
