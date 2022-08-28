import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { VehicleType } from '../../../models/garage/vehicle-type.model';
import { PredicateFormat } from '../../../shared/utils/predicate';
import { VehicleTypeService } from '../../services/vehicle-type/vehicle-type.service';

@Component({
  selector: 'app-vehicle-type-dropdown',
  templateUrl: './vehicle-type-dropdown.component.html',
  styleUrls: ['./vehicle-type-dropdown.component.scss']
})
export class VehicleTypeDropdownComponent implements OnInit {

  @Input() form: FormGroup;
  @Output() selectedValue: EventEmitter<VehicleType> = new EventEmitter<VehicleType>();
  vehicleTypeDataSource: VehicleType[];
  vehicleTypeFiltredDataSource: VehicleType[];
  constructor(private vehicleTypeService: VehicleTypeService) { }

  ngOnInit() {
    this.initGridDataSource();
  }

  initGridDataSource() {
    this.vehicleTypeService.readDropdownPredicateData(new PredicateFormat()).subscribe((data: any) => {
      this.vehicleTypeDataSource = data;
      this.vehicleTypeFiltredDataSource = this.vehicleTypeDataSource.slice(0);
    });
  }

  handleFilter($event) {
    this.vehicleTypeFiltredDataSource = this.vehicleTypeDataSource.filter(x => x.Name.toLowerCase().includes($event.toLowerCase()));
  }

  onSelect($event) {
    const selectedVehicleType: VehicleType = this.vehicleTypeDataSource.find(x => x.Id === $event);
    this.selectedValue.emit(selectedVehicleType);
  }
}
