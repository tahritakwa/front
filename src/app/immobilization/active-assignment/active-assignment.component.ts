import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { DataSourceRequestState } from '@progress/kendo-data-query';
import { DataStateChangeEvent } from '@progress/kendo-angular-grid';

import { Observable } from 'rxjs/Observable';
import { ColumnSettings } from '../../shared/utils/column-settings.interface';
import { GridSettings } from '../../shared/utils/grid-settings.interface';
import { PredicateFormat, Filter, Operation, Relation, OrderBy, OrderByDirection } from '../../shared/utils/predicate';
import { ActiveAssignmentService } from '../services/active-assignment/active-assignment.service';
import { ValidationService, dateValueLT, dateValueGT } from '../../shared/services/validation/validation.service';
import { ActiveAssignment } from '../../models/immobilization/active-assignment.model';
import { SwalWarring } from '../../shared/components/swal/swal-popup';
import { ActiveDropdownComponent } from '../components/active-dropdown/active-dropdown.component';
import { ActiveConstant } from '../../constant/immobilization/active.constant';
import { EmployeeDropdownComponent } from '../../shared/components/employee-dropdown/employee-dropdown.component';
import { Active } from '../../models/immobilization/active.model';
import { TranslateService } from '@ngx-translate/core';
import { GrowlService } from '../../../COM/Growl/growl.service';
import { NumberConstant } from '../../constant/utility/number.constant';
import { SharedConstant } from '../../constant/shared/shared.constant';
import { PermissionConstant } from '../../Structure/permission-constant';
import { AuthService } from '../../login/Authentification/services/auth.service';

@Component({
  selector: 'app-active-assignment',
  templateUrl: './active-assignment.component.html',
  styleUrls: ['./active-assignment.component.scss']
})
export class ActiveAssignmentComponent implements OnInit {
  private oldAcquisationDateValue: Date;
  private oldAbandonmentDateValue: Date;
  public minAbandonmentDate: Date;
  public minAcquisationDate: Date;
  public maxAcquisationDate: Date;

  private oldAcquisationDateValueInGrid: Date;
  private oldAbandonmentDateValueInGrid: Date;
  public minAbandonmentDateInGrid: Date;
  public minAcquisationDateInGrid: Date;
  public maxAcquisationDateInGrid: Date;

  private nameCurrentActive: string;
  private oldValueOfActive: string;
  public showErrorMessage: boolean;
  // Edited Row index
  private editedRowIndex: number;
  // Grid quick add
  public activeAssignmentFormGroup: FormGroup;
  @ViewChild(ActiveDropdownComponent) childActive;
  @ViewChild(EmployeeDropdownComponent) childEmployee;
  public assignmentFormGroup: FormGroup;
  public isDisabled: boolean;
  private selectedActive: Active;
  /**
* Grid state
*/
  public gridState: DataSourceRequestState = {
    skip: 0,
    take: 10,
    filter: { // Initial filter descriptor
      logic: 'and',
      filters: []
    }
  };

  /**
  * Grid columns
  */
  public columnsConfig: ColumnSettings[] = [
    {
      field: SharedConstant.FULL_NAME_FROM_EMPLOYEE_NAVIGATION,
      title: SharedConstant.EMPLOYEE_UPPER,
      filterable: true,
      _width: NumberConstant.THREE_HUNDRED
    },
    {
      field: ActiveConstant.ACQUISATION_DATE,
      title: ActiveConstant.ACQUISATION_DATE_TITLE,
      filterable: false,
      format: this.translate.instant(SharedConstant.DATE_FORMAT),
      _width: NumberConstant.THREE_HUNDRED
    },
    {
      field: ActiveConstant.ABANDONMENT_DATE,
      title: ActiveConstant.ABANDONMENT_DATE_TITLE,
      filterable: false,
      format: this.translate.instant(SharedConstant.DATE_FORMAT),
      _width: NumberConstant.THREE_HUNDRED
    }
  ];

