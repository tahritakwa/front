import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { GarageConstant } from '../../../constant/garage/garage.constant';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { TiersTypeEnumerator } from '../../../models/enumerators/tiers-type.enum';
import { VehicleBrand } from '../../../models/garage/vehicle-brand.model';
import { unique, ValidationService } from '../../../shared/services/validation/validation.service';
import { ModelDropdownComponent } from '../model-dropdown/model-dropdown.component';
import { VehicleService } from '../../services/vehicle/vehicle.service';
import { VehicleCategoryEnumerator } from '../../../models/enumerators/vehicle-category.enum';
import { Vehicle } from '../../../models/garage/vehicle.model';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-add-vehicle',
  templateUrl: './add-vehicle.component.html',
  styleUrls: ['./add-vehicle.component.scss']
})
export class AddVehicleComponent implements OnInit {
  VEHICLE_LIST_URL = GarageConstant.VEHICLE_LIST_URL;
  @Input() vehicleCategory: any;
  @Input() id: number;
  @Input() idTiers: number;
  @Input() isModal: boolean;
  @Input() hasUpdatePermission: boolean;
  @Output() saveDoneEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
  @ViewChild('vehicleModelViewChild') vehicleModelViewChild: ModelDropdownComponent;
  public customerTiers = TiersTypeEnumerator.Customer;
  public vehicleCategoryEnum = VehicleCategoryEnumerator;
  vehicleToUpdate: Vehicle;
  isUpdateMode = false;
  isValidFirstTraficDate = true;
  addVehicleFormGroup: FormGroup;
  saveDone = false;
  formatDate = this.translate.instant(SharedConstant.DATE_FORMAT);

  constructor(private formBuilder: FormBuilder, private router: Router,
    private validationService: ValidationService, private vehicleService: VehicleService, private translate: TranslateService) {
  }

  ngOnInit() {
    this.createAddForm();
    this.isUpdateMode = this.id > NumberConstant.ZERO;
    if (this.isUpdateMode) {
      this.getDataToUpdate();
    }
  }

  createAddForm() {
    this.addVehicleFormGroup = this.formBuilder.group({
      IdTiers: [{
        value: this.idTiers, disabled: this.idTiers ? true : false
      }, this.validationService.conditionalValidator(() =>
        this.vehicleCategory === this.vehicleCategoryEnum.Customer, Validators.required)],
      IdVehicleBrand: [undefined],
      IdVehicleModel: [undefined],
      IdVehicleType: [undefined],
      RegistrationNumber: [undefined, {
        validators: [Validators.required, Validators.maxLength(NumberConstant.FIFTY)],
        asyncValidators: unique(GarageConstant.REGISTRATION_NUMBER, this.vehicleService, this.id ?
          String(this.id) : String(NumberConstant.ZERO)), updateOn: 'blur'
      }],
      ChassisNumber: [undefined],
      Power: [undefined],
      IdVehicleEnergy: [undefined],
      FirstTraficDate: [undefined],
      Category: [this.vehicleCategory],
      IsAvailable: [undefined]
    });
    this.addVehicleFormGroup.controls['Power'].setValidators(this.validationService.conditionalValidator((
      () => this.addVehicleFormGroup.controls.Power.value), Validators.min(0)));
  }

  save() {
    if (this.addVehicleFormGroup.valid && this.isValidFirstTraficDate) {
      this.vehicleToUpdate = Object.assign({}, this.vehicleToUpdate, this.addVehicleFormGroup.getRawValue());
      this.vehicleService.save(this.vehicleToUpdate, !this.isUpdateMode).subscribe(() => {
        this.saveDone = true;
        if (this.isModal) {
          this.saveDoneEvent.emit();
        } else {
          this.goToAdvancedList();
        }
      });
    } else {
      this.validationService.validateAllFormFields(this.addVehicleFormGroup);
    }
  }

  goToAdvancedList() {
    const url = this.vehicleCategory === this.vehicleCategoryEnum.Customer ?
      GarageConstant.NAVIGATE_TO_LIST_CUSTOMERS_VEHICLES : GarageConstant.NAVIGATE_TO_LIST_LOAN_VEHICLES;
    this.router.navigateByUrl(url);
  }

  getDataToUpdate() {
    this.vehicleService.getById(this.id).subscribe((data) => {
      this.vehicleToUpdate = data;
      this.vehicleToUpdate.FirstTraficDate = this.vehicleToUpdate.FirstTraficDate ?
        new Date(this.vehicleToUpdate.FirstTraficDate) : undefined;
      this.addVehicleFormGroup.patchValue(this.vehicleToUpdate);
      this.IdVehicleModel.enable();
      if (!this.hasUpdatePermission) {
        this.addVehicleFormGroup.disable();
      }
    });
  }

  brandSelectedChange($event) {
    const selectedBrand: VehicleBrand = $event;
    this.IdVehicleModel.setValue(undefined);
    if (selectedBrand) {
      this.vehicleModelViewChild.setModel(selectedBrand.Id);
    } else {
      this.vehicleModelViewChild.setModel(0);
    }
  }

  changeFirstTraficDate($event) {
    if ($event == null) {
          this.isValidFirstTraficDate = false;
    } else {
      this.isValidFirstTraficDate = true;
    }
  }

  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    return this.validationService.handleCanDeactivateToLeaveCurrentComponent(() => !this.saveDone && this.addVehicleFormGroup.dirty);
  }

  get IdTiers(): FormControl {
    return this.addVehicleFormGroup.get(GarageConstant.ID_TIERS) as FormControl;
  }
  get IdVehicleBrand(): FormControl {
    return this.addVehicleFormGroup.get(GarageConstant.ID_VEHICLE_BRAND) as FormControl;
  }
  get IdVehicleModel(): FormControl {
    return this.addVehicleFormGroup.get(GarageConstant.ID_VEHICLE_MODEL) as FormControl;
  }
  get IdVehicleType(): FormControl {
    return this.addVehicleFormGroup.get(GarageConstant.ID_VEHICLE_TYPE) as FormControl;
  }
  get RegistrationNumber(): FormControl {
    return this.addVehicleFormGroup.get(GarageConstant.REGISTRATION_NUMBER) as FormControl;
  }
  get ChassisNumber(): FormControl {
    return this.addVehicleFormGroup.get(GarageConstant.CHASSIS_NUMBER) as FormControl;
  }
  get Power(): FormControl {
    return this.addVehicleFormGroup.get(GarageConstant.POWER) as FormControl;
  }
  get IdVehicleEnergy(): FormControl {
    return this.addVehicleFormGroup.get(GarageConstant.ID_VEHICLE_ENERGY) as FormControl;
  }

  get FirstTraficDate(): FormControl {
    return this.addVehicleFormGroup.get(GarageConstant.FIRST_TRAFIC_DATE) as FormControl;
  }
}
