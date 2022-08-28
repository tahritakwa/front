import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { PagerSettings, SelectAllCheckboxState } from '@progress/kendo-angular-grid';
import { DataResult, State } from '@progress/kendo-data-query';
import { Observable } from 'rxjs/Observable';
import { GrowlService } from '../../../../COM/Growl/growl.service';
import { GarageConstant } from '../../../constant/garage/garage.constant';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { Mileage } from '../../../models/garage/mileage.model';
import { unique, ValidationService } from '../../../shared/services/validation/validation.service';
import { ColumnSettings } from '../../../shared/utils/column-settings.interface';
import { GridSettings } from '../../../shared/utils/grid-settings.interface';
import { Filter, Operation, OrderByDirection, PredicateFormat, Relation } from '../../../shared/utils/predicate';
import { MileageService } from '../../services/mileage/mileage.service';
import { OperationService } from '../../services/operation/operation.service';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { AuthService } from '../../../login/Authentification/services/auth.service';

@Component({
  selector: 'app-add-operation-proposed',
  templateUrl: './add-operation-proposed.component.html',
  styleUrls: ['./add-operation-proposed.component.scss']
})
export class AddOperationProposedComponent implements OnInit {
  pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
  public predicate: PredicateFormat = new PredicateFormat();
  // URL
  OPERATION_PROPOSED_LIST_URL = GarageConstant.OPERATION_PROPOSED_LIST_URL;

  // FormGroup Properties
  mileageFormGroup: FormGroup;

  // Update Properties
  isUpdateMode = false;
  id: number;
  mileage = new Mileage();
  private saveDone = false;
  // Permission Parameters
  public hasAddPermission: boolean;
  public hasUpdatePermission: boolean;

  // selection properties
  selectAllState: SelectAllCheckboxState = SharedConstant.UNCHECKED as SelectAllCheckboxState;
  selectedItemsIds = [];
  selectableSettings = {
    checkboxOnly: true,
    mode: GarageConstant.MULTIPLE
  };
  public allOperationsIds = [];

  public filterValue = '';

  public gridState: State = {
    skip: 0,
    take: 20,
    // Initial filter descriptor
    filter: {
      logic: SharedConstant.LOGIC_AND,
      filters: []
    },
    sort: [
      {
        field: GarageConstant.ID,
        dir: SharedConstant.DESC
      }
    ],
    group: []
  };

