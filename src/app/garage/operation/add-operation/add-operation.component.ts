import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { EnumValues } from 'enum-values';
import { Observable } from 'rxjs/Observable';
import { CompanyService } from '../../../administration/services/company/company.service';
import { GarageConstant } from '../../../constant/garage/garage.constant';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { Company } from '../../../models/administration/company.model';
import { Currency } from '../../../models/administration/currency.model';
import { ReducedTaxe } from '../../../models/administration/reduced-taxe.model';
import { TypeUnitEnumerator } from '../../../models/enumerators/type-unit.enum';
import { OperationType } from '../../../models/garage/operation-type.model';
import { Operation } from '../../../models/garage/operation.model';
import { LanguageService } from '../../../shared/services/language/language.service';
import { digitsAfterComma, strictSup, unique, ValidationService } from '../../../shared/services/validation/validation.service';
import { OperationService } from '../../services/operation/operation.service';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import {LocalStorageService} from '../../../login/Authentification/services/local-storage-service';
@Component({
  selector: 'app-add-operation',
  templateUrl: './add-operation.component.html',
  styleUrls: ['./add-operation.component.scss']
})
export class AddOperationComponent implements OnInit {
  language: string;
  typeUnitEnumerator = TypeUnitEnumerator;
  operationFormGroup: FormGroup;
  isUpdateMode = false;
  id: number;
  operationToUpdate = new Operation();
  companyCurrency: Currency;
  OPERATION_LIST_URL = GarageConstant.OPERATION_LIST_URL;
  taxeValuePercentage: number;
  unitDetailsValue: string;
  selectedOperationType: OperationType;
  private saveDone = false;
  // Permission Parameters
  public hasAddPermission: boolean;
  public hasUpdatePermission: boolean;
  constructor(private fb: FormBuilder, private validationService: ValidationService, private companyService: CompanyService,
    private router: Router, private activatedRoute: ActivatedRoute, private operationService: OperationService,
              private localStorageService : LocalStorageService, private translateService: TranslateService, private authService: AuthService) {
    this.activatedRoute.params.subscribe(params => {
      this.id = +params[SharedConstant.ID_LOWERCASE] || NumberConstant.ZERO;
      this.isUpdateMode = this.id > NumberConstant.ZERO;
    });
    this.language = this.localStorageService.getLanguage();

  }

  ngOnInit() {
    this.hasAddPermission = this.authService.hasAuthority(PermissionConstant.SettingsGaragePermissions.ADD_OPERATION);
    this.hasUpdatePermission = this.authService.hasAuthority(PermissionConstant.SettingsGaragePermissions.UPDATE_OPERATION);
    this.companyService.getCurrentCompany().subscribe((data: Company) => {
      this.companyCurrency = data.IdCurrencyNavigation;
    });
    this.createAddForm();
    if (this.isUpdateMode) {
      this.getDataToUpdate();
    }
  }

  createAddForm() {
    this.operationFormGroup = this.fb.group({
      Id: [0],
      Name: [undefined, {
        validators: [Validators.required, Validators.maxLength(NumberConstant.TWO_HUNDRED_FIFTY_FIVE)],
        asyncValidators: unique(GarageConstant.NAME, this.operationService, this.id ? String(this.id) : String(NumberConstant.ZERO)),
        updateOn: 'blur'
      }],
      IdOperationType: [undefined, Validators.required],
      UnitNumber: [undefined, [Validators.required, digitsAfterComma(NumberConstant.THREE), strictSup(0)]],
      UnitDetails: [undefined],
      IdTaxe: [undefined, Validators.required]
    });
  }

  save() {
    if (this.operationFormGroup.valid) {
      this.operationToUpdate.IdOperationTypeNavigation = null;
      this.operationToUpdate = Object.assign({}, this.operationToUpdate, this.operationFormGroup.value);
      if (!this.isUpdateMode) {
        this.operationService.addOperation(this.operationToUpdate).subscribe(() => {
          this.saveDone = true;
          this.router.navigateByUrl(GarageConstant.OPERATION_LIST_URL);
        });
      } else {
        this.operationService.updateOperation(this.operationToUpdate).subscribe(() => {
          this.saveDone = true;
          this.router.navigateByUrl(GarageConstant.OPERATION_LIST_URL);
        });
      }
    } else {
      this.validationService.validateAllFormFields(this.operationFormGroup);
    }
  }

