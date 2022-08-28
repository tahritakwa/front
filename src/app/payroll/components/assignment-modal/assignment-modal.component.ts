import { Component, OnInit, ComponentRef, ChangeDetectorRef } from '@angular/core';
import { IModalDialogOptions, IModalDialog } from 'ngx-modal-dialog';
import { Subject } from 'rxjs/Subject';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ModalDialogInstanceService } from 'ngx-modal-dialog/src/modal-dialog-instance.service';
import { ValidationService, dateValueLT, dateValueGT } from '../../../shared/services/validation/validation.service';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { EmployeeTeam } from '../../../models/payroll/employee-team.model';
import { EmployeeTeamService } from '../../services/employee-team/employee-team.service';
import { TeamConstant } from '../../../constant/payroll/team.constant';
import { PredicateFormat, Filter, Operation, Relation } from '../../../shared/utils/predicate';
import { isNullOrUndefined } from 'util';
import { Observable } from 'rxjs/Observable';
import { FormModalDialogService } from '../../../shared/services/dialog/form-modal-dialog/form-modal-dialog.service';
import { UtilityService } from '../../../shared/services/utility/utility.service';
import { TranslateService } from '@ngx-translate/core';
import { ObjectToSend } from '../../../models/sales/object-to-save.model';

@Component({
  selector: 'app-assignment-modal',
  templateUrl: './assignment-modal.component.html',
  styleUrls: ['./assignment-modal.component.scss']
})
export class AssignmentModalComponent implements OnInit {
  /**
   * Show controls
   */
  public showControl = true;
  /**
   * Assignement form group
   */
  public moveToAssignFormGroup: FormGroup;
  /**
   * If modal=true
   */
  public isModal: boolean;
  /*
   * dialog subject
   */
  options: Partial<IModalDialogOptions<any>>;
  reference: ComponentRef<IModalDialog>;
  public closeDialogSubject: Subject<any>;
  public data: any;
  public creationDate: any;
  public state: any;
  public dataAssignementHistoric: EmployeeTeam[];
  public employeeTeamToUpdate: EmployeeTeam;
  /**
   * Format Date
   */
  public formatDate: string = this.translate.instant(SharedConstant.DATE_FORMAT);
  public minDate: Date;
  private oldAssignmentDateValue: Date;
  private oldUnassignmentDateValue: Date;
  public minUnassignmentDate: Date;
  public maxAssignmentDate: Date;
  constructor(private modalService: ModalDialogInstanceService,
    private utilityService: UtilityService, private employeeTeamService: EmployeeTeamService,
    private formModalDialogService: FormModalDialogService, private fb: FormBuilder,
    private validationService: ValidationService, private cdRef: ChangeDetectorRef, private translate: TranslateService) { }

  dialogInit(reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
    this.isModal = true;
    this.options = options;
    this.data = options.data.employeeTeam;
    this.creationDate = options.data.CreationDate;
    this.state = options.data.State || options.data.Id === NumberConstant.ZERO;
    if (this.data && this.data.AssignmentDate) {
      const assignmentDay = new Date(this.data.AssignmentDate);
      this.minDate = assignmentDay;
      this.minDate.setDate(assignmentDay.getDate() + NumberConstant.ONE);
    }
    this.closeDialogSubject = options.closeDialogSubject;
    if (!this.data.ShowControl) {
      this.showControl = false;
    }
  }

  ngOnInit() {
    this.initGridDataSource();
    this.createMoveToAssignForm();
  }

  /**
   * Init grid with data from the datasource
   */
  initGridDataSource() {
    this.employeeTeamService.getAssignationtHistoric(this.preparePredicate(), this.data.IdTeam, this.data.IdEmployee)
      .subscribe(data => {
        this.dataAssignementHistoric = data.listObject.listData;
        this.employeeTeamToUpdate = data.objectData;
        if (!isNullOrUndefined(this.employeeTeamToUpdate)) {
          this.employeeTeamToUpdate.AssignmentDate = new Date(this.employeeTeamToUpdate.AssignmentDate);
          this.employeeTeamToUpdate.UnassignmentDate = this.employeeTeamToUpdate.UnassignmentDate !== null ?
            new Date(this.employeeTeamToUpdate.UnassignmentDate) : null;
        }
        if (!isNullOrUndefined(this.employeeTeamToUpdate)) {
          this.moveToAssignFormGroup.patchValue(this.employeeTeamToUpdate);

        }
      });
  }

  /**
   * Prepare predicate for get the team with the specific id
   */
  preparePredicate() {
    const predicate = new PredicateFormat();
    predicate.Filter = new Array<Filter>();
    predicate.Filter.push(new Filter(SharedConstant.ID, Operation.eq, this.data.Id));
    predicate.Relation = new Array<Relation>();
    predicate.Relation.push(new Relation(TeamConstant.EMPLOYEE_TEAM));
    predicate.Relation.push(new Relation(TeamConstant.ID_EMPLOYEE_NAVIGATION));
    return predicate;
  }

