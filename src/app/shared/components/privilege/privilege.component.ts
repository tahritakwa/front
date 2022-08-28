import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {AbstractControl, FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {PrivilegUserConstant} from '../../../constant/Administration/privilege-user.constant';
import {ValidationService} from '../../services/validation/validation.service';
import {NumberConstant} from '../../../constant/utility/number.constant';
import {SwalWarring} from '../swal/swal-popup';
import {groupBy, GroupResult} from '@progress/kendo-data-query';
import {isNullOrEmptyString} from '@progress/kendo-angular-grid/dist/es2015/utils';

const MODULE = 'module';
const PRIVILEGE = 'privilege';

@Component({
  selector: 'app-privilege',
  templateUrl: './privilege.component.html',
  styleUrls: ['./privilege.component.scss']
})
export class PrivilegeComponent implements OnInit, OnChanges {
  @Input() form: FormGroup;

  @Input() isUpdateMode: boolean;

  @Input()
  public privilegesLoaded: any;

  @Input()
  public consultMode = false;

  public modules: any[] = [];
  public modulesSelected = [];
  public modulesLoaded: any;
  public privilegeForUpdate: any[] = [];

  /**
   * array of address label with boolean flag
   */
  public privilegeEditable: boolean[] = [];

  public isUpdate: boolean[] = [];
  public selectedValues: any[] = [];
  public data: Array<any> = [
    {
      name: this.translate.instant(PrivilegUserConstant.SAME_LEVEL_WITH_HIERARCHY_TITLE),
      field: PrivilegUserConstant.SAME_LEVEL_WITH_HIERARCHY,
      goupOption: this.translate.instant(PrivilegUserConstant.SAME_LEVEL)
    },
    {
      name: this.translate.instant(PrivilegUserConstant.SAME_LEVEL_WITHOUT_HIERARCHY_TITLE),
      field: PrivilegUserConstant.SAME_LEVEL_WITHOUT_HIERARCHY,
      goupOption: this.translate.instant(PrivilegUserConstant.SAME_LEVEL)
    },
    {
      name: this.translate.instant(PrivilegUserConstant.SUB_LEVEL_TITLE),
      field: PrivilegUserConstant.SUB_LEVEL,
      goupOption: this.translate.instant(PrivilegUserConstant.SUB_LEVEL_TITLE)
    },
    {
      name: this.translate.instant(PrivilegUserConstant.SUPERIOR_LEVEL_WITH_HIERARCHY_TITLE),
      field: PrivilegUserConstant.SUPERIOR_LEVEL_WITH_HIERARCHY,
      goupOption: this.translate.instant(PrivilegUserConstant.SUPERIOR_LEVEL)
    },
    {
      name: this.translate.instant(PrivilegUserConstant.SUPERIOR_LEVEL_WITHOUT_HIERARCHY_TITLE),
      field: PrivilegUserConstant.SUPERIOR_LEVEL_WITHOUT_HIERARCHY,
      goupOption: this.translate.instant(PrivilegUserConstant.SUPERIOR_LEVEL)
    },
    {
      name: this.translate.instant(PrivilegUserConstant.MANAGEMENT_TITLE),
      field: PrivilegUserConstant.MANAGEMENT,
      goupOption: this.translate.instant(PrivilegUserConstant.MANAGEMENT_TITLE)
    }
  ];
  public groupedData: GroupResult[] = groupBy(this.data, [{field: 'goupOption'}]);

  constructor(private fb: FormBuilder, private translate: TranslateService,
              private validationService: ValidationService, private swalWarring: SwalWarring) {
  }

  ngOnInit() {

  }

  private buildPrivilegeForm(UserPrivilege?, index?: number): FormGroup {
    return this.fb.group({
      Id: [UserPrivilege ? UserPrivilege.Id : NumberConstant.ZERO],
      module: [UserPrivilege ? this.modulesSelected[index] : '', Validators.required],
      privilege: [UserPrivilege ? this.selectedValues[index] : '', Validators.required],
    });
  }

  /**
   * add empty privilege by click in the add button
   * @private
   */
  private addEmptyPrivilege(UserPrivilege?, index?) {
    if (this.privilege.valid) {
      this.privilegeEditable.push(false);
      this.privilege.push(this.buildPrivilegeForm(UserPrivilege, index));
      this.setValidatorForm();
    } else {
      this.validationService.validateAllFormFields(this.form);
    }
  }

  public preparePrivilege(index, privilege?) {
    this.modules[index + NumberConstant.ONE] = this.modulesLoaded;
    this.modulesSelected[index + NumberConstant.ONE] = '';
    this.selectedValues[index + NumberConstant.ONE] = [];
    this.changeNextDataElementFiltred(index);
    if (privilege) {
      this.privilegeEditable.push(false);
      this.privilege.push(this.buildPrivilegeForm());
    } else {
      this.isUpdate[index + NumberConstant.ONE] = false;
      this.addEmptyPrivilege();
    }
  }

  public removePrivilege(index: number) {
    this.privilege.removeAt(index);
  }

  public get privilege(): FormArray {
    return this.form.get(PrivilegUserConstant.PRIVILEGE) as FormArray;
  }

  public changeNextDataElementFiltred(index) {
    const dataElementSelected = this.privilege.value.map(data => data.module);
    this.modules[index + NumberConstant.ONE] = this.getModuleNotAttributed(this.modulesLoaded, dataElementSelected);
  }

  getModuleNotAttributed(allModule, moduleSelected) {
    let modules = allModule.concat(moduleSelected);
    return modules.filter(function (value, index, array) {
      if (array.slice(index + NumberConstant.ONE).indexOf(value) === -1 && array.slice(NumberConstant.ZERO, index).indexOf(value) === -1) {
        return value;
      }
    });
  }

  checkValueModuleAttributed(value, index, array): boolean {
    return array.slice(index + NumberConstant.ONE).indexOf(value) === -1 && array.slice(NumberConstant.ZERO, index).indexOf(value) === -1;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.setDataForPrivilegesLoaded();
    if (this.privilegesLoaded && this.privilegesLoaded.length > NumberConstant.ZERO) {
      this.modulesLoaded = this.privilegesLoaded.map(data => (
        {
          valueId: data.Id,
          valueIdPrivilege: data.IdPrivilege,
          text: data.IdPrivilegeNavigation.Label
        }
      ));
    }
    if (this.isUpdateMode && this.privilegesLoaded) {
      this.loadPrivileges();
    } else {
      this.initModuleAndSelectedValues();
    }
  }

  public setDataForPrivilegesLoaded() {
    if (this.privilegesLoaded && this.privilegesLoaded.data) {
      this.privilegesLoaded = this.privilegesLoaded.data;
    }
  }

  public setValidatorForm() {
    if (this.privilege.controls.length === NumberConstant.ONE && this.isEmptyElement(NumberConstant.ZERO)) {
      this.setValidatorsElementPrivilege(null);
    } else {
      this.setValidatorsElementPrivilege(Validators.required);
    }
  }

  public initModuleAndSelectedValues() {
    if (isNullOrEmptyString(this.modules[NumberConstant.ZERO])) {
      this.modules[NumberConstant.ZERO] = this.modulesLoaded;
      this.modulesSelected[NumberConstant.ZERO] = '';
      this.selectedValues[NumberConstant.ZERO] = [];
      if (this.privilege.controls.length === NumberConstant.ZERO) {
        this.addEmptyPrivilege();
      }
    }
  }

  public handleFiltreModule(module, index) {
    this.modules[index].filter((s) => s.toLowerCase().indexOf(module.toLowerCase()) !== -NumberConstant.ONE);
  }

  public loadPrivileges() {
    this.privilegeForUpdate = this.modulesLoaded.filter(data => data.valueId !== NumberConstant.ZERO);
    let indexPrivilege = NumberConstant.ZERO;
    this.privilegeForUpdate.forEach((item, index) => {
      if (this.getSelectedValuesPrivilege(index).length > NumberConstant.ZERO) {
        this.modules[indexPrivilege] = this.modulesLoaded;
        this.modulesSelected[indexPrivilege] = item;
        this.selectedValues[indexPrivilege] = this.getSelectedValuesPrivilege(index);
        this.addEmptyPrivilege(item, indexPrivilege);
        indexPrivilege++;
      }
    });
    this.privilege.removeAt(NumberConstant.ZERO);
    if (this.privilege.controls.length === NumberConstant.ZERO) {
      this.initModuleAndSelectedValues();
    }
  }

  public getSelectedValuesPrivilege(index) {
    const selectedValuesPrivilege = [];
    const privilegesLoadedFiltred = this.privilegesLoaded.filter(data => data.Id !== 0);
    if (privilegesLoadedFiltred[index].SameLevelWithHierarchy) {
      selectedValuesPrivilege.push(this.data[NumberConstant.ZERO]);
    }
    if (privilegesLoadedFiltred[index].SameLevelWithoutHierarchy) {
      selectedValuesPrivilege.push(this.data[NumberConstant.ONE]);
    }
    if (privilegesLoadedFiltred[index].SubLevel) {
      selectedValuesPrivilege.push(this.data[NumberConstant.TWO]);
    }
    if (privilegesLoadedFiltred[index].SuperiorLevelWithHierarchy) {
      selectedValuesPrivilege.push(this.data[NumberConstant.THREE]);
    }
    if (privilegesLoadedFiltred[index].SuperiorLevelWithoutHierarchy) {
      selectedValuesPrivilege.push(this.data[NumberConstant.FOUR]);
    }
    if (privilegesLoadedFiltred[index].Management) {
      selectedValuesPrivilege.push(this.data[NumberConstant.FIVE]);
    }
    return selectedValuesPrivilege;
  }

  public deletePrivilege(privilege: AbstractControl, index) {
    this.swalWarring.CreateDeleteSwal().then((result) => {
      if (result.value) {
        this.privilege.removeAt(index);
        this.deleteElementPrivilege(index);
        if (this.privilege.controls.length === NumberConstant.ZERO) {
          this.initModuleAndSelectedValues();
        }
        this.setValidatorForm();
      }
    });
  }

  deleteElementPrivilege(index: number) {
    this.privilegeEditable.splice(index, NumberConstant.ONE);
    this.modules.splice(index, NumberConstant.ONE);
    this.modulesSelected.splice(index, NumberConstant.ONE);
    this.selectedValues.splice(index, NumberConstant.ONE);
  }

  public isLastElement(privilege: AbstractControl, index) {
    return this.privilege.length - NumberConstant.ONE === index;
  }

  public onValueChange(itemsSelected: Array<any>, index: number) {
    const uniqueArray = itemsSelected.filter((value, i) => {
      const itemSelected = JSON.stringify(value.goupOption);
      return i === itemsSelected.findIndex(obj => {
        return JSON.stringify(obj.goupOption) === itemSelected;
      });
    });
    itemsSelected = uniqueArray;
    this.selectedValues[index] = uniqueArray;

  }

  isEmptyElement(index) {
    const valueModule = this.privilege.value[NumberConstant.ZERO].module;
    const valuePrivilege = this.privilege.value[NumberConstant.ZERO].privilege;
    return (isNullOrEmptyString(valueModule) || isNullOrEmptyString(valuePrivilege)
      || (valuePrivilege && valuePrivilege.length === NumberConstant.ZERO));
  }

  setValidatorsElementPrivilege(validator: any) {
    const firstControl = this.privilege.controls[NumberConstant.ZERO];
    firstControl.get(MODULE).setValidators(validator);
    firstControl.get(PRIVILEGE).setValidators(validator);
    if (isNullOrEmptyString(validator)) {
      firstControl.get(MODULE).setErrors(null);
      firstControl.get(PRIVILEGE).setErrors(null);
    }
  }
}
