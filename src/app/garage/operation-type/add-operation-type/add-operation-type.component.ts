import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import { CompanyService } from '../../../administration/services/company/company.service';
import { GarageConstant } from '../../../constant/garage/garage.constant';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { Currency } from '../../../models/administration/currency.model';
import { TypeUnitEnumerator } from '../../../models/enumerators/type-unit.enum';
import { OperationType } from '../../../models/garage/operation-type.model';
import { digitsAfterComma, observableDigitsAfterComma, strictSup, unique, ValidationService } from '../../../shared/services/validation/validation.service';
import { Filter, Operation, PredicateFormat, Relation } from '../../../shared/utils/predicate';
import { OperationTypeService } from '../../services/operation-type/operation-type.service';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { LocalStorageService } from '../../../login/Authentification/services/local-storage-service';

@Component({
  selector: 'app-add-operation-type',
  templateUrl: './add-operation-type.component.html',
  styleUrls: ['./add-operation-type.component.scss']
})
export class AddOperationTypeComponent implements OnInit {

  companyCurrency: Currency;
  companyCurrencyPrecision : any;
  companyCurrencyCode : any;
  operationTypeFormGroup: FormGroup;
  isUpdateMode: boolean;
  operationTypeToUpdate: OperationType;
  id: number;
  OPERATION_TYPE_LIST_URL = GarageConstant.OPERATION_TYPE_LIST_URL;
  unitDetailsValue: string;
  typeUnitEnumerator = TypeUnitEnumerator;
  private saveDone = false;
  // Permission Parameters
  public hasAddPermission: boolean;
  public hasUpdatePermission: boolean;
  constructor(private router: Router, private activatedRoute: ActivatedRoute, private fb: FormBuilder,
    private operationTypeService: OperationTypeService, private validationService: ValidationService,
    private translateService: TranslateService, private companyService: CompanyService, private authService: AuthService, private localStorageService : LocalStorageService) {
    this.activatedRoute.params.subscribe(params => {
      this.id = +params[SharedConstant.ID_LOWERCASE] || NumberConstant.ZERO;
      this.isUpdateMode = this.id > NumberConstant.ZERO;
    });
  }

  ngOnInit() {
    this.createAddForm();
    this.hasAddPermission = this.authService.hasAuthority(PermissionConstant.SettingsGaragePermissions.ADD_OPERATIONTYPE);
    this.hasUpdatePermission = this.authService.hasAuthority(PermissionConstant.SettingsGaragePermissions.UPDATE_OPERATIONTYPE);
    this.companyCurrencyPrecision = this.localStorageService.getCurrencyPrecision();
    this.companyCurrencyCode = this.localStorageService.getCurrencyCode();
    this.UnitPrice.updateValueAndValidity();
    if (this.isUpdateMode) {
      this.getDataToUpdate();
    }
  }

  private createAddForm(): void {
    this.operationTypeFormGroup = this.fb.group({
      Name: [undefined, {
        validators: [Validators.required, Validators.maxLength(NumberConstant.FIFTY)],
        asyncValidators: unique(GarageConstant.NAME, this.operationTypeService, this.id ? String(this.id) : String(NumberConstant.ZERO)),
        updateOn: 'blur'
      }],
      IdUnit: [undefined, Validators.required],
      UnitDetails: [undefined],
      UnitPrice: [undefined, [Validators.required,
      observableDigitsAfterComma(new Observable(o =>
          o.next(this.companyCurrencyPrecision ? this.companyCurrencyPrecision : 0))),
      strictSup(0)]]
    });
  }


  save() {
    if (this.operationTypeFormGroup.valid) {
      this.operationTypeToUpdate = Object.assign({}, this.operationTypeToUpdate, this.operationTypeFormGroup.value);
      this.operationTypeToUpdate.IdUnitNavigation = null;
      if (!this.isUpdateMode) {
        this.operationTypeService.save(this.operationTypeToUpdate, true).subscribe(() => {
          this.saveDone = true;
          this.router.navigateByUrl(GarageConstant.OPERATION_TYPE_LIST_URL);
        });
      } else {
        this.operationTypeService.updateOperationType(this.operationTypeToUpdate).subscribe(() => {
          this.saveDone = true;
          this.router.navigateByUrl(GarageConstant.OPERATION_TYPE_LIST_URL);
        });
      }

    } else {
      this.validationService.validateAllFormFields(this.operationTypeFormGroup);
    }
  }

  getDataToUpdate() {
    const predicate = new PredicateFormat();
    predicate.Filter = new Array<Filter>();
    predicate.Filter.push(new Filter(GarageConstant.ID_UPPER_CASE, Operation.eq, this.id));
    predicate.Relation = new Array<Relation>();
    predicate.Relation.push.apply(predicate.Relation, [new Relation(GarageConstant.ID_UNIT_NAVIGATION)]);
    this.operationTypeService.getModelByCondition(predicate).subscribe((data) => {
      this.operationTypeToUpdate = data;
      this.operationTypeFormGroup.patchValue(this.operationTypeToUpdate);
      this.unitValueChange(this.operationTypeToUpdate.IdUnitNavigation);
      if (!this.hasUpdatePermission) {
        this.operationTypeFormGroup.disable();
      }
    });
  }

  unitValueChange($event) {
    if ($event) {
      this.unitDetailsValue = $event.Quantity + ' ';
      if ($event.Type === this.typeUnitEnumerator.Days) {
        this.unitDetailsValue = String(this.unitDetailsValue).concat(this.translateService.instant(GarageConstant.DAYS));
      } else if ($event.Type === this.typeUnitEnumerator.Hours) {
        this.unitDetailsValue = String(this.unitDetailsValue).concat(this.translateService.instant(GarageConstant.HOURS));
      } else if ($event.Type === this.typeUnitEnumerator.Minutes) {
        this.unitDetailsValue = String(this.unitDetailsValue).concat(this.translateService.instant(GarageConstant.MINUTES));
      } else if ($event.Type === this.typeUnitEnumerator.Seconds) {
        this.unitDetailsValue = String(this.unitDetailsValue).concat(this.translateService.instant(GarageConstant.SECONDES));
      }
    } else {
      this.unitDetailsValue = undefined;
    }
    this.UnitDetails.setValue(this.unitDetailsValue);
  }

  updateUnitDetails() {
    this.UnitDetails.setValue(this.unitDetailsValue);
  }

  /**
  * this method will be called by CanDeactivateGuard service to check the leaving component possibility
  */
  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    return this.validationService.handleCanDeactivateToLeaveCurrentComponent(() => !this.saveDone && this.operationTypeFormGroup.dirty);
  }

  get Name(): FormControl {
    return this.operationTypeFormGroup.get(GarageConstant.NAME) as FormControl;
  }

  get IdUnit(): FormControl {
    return this.operationTypeFormGroup.get(GarageConstant.ID_UNIT) as FormControl;
  }

  get UnitDetails(): FormControl {
    return this.operationTypeFormGroup.get(GarageConstant.UNIT_DETAILS) as FormControl;
  }

  get UnitPrice(): FormControl {
    return this.operationTypeFormGroup.get(GarageConstant.UNIT_PRICE) as FormControl;
  }


}
