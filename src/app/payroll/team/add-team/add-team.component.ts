import {Component, ComponentRef, OnDestroy, OnInit, ViewContainerRef, ViewEncapsulation, ViewChild, ElementRef} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {NumberConstant} from '../../../constant/utility/number.constant';
import {Team} from '../../../models/payroll/team.model';
import {EmployeeTeam} from '../../../models/payroll/employee-team.model';
import {SharedConstant} from '../../../constant/shared/shared.constant';
import {TeamService} from '../../services/team/team.service';
import {ActivatedRoute, Router} from '@angular/router';
import {unique, ValidationService} from '../../../shared/services/validation/validation.service';
import {EmployeeTeamService} from '../../services/employee-team/employee-team.service';
import {SwalWarring} from '../../../shared/components/swal/swal-popup';
import {FormModalDialogService} from '../../../shared/services/dialog/form-modal-dialog/form-modal-dialog.service';
import {Filter, Operation, PredicateFormat, Relation} from '../../../shared/utils/predicate';
import {TeamConstant} from '../../../constant/payroll/team.constant';
import {isNullOrUndefined} from 'util';
import {AssignmentModalComponent} from '../../components/assignment-modal/assignment-modal.component';
import {EmployeeService} from '../../services/employee/employee.service';
import {IModalDialog, IModalDialogOptions} from 'ngx-modal-dialog';
import {ModalDialogInstanceService} from 'ngx-modal-dialog/src/modal-dialog-instance.service';
import {Employee} from '../../../models/payroll/employee.model';
import {Observable} from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription';
import {PermissionConstant} from '../../../Structure/permission-constant';
import { TranslateService } from '@ngx-translate/core';
import { EmployeeState } from '../../../models/enumerators/employee-state.enum';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { ListEmployeeComponent } from '../../employee/list-employee/list-employee.component';
import { forEach } from '@angular/router/src/utils/collection';