  private createMoveToAssignForm() {
    this.moveToAssignFormGroup = this.fb.group({
      IdEmployee: [this.data && this.data.IdEmployee ? this.data.IdEmployee : NumberConstant.ZERO],
      AssignmentDate: [this.data && this.data.AssignmentDate ? new Date(this.data.AssignmentDate) : '', Validators.required],
      UnassignmentDate: [this.data && this.data.UnassignmentDate ? new Date(this.data.UnassignmentDate) : ''],
      AssignmentPercentage: [{ value: this.data && this.data.AssignmentPercentage ? this.data.AssignmentPercentage : NumberConstant.ZERO, disabled: !this.state },
      [Validators.min(NumberConstant.ZERO), Validators.max(NumberConstant.ONE_HUNDRED),
      Validators.pattern('^[0-9]*'), Validators.required]]
    });
    this.addDependentDateControls();
  }
  private addDependentDateControls() {
    this.AssignmentDate.setValidators([Validators.required,
    dateValueGT(Observable.of(this.utilityService.maxDateBetweendates([this.creationDate, this.data.IdEmployeeNavigation.HiringDate])))]);
    this.UnassignmentDate.setValidators([
      dateValueGT(Observable.of(this.utilityService.maxDateBetweendates([this.AssignmentDate.value, this.data.IdEmployeeNavigation.HiringDate])))]);
  }

  changeAssignmentDate() {
    if (this.moveToAssignFormGroup.get(TeamConstant.ASSIGNMENTDATE).value !== this.oldAssignmentDateValue) {
      this.oldAssignmentDateValue = this.moveToAssignFormGroup.get(TeamConstant.ASSIGNMENTDATE).value;
      if (!this.oldAssignmentDateValue) {
        this.minUnassignmentDate = undefined;
      } else {
        this.minUnassignmentDate = this.oldAssignmentDateValue;
      }
      this.cdRef.detectChanges();
    }
  }

  changeUnassignmentDate() {
    if (this.moveToAssignFormGroup.get(TeamConstant.UNASSIGNMENTDATE).value !== this.oldUnassignmentDateValue) {
      this.oldUnassignmentDateValue = this.moveToAssignFormGroup.get(TeamConstant.UNASSIGNMENTDATE).value;

      if (!this.oldUnassignmentDateValue) {
        this.maxAssignmentDate = undefined;
      } else {
        this.maxAssignmentDate = this.oldUnassignmentDateValue;
      }
      this.cdRef.detectChanges();
    }
  }

  /**
   * When validate
  */
  toAssignClick() {
    if (this.moveToAssignFormGroup.valid) {
      if (this.creationDate > this.moveToAssignFormGroup.get(TeamConstant.ASSIGNMENTDATE).value) {
        this.moveToAssignFormGroup.controls[TeamConstant.ASSIGNMENTDATE].setValue('');
        this.validationService.validateAllFormFields(this.moveToAssignFormGroup.controls[TeamConstant.ASSIGNMENTDATE].value);
      }
      this.options.data = this.moveToAssignFormGroup;
      const employeeTeam: EmployeeTeam = Object.assign({}, this.moveToAssignFormGroup.getRawValue());
      employeeTeam.Id = this.data.Id;
      this.data.AssignmentPercentage = employeeTeam.AssignmentPercentage;
      this.data.AssignmentDate = employeeTeam.AssignmentDate;
      this.data.UnassignmentDate = employeeTeam.UnassignmentDate;
      const objectToSave = new ObjectToSend(this.data);
      this.employeeTeamService.validateConditionAssignmentPercentage(objectToSave).toPromise().then(res => {
        if (res && res.flag === NumberConstant.ONE) {
          if (this.data.IdTeam && this.data.Id) {
            this.employeeTeamService.save(this.data, false).subscribe(() => {
            });
          }
          this.options.onClose();
          this.options.closeDialogSubject.next();
        }
        if (isNullOrUndefined(res)) {
          this.data.AssignmentPercentage = NumberConstant.ZERO;
          this.AssignmentPercentage.reset();
        }
      });
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


  get AssignmentDate(): FormControl {
    return this.moveToAssignFormGroup.get(TeamConstant.ASSIGNMENTDATE) as FormControl;
  }

  get UnassignmentDate(): FormControl {
    return this.moveToAssignFormGroup.get(TeamConstant.UNASSIGNMENTDATE) as FormControl;
  }

  get AssignmentPercentage(): FormControl {
    return this.moveToAssignFormGroup.get(TeamConstant.ASSIGNMENT_PERCENTAGE) as FormControl;
  }
}