  // Grid settings
  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig
  };

  private predicate: PredicateFormat;
  public haveAddPermission = false ;
  public haveUpdatePermission = false ;
  public haveDeletePermission = false ;

  constructor(private fb: FormBuilder, private activeAssignmentService: ActiveAssignmentService,
    private validationService: ValidationService, private swalNotif: SwalWarring, private cdRef: ChangeDetectorRef,
    private growlService: GrowlService, private translate: TranslateService,
    private authService: AuthService) { }

  /**
   * Change min value of service date
   * */
  changeAcquisationDate() {
    if (this.assignmentFormGroup.get(ActiveConstant.ACQUISATION_DATE).value !== this.oldAcquisationDateValue) {
      this.oldAcquisationDateValue = this.assignmentFormGroup.get(ActiveConstant.ACQUISATION_DATE).value;
      if (!this.oldAcquisationDateValue || (this.oldAcquisationDateValue && this.oldAcquisationDateValue < this.minAcquisationDate)) {
        this.minAbandonmentDate = this.minAcquisationDate;
      } else {
        this.minAbandonmentDate = this.oldAcquisationDateValue;
      }
      this.cdRef.detectChanges();
    }
  }

  /**
   * Change max value of Acquisation date
   * */
  changeAbandonmentDate() {
    if (this.assignmentFormGroup.get(ActiveConstant.ABANDONMENT_DATE).value !== this.oldAbandonmentDateValue) {
      this.oldAbandonmentDateValue = this.assignmentFormGroup.get(ActiveConstant.ABANDONMENT_DATE).value;
      this.maxAcquisationDate = this.assignmentFormGroup.get(ActiveConstant.ABANDONMENT_DATE).value;
      this.cdRef.detectChanges();
    }
  }

  /**
 * Change min value of service date
 * */
  changeAcquisationDateInGrid() {
    if (this.activeAssignmentFormGroup.get(ActiveConstant.ACQUISATION_DATE).value !== this.oldAcquisationDateValueInGrid) {
      this.oldAcquisationDateValueInGrid = this.activeAssignmentFormGroup.get(ActiveConstant.ACQUISATION_DATE).value;
      if (!this.oldAcquisationDateValueInGrid || (this.oldAcquisationDateValueInGrid && this.oldAcquisationDateValueInGrid < this.minAcquisationDateInGrid)) {
        this.minAbandonmentDateInGrid = this.minAcquisationDateInGrid;
      } else {
        this.minAbandonmentDateInGrid = this.oldAcquisationDateValueInGrid;
      }
      this.cdRef.detectChanges();
    }
  }

  /**
   * Change max value of Acquisation date
   * */
  changeAbandonmentDateInGrid() {
    if (this.activeAssignmentFormGroup.get(ActiveConstant.ABANDONMENT_DATE).value !== this.oldAbandonmentDateValueInGrid) {
      this.oldAbandonmentDateValueInGrid = this.activeAssignmentFormGroup.get(ActiveConstant.ABANDONMENT_DATE).value;
      this.maxAcquisationDateInGrid = this.activeAssignmentFormGroup.get(ActiveConstant.ABANDONMENT_DATE).value;
      this.cdRef.detectChanges();
    }
  }

  public onChangeValueActive() {
    if (this.assignmentFormGroup) {
      if (this.assignmentFormGroup.value[ActiveConstant.ID_ACTIVE] !== this.oldValueOfActive) {
        this.oldValueOfActive = this.assignmentFormGroup.value[ActiveConstant.ID_ACTIVE];
        if (this.assignmentFormGroup.value[ActiveConstant.ID_ACTIVE]) {
          this.selectedActive = this.childActive.activeDataSource.find(x =>
            x.Id === this.assignmentFormGroup.value[ActiveConstant.ID_ACTIVE]);
          if (!this.selectedActive.ServiceDate) {
            this.growlService.ErrorNotification(this.selectedActive.Label + ' ' + this.translate.instant('ACTIF_IS_NOT_COMMISSIONED'));
            this.assignmentFormGroup.get(ActiveConstant.ID_ACTIVE).reset();
          } else {
            const dateAcqActive = this.selectedActive.ServiceDate;
            if (dateAcqActive) {
              this.minAcquisationDate = new Date(new Date(dateAcqActive).toDateString());
              this.minAbandonmentDate = new Date(new Date(dateAcqActive).toDateString());
            }
            this.enableFields();
          }
        } else {
          this.cleanFields();
          this.disableFields();
        }
        this.initGridDataSource();
      }
    }
  }


  private preparePredicate(): void {
    this.predicate = new PredicateFormat();
    this.predicate.Filter = new Array<Filter>();
    if (!this.assignmentFormGroup.value[ActiveConstant.ID_ACTIVE]) {
      this.assignmentFormGroup.value[ActiveConstant.ID_ACTIVE] = 0;
    }
    this.predicate.Filter.push(new Filter(ActiveConstant.ID_ACTIVE, Operation.eq,
      this.assignmentFormGroup.value[ActiveConstant.ID_ACTIVE]));

    this.predicate.OrderBy = new Array<OrderBy>();
    this.predicate.OrderBy.push.apply(this.predicate.OrderBy, [new OrderBy(ActiveConstant.ACQUISATION_DATE, OrderByDirection.desc)]);

    this.predicate.Relation = new Array<Relation>();
    this.predicate.Relation.push.apply(this.predicate.Relation, [new Relation(ActiveConstant.ID_EMPLOYEE_NAVIGATION)]);
  }

  public onAddActiveAssignmentClick(): void {
    if (this.assignmentFormGroup.valid) {
      // Temporary code
      const valueToSend = this.assignmentFormGroup.value as ActiveAssignment;
      if (this.checkOverlappingDates(this.gridSettings.gridData.data, valueToSend.AcquisationDate, valueToSend.AbandonmentDate)) {
        this.activeAssignmentService.save(valueToSend, true).subscribe(() => {
          this.initGridDataSource();
          this.cleanFields();
        });
      } else {
        this.nameCurrentActive = this.childActive.activeDataSource.find(x => x.Id === valueToSend.IdActive).Label;
      }
    } else {
      this.validationService.validateAllFormFields(this.assignmentFormGroup);
    }
  }




  /**
   * Check if Overlapping Dates
   * @param listOfAssignement
   * @param startDate
   * @param endDate
   */
  public checkOverlappingDates(listOfAssignement: any, startDate: Date, endDate: Date): boolean {
    this.showErrorMessage = false;
    let validDates = true;
    if (this.selectedActive && (new Date(new Date(this.selectedActive.ServiceDate).toDateString())) > startDate) {
      this.showErrorMessage = true;
      validDates = false;
    } else if (listOfAssignement.length > 0) {
      for (const assignActive of listOfAssignement) {
        const AcquisationDate: Date = assignActive.AcquisationDate ? new Date(new Date(assignActive.AcquisationDate).toDateString()) : null;
        const AbandonmentDate: Date = assignActive.AbandonmentDate ? new Date(new Date(assignActive.AbandonmentDate).toDateString()) : null;
        if (AcquisationDate && (!((!AbandonmentDate && endDate && endDate < AcquisationDate) ||
          (AbandonmentDate && (startDate > AbandonmentDate || (endDate && endDate < AcquisationDate)))))) {
          this.showErrorMessage = true;
          validDates = false;
          break;
        }
      }
    }
    return validDates;
  }

  /**
 * Quick edit
 * @param param0
 */
  public editHandler({ sender, rowIndex, dataItem }) {
    this.closeEditor(sender);
    this.activeAssignmentFormGroup = this.fb.group({
      Id: [dataItem.Id],
      IdEmployee: [dataItem.IdEmployee],
      IdActive: [dataItem.IdActive],
      AcquisationDate: [dataItem.AcquisationDate ? new Date(new Date(dataItem.AcquisationDate).toDateString()) : null],
      AbandonmentDate: [dataItem.AbandonmentDate ? new Date(new Date(dataItem.AbandonmentDate).toDateString()) : null],
    });
    if(this.gridSettings.gridData.total == 1 || this.gridSettings.gridData.data[this.gridSettings.gridData.total - 1].Id == dataItem.Id ){

      const dateAcqActive = this.childActive.activeDataSource.find(x =>
        x.Id === this.activeAssignmentFormGroup.value[ActiveConstant.ID_ACTIVE]).AcquisationDate;
      if (dateAcqActive) {
        this.minAcquisationDateInGrid = new Date(new Date(dateAcqActive).toDateString()); //new Date(Date.parse(dateAcqActive));
      }
    } else {
      let previousData = this.gridSettings.gridData.data[rowIndex +1];
      if(previousData.AbandonmentDate != null){
        this.minAcquisationDateInGrid = new Date(new Date(previousData.AbandonmentDate).toString());
        this.minAcquisationDateInGrid.setDate(this.minAcquisationDateInGrid.getDate() +1)
        this.minAcquisationDateInGrid.setHours(0);
      }
    }
    this.addDependentDateControls(this.activeAssignmentFormGroup);
    this.editedRowIndex = rowIndex;
    sender.editRow(rowIndex, this.activeAssignmentFormGroup);
  }

  /**
* Close editor
* @param grid
* @param rowIndex
*/
  private closeEditor(grid, rowIndex = this.editedRowIndex) {
    if (rowIndex !== undefined) {
      grid.closeRow(rowIndex);
      this.editedRowIndex = undefined;
      this.activeAssignmentFormGroup = undefined;
    }
  }

  /**
 * Cancel
 * @param param0
 */
  public cancelHandler({ sender, rowIndex }) {
    this.closeEditor(sender, rowIndex);
  }

  /**
 * Save handler
 * @param param0
 */
  public saveHandler({ sender, rowIndex, formGroup }) {
    if ((formGroup as FormGroup).valid) {
      const item: ActiveAssignment = formGroup.value;
      let listInGrid = Array<any>();
      listInGrid = listInGrid.concat(this.gridSettings.gridData.data);
      listInGrid.splice(this.gridSettings.gridData.data.map(({ Id }) => Id).indexOf(item.Id), 1);
      if (this.checkOverlappingDates(listInGrid, item.AcquisationDate, item.AbandonmentDate)) {
        this.activeAssignmentService.save(item, false, this.predicate).subscribe(() => this.initGridDataSource());
        sender.closeRow(rowIndex);
      } else {
        this.nameCurrentActive = this.childActive.activeDataSource.find(x => x.Id === item.IdActive).Label;
      }
    } else {
      this.validationService.validateAllFormFields(formGroup as FormGroup);
    }
  }

  initGridDataSource() {
    this.preparePredicate();
    this.activeAssignmentService.reloadServerSideData(this.gridSettings.state, this.predicate)
      .subscribe(data => this.gridSettings.gridData = data);
  }

  /**
 * Remove handler
 * @param param0
 */
  public removeHandler({ dataItem }) {
    this.swalNotif.CreateSwal().then((result) => {
      if (result.value) {
        this.activeAssignmentService.remove(dataItem, this.predicate).subscribe(() => this.initGridDataSource());
      }
    });
  }

  /**
* Data changed listener
* @param state
*/
  public dataStateChange(state: DataStateChangeEvent): void {
    this.gridSettings.state = state;
    this.initGridDataSource();
  }

  ngOnInit() {
    this.haveAddPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.ADD_ASSIGNMENT_ACTIVE);
    this.haveUpdatePermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.UPDATE_ASSIGNMENT_ACTIVE);
    this.haveDeletePermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.DELETE_ASSIGNMENT_ACTIVE);
    this.createAddForm();
    this.disableFields();
  }

  private createAddForm(): void {
    this.assignmentFormGroup = this.fb.group({
      Id: [0],
      IdActive: [undefined],
      IdEmployee: [undefined, Validators.required],
      AcquisationDate: [],
      AbandonmentDate: []
    });
    this.addDependentDateControls(this.assignmentFormGroup);
  }
  private addDependentDateControls(currentformGroup: FormGroup) {
    this.setAcquisationDateControl(currentformGroup);
    this.setAbandonmentDateControl(currentformGroup);
    this.AcquisationDate(currentformGroup).valueChanges.subscribe(() => {
      if (this.AbandonmentDate(currentformGroup).hasError(ActiveConstant.DATE_VALUE_GT)) {
        this.AbandonmentDate(currentformGroup).setErrors(null);
      }
    });
    this.AbandonmentDate(currentformGroup).valueChanges.subscribe(() => {
      if (this.AcquisationDate(currentformGroup).hasError(ActiveConstant.DATE_VALUE_LT)) {
        this.AcquisationDate(currentformGroup).setErrors(null);
      }
    });

  }
  private setAcquisationDateControl(currentformGroup: FormGroup) {
    const oAbandonmentDate = new Observable<Date>(observer => observer.next(this.AbandonmentDate(currentformGroup).value));
    const oServiceDate = new Observable<Date>(observer => observer.next(this.minAcquisationDate));
    currentformGroup.setControl(ActiveConstant.ACQUISATION_DATE, this.fb.control(currentformGroup.value.AcquisationDate,
      [Validators.required, dateValueLT(oAbandonmentDate), dateValueGT(oServiceDate)]));
  }
  private setAbandonmentDateControl(currentformGroup: FormGroup) {
    const oAcquisationDate = new Observable<Date>(observer => observer.next(this.AcquisationDate(currentformGroup).value));
    const oServiceDate = new Observable<Date>(observer => observer.next(this.minAcquisationDate));
    currentformGroup.setControl(ActiveConstant.ABANDONMENT_DATE, this.fb.control(currentformGroup.value.AbandonmentDate,
      [dateValueGT(oAcquisationDate), dateValueGT(oServiceDate)]));
  }
  private AcquisationDate(currentformGroup: FormGroup): FormControl {
    return currentformGroup.get(ActiveConstant.ACQUISATION_DATE) as FormControl;
  }
  private AbandonmentDate(currentformGroup: FormGroup): FormControl {
    return currentformGroup.get(ActiveConstant.ABANDONMENT_DATE) as FormControl;
  }
  private cleanFields(): void {
    if (this.childEmployee) {
      this.childEmployee.employeeFiltredDataSource = this.childEmployee.employeeDataSource;
    }
    this.assignmentFormGroup.get(ActiveConstant.ID_EMPLOYEE).reset();
    this.assignmentFormGroup.get(ActiveConstant.ACQUISATION_DATE).reset();
    this.assignmentFormGroup.get(ActiveConstant.ABANDONMENT_DATE).reset();
  }

  private disableFields(): void {
    this.assignmentFormGroup.get(ActiveConstant.ID_EMPLOYEE).disable();
    this.assignmentFormGroup.get(ActiveConstant.ACQUISATION_DATE).disable();
    this.assignmentFormGroup.get(ActiveConstant.ABANDONMENT_DATE).disable();
    this.isDisabled = true;
  }
  private enableFields(): void {
    this.assignmentFormGroup.get(ActiveConstant.ID_EMPLOYEE).enable();
    this.assignmentFormGroup.get(ActiveConstant.ACQUISATION_DATE).enable();
    this.assignmentFormGroup.get(ActiveConstant.ABANDONMENT_DATE).enable();
    this.isDisabled = false;
  }
}
