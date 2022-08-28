import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {AbstractControl, FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import { unique, ValidationService} from '../../services/validation/validation.service';
import {SwalWarring} from '../swal/swal-popup';
import {TiersConstants} from '../../../constant/purchase/tiers.constant';
import {NumberConstant} from '../../../constant/utility/number.constant';
import {ContactConstants} from '../../../constant/crm/contact.constant';
import {isNullOrEmptyString} from '@progress/kendo-angular-grid/dist/es2015/utils';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { ModelOfItemComboBoxComponent } from '../model-of-item-combo-box/model-of-item-combo-box.component';
import { VehicleService } from '../../services/vehicle/vehicle.service';


@Component({
  selector: 'app-tiers-vehicle',
  templateUrl: './tiers-vehicle.component.html',
  styleUrls: ['./tiers-vehicle.component.scss']
})

export class TiersvehicleComponent implements OnInit, OnChanges {

  /**
   * Decorator to identify the tiersFormGroup
   */
  @Input()
  public tiersFormGroup: FormGroup;
  /**
   * Decorator to identify the TiersVehicle
   */
  @Input()
  public tiersVehicleToUpdate: any;
 
  
  /**
   * Decorator to identify collapse "open" action
   */
  @Input()
  public collapseOnOpenAction: boolean;

  /**
   * Decorator to agence action
   */
  @Input()
  public isBankAgency: boolean;
  /**
   * Decorator to office action
   */
  @Input()
  public isOffice: boolean;
  /**
   * Decorator to company setup action
   */
  @Input()
  public isCompanySetup: boolean;

  public isUpdate: boolean[] = [];

  @Input()
  public typeTier;
  public hasUpdateCustomerPermission = false;
  idTiers = NumberConstant.ZERO;
  @ViewChild(ModelOfItemComboBoxComponent) modelOfItemChild;
  public addBrandPermission = false ;

  public static isEmptyVehicleFields(vehicle) {
    return isNullOrEmptyString(vehicle.IdVehicleBrand) && isNullOrEmptyString(vehicle.IdModel)
      && isNullOrEmptyString(vehicle.RegistrationNumber) && isNullOrEmptyString(vehicle.ChassisNumber) &&
      (isNullOrEmptyString(vehicle.Power) && isNullOrEmptyString(vehicle.IdVehicleEnergy));
  }

  /**
   *
   * @param fb
   * @param validationService
   * @param swalWarring
   */
  constructor(private fb: FormBuilder, private validationService: ValidationService,
    private vehicleService: VehicleService,
              private swalWarring: SwalWarring, private authService: AuthService) {
  }



  ngOnInit() {
    this.idTiers = this.tiersFormGroup.value.Id;
    this.hasUpdateCustomerPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.UPDATE_CUSTOMER);
    this.addBrandPermission = this.authService.hasAuthority(PermissionConstant.SettingsCommercialPermissions.ADD_VEHICLEBRAND)
  }

  public get vehicle(): FormArray {
    return this.tiersFormGroup.get(TiersConstants.VEHICLE) as FormArray;
  }

  addNewVehicle() {
    if (this.vehicle.valid) {
      this.isUpdate[this.isUpdate.length + NumberConstant.ONE] = false;
      this.vehicle.push(this.buildVehicleForm());
    } else {
      this.validationService.validateAllFormFields(this.tiersFormGroup);
    }
  }

  public deleteVehicle(vehicle: AbstractControl, index) {
    this.swalWarring.CreateDeleteSwal(ContactConstants.VEHICLE_ELEMENT, ContactConstants.PRONOUN_CETTE).then((result) => {
      if (result.value) {
        this.checkIsNewVehicle(vehicle.value.Id, index);
      }
    });
  }

  private buildVehicleForm(TiersVehicle?): FormGroup {
    return this.fb.group({
      Id: [TiersVehicle ? TiersVehicle.Id : NumberConstant.ZERO],
      IdTiers: [TiersVehicle ? TiersVehicle.IdTiers : null],
      IdVehicleBrand: [TiersVehicle ? TiersVehicle.IdVehicleBrand : null],
      IdVehicleModel: [TiersVehicle ? TiersVehicle.IdVehicleModel : null],
      IdVehicleEnergy: [TiersVehicle ? TiersVehicle.IdVehicleEnergy : null],
      RegistrationNumber: [TiersVehicle ? TiersVehicle.RegistrationNumber : null, {
        validators: Validators.required,
        asyncValidators: unique(TiersConstants.REGISTRATION_NUMBER, this.vehicleService,this.tiersFormGroup.value.Id ?
          String(this.tiersFormGroup.value.Id) : String(NumberConstant.ZERO)), updateOn: 'blur'
      }],
      ChassisNumber: [TiersVehicle ? TiersVehicle.ChassisNumber : null, 
        {asyncValidators: unique(TiersConstants.CHASSIS_NUMBER, this.vehicleService , this.tiersFormGroup.value.Id ?
          String(this.tiersFormGroup.value.Id) : String(NumberConstant.ZERO)), updateOn: 'blur'}],
      Power: [TiersVehicle ? TiersVehicle.Power : null],
      IsDeleted: [false]
     
    });
  }



  /**
   * check if TiersVehicle is new by Id
   * @param id
   * @param index
   * @private
   */
  private checkIsNewVehicle(id, index) {
    if (id !== NumberConstant.ZERO) {
      this.vehicle.at(index).get(ContactConstants.IS_DELETED).setValue(true);
      Object.keys((this.vehicle.at(index) as FormGroup).controls).forEach(key => {
        (this.vehicle.at(index) as FormGroup).get(key).setErrors(null);
      });
    } else {
      this.vehicle.removeAt(index);
    }
  }



  /**
   * load vehicle in update mode
   * @param changes
   * @private
   */
  private getVehicleToUpdate(changes: SimpleChanges) {
    changes.tiersVehicleToUpdate.currentValue.forEach((value, index) => {
      this.isUpdate[index] = true;
      this.vehicle.push(this.buildVehicleForm(value));
    });
  }

  /**
   * onChanges life cycle
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.collapseOnOpenAction !== undefined && changes.collapseOnOpenAction.currentValue) {
      this.addNewVehicle();
    } else if (changes.tiersVehicleToUpdate !== undefined && changes.tiersVehicleToUpdate.currentValue !== undefined
      && changes.tiersVehicleToUpdate.currentValue.length > NumberConstant.ZERO) {
      this.getVehicleToUpdate(changes);
    }
  }
  
  /**
   * On change brand, receive the selected value
   * */
  public receiveBrand($event) {
    this.modelOfItemChild.initDataSource($event);
  }

    
  /**
   * check if vehicle row is visible by IsDeleted flag
   * @param vehicle
   */
      isVehicleRowVisible(vehicle) {
    return !vehicle.value.IsDeleted;
  }

  

}
