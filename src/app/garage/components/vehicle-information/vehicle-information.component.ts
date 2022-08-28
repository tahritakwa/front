import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { CustomerCategoryEnumerator } from '../../../models/enumerators/customer-category.enum';
import { VehicleCategoryEnumerator } from '../../../models/enumerators/vehicle-category.enum';
import { Vehicle } from '../../../models/garage/vehicle.model';

@Component({
  selector: 'app-vehicle-information',
  templateUrl: './vehicle-information.component.html',
  styleUrls: ['./vehicle-information.component.scss']
})
export class VehicleInformationComponent implements OnInit {

  dateFormat = this.translate.instant(SharedConstant.DATE_FORMAT);
  @Input() form: FormGroup;
  @Output() selectedVehicle: EventEmitter<Vehicle> = new EventEmitter<Vehicle>();
  vehicleSelected: Vehicle;
  customerCategoryEnumerator = CustomerCategoryEnumerator;
  public vehicleCategoryEnum = VehicleCategoryEnumerator;
  constructor(private translate: TranslateService) {  }

  ngOnInit() {
  }

  refreshVehicleInformation($event) {
    this.vehicleSelected = $event;
    this.selectedVehicle.emit(this.vehicleSelected);
  }

  public setVehichle(vehicle: Vehicle) {
    this.vehicleSelected = vehicle;
  }

  get ReceptionFormGroup(): FormGroup {
    return this.form.controls.IdReceptionNavigation as FormGroup;
  }
}
