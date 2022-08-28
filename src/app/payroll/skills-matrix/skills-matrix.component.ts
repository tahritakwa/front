import { Component, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { DataStateChangeEvent, PagerSettings } from '@progress/kendo-angular-grid';
import { DataResult, DataSourceRequestState, process } from '@progress/kendo-data-query';
import { Options } from 'ng5-slider';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { EmployeeConstant } from '../../constant/payroll/employee.constant';
import { SkillsMatrixConstant } from '../../constant/payroll/skills-matrix.constant';
import { SkillsConstant } from '../../constant/payroll/skills.constant';
import { SharedConstant } from '../../constant/shared/shared.constant';
import { NumberConstant } from '../../constant/utility/number.constant';
import { AuthService } from '../../login/Authentification/services/auth.service';
import { EmployeeSkillsMatrixFilter } from '../../models/enumerators/employee-skills-matrix-filter.enum';
import { EmployeeSkills } from '../../models/payroll/employee-skills.model';
import { SkillsRating } from '../../models/payroll/skills-rating.model';
import { ObjectToSend } from '../../models/sales/object-to-save.model';
import { EmployeeMultiselectComponent } from '../../shared/components/employee-multiselect/employee-multiselect.component';
import { uniqueValueInFormArray } from '../../shared/services/validation/validation.service';
import { Filter, Operation, OrderBy, OrderByDirection, PredicateFormat } from '../../shared/utils/predicate';
import { PermissionConstant } from '../../Structure/permission-constant';
import { RatingPerSkillsComponent } from '../components/rating-per-skills/rating-per-skills.component';
import { EmployeeSkillsService } from '../services/employee-skills/employee-skills.service';
import { SkillsService } from '../services/skills/skills.service';

@Component({
  selector: 'app-skills-matrix',
  templateUrl: './skills-matrix.component.html',
  styleUrls: ['./skills-matrix.component.scss']
})

export class SkillsMatrixComponent implements OnInit , OnDestroy {

  @ViewChild(EmployeeMultiselectComponent) childEmployeesDropDown;
  @ViewChildren(RatingPerSkillsComponent) RatingChils: QueryList<RatingPerSkillsComponent>;

  // grid settings
  pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;

  // stars notes
  numbers = [NumberConstant.ONE, NumberConstant.TWO, NumberConstant.THREE, NumberConstant.FOUR, NumberConstant.FIVE, NumberConstant.SIX];

  // grid setting
  gridData: DataResult;
  public gridState: DataSourceRequestState;
  public itemEmployeeSkills: any;
  public colorPalette = ['rgba(221, 221, 229, 0.25)', '#f0f3f552'];
  public generiqueColumnConfig = [{
    field: SkillsMatrixConstant.TEAM,
    title: SkillsMatrixConstant.TEAM_UPPERCASE,
    _width: 200,
    filterable: true,
  },
    {
      field: EmployeeConstant.EMPLOYEE_FULL_NAME,
      title: EmployeeConstant.EMPLOYEE_BY_TEAM,
      _width: 250,
      filterable: true,
    }
  ];
  public columnsConfig: any[] = [];
  public columnsConfigWithoutFilter: any[] = [];
  public keysWithoutFilter: any[] = [];
  Skills: any[] = [];
  Keys: any[] = [];

  // object to communicate with server
  objectToSend: ObjectToSend;
  public predicate: PredicateFormat;
  public hasChangeRangeSkillsMatrixPermission = false;
  // If no skills is configured the show message
  SkillsConfigured = false;
  showMessage = false;

  // edit in grid
  editedColumn = 0;
  formGroup: FormGroup;

  // Filter FormGroup
  skillsFormGroup: FormGroup;
  filterFormGroup: FormGroup;

  // Filter properties
  selectedTeam = 0;
  selectedEmployees: any[] = [];
  selectedSkills: any[] = [];
  employeeSkillsMatrixFilter: EmployeeSkillsMatrixFilter;
  skillsFamilySelected: any[] = [];
  isSelectedSkill=false;
  public readCreerPermission = false;
  // Slider Properties
  minValue = 0;
  maxValue = 5;
  options: Options = {
    floor: 0,
    ceil: 5,
    getPointerColor: (value: number): string => 'rgb(163, 183, 190)',
    getSelectionBarColor: (value: number): string => 'rgb(163, 183, 190)',
  };
  private subscriptions: Subscription[]= [];

  constructor(public skillsService: SkillsService,
              private employeeSkillsService: EmployeeSkillsService,
              private fb: FormBuilder,
              private authService: AuthService,
              private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.hasChangeRangeSkillsMatrixPermission =
      this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.CHANGE_RANGE_SKILLS_MATRIX);
    this.createFilterFormGroup();
    this.addSkillsLevel();
    this.gridState = this.initializeState();
    this.getColumnName();
  }

  public get SkillsLevels(): FormArray {
    return this.filterFormGroup.controls[SkillsMatrixConstant.SKILLS_LEVELS] as FormArray;
  }

  public createFilterFormGroup() {
    this.filterFormGroup = this.fb.group({
      IdTeam: [undefined],
      SkillsLevels: this.fb.array([]),
    });
  }

  public addSkillsLevel(): void {
    if (this.filterFormGroup.valid) {
      this.SkillsLevels.push(this.createSkillsFormGroup());
    }
  }

  public deleteSkillsLevel(index) {
    this.SkillsLevels.removeAt(index);
    this.validateForm();
    this.gridState = this.initializeState();
    this.skillsSelected();
  }

  public createSkillsFormGroup(): FormGroup {
    return new FormGroup({
      IdSkills: new FormControl(undefined, uniqueValueInFormArray(Observable.of(this.SkillsLevels), SkillsConstant.ID_SKILLS)),
      Rate: new FormControl([1, 6])
    });
  }

  getColumnName() {
    this.columnsConfig = [];
    this.columnsConfigWithoutFilter = [];
    this.Keys = [];
    this.keysWithoutFilter = [];
    this.predicate = new PredicateFormat();
    this.predicate.OrderBy = new Array<OrderBy>();
    this.predicate.OrderBy.push.apply(this.predicate.OrderBy, [new OrderBy(SkillsConstant.LABEL, OrderByDirection.asc)]);
    this.subscriptions.push(this.skillsService.readPredicateData(this.predicate)
      .subscribe(res => {
        this.Skills = res;
        if (res && res.length > 0) {
          this.SkillsConfigured = true;
          res.forEach(element => {
            this.columnsConfig.push(
              {
                field: 'Skills.' + element.Id,
                _width: 270,
                selector: element.Id,
                title: element.Label,
                filterable: true,
              }
            );
            this.Keys.push(element.Id);
          });
          Object.assign(this.columnsConfigWithoutFilter, this.columnsConfig);
          Object.assign(this.keysWithoutFilter, this.Keys);
          this.predicate = new PredicateFormat();
          this.getMatrix();
        } else {
          this.SkillsConfigured = false;
        }
      }));
  }

  /**
   * Data changed listener
   * @param state
   */
  public dataStateChange(state: DataStateChangeEvent): void {
    this.gridState = state;
    this.getMatrix();

  }

  preparePredicate() {
    this.predicate = new PredicateFormat();
    this.employeeSkillsService.prepareServerOptions(this.gridState, this.predicate);
    this.employeeSkillsMatrixFilter = new EmployeeSkillsMatrixFilter();
    this.employeeSkillsMatrixFilter.Page = this.predicate.page;
    this.employeeSkillsMatrixFilter.PageSize = this.predicate.pageSize;
    this.employeeSkillsMatrixFilter.IdTeam = this.selectedTeam;
    this.employeeSkillsMatrixFilter.EmployeesId = this.selectedEmployees;
    this.employeeSkillsMatrixFilter.SkillsLevels = [];
    if (this.SkillsLevels.length > 0) {
      for (let index = 0; index < this.SkillsLevels.length; index++) {
        const skillsLevel = new SkillsRating();
        skillsLevel.IdSkills = (this.SkillsLevels.at(index) as FormGroup).controls[SkillsMatrixConstant.ID_SKILLS].value;
        skillsLevel.MinLevel = (this.SkillsLevels.at(index) as FormGroup).controls[SkillsMatrixConstant.RATE].value[0];
        skillsLevel.MaxLevel = (this.SkillsLevels.at(index) as FormGroup).controls[SkillsMatrixConstant.RATE].value[1];
        if (skillsLevel.IdSkills) {
          this.employeeSkillsMatrixFilter.SkillsLevels.push(skillsLevel);
        }
      }
    }
  }

  public changeRateLevel() {
    if(this.isSelectedSkill === true){
      this.validateForm();
      this.gridState = this.initializeState();
      this.skillsSelected();
    }
  }
  public getSkill($event) {
    if($event!== undefined)
    {
      this.isSelectedSkill = true;
    }
    else
    {
      this.isSelectedSkill = false;
    }

  }

  public validateForm() {
    for (let index = 0; index < this.SkillsLevels.length; index++) {
      (this.SkillsLevels.at(index) as FormGroup).get(SkillsConstant.ID_SKILLS).updateValueAndValidity();
    }
  }

  getMatrix() {
    this.preparePredicate();
    this.subscriptions.push(this.employeeSkillsService.getSkillsMatrix(this.employeeSkillsMatrixFilter).subscribe((res: DataResult) => {
      this.showMessage = true;
      this.gridData = res;
      const state = this.initializeState();
      state.skip = 0;
      state.take = this.gridState.take;
      state.filter = this.gridState.filter;
      state.group = this.gridState.group;
      state.sort = this.gridState.sort;
      // Grouping
      const Process = process(res.data, state);
      /* Regroup returned data */
      this.gridData = res;
      this.gridData.data = Process.data;
      this.gridData.total = res.total;
    }));
  }

  private isReadOnly(field: string): boolean {
    const readOnlyColumns = [EmployeeConstant.EMPLOYEE_FULL_NAME];
    return readOnlyColumns.indexOf(field) > -1;
  }

  public cellClickHandler({ sender, rowIndex, column, columnIndex, dataItem, isEdited }) {
    if (this.hasChangeRangeSkillsMatrixPermission) {
      this.editedColumn = columnIndex - 1;
      this.itemEmployeeSkills = dataItem;
      if (!isEdited && !this.isReadOnly(column.field)) {
        sender.editCell(rowIndex, columnIndex, this.createLineFormGroup(dataItem));
      }
    }
  }

  public cellCloseHandler(formGroup) {
    const employeeSkills = new EmployeeSkills();
    employeeSkills.IdEmployee = this.itemEmployeeSkills.Employee.Id;
    employeeSkills.IdSkills = this.Keys[this.editedColumn];
    const oldValueOfRating = this.itemEmployeeSkills.Skills[employeeSkills.IdSkills];
    this.itemEmployeeSkills.Skills = formGroup.getRawValue();
    employeeSkills.Rate = this.itemEmployeeSkills.Skills[employeeSkills.IdSkills];
    if (employeeSkills.Rate !== oldValueOfRating) {
      this.objectToSend = new ObjectToSend(employeeSkills);
      this.subscriptions.push(this.employeeSkillsService.SaveRating(this.objectToSend).subscribe(
        res => { },
        error => {
          this.itemEmployeeSkills.Skills[employeeSkills.IdSkills] = oldValueOfRating;
        }));
    }
  }

  public createLineFormGroup(dataItem: any): FormGroup {
    const formGroup = this.formBuilder.group({});
    if (this.Keys.length > 0) {
      this.Keys.forEach(key => {
        formGroup.addControl(key, new FormControl(dataItem.Skills[key]));
      });
    }
    return formGroup;
  }

  public cleanCellValue(formControl: FormControl) {
    formControl.setValue(0);

  }
  public getColor(i): string {
    if ((i % 2) === 0) {
      return this.colorPalette[0];
    } else {
      return this.colorPalette[1];
    }
  }
  public initializeState(): DataSourceRequestState {
    return {
      skip: NumberConstant.ZERO,
      take: NumberConstant.TEN,
      filter: { // Initial filter descriptor
        logic: 'and',
        filters: []
      },
      group: [{ field: SkillsMatrixConstant.TEAM }]
    };
  }
  teamSelected($event) {
    this.selectedTeam = $event.formGroup.controls[SkillsMatrixConstant.ID_TEAM].value;
    this.selectedEmployees = [];
    if (this.childEmployeesDropDown) {
      this.childEmployeesDropDown.initialiseEmployeeDropdown();
      this.childEmployeesDropDown.SetTeam(this.selectedTeam);
    }
    this.gridState = this.initializeState();
    this.getMatrix();
  }

  /**
   * When user choose a specific employees
   * @param $event
   */
  employeeSelected($event) {
    this.selectedEmployees = $event;
    this.gridState = this.initializeState();
    this.getMatrix();
  }

  /**
   * When Family is selected
   * @param $event
   */
  familySelected($event) {
    this.skillsFamilySelected = $event.selectedValueMultiSelect;
    if (this.RatingChils && this.RatingChils.length > 0) {
      this.RatingChils.forEach(ratingChild => {
        ratingChild.getSkillsRelatedToFamily(this.skillsFamilySelected);
      });
    }
    if (this.skillsFamilySelected && this.skillsFamilySelected.length > 0) {
      this.checkSkillsFilter();
    }
  }

  /**
   * if family changed then clear skills filter that doesn't respect the family clause
   */
  checkSkillsFilter() {
    const skillsPredicate = new PredicateFormat();
    skillsPredicate.Filter = new Array<Filter>();
    if (this.skillsFamilySelected && this.skillsFamilySelected.length > 0) {
      this.skillsFamilySelected.forEach(tier => {
        skillsPredicate.Filter.push(new Filter(SkillsConstant.ID_FAMILY, Operation.eq, tier, false, true));
      });
    }
    let AllSkillsIdsBelongToTheSelectedFamily = [];
    const formGroupToRemove = [];
    this.subscriptions.push(this.skillsService.readPredicateData(skillsPredicate).subscribe(data => {
      AllSkillsIdsBelongToTheSelectedFamily = data.slice(0).map(x => x.Id);
      for (let index = 0; index < this.SkillsLevels.length; index++) {
        const formGroup = (this.SkillsLevels.at(index) as FormGroup);
        const canKeepFilter = (AllSkillsIdsBelongToTheSelectedFamily
            .filter(x => x === formGroup.controls[SkillsConstant.ID_SKILLS].value)[0] !== undefined
          || formGroup.controls[SkillsConstant.ID_SKILLS].value === undefined
          || formGroup.controls[SkillsConstant.ID_SKILLS].value === null);
        if (!canKeepFilter) {
          formGroupToRemove.push(formGroup);
        }
      }
      if (formGroupToRemove.length > 0) {
        formGroupToRemove.forEach(form => {
          const indexInArray = this.SkillsLevels.controls
            .findIndex(x => x.get(SkillsConstant.ID_SKILLS) === form.get(SkillsConstant.ID_SKILLS));
          this.deleteSkillsLevel(indexInArray);
        });
      }
    }));
  }

  /**
   * when user indicate skills that should be display in the matrix
   */
  skillsSelected() {
    if (this.SkillsLevels.length > 0) {
      this.Keys = [];
      this.columnsConfig = [];
      let filterContainsValueNotNull = false;
      for (let index = 0; index < this.SkillsLevels.length; index++) {
        let skillsId;
        skillsId = (this.SkillsLevels.at(index) as FormGroup).controls[SkillsMatrixConstant.ID_SKILLS].value;
        if (skillsId) {
          filterContainsValueNotNull = true;
          const alreadyExists = this.columnsConfig.filter(x => x.selector === skillsId)[0] !== undefined;
          if (!alreadyExists) {
            const config = this.columnsConfigWithoutFilter.filter(x => x.selector === skillsId)[0];
            this.columnsConfig.push(config);
            this.Keys.push(skillsId);
          }
        }
      }
      if (!filterContainsValueNotNull) {
        this.columnsConfig = this.columnsConfigWithoutFilter;
        this.Keys = this.keysWithoutFilter;
      }
    } else {
      this.columnsConfig = this.columnsConfigWithoutFilter;
      this.Keys = this.keysWithoutFilter;
    }
    this.getMatrix();
  }

  ngOnDestroy(): void {
    if (this.subscriptions !== undefined) {
      this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }
  }
}
