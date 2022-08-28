import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewContainerRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ComboBoxComponent } from '@progress/kendo-angular-dropdowns';
import { GarageConstant } from '../../../constant/garage/garage.constant';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { VehicleService } from '../../../garage/services/vehicle/vehicle.service';
import { AddCustomerVehicleComponent } from '../../../garage/vehicle/customer-vehicle/add-customer-vehicle/add-customer-vehicle.component';
import { Vehicle } from '../../../models/garage/vehicle.model';
import { FormModalDialogService } from '../../services/dialog/form-modal-dialog/form-modal-dialog.service';
import { Filter, Operation, PredicateFormat, Relation } from '../../utils/predicate';

@Component({
  selector: 'app-registration-number-of-vehicle-dropdwon',
  templateUrl: './registration-number-of-vehicle-dropdwon.component.html',
  styleUrls: ['./registration-number-of-vehicle-dropdwon.component.scss']
})
export class RegistrationNumberOfVehicleDropdwonComponent implements OnInit {

  @ViewChild(ComboBoxComponent) public registrationNumberOfVehicleComboBox: ComboBoxComponent;
  @Input() group: FormGroup;
  @Input() category: any;
  @Input() isAvailable: boolean;
  @Output() valueSelected = new EventEmitter<Vehicle>();
  @Input() withoutPlaceholder: boolean;
  @Input() showAddButton: boolean;
  registrationNumberDataSource: Vehicle[];
  registrationNumberFilterDataSource: Vehicle[];
  predicate: PredicateFormat;
  public placeholder = GarageConstant.VEHICLE_PLACE_HOLDER;
  constructor(private vehicleService: VehicleService, private formModalDialogService: FormModalDialogService,
    private viewContainerRef: ViewContainerRef) { }

  ngOnInit() {
    if (this.withoutPlaceholder) {
      this.placeholder = '';
    }
    this.realoadData();
  }

  public realoadData(idTiers?: any) {
    this.preparePredicate();
    if (idTiers) {
      this.predicate.Filter.push(new Filter(GarageConstant.ID_TIERS, Operation.eq, idTiers));
    }
    this.initGridDataSource();
  }

  initGridDataSource() {
    this.vehicleService.getVehicleRegistrationNumberDropdown(this.predicate).subscribe((data) => {
      this.registrationNumberDataSource = data.listData;
      this.registrationNumberFilterDataSource = this.registrationNumberDataSource.slice(0);
    });
  }

  preparePredicate() {
    this.predicate = new PredicateFormat();
    this.predicate.Relation = new Array<Relation>();
    this.predicate.Relation.push.apply(this.predicate.Relation, [new Relation(GarageConstant.ID_VEHICLE_MODEL_NAVIGATION)]);
    this.predicate.Relation.push.apply(this.predicate.Relation, [new Relation(GarageConstant.ID_VEHICLE_BRAND_NAVIGATION)]);
    this.predicate.Relation.push.apply(this.predicate.Relation, [new Relation(GarageConstant.ID_VEHICLE_ENERGY_NAVIGATION)]);
    this.predicate.Filter = new Array<Filter>();
    if (this.category) {
      this.predicate.Filter.push(new Filter(GarageConstant.CATEGORY, Operation.eq, this.category));
    }
    if (this.isAvailable) {
      this.predicate.Filter.push(new Filter(GarageConstant.IS_AVAILABLE, Operation.eq, true));
    }
  }

  handleFilter(value: string) {
    this.registrationNumberFilterDataSource = this.registrationNumberDataSource.filter((s) =>
      s.RegistrationNumber.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }

  onValueChanged($event) {
    const selectedValue = this.registrationNumberFilterDataSource.find(x => x.Id === $event);
    this.valueSelected.emit(selectedValue);
  }

  public resetRegistrationNumberComboBox() {
    this.registrationNumberOfVehicleComboBox.reset();
    this.registrationNumberFilterDataSource = this.registrationNumberDataSource.slice(0);
  }

  addNew(): void {
    const TITLE = GarageConstant.ADD_CUSTOMER_VEHICLE;
    this.formModalDialogService.openDialog(TITLE,
      AddCustomerVehicleComponent,
      this.viewContainerRef, this.initGridDataSource.bind(this), null, true, SharedConstant.MODAL_DIALOG_SIZE_L);
  }
}