  columnsConfig: ColumnSettings[] = [
    {
      field: GarageConstant.NAME,
      title: GarageConstant.OPERATION,
      filterable: true,
    },
    {
      field: GarageConstant.EXPECTED_DURATION,
      title: GarageConstant.EXPECTED_DURATION_TITLE,
      filterable: true,
    },
    {
      field: GarageConstant.ID_OPERATION_TYPE,
      title: GarageConstant.OPERATION_TYPE_TITLE,
      filterable: true,
    },
  ];

  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig,
  };

  constructor(private fb: FormBuilder, private validationService: ValidationService,
    private router: Router, private activatedRoute: ActivatedRoute, private mileageService: MileageService,
    private operationService: OperationService, private translate: TranslateService, private growService: GrowlService,
    private authService: AuthService) {
    this.activatedRoute.params.subscribe(params => {
      this.id = +params[SharedConstant.ID_LOWERCASE] || NumberConstant.ZERO;
      this.isUpdateMode = this.id > NumberConstant.ZERO;
    });
  }

  ngOnInit() {
    this.hasAddPermission = this.authService.hasAuthority(PermissionConstant.SettingsGaragePermissions.ADD_OPERATION_PROPOSED);
    this.hasUpdatePermission = this.authService.hasAuthority(PermissionConstant.SettingsGaragePermissions.UPDATE_OPERATION_PROPOSED);
    this.createAddForm();
    if (this.isUpdateMode) {
      this.syncInitGridInUpdateMode();
    } else {
      this.initGridDataSource();
    }
  }
  /**
    * Create mileage add form
   */
  private createAddForm(mileage?): void {
    this.mileageFormGroup = this.fb.group({
      Id: [mileage ? mileage.Id : 0],
      Name: [mileage ? mileage.Name : undefined, {
        validators: [Validators.required, Validators.maxLength(NumberConstant.TWO_HUNDRED_FIFTY_FIVE)],
        asyncValidators: unique(GarageConstant.NAME, this.mileageService, this.id ? String(this.id) : String(NumberConstant.ZERO)),
        updateOn: 'blur'
      }],
      MileageValue: [mileage ? mileage.MileageValue : undefined, {
        validators: Validators.required,
        asyncValidators: unique(GarageConstant.MILEAGE_VALUE, this.mileageService, this.id ? String(this.id) : String(NumberConstant.ZERO)),
        updateOn: 'blur'
      }],
    });
  }
  /**
     * init operation grid for add
    */
  public initGridDataSource() {
    this.preparePredicate();
    this.operationService.getOperationsForMileage(this.gridSettings.state, this.predicate)
    .subscribe(result => {
      this.gridSettings.gridData = new Object() as DataResult;
      this.gridSettings.gridData.data = result.Data;
      this.gridSettings.gridData.total = result.Total;
      this.allOperationsIds = result.AllItemIds;
    });
  }
  // Initialise data grid and check the operations associated for update
  private syncInitGridInUpdateMode() {
    this.preparePredicate();
    this.operationService.getOperationsForMileage(this.gridSettings.state, this.predicate)
      .subscribe(result => {
        this.gridSettings.gridData = new Object() as DataResult;
        this.gridSettings.gridData.data = result.Data;
        this.gridSettings.gridData.total = result.Total;
        this.allOperationsIds = result.AllItemIds;
        this.getDataToUpdate();
      });
  }

  public preparePredicate(): void {
    this.predicate.Relation = new Array<Relation>();
    this.predicate.Relation.push(new Relation(GarageConstant.ID_OPERATION_TYPE_NAVIGATION));
}

  /**
   * Get data to Update
   */
  getDataToUpdate() {
    const predicateModel = new PredicateFormat();
    predicateModel.Filter = new Array<Filter>();
    predicateModel.Filter.push(new Filter(GarageConstant.ID, Operation.eq, this.id));
    predicateModel.Relation = new Array<Relation>();
    predicateModel.Relation.push(new Relation(GarageConstant.MILEAGE_PROPOSED_OPERATION));
    this.mileageService.getModelByCondition(predicateModel).subscribe((dataMileage) => {
        this.mileage = dataMileage;
        this.mileageFormGroup.patchValue(this.mileage);
        this.selectedItemsIds = this.mileage.MileageProposedOperation.map(m => m.IdOperation);
      this.onSelectedKeysChange();
      if (!this.hasUpdatePermission) {
        this.mileageFormGroup.disable();
      }
      });
  }

  public dataStateChange(state: State): void {
    this.gridSettings.state = state;
    this.initGridDataSource();
  }

  public goBackToList(): void {
    this.router.navigateByUrl(GarageConstant.OPERATION_PROPOSED_LIST_URL);
  }
  public onSelectAllChange(checkedState: SelectAllCheckboxState) {
    if (checkedState === SharedConstant.CHECKED as SelectAllCheckboxState) {
      this.selectAllState = SharedConstant.CHECKED as SelectAllCheckboxState;
      this.selectedItemsIds = Object.assign([], this.allOperationsIds);
    } else {
      this.selectAllState = SharedConstant.UNCHECKED as SelectAllCheckboxState;
      this.selectedItemsIds = [];
    }
  }

  public onSelectedKeysChange() {
    if (this.selectedItemsIds.length === 0) {
      this.selectAllState = SharedConstant.UNCHECKED as SelectAllCheckboxState;
    } else if (this.selectedItemsIds.length > 0 && this.selectedItemsIds.length < this.allOperationsIds.length) {
      this.selectAllState = SharedConstant.INDETERMINATE as SelectAllCheckboxState;
    } else {
      this.selectAllState = SharedConstant.CHECKED as SelectAllCheckboxState;
    }
  }
  /**
 * add mileage and operations associated
 */
  save() {
    if (this.mileageFormGroup.valid) {
      if (this.selectedItemsIds.length > 0) {
        this.mileage = this.mileageFormGroup.getRawValue();
        if (this.isUpdateMode) {
          this.mileageService.updateMileage(this.mileage, this.selectedItemsIds).subscribe(() => {
            this.saveDone = true;
            this.goBackToList();
          });
        } else {
          this.mileageService.addMileage(this.mileage, this.selectedItemsIds).subscribe(() => {
            this.saveDone = true;
            this.goBackToList();
          });
        }
      } else {
        this.growService.warningNotification(this.translate.instant(GarageConstant.NO_OPERATION_SELLECTED_ALERT_INFO));
      }
    } else {
      this.validationService.validateAllFormFields(this.mileageFormGroup);
    }
  }

  public doFilter() {
    this.predicate.Filter = new Array<Filter>();
    if (this.filterValue) {
      this.filterValue = this.filterValue ? this.filterValue.replace(/\s+/g, SharedConstant.BLANK_SPACE) : this.filterValue;
      this.predicate.Filter.push(new Filter(GarageConstant.NAME, Operation.contains, this.filterValue, false, true));
      this.predicate.Filter.push(new Filter(GarageConstant.ID_OPERATION_TYPE_NAVIGATION_TO_NAME,
        Operation.contains, this.filterValue, false, true));
      this.predicate.Filter.push(new Filter(GarageConstant.EXPECTED_DURATION, Operation.contains, this.filterValue, false, true));
    }
    this.gridSettings.state = this.gridState;
    this.initGridDataSource();
  }
  /**
  * this method will be called by CanDeactivateGuard service to check the leaving component possibility
  */
  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    return this.validationService.handleCanDeactivateToLeaveCurrentComponent(() => !this.saveDone && this.mileageFormGroup.dirty);
  }

  get Name(): FormControl {
    return this.mileageFormGroup.get(GarageConstant.NAME) as FormControl;
  }

  get MileageValue(): FormControl {
    return this.mileageFormGroup.get(GarageConstant.MILEAGE_VALUE) as FormControl;
  }

}
