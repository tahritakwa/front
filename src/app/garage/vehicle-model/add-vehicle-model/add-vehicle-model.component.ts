import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { GarageConstant } from '../../../constant/garage/garage.constant';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { VehicleModel } from '../../../models/garage/vehicle-model.model';
import { SwalWarring } from '../../../shared/components/swal/swal-popup';
import { unique, ValidationService } from '../../../shared/services/validation/validation.service';
import { VehicleModelService } from '../../services/vehicle-model/vehicle-model.service';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { AuthService } from '../../../login/Authentification/services/auth.service';
const MODELS_LIST_URL = '/main/settings/garage/models';
@Component({
  selector: 'app-add-vehicle-model',
  templateUrl: './add-vehicle-model.component.html',
  styleUrls: ['./add-vehicle-model.component.scss']
})
export class AddVehicleModelComponent implements OnInit {
  modelFormGroup: FormGroup;
  private saveDone = false;
  // update properties
  isUpdateMode = false;
  modelToUpdate: VehicleModel;
  id: number;
    // Permission Parameters
    public hasAddPermission: boolean;
    public hasUpdatePermission: boolean;

  constructor(private fb: FormBuilder,
    private vehicleModelService: VehicleModelService,
    private validationService: ValidationService,
    private router: Router,
    private swalWarring: SwalWarring,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute) {
    this.activatedRoute.params.subscribe(params => {
        this.id = +params[SharedConstant.ID_LOWERCASE] || NumberConstant.ZERO;
    });
  }

ngOnInit() {
  this.hasAddPermission = this.authService.hasAuthority(PermissionConstant.SettingsGaragePermissions.ADD_VEHICLEMODEL);
  this.hasUpdatePermission = this.authService.hasAuthority(PermissionConstant.SettingsGaragePermissions.UPDATE_VEHICLEMODEL);
  this.createAddForm();
  this.isUpdateMode = this.id ? true : false;
  if (this.isUpdateMode) {
      this.getDataToUpdate();
  }
}

private createAddForm(dataItem?): void {
  this.modelFormGroup = this.fb.group({
    Id: [dataItem ? dataItem.Id : 0],
    Code: [dataItem ? dataItem.Code : '', { validators: [Validators.required, Validators.maxLength(NumberConstant.FIFTY)], asyncValidators:
      unique(GarageConstant.CODE, this.vehicleModelService,  this.id ?
        String(this.id) : String(NumberConstant.ZERO)), updateOn: 'blur'}],
    Designation: [dataItem ? dataItem.Designation : '', { validators: [Validators.required, Validators.maxLength(NumberConstant.FIFTY)], asyncValidators:
       unique(GarageConstant.DESIGNATION, this.vehicleModelService, String(dataItem ? dataItem.Id : 0)), updateOn: 'blur'}],
    IdVehicleBrand: [dataItem ? dataItem.IdVehicleBrand : '']
  });
}

private getDataToUpdate() {
  this.vehicleModelService.getById(this.id).subscribe(data => {
    this.modelToUpdate = data;
    if (!this.hasUpdatePermission) {
      this.modelFormGroup.disable();
    }
    this.createAddForm(this.modelToUpdate);
  });
}

public backToList() {
  this.router.navigateByUrl(MODELS_LIST_URL);
}

public onAddClick() {
  if ((this.modelFormGroup as FormGroup).valid) {
    const brandToSave = this.modelFormGroup.getRawValue() as VehicleModel;
    brandToSave.Id = this.isUpdateMode ? this.id : 0;
    this.vehicleModelService.save(brandToSave, !this.isUpdateMode).subscribe(
      (data) => {
        if (data) {
          this.saveDone = true;
          this.router.navigate([MODELS_LIST_URL]);
        }
      }
    );
  } else {
    this.validationService.validateAllFormFields(this.modelFormGroup);
  }
}

/**
 * this method will be called by CanDeactivateGuard service to check the leaving component possibility
 */
 canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    return this.validationService.handleCanDeactivateToLeaveCurrentComponent(() => !this.saveDone && this.modelFormGroup.dirty);
 }

}
