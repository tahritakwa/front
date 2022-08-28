import { Component, OnInit, ComponentRef } from '@angular/core';
import { IModalDialogOptions, IModalDialog } from 'ngx-modal-dialog';
import { Subject } from 'rxjs/Subject';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ModalDialogInstanceService } from 'ngx-modal-dialog/src/modal-dialog-instance.service';
import { ValidationService, dateValueGT, dateValueLT } from '../../../shared/services/validation/validation.service';
import { ProjectConstant } from '../../../constant/rh/project.constant';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { EmployeeProjectService } from '../../services/employee-project/employee-project.service';
import { EmployeeProject } from '../../../models/rh/employee-project.model';
import { ContractConstant } from '../../../constant/payroll/Contract.constant';
import { Observable } from 'rxjs/Observable';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-assignment-modal',
  templateUrl: './assignment-modal.component.html',
  styleUrls: ['./assignment-modal.component.scss']
})
export class AssignementModalComponent implements OnInit {
  /**
   * Show controls
   */
  public showControl = true;
  /**
   * Assignement form group
   */
  public moveToAssignFormGroup: FormGroup;
  /**
   * Update mode
   */
  isUpdateMode: boolean;
  /*
   * dialog subject
   */
  options: Partial<IModalDialogOptions<any>>;
  reference: ComponentRef<IModalDialog>;
  public closeDialogSubject: Subject<any>;
  public data: any;
  public precision: number;
  public dataAssignementHistoric: EmployeeProject[];
  public showBillableOption: true;
  projectStartDate: Date;
  projectEndDate: Date;
  /**
   * Format Date
   */
  public formatDate: string = this.translate.instant(SharedConstant.DATE_FORMAT);
  public minDate: Date;
  public assignementIsBillable = true;

  constructor(private modalService: ModalDialogInstanceService, private employeeProjectService: EmployeeProjectService,
    private fb: FormBuilder, private validationService: ValidationService, private translate: TranslateService) { }

  dialogInit(reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
    this.options = options;
    this.data = options.data.employeeProject;
    this.precision = options.data.purchasePrecision;
    this.projectStartDate = options.data.projectStartDate;
    this.projectEndDate = options.data.projectEndDate;
    this.showBillableOption = this.data.ShowBillableOption;
    if (this.data && !this.data.IsBillable) {
      this.assignementIsBillable = false;
    }
    if (this.data && this.data.AssignmentDate) {
      const assignmentDay = new Date(this.data.AssignmentDate);
      this.minDate = assignmentDay;
      this.minDate.setDate(assignmentDay.getDate() + 1);
    }
    this.closeDialogSubject = options.closeDialogSubject;
    if (!this.data.ShowControl) {
      this.showControl = false;
    }
  }

  ngOnInit() {
    this.initGridDataSource();
    this.createMoveToAssignForm();
    // change validator
    if (this.precision) {
      this.moveToAssignFormGroup.controls[ProjectConstant.AVAIRAGE_DAILY_RATE].setValidators(
        [Validators.pattern('[0-9]*\.?[0-9]{0,' + this.precision + '}'), Validators.min(NumberConstant.ONE),
          Validators.max(NumberConstant.ONE_BILLION)]);
    }
  }

  /**
   * Init grid with data from the datasource
   */
  initGridDataSource() {
    this.employeeProjectService.getAssignationtHistoric(this.data.IdProject, this.data.IdEmployee)
      .subscribe(data => {
        this.dataAssignementHistoric = data.objectData;
      });
  }

  private createMoveToAssignForm() {
    this.moveToAssignFormGroup = this.fb.group({
      IdEmployee: [this.data && this.data.IdEmployee ? this.data.IdEmployee : NumberConstant.ZERO],
      AssignmentDate: [this.data && this.data.AssignmentDate ? new Date(this.data.AssignmentDate) : '', Validators.required],
      AverageDailyRate: [this.data && this.data.AverageDailyRate ? this.data.AverageDailyRate : '', [Validators.min(NumberConstant.ONE),
       Validators.max(NumberConstant.ONE_BILLION)]],
      UnassignmentDate: [this.data && this.data.UnassignmentDate ? new Date(this.data.UnassignmentDate) : ''],
      IsBillable: [this.data ? this.data.IsBillable : true],
      AssignmentPercentage: [{value: NumberConstant.ONE_HUNDRED, disabled: true},
        [Validators.min(NumberConstant.ZERO), Validators.max(NumberConstant.ONE_HUNDRED), Validators.pattern('^[0-9]*')]],
      CompanyCode: [this.data ? this.data.CompanyCode : '']
    });
    this.AssignmentDate.setValidators([
      Validators.required,
      dateValueGT(new Observable(o => o.next(this.projectStartDate))),
      dateValueLT(new Observable(o => o.next(this.projectEndDate)))
    ]);
  }

  /**
   * When validate
  */
  toAssignClick() {
    if (this.moveToAssignFormGroup.valid) {
      this.options.data = this.moveToAssignFormGroup;
      this.options.onClose();
      this.modalService.closeAnyExistingModalDialog();
    } else {
      this.validationService.validateAllFormFields(this.moveToAssignFormGroup);
    }
  }

  public AssignmentDateValueChange(selectedDate: Date) {
    if (selectedDate) {
      this.minDate = selectedDate;
      this.minDate.setDate(selectedDate.getDate() + NumberConstant.ONE);
      if (this.UnassignmentDate.value && new Date(this.UnassignmentDate.value).getTime() < selectedDate.getTime()) {
        this.UnassignmentDate.reset();
      }
    }
  }

  public clickIsBillableCheckBox() {
    this.assignementIsBillable = !this.assignementIsBillable;
    this.IsBillable.setValue(this.assignementIsBillable);
  }

  get AssignmentDate(): FormControl {
    return this.moveToAssignFormGroup.get(ProjectConstant.ASSIGNMENTDATE) as FormControl;
  }

  get AverageDailyRate(): FormControl {
    return this.moveToAssignFormGroup.get(ProjectConstant.AVAIRAGE_DAILY_RATE) as FormControl;
  }

  get UnassignmentDate(): FormControl {
    return this.moveToAssignFormGroup.get(ProjectConstant.UNASSIGNMENTDATE) as FormControl;
  }

  get IsBillable(): FormControl {
    return this.moveToAssignFormGroup.get(ProjectConstant.IS_BILLABLE) as FormControl;
  }

  get AssignmentPercentage(): FormControl {
    return this.moveToAssignFormGroup.get(ProjectConstant.ASSIGNMENT_PERCENTAGE) as FormControl;
  }

  get CompanyCode(): FormControl {
    return this.moveToAssignFormGroup.get(ProjectConstant.COMPANY_CODE) as FormControl;
  }
}