@Component({
  selector: 'app-add-team',
  templateUrl: './add-team.component.html',
  styleUrls: ['./add-team.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AddTeamComponent implements OnInit, OnDestroy {
  public teamFormGroup: FormGroup;
  public isUpdateMode = false;
  public id: number = NumberConstant.ZERO;
  public teamToUpdate: Team;
  public freeResources: EmployeeTeam[];
  public assignResources: EmployeeTeam[];
  public oldManagerTeam: EmployeeTeam;
  public newManagerTeam: EmployeeTeam;
  public status: any;
  public employeeAssociated: Employee;
  public dateFormat = this.translate.instant(SharedConstant.DATE_FORMAT);
  public currentDate = Date.now;
  public isModal: boolean;
  private idTeam: number;
  private isUpdateManager = false;
  private isSaveOperation = false;
  private subscriptions: Subscription[] = [];
  @ViewChild('BackToList') backToList: ElementRef;
  @ViewChild(ListEmployeeComponent) listEmployeeComponent: ListEmployeeComponent;
  /** Permissions */
  public hasAddPermission = false;
  public hasUpdatePermission = false;

  constructor(private modalService: ModalDialogInstanceService, private fb: FormBuilder, public teamService: TeamService,
              private router: Router, private validationService: ValidationService, private activatedRoute: ActivatedRoute,
              private employeeTeamService: EmployeeTeamService, private employeeService: EmployeeService, private authService: AuthService,
              private formModalDialogService: FormModalDialogService, private viewRef: ViewContainerRef, private swalWarring: SwalWarring,
              private translate: TranslateService) {
    // check if is an update mode
    this.subscriptions.push(this.activatedRoute.params.subscribe(params => {
      this.id = params[SharedConstant.ID_LOWERCASE] || NumberConstant.ZERO;
      this.isUpdateMode = this.id > NumberConstant.ZERO;
    }));
  }

  ngOnInit() {
    this.hasAddPermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.ADD_TEAM);
    this.hasUpdatePermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.UPDATE_TEAM);
    this.createTeamForm();
    if (this.isUpdateMode) {
      this.getDataToUpdate();
    } else {
      this.idTeam = NumberConstant.ZERO;
      this.status = true;
      this.initResources();
    }
  }

  get Name(): FormControl {
    return this.teamFormGroup.get(TeamConstant.NAME) as FormControl;
  }

  get CreationDate(): FormControl {
    return this.teamFormGroup.get(TeamConstant.CREATION_DATE) as FormControl;
  }

  get TeamCode(): FormControl {
    return this.teamFormGroup.get(TeamConstant.TEAM_CODE) as FormControl;
  }

  get IdManager(): FormControl {
    return this.teamFormGroup.get(TeamConstant.ID_MANAGER) as FormControl;
  }

  get EmployeeTeam(): FormArray {
    return this.teamFormGroup.get(TeamConstant.EMPLOYEE_TEAM) as FormArray;
  }

  get IdManagerNavigation(): FormControl {
    return this.teamFormGroup.get(TeamConstant.ID_MANAGER_NAVIGATION) as FormControl;
  }

  get State(): FormControl {
    return this.teamFormGroup.get(TeamConstant.STATE) as FormControl;
  }

  get IdTeamType(): FormControl {
    return this.teamFormGroup.get(TeamConstant.ID_TEAM_TYPE) as FormControl;
  }

  get HistoryOfTeamAssignments(): FormArray {
    return this.teamFormGroup.get(TeamConstant.HISTORY_OF_TEAM_ASSIGNMENTS) as FormArray;
  }

  dialogInit(reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
    this.isModal = true;
  }

  createTeamForm() {
    this.teamFormGroup = this.fb.group({
      Name: new FormControl('', {
        validators: Validators.required, asyncValidators: unique(TeamConstant.NAME, this.teamService, String(this.id)),
        updateOn: 'blur'
      }),
      TeamCode: new FormControl('', {
        validators: Validators.required, asyncValidators: unique(TeamConstant.TEAM_CODE, this.teamService, String(this.id)),
        updateOn: 'blur'
      }),
      IdManager: ['', Validators.required],
      EmployeeTeam: this.fb.array([]),
      IdManagerNavigation: [''],
      IdTeamType: ['', Validators.required],
      State: [true],
      CreationDate: ['', Validators.required],
    });
  }

  public showUnassignmentDate(date: Date): boolean {
    return (new Date(date)).getTime() < new Date().getTime();
  }

  /**
   * Save
   */
  save() {
    if (this.teamFormGroup.valid) {
      this.isSaveOperation = true;
      this.assignEmployeeToTeam();
      const team: Team = Object.assign({}, this.teamToUpdate, this.teamFormGroup.getRawValue());
      if (!isNullOrUndefined(team.CreationDate)) {
        team.EmployeeTeam = team.EmployeeTeam.filter(x => x.IdEmployee != null && x.IdTeam != null);
        if (this.isUpdateMode &&
          this.teamToUpdate.State !== this.State.value) {
          this.swalWarring.CreateSwal(TeamConstant.UPDATE_STATE_TEAM, SharedConstant.WARNING,
            SharedConstant.CONTINUE, SharedConstant.CANCEL).then((data) => {
            if (data.value) {
              this.actionToSave(team);
            }
          });
        } else {
          this.actionToSave(team);
        }
      }
    } else {
      this.validationService.validateAllFormFields(this.teamFormGroup);
    }
  }

  /**
   * Retrieve the period to edit
   */
  getDataToUpdate() {
    this.subscriptions.push(this.teamService.getModelByConditionWithHistory(this.preparePredicate()).subscribe(data => {
      this.teamToUpdate = data;
      this.status = data.State;
      this.TeamCode.disable();
      this.teamToUpdate.CreationDate = new Date(this.teamToUpdate.CreationDate);
      if (!isNullOrUndefined(this.teamToUpdate.EmployeeTeam)) {
        this.teamFormGroup.patchValue(this.teamToUpdate);
        this.idTeam = this.teamToUpdate.Id;
      } else {
        this.teamToUpdate.EmployeeTeam = new Array<EmployeeTeam>();
        this.teamFormGroup.patchValue(this.teamToUpdate);
        this.idTeam = this.teamToUpdate.Id;
      }
      if (!this.hasUpdatePermission || !this.status) {
        this.teamFormGroup.disable();
      }
      this.initResources();
    }));
  }

  /**
   * Prepare predicate for get the team with the specific id
   */
  preparePredicate() {
    const predicate = new PredicateFormat();
    predicate.Filter = new Array<Filter>();
    predicate.Filter.push(new Filter(SharedConstant.ID, Operation.eq, this.id));
    predicate.Relation = new Array<Relation>();
    predicate.Relation.push(new Relation(TeamConstant.EMPLOYEE_TEAM));
    predicate.Relation.push(new Relation(TeamConstant.ID_EMPLOYEE_NAVIGATION));
    return predicate;
  }

  /**
   * Opens the information model for assignment information
   */
  public setAssignementInformations(employeeTeam: EmployeeTeam) {
    employeeTeam.ShowControl = this.freeResources.includes(employeeTeam) ? false : true;
    const data = {};
    data[TeamConstant.EMPLOYEE_TEAM_UPPER] = employeeTeam;
    data[TeamConstant.CREATION_DATE] = this.teamFormGroup.get(TeamConstant.CREATION_DATE).value;
    data[TeamConstant.STATE] = this.teamFormGroup.get(TeamConstant.STATE).value;
    data[TeamConstant.ID] = this.id;
    this.formModalDialogService.openDialog(TeamConstant.HISTORY_ASSIGNMENT,
      AssignmentModalComponent, this.viewRef, this.onCloseMoveToAssignModal.bind(this), data,
      true, SharedConstant.MODAL_DIALOG_SIZE_M);
  }

  /**
   * Assign employees to the current team
   */
  public assignEmployeeToTeam() {
    // Clear form array
    while (this.EmployeeTeam.length !== NumberConstant.ZERO) {
      this.EmployeeTeam.removeAt(NumberConstant.ZERO);
    }
    if (this.assignResources.length > NumberConstant.ZERO) {
      this.assignResources.forEach(assign => {
        this.EmployeeTeam.push(this.assignResourcesFormGroup(assign));
      });
    }
    if (this.freeResources.length > NumberConstant.ZERO) {
      this.freeResources.filter(m => m.UnassignmentDate).forEach(unassign => {
        this.EmployeeTeam.push(this.assignResourcesFormGroup(unassign));
      });
    }
  }

  public onMoveToAssignResources(employeeTeams: Array<EmployeeTeam>) {
    this.EmployeeTeam.markAsTouched();
    for (let i = NumberConstant.ZERO; i < employeeTeams[TeamConstant.ITEMS].length; i++) {
      const index = this.assignResources.findIndex(m => m.IdEmployee ===
        employeeTeams[TeamConstant.ITEMS][i].IdEmployee);
      if (index >= NumberConstant.ZERO) {
        if (this.isUpdateMode) {
          this.assignResources[index].AssignmentDate = new Date();
        } else {
          this.assignResources[index].AssignmentDate = this.CreationDate.valid ? this.CreationDate.value : new Date();
        }
        this.assignResources[index].UnassignmentDate = undefined;
      }
    }
  }

  public onMoveToFreeResources(employeeTeams: Array<EmployeeTeam>) {
    this.EmployeeTeam.markAsTouched();
    for (let i = NumberConstant.ZERO; i < employeeTeams[TeamConstant.ITEMS].length; i++) {
      if (employeeTeams[TeamConstant.ITEMS][i].IdEmployee === this.teamFormGroup.get(TeamConstant.ID_MANAGER).value) {
        this.assignResources.push(this.freeResources.find(x => x.IdEmployee === this.teamFormGroup.get(TeamConstant.ID_MANAGER).value));
        this.assignResources = this.assignResources.filter((n, x) => this.assignResources.indexOf(n) === x);
        const id = this.freeResources.findIndex(m => m.IdEmployee === this.teamFormGroup.get(TeamConstant.ID_MANAGER).value);
        this.freeResources.splice(id, NumberConstant.ONE);
        const idx = this.assignResources.findIndex(m => m.IdEmployee ===
          employeeTeams[TeamConstant.ITEMS][i].IdEmployee);
        this.swalWarring.CreateSwal(TeamConstant.UPDATE_MANAGER_TEAM, SharedConstant.WARNING,
          SharedConstant.CONTINUE, SharedConstant.CANCEL).then((res) => {
          if (res.value) {
            this.assignResources[idx].UnassignmentDate = new Date();
            this.assignResources[idx].AssignmentPercentage = NumberConstant.ZERO;
            this.freeResources.push(this.assignResources[idx]);
            this.assignResources.splice(idx, NumberConstant.ONE);
            this.teamFormGroup.controls[TeamConstant.ID_MANAGER].setValue('');
            this.validationService.validateAllFormFields(this.teamFormGroup);
          }
        });
      } else {
        const index = this.freeResources.findIndex(m => m.IdEmployee ===
          employeeTeams[TeamConstant.ITEMS][i].IdEmployee);
        if (index >= NumberConstant.ZERO) {
          this.freeResources[index].UnassignmentDate = new Date();
          this.freeResources[index].AssignmentPercentage = NumberConstant.ZERO;
        }
      }
    }
  }

  public onRemoveToManagerTeam(managerTeam: EmployeeTeam, resources: Array<EmployeeTeam>) {
    for (let i = NumberConstant.ZERO; i < resources.length; i++) {
      const index = resources.findIndex(m => m.IdEmployee ===
        managerTeam.IdEmployee);
      if (index >= NumberConstant.ZERO) {
        resources.splice(index, NumberConstant.ONE);
      }
    }
  }

  /**
   * change the drowpdown value
   * @param $event
   */
  public IdManagerValueChange($event) {
    if ($event.form.controls[TeamConstant.ID_MANAGER].value) {
      this.subscriptions.push(this.employeeService.getById($event.form.controls[TeamConstant.ID_MANAGER].value).subscribe(result => {
        const employeeTeam = this.fb.group({
          Id: [NumberConstant.ZERO],
          IdEmployee: [result.Id],
          IdTeam: [this.idTeam],
          AssignmentDate: [this.CreationDate.valid ? this.CreationDate.value : null],
          UnassignmentDate: [null],
          AssignmentPercentage: [NumberConstant.ZERO],
          IdEmployeeNavigation: result
        });
        if (this.teamToUpdate && this.teamToUpdate.Id) {
          this.swalWarring.CreateSwal(TeamConstant.UPDATE_MANAGER_TEAM, SharedConstant.WARNING,
            SharedConstant.CONTINUE, SharedConstant.CANCEL).then((data) => {
            if (data.value) {
              if (!this.isUpdateManager) {
                this.oldManagerTeam = this.assignResources.find(x => x.IdEmployee === this.teamToUpdate.IdManager);
                this.newManagerTeam = employeeTeam.getRawValue();
                this.isUpdateManager = true;
              } else {
                this.oldManagerTeam = this.newManagerTeam;
                this.newManagerTeam = employeeTeam.getRawValue();
              }
              if (this.assignResources.filter(x => x.IdEmployee === this.newManagerTeam.IdEmployee).length === NumberConstant.ZERO) {
                this.assignResources.push(this.newManagerTeam);
                this.onRemoveToManagerTeam(this.newManagerTeam, this.freeResources);
              }
            } else {
              this.teamFormGroup.controls[TeamConstant.ID_MANAGER].setValue(this.teamToUpdate.IdManager);
            }
          });
        } else {
          if (!this.isUpdateManager) {
            this.newManagerTeam = employeeTeam.getRawValue();
            this.isUpdateManager = true;
          } else {
            this.oldManagerTeam = this.newManagerTeam;
            this.newManagerTeam = employeeTeam.getRawValue();
          }
          if ((this.assignResources.filter(x => x.IdEmployee === this.newManagerTeam.IdEmployee).length === NumberConstant.ZERO)
            && this.isUpdateManager) {
            this.assignResources.push(this.newManagerTeam);
          }
          if ((this.assignResources.filter(x => x.IdEmployee === this.newManagerTeam.IdEmployee).length === NumberConstant.ZERO)
            && this.oldManagerTeam) {
            this.assignResources.push(this.newManagerTeam);
            this.oldManagerTeam.UnassignmentDate = new Date();
            this.oldManagerTeam.AssignmentPercentage = NumberConstant.ZERO;
            this.freeResources.push(this.oldManagerTeam);
            this.onRemoveToManagerTeam(this.newManagerTeam, this.freeResources);
          }
          if (this.oldManagerTeam) {
            this.onRemoveToManagerTeam(this.oldManagerTeam, this.assignResources);
            this.freeResources.push(this.oldManagerTeam);
          }
          if (this.isUpdateManager) {
            this.onRemoveToManagerTeam(this.newManagerTeam, this.freeResources);
          }
        }
      }));
    }
  }

  isFormChanged(): boolean {
    return this.teamFormGroup.touched;
  }

  /**
   * this method will be called by CanDeactivateGuard service to check the leaving component possibility
   */
  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (this.isSaveOperation) {
      this.isSaveOperation = false;
      return true;
    }
    return this.validationService.handleCanDeactivateToLeaveCurrentComponent(this.isFormChanged.bind(this));
  }

  ngOnDestroy(): void {
    if (this.subscriptions !== undefined) {
      this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }
  }

  /**
   * Get list of free resouces, not affected to the team
   */
  private initResources() {
    this.subscriptions.push(this.employeeTeamService.getTeamResources(this.idTeam).subscribe(result => {
      result.forEach(employeeTeam => {
        if (employeeTeam.IdEmployeeNavigation.Picture) {
          this.employeeService.getPicture(employeeTeam.IdEmployeeNavigation.Picture).subscribe((picture: any) => {
            employeeTeam.IdEmployeeNavigation.pictureEmployesSrc = 'data:image/png;base64,' + picture;
          });
        }
      });
      this.assignResources = result.filter(resource => resource.AssignmentDate && resource.IsAssigned);
      this.freeResources = result.filter((resource: EmployeeTeam) => !resource.AssignmentDate
        && resource.IdEmployeeNavigation.Status !== EmployeeState.Resigned);
    }));
  }

  private actionToSave(teamToSave: Team) {
    this.subscriptions.push(this.teamService.save(teamToSave, !this.isUpdateMode).subscribe((res) => {
      if (!this.isModal) {
        // this.router.navigateByUrl(TeamConstant.TEAM_EDIT_URL.concat(res.Id.toString()), { skipLocationChange: true });
        this.router.navigate([TeamConstant.TEAM_LIST_URL]);
      } else {
        this.modalService.closeAnyExistingModalDialog();
      }
    }));
  }

  /**
   * on close assignment informations modal
   * @param data
   */
  private onCloseMoveToAssignModal(data: any): void {
    if (data !== undefined) {
      const employeeTeam: EmployeeTeam = data.value;
      if (employeeTeam) {
        const index = this.assignResources.findIndex(m => m.IdEmployee === employeeTeam.IdEmployee);
        this.assignResources[index].AssignmentDate = employeeTeam.AssignmentDate;
        this.assignResources[index].UnassignmentDate = employeeTeam.UnassignmentDate;
        this.assignResources[index].AssignmentPercentage = employeeTeam.AssignmentPercentage;
      }
    }
  }

  /**
   * For assign an employee from a team
   */
  private assignResourcesFormGroup(employeeTeam: EmployeeTeam) {
    const assignFormGroup = this.fb.group({
      Id: [employeeTeam.Id ? employeeTeam.Id : NumberConstant.ZERO],
      IdEmployee: [employeeTeam.IdEmployee],
      IdTeam: [employeeTeam.IdTeam],
      AssignmentDate: [employeeTeam.AssignmentDate],
      AssignmentPercentage: [employeeTeam ? employeeTeam.AssignmentPercentage : NumberConstant.ZERO],
    });
    if (employeeTeam.UnassignmentDate) {
      assignFormGroup.addControl(TeamConstant.UNASSIGNMENTDATE, this.fb.control(employeeTeam.UnassignmentDate));
    }
    return assignFormGroup;
  }

}
