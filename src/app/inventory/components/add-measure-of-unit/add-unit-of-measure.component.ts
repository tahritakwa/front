import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {isNumeric, unique, ValidationService} from '../../../shared/services/validation/validation.service';
import {MeasureUnitService} from '../../../shared/services/mesure-unit/measure-unit.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ItemConstant} from '../../../constant/inventory/item.constant';
import {Observable} from 'rxjs/Observable';
import {SharedConstant} from '../../../constant/shared/shared.constant';
import {NumberConstant} from '../../../constant/utility/number.constant';
import {MeasureUnit} from '../../../models/inventory/measure-unit.model';
import {StyleConfigService} from '../../../shared/services/styleConfig/style-config.service';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { AuthService } from '../../../login/Authentification/services/auth.service';

@Component({
  selector: 'app-add-measure-of-unit',
  templateUrl: './add-unit-of-measure.component.html',
  styleUrls: ['./add-unit-of-measure.component.scss']
})
export class AddUnitOfMeasureComponent implements OnInit {

  /**
   * to check if we add or edit a unit of measure
   */
  public isUpdateMode = false;
  public unitFormGroup: FormGroup;
  /**
   * attribute to use while verifying the route leave
   */
  private isSaveOperation = false;
  public unitsOfMeasureList = ItemConstant.MEASURE_UNIT_LIST_URL;

  /**
   * contains the unit id in case of update mode
   */
  public id: number;
  /**
   * contains the unit data in case of update mode
   */
  public unitToUpdate: MeasureUnit;
  public hasAddMeasureUnitPermission: boolean;
  public hasUpdateMeasureUnitPermission: boolean;
  constructor(private formBuilder: FormBuilder, private activatedRoute: ActivatedRoute,
              private measureUnitService: MeasureUnitService, private router: Router, private authService: AuthService,
              private validationService: ValidationService, private styleConfigService: StyleConfigService) {
  }

  ngOnInit() {
    this.hasAddMeasureUnitPermission = this.authService.hasAuthority(PermissionConstant.SettingsCommercialPermissions.ADD_MEASUREUNIT);
    this.hasUpdateMeasureUnitPermission =
    this.authService.hasAuthority(PermissionConstant.SettingsCommercialPermissions.UPDATE_MEASUREUNIT);
    this.createFormGroup();
    this.checkMode();
  }


  /**
   * check if it is an add or  update mode
   */
  public checkMode(): void {
    this.activatedRoute.params.subscribe(params => {
      this.id = params[SharedConstant.ID_LOWERCASE] || NumberConstant.ZERO;
      this.isUpdateMode = this.id > NumberConstant.ZERO;
    });
    if (this.isUpdateMode) {
      this.getDataToUpdate();
    }
  }

  /***
   * To build the form group
   */
  public createFormGroup() {
    this.unitFormGroup = this.formBuilder.group({
      MeasureUnitCode: ['', {validators: Validators.required, asyncValidators: unique('MeasureUnitCode', this.measureUnitService, String(this.id)), updateOn: 'blur'}],
      Label: ['', Validators.required],
      Description: ['', Validators.required],
      IsDecomposable: [false],
      DigitsAfterComma: [NumberConstant.ZERO, [Validators.min(NumberConstant.ZERO),
        Validators.max(NumberConstant.TEN), isNumeric()]]
    });
  }

  public save() {
    if (this.unitFormGroup.valid) {
      this.isSaveOperation = true;
      const unitToSave = this.unitFormGroup.value;
      if (this.id) {
        unitToSave.Id = this.id;
      }
      this.measureUnitService.save(unitToSave, !this.isUpdateMode).subscribe((data) => {
        this.router.navigate([this.unitsOfMeasureList]);
      });
    } else {
      this.validationService.validateAllFormFields(this.unitFormGroup);
    }
  }

  /**
   * this method will be called by CanDeactivateGuard service to check the leaving component possibility
   */
  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (this.isSaveOperation) {
      this.isSaveOperation = false;
      return true;
    }
    return this.validationService.handleCanDeactivateToLeaveCurrentComponent(this.isFormGroupChanged.bind(this));
  }

  private isFormGroupChanged(): boolean {
    return this.unitFormGroup.touched;
  }

  get IsDecomposable(): FormControl {
    return this.unitFormGroup.controls[ItemConstant.ISDECOMPOSABLE] as FormControl;
  }


  public changeIsDecomposable() {
    if (!this.IsDecomposable.value) {
      this.unitFormGroup.controls[ItemConstant.DIGITSAFTERCOMMA].setValue(0);
    }
  }

  /**
   * Retrieve the unit to edit
   */
  getDataToUpdate() {
    this.measureUnitService.getById(this.id).subscribe(data => {
      if (data) {
        this.unitToUpdate = data;
        this.unitFormGroup.patchValue(this.unitToUpdate);
      }
      if (!this.hasUpdateMeasureUnitPermission) {
        this.unitFormGroup.disable();
      }
    });
  }

  getFooterClass() {
    return this.styleConfigService.getFooterClassSettingLayoutAddComponent();
  }
}
