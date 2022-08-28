import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { GarageConstant } from '../../../constant/garage/garage.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { TypeUnitEnumerator } from '../../../models/enumerators/type-unit.enum';
import { Unit } from '../../../models/garage/unit.model';
import { strictSup, unique, ValidationService } from '../../../shared/services/validation/validation.service';
import { UnitService } from '../../services/unit/unit.service';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { PermissionConstant } from '../../../Structure/permission-constant';

@Component({
  selector: 'app-add-unit',
  templateUrl: './add-unit.component.html',
  styleUrls: ['./add-unit.component.scss']
})
export class AddUnitComponent implements OnInit {

  isUpdateMode = false;
  unitToUpdate: Unit;
  id: number;
  addUnitFormGroup: FormGroup;
  typeUnitEnumerator = TypeUnitEnumerator;
  LIST_UNIT_URL = GarageConstant.LIST_UNIT_URL;
  private saveDone = false;
  // Permission Parameters
  public hasAddPermission: boolean;
  public hasUpdatePermission: boolean;

  constructor(private fb: FormBuilder, private router: Router, private unitService: UnitService,
    private validationService: ValidationService, private activatedRoute: ActivatedRoute, private authService: AuthService) {
    this.id = this.activatedRoute.snapshot.params['id'];
    this.isUpdateMode = this.id && this.id > NumberConstant.ZERO;
  }

  ngOnInit() {
    this.hasAddPermission = this.authService.hasAuthority(PermissionConstant.SettingsGaragePermissions.ADD_UNIT);
    this.hasUpdatePermission = this.authService.hasAuthority(PermissionConstant.SettingsGaragePermissions.UPDATE_UNIT);
    this.createAddForm();
    if (this.isUpdateMode) {
      this.getDataToUpdate();
    }
  }

  createAddForm() {
    this.addUnitFormGroup = this.fb.group({
      Id: [0],
      Name: [undefined, {
        validators: [Validators.required, Validators.maxLength(NumberConstant.FIFTY)],
        asyncValidators: unique(GarageConstant.NAME, this.unitService, this.id ? String(this.id) : String(NumberConstant.ZERO)),
        updateOn: 'blur'
      }],
      Quantity: [undefined, [Validators.required, strictSup(0)]],
      Type: [undefined, Validators.required]
    });
  }

  getDataToUpdate() {
    this.unitService.getById(this.id).subscribe((data) => {
      this.unitToUpdate = data;
      this.addUnitFormGroup.patchValue(this.unitToUpdate);
      if (!this.hasUpdatePermission) {
       this.addUnitFormGroup.disable();
      }
    });
  }

  save() {
    if (this.addUnitFormGroup.valid) {
      this.unitToUpdate = Object.assign({}, this.unitToUpdate, this.addUnitFormGroup.getRawValue());
      this.unitService.save(this.unitToUpdate, !this.isUpdateMode).subscribe(() => {
        this.saveDone = true;
        this.router.navigateByUrl(GarageConstant.LIST_UNIT_URL);
      });
    } else {
      this.validationService.validateAllFormFields(this.addUnitFormGroup);
    }
  }

  /**
   * this method will be called by CanDeactivateGuard service to check the leaving component possibility
   */
  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    return this.validationService.handleCanDeactivateToLeaveCurrentComponent(() => !this.saveDone && this.addUnitFormGroup.dirty);
  }
}
