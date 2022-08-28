import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { GarageConstant } from '../../../constant/garage/garage.constant';
import { Vehicle } from '../../../models/garage/vehicle.model';
import { VehicleService } from '../../services/vehicle/vehicle.service';

@Component({
  selector: 'app-loan-vehicle-dropdown',
  templateUrl: './loan-vehicle-dropdown.component.html',
  styleUrls: ['./loan-vehicle-dropdown.component.scss']
})
export class LoanVehicleDropdownComponent implements OnInit {

  @Input() group: FormGroup;
  @Input() category: any;
  @Input() isAvailable: boolean;
  @Input() idVehicle: number;
  @Output() valueSelected = new EventEmitter<Vehicle>();
  @Input() withoutPlaceholder: boolean;
  loanVehicleDataSource: Vehicle[];
  loanVehicleFilterDataSource: Vehicle[]; 
  public placeholder = GarageConstant.VEHICLE_PLACE_HOLDER;
  constructor(private vehicleService: VehicleService) { }

  ngOnInit() {
     if (this.withoutPlaceholder) {
      this.placeholder = '';
    }
    this.initGridDataSource();
  }

  initGridDataSource() {
    this.vehicleService.getLoanVehicleDropdown(this.isAvailable, this.idVehicle).subscribe((data) => {
      this.loanVehicleDataSource = data.listData;
      this.loanVehicleFilterDataSource = this.loanVehicleDataSource.slice(0);
    });
  }

  
  handleFilter(value: string) {
    this.loanVehicleFilterDataSource = this.loanVehicleDataSource.filter((s) =>
      s.RegistrationNumber.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }

  onValueChanged($event) {
    const selectedValue = this.loanVehicleFilterDataSource.find(x => x.Id === $event);
    this.valueSelected.emit(selectedValue);
  }
}
