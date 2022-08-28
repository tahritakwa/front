import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ComboBoxComponent } from '@progress/kendo-angular-dropdowns';
import { VehicleModel } from '../../../models/garage/vehicle-model.model';
import { PredicateFormat } from '../../../shared/utils/predicate';
import { VehicleModelService } from '../../services/vehicle-model/vehicle-model.service';

@Component({
  selector: 'app-vehicle-model-dropdown',
  templateUrl: './vehicle-model-dropdown.component.html',
  styleUrls: ['./vehicle-model-dropdown.component.scss']
})
export class VehicleModelDropdownComponent implements OnInit {

  @ViewChild(ComboBoxComponent) public vehicleModeComboBOx: ComboBoxComponent;
  @Input() form: FormGroup;
  @Output() selectedValue: EventEmitter<VehicleModel> = new EventEmitter<VehicleModel>();
  vehicleModelDataSource: VehicleModel[];
  vehicleModelFiltredDataSource: VehicleModel[];
  constructor(private vehicleModelService: VehicleModelService) { }

  ngOnInit() {
    this.initGridDataSource();
  }

  initGridDataSource() {
    this.vehicleModelService.readDropdownPredicateData(new PredicateFormat()).subscribe((data: any) => {
      this.vehicleModelDataSource = data;
      this.vehicleModelFiltredDataSource = this.vehicleModelDataSource.slice(0);
    });
  }

  handleFilter($event) {
    this.vehicleModelFiltredDataSource = this.vehicleModelDataSource.filter(x => x.Designation.toLowerCase().includes($event.toLowerCase()));
  }

  onSelect($event) {
    const selectedVehicleModel: VehicleModel = this.vehicleModelDataSource.find(x => x.Id === $event);
    this.selectedValue.emit(selectedVehicleModel);
  }

  public resetVehicleModelComboBox(){
    this.vehicleModeComboBOx.reset();
    this.vehicleModelFiltredDataSource = this.vehicleModelDataSource.slice(0);
  }
}