  getDataToUpdate() {
    this.operationService.getOperationById(this.id).subscribe((data) => {
      this.operationToUpdate = data;
      this.taxeValuePercentage = this.operationToUpdate.TaxeValuePercentage;
      this.operationFormGroup.patchValue(this.operationToUpdate);
      this.selectedOperationType = this.operationToUpdate.IdOperationTypeNavigation;
      this.getDetailsValue(this.selectedOperationType);
      if (!this.hasUpdatePermission) {
         this.operationFormGroup.disable();
      }
    });
  }

  getDetailsValue($event) {
    if ($event) {
      const list = EnumValues.getNamesAndValues(this.typeUnitEnumerator);
      list.forEach(elem => {
        if (elem.value === $event.IdUnitNavigation.Type) {
          this.unitDetailsValue = $event.IdUnitNavigation.Quantity + ' ';
          if ($event.IdUnitNavigation.Type === this.typeUnitEnumerator.Days) {
            this.unitDetailsValue = String(this.unitDetailsValue).concat(this.translateService.instant(GarageConstant.DAYS));
          } else if ($event.IdUnitNavigation.Type === this.typeUnitEnumerator.Hours) {
            this.unitDetailsValue = String(this.unitDetailsValue).concat(this.translateService.instant(GarageConstant.HOURS));
          } else if ($event.IdUnitNavigation.Type === this.typeUnitEnumerator.Minutes) {
            this.unitDetailsValue = String(this.unitDetailsValue).concat(this.translateService.instant(GarageConstant.MINUTES));
          } else if ($event.IdUnitNavigation.Type === this.typeUnitEnumerator.Seconds) {
            this.unitDetailsValue = String(this.unitDetailsValue).concat(this.translateService.instant(GarageConstant.SECONDES));
          }
          this.unitDetailsValue = String(this.unitDetailsValue)
            .concat(' ')
            .concat(SharedConstant.OPEN_PARENTHESIS)
            .concat($event.IdUnitNavigation.Name.toString())
            .concat(SharedConstant.CLOSE_PARENTHESIS);
        }
      });
    } else {
      this.unitDetailsValue = undefined;
    }
    this.UnitDetails.setValue(this.unitDetailsValue);
  }

  onValueChanged(event?) {
    if (this.IdOperationType.valid && this.UnitNumber.valid && this.IdTaxe.valid) {
      this.operationService.getOperationAmountsAndExcpectedDuration(this.selectedOperationType, this.UnitNumber.value,
        this.taxeValuePercentage).subscribe((result: any) => {
          this.operationToUpdate.Htprice = result.HtPrice;
          this.operationToUpdate.Ttcprice = result.TtcPrice;
          this.operationToUpdate.ExpectedDuration = result.ExpectedDuration;
          this.operationToUpdate.DurationInDays = result.DurationInDays;
          this.operationToUpdate.DurationInHours = result.DurationInHours;
          this.operationToUpdate.DurationInMinutes = result.DurationInMinutes;
          this.operationToUpdate.DurationInSecondes = result.DurationInSecondes;
        });
    } else {
      this.operationToUpdate.Htprice = 0;
      this.operationToUpdate.Ttcprice = 0;
      this.operationToUpdate.ExpectedDuration = 0;
      this.operationToUpdate.DurationInDays = 0;
      this.operationToUpdate.DurationInHours = 0;
      this.operationToUpdate.DurationInMinutes = 0;
      this.operationToUpdate.DurationInSecondes = 0;
    }
  }

  selectedOpeartionTypeValueChange($event) {
    this.selectedOperationType = $event;
    this.onValueChanged();
    this.getDetailsValue($event);
  }

  taxSelectedChange($event) {
    this.taxeValuePercentage = $event && $event.TaxeValue ? $event.TaxeValue : 0;
    this.onValueChanged();
  }

  updateUnitDetails() {
    this.UnitDetails.setValue(this.unitDetailsValue);
  }

  /**
 * this method will be called by CanDeactivateGuard service to check the leaving component possibility
 */
  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    return this.validationService.handleCanDeactivateToLeaveCurrentComponent(() => !this.saveDone && this.operationFormGroup.dirty);
  }

  get Name(): FormControl {
    return this.operationFormGroup.get(GarageConstant.NAME) as FormControl;
  }

  get IdOperationType(): FormControl {
    return this.operationFormGroup.get(GarageConstant.ID_OPERATION_TYPE) as FormControl;
  }

  get UnitNumber(): FormControl {
    return this.operationFormGroup.get(GarageConstant.UNIT_NUMBER) as FormControl;
  }

  get IdTaxe(): FormControl {
    return this.operationFormGroup.get(GarageConstant.ID_TAXE) as FormControl;
  }
  get UnitDetails(): FormControl {
    return this.operationFormGroup.get(GarageConstant.UNIT_DETAILS) as FormControl;
  }

}
