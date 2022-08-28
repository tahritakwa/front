import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { isNullOrUndefined } from 'util';
import { GrowlService } from '../../../../COM/Growl/growl.service';
import { ActionConstant } from '../../../constant/payroll/action.constant';
import { AdministrativeDocumentConstant } from '../../../constant/payroll/administrative-document-constant';
import { ExitEmployeeConstant } from '../../../constant/payroll/exit-employee.constant';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { ActiveAssignmentService } from '../../../immobilization/services/active-assignment/active-assignment.service';
import { LocalStorageService } from '../../../login/Authentification/services/local-storage-service';
import { ExitEmployeeStatusEnum } from '../../../models/enumerators/exit-employee-status-enum';
import { Active } from '../../../models/immobilization/active.model';
import { Employee } from '../../../models/payroll/employee.model';
import { ExitEmployee } from '../../../models/payroll/exit-employee.model';
import { ExitEmailForEmployee } from '../../../models/payroll/ExitEmailForEmployee.model';
import { ObjectToSend } from '../../../models/sales/object-to-save.model';
import { Comment } from '../../../models/shared/comment.model';
import { CreatedData } from '../../../models/shared/created-data.model';
import { FileInfo } from '../../../models/shared/objectToSend';
import { SwalWarring } from '../../../shared/components/swal/swal-popup';
import { CommentService } from '../../../shared/services/signalr/comment/comment.service';
import { InformationTypeEnum } from '../../../shared/services/signalr/information/information.enum';
import {
  MessageAdministrativeDocumentsService
} from '../../../shared/services/signalr/message-administrative-documents/message-administrative-documents.service';
import { dateValueGT, dateValueLT, ValidationService } from '../../../shared/services/validation/validation.service';
import { PredicateFormat } from '../../../shared/utils/predicate';
import { EmployeeService } from '../../services/employee/employee.service';
import { ExitEmployeeService } from '../../services/exit-employee/exit-employee.service';
@Component({
  selector: 'app-add-exit-employee',
  templateUrl: './add-exit-employee.component.html',
  styleUrls: ['./add-exit-employee.component.scss']
})
export class AddExitEmployeeComponent implements OnInit, OnDestroy {
  @Input() employeeExit: ExitEmployee;
  @Output() employeeExitChanged = new EventEmitter<any>();
  @Output() showStepperBool = new EventEmitter<any>();
  LeaveEmployeeFormGroup: FormGroup;
  public isUpdateMode = false;
  public isValidateMode = false;
  private id: number;
  public hideCardBody = false;
  // List of comments
  public commentsData: Comment[] = [];
  // Enum  Waiting , Accepted , Refused
  public statusCode = ExitEmployeeStatusEnum;
  // The Id of th connected Empployee
  public selectedEmployee = NumberConstant.ZERO;
  public currentEmployee: Employee;
  public connectedEmployee: Employee;
  public exitEmployeeAttachementFileInfo: Array<FileInfo>;
  public leaveAlreadyValidate;
  public employeeExitEmployee: ExitEmailForEmployee;
  // predicate Related To the grid
  public predicate: PredicateFormat;
  historyResult: Active[];
  public listCurrentSelectedIds: number[] = [];
  public showStartBtn: boolean;
  idCommentToEdit = NumberConstant.ZERO;
  isNew = true;
  toEditComent: Comment;
  private isSaveOperation = false;
  private subscriptions: Subscription[] = [];

  constructor(public exitEmployeeService: ExitEmployeeService, private router: Router, private fb: FormBuilder,
    private validationService: ValidationService, private activatedRoute: ActivatedRoute, private commentService: CommentService,
    private messageAdministrativeDocumentsService: MessageAdministrativeDocumentsService, private swalWarrings: SwalWarring,
    private employeeService: EmployeeService, private translate: TranslateService, private growlService: GrowlService,
    public activeAssignmentService: ActiveAssignmentService, private localStorageService: LocalStorageService) {
    this.subscriptions.push(this.activatedRoute.params.subscribe(params => {
      this.id = +params['id'] || NumberConstant.ZERO;
      this.exitEmployeeAttachementFileInfo = new Array<FileInfo>();
      this.isUpdateMode = this.id > NumberConstant.ZERO ? true : false;
    }));
  }
  ngOnInit() {
    this.employeeService.getConnectedEmployee().subscribe(connectedEmployee => {
      this.connectedEmployee = connectedEmployee;
      this.showStartBtn = this.employeeExit && this.employeeExit.Id !== 0 && this.employeeExit.Status === this.statusCode.Draft;
    });
    this.createLeaveEmployeeFormGroup();
    this.commentService.initCommentHubConnection();
    this.isUpdateMode = this.id > NumberConstant.ZERO ? true : false;
    if (this.isUpdateMode) {
      this.getDataToUpdate();
    }
  }
  private createLeaveEmployeeFormGroup(employeeExit?: ExitEmployee): void {
    this.LeaveEmployeeFormGroup = this.fb.group({
      Id: [employeeExit ? employeeExit.Id : NumberConstant.ZERO],
      IdEmployee: [employeeExit ? employeeExit.IdEmployee : undefined, [Validators.required]],
      ReleaseDate: [employeeExit ? employeeExit.ReleaseDate : '', [Validators.required]],
      IdExitReason: [employeeExit ? employeeExit.IdExitReason : undefined, [Validators.required]],
      CommentRh: [employeeExit ? employeeExit.CommentRh : undefined, [Validators.required]],
      Status: [employeeExit ? employeeExit.Status : NumberConstant.ZERO, [Validators.required]],
      Message: [''],
      ExitDepositDate: [employeeExit ? employeeExit.ExitDepositDate : '', [Validators.required]]
    });
  }
  preparesave() {
    if (this.LeaveEmployeeFormGroup.valid) {
      this.isSaveOperation = true;
      const leaveAssign: ExitEmployee = Object.assign({}, this.employeeExit, this.LeaveEmployeeFormGroup.getRawValue());
      // Save file
      if (this.exitEmployeeAttachementFileInfo.length !== NumberConstant.ZERO) {
        leaveAssign.ExitFileInfo = this.exitEmployeeAttachementFileInfo;
      }
      this.subscriptions.push(this.exitEmployeeService.save(leaveAssign, !this.isUpdateMode).subscribe((res) => {
        this.messageAdministrativeDocumentsService.startSendMessageRHDocuments(
          leaveAssign,
          InformationTypeEnum.ADD_EXIT_EMPLOYEE_REQUEST,
          this.connectedEmployee,
          this.connectedEmployee.Id,
          true,
          ActionConstant.VALIDATION);
        this.router.navigate([ExitEmployeeConstant.LIST_URL]);
      }));
    } else {
      this.validationService.validateAllFormFields(this.LeaveEmployeeFormGroup);
    }
  }
  public addComment(): void {
    if (this.Message.value) {
      // Prepare comment entity
      const commentEntity: Comment = new Comment();
      commentEntity.Id = NumberConstant.ZERO;
      if (this.toEditComent) {
        Object.assign(commentEntity, this.toEditComent);
      }
      commentEntity.Message = (this.Message.value as string)
        .replace('\n', '<br>');
      commentEntity.CreationDate = new Date();
      commentEntity.IdEntityCreated = this.id;
      commentEntity.EmailCreator = this.localStorageService.getUser().Email;
      commentEntity.EntityName = ExitEmployeeConstant.ENTITY_NAME;
      this.commentService.save(commentEntity, this.idCommentToEdit === NumberConstant.ZERO).subscribe(res => {
        if (res) {
          const createdData: CreatedData = new CreatedData(this.employeeExit.Id, this.employeeExit.Code);
          this.commentService.addCommentAndSendNotifTheSuperior(commentEntity, this.employeeExit.IdEmployee, createdData,
            InformationTypeEnum.ADD_COMMENT_LEAVE_REQUEST, true);
        }
        if (this.idCommentToEdit) {
          const index = this.commentsData.findIndex(x => x.Id === this.idCommentToEdit);
          this.commentsData[index] = commentEntity;
          this.idCommentToEdit = NumberConstant.ZERO;
          this.toEditComent = null;
          this.Message.reset();
        } else {
          res = this.getSrcPictureEmployee(res);
          this.Message.reset();
          this.commentsData.push(res);
        }
      });
    }
  }

  deletecomment(idComment: number ) {
    const element = this.commentsData.find(x => x.Id === idComment);
    if (element && element.Employee.Id === this.connectedEmployee.Id) {
      this.commentService.remove(element).subscribe(() => {
        const index = this.commentsData.findIndex(x => x.Id === idComment);
        this.commentsData.splice(index, NumberConstant.ONE);
        this.Message.reset();
      });
    } else {
      this.growlService.warningNotification(this.translate.instant(SharedConstant.UNAUTHRIZED_ERROR_MSG));
    }
  }

  editcomment(idComment: number ) {
    const element = this.commentsData.find(x => x.Id === idComment);
    if (element && element.Employee.Id === this.connectedEmployee.Id) {
      this.Message.setValue(element.Message);
      this.idCommentToEdit = element.Id;
      this.toEditComent = element;
    } else {
      this.growlService.warningNotification(this.translate.instant(SharedConstant.UNAUTHRIZED_ERROR_MSG));
    }
  }

  private setLeaveTimeAndFile(employeeExit: ExitEmployee) {
    if (this.employeeExit.ExitFileInfo) {
      this.exitEmployeeAttachementFileInfo = this.employeeExit.ExitFileInfo;
    }
  }

  public getDataToUpdate() {
    this.buildExitEmployeeValidators();
    if (this.employeeExit) {
      this.buildExitEmployeeValidators();
      this.employeeExit.ReleaseDate = new Date(this.employeeExit.ReleaseDate);
      this.employeeExit.LegalExitDate = this.employeeExit.LegalExitDate ? new Date(this.employeeExit.LegalExitDate) : undefined;
      this.employeeExit.ExitDepositDate = this.employeeExit.ExitDepositDate ? new Date(this.employeeExit.ExitDepositDate) : undefined;
      this.employeeExit.MaxNoticePeriodDate = this.employeeExit.MaxNoticePeriodDate ? new Date(this.employeeExit.MaxNoticePeriodDate) : undefined;
      this.employeeExit.MinNoticePeriodDate = this.employeeExit.MinNoticePeriodDate ? new Date(this.employeeExit.MinNoticePeriodDate) : undefined;
      this.employeeExit.ExitPhysicalDate = this.employeeExit.ExitPhysicalDate ? new Date(this.employeeExit.ExitPhysicalDate) : undefined;
      this.LeaveEmployeeFormGroup.patchValue(this.employeeExit);
      this.selectedEmployee = this.employeeExit.IdEmployee;
      this.employeeExitChanged.emit(this.employeeExit);
      this.prepareCommentsList();
      this.setLeaveTimeAndFile(this.employeeExit);
      this.checkIfDocumentHasBeenAlreadyValidated();
    }
  }
  getSelectedEmployee($event: any) {
    if (!isNullOrUndefined($event)) {
      this.currentEmployee = $event.employeeFiltredDataSource
        .filter(x => x.Id === this.LeaveEmployeeFormGroup.controls[ExitEmployeeConstant.ID_EMPLOYEE].value)[0];
      this.buildExitEmployeeValidators();
    }
  }
  /**
   * Build exit employee validators
   */
  buildExitEmployeeValidators() {
    this.ReleaseDate.setValidators([
      this.currentEmployee && this.currentEmployee.HiringDate ?
        dateValueGT(new Observable(o => o.next(new Date(this.currentEmployee.HiringDate)))) : dateValueGT(Observable.of(null)),
      new Date(this.LeaveEmployeeFormGroup.value.ExitDepositDate) ?
        dateValueGT(new Observable(o => o.next(new Date(this.LeaveEmployeeFormGroup.value.ExitDepositDate)))) :
        dateValueGT(Observable.of(null)),
      this.employeeExit && new Date(this.employeeExit.IdEmployeeNavigation.HiringDate) ?
        dateValueGT(new Observable(o => o.next(new Date(this.employeeExit.IdEmployeeNavigation.HiringDate)))) :
        dateValueGT(Observable.of(null)),
      Validators.required
    ]);
    this.ExitDepositDate.setValidators([
      this.currentEmployee && this.currentEmployee.HiringDate ?
        dateValueGT(new Observable(o => o.next(new Date(this.currentEmployee.HiringDate)))) : dateValueGT(Observable.of(null)),
      new Date(this.LeaveEmployeeFormGroup.value.ReleaseDate) ?
        dateValueLT(new Observable(o => o.next(new Date(this.LeaveEmployeeFormGroup.value.ReleaseDate)))) :
        dateValueLT(Observable.of(null)),
      this.employeeExit && new Date(this.employeeExit.IdEmployeeNavigation.HiringDate) ?
        dateValueGT(new Observable(o => o.next(new Date(this.employeeExit.IdEmployeeNavigation.HiringDate)))) :
        dateValueGT(Observable.of(null)),
      Validators.required
    ]);
  }

  public GetLeaveEmployeeFormGroup() {
    return this.LeaveEmployeeFormGroup;
  }

  prepareCommentsList() {
    // Prepare Comment list
    this.commentsData = this.employeeExit.Comments;
    if (this.commentsData.length !== NumberConstant.ZERO) {
      this.commentsData.forEach(x => {
        this.getSrcPictureEmployee(x);
      });
    }
  }
  /**
   * Accept or reject request
   * @param state
   */
  public setRequestState(state) {
    this.swalWarrings.CreateSwal(this.getSwalText(state), null, AdministrativeDocumentConstant.OKAY).then((result) => {
      if (result.value) {
        const employeeExitToSave: ExitEmployee = new ExitEmployee();
        Object.assign(employeeExitToSave, this.employeeExit);
        employeeExitToSave.Status = state;
        // Save or update the exit
        const objectToSave = new ObjectToSend(employeeExitToSave);
        this.subscriptions.push(this.exitEmployeeService.ValidateExitEmployee(objectToSave).subscribe(() => {
          switch (state) {
            case this.statusCode.Accepted: {
              this.messageAdministrativeDocumentsService.startSendMessageRHDocuments(
                employeeExitToSave,
                InformationTypeEnum.VALIDATE_EXIT_EMPLOYEE_REQUEST,
                this.connectedEmployee,
                this.connectedEmployee.Id,
                true,
                ActionConstant.VALIDATION
              );
              break;
            }
            case this.statusCode.Refused: {
              this.messageAdministrativeDocumentsService.startSendMessageRHDocuments(
                employeeExitToSave,
                InformationTypeEnum.REFUSE_EXIT_EMPLOYEE_REQUEST,
                this.connectedEmployee,
                this.connectedEmployee.Id,
                true,
                ActionConstant.REJECTION
              );
              break;
            }
            default:
              break;
          }
          this.router.navigate([ExitEmployeeConstant.LIST_URL]);
        }));
      }
    });
  }
  getSwalText(state): string {
    if (state === this.statusCode.Accepted) {
      return ExitEmployeeConstant.VALIDATE_EXIT_REQUEST_ALERT;
    }
    if (state === this.statusCode.Refused) {
      return ExitEmployeeConstant.REFUS_EXIT_REQUEST_ALERT;
    }
  }
  /**
   * Get src of picture employee
   */
  private getSrcPictureEmployee(comment: Comment): Comment {
    if (comment.Employee && comment.Employee.PictureFileInfo && comment.Employee.PictureFileInfo.Data) {
      comment.SrcPictureEmployee = 'data:image/png;base64,'.concat(comment.Employee.PictureFileInfo.Data);
    } else {
      comment.SrcPictureEmployee = '../../../../assets/image/user-new-icon1.jpg';
    }
    return comment;
  }
  checkIfDocumentHasBeenAlreadyValidated() {
    if (this.employeeExit.Status === ExitEmployeeStatusEnum.Accepted || this.employeeExit.Status === ExitEmployeeStatusEnum.Refused) {
      this.LeaveEmployeeFormGroup.disable();
      this.LeaveEmployeeFormGroup.get(SharedConstant.MESSAGE).enable();
      this.leaveAlreadyValidate = true;
    } else {
      this.leaveAlreadyValidate = false;
    }
  }

  /**
  * formatDate
  * */
  public formatDate(): string {
    return localStorage.getItem(ExitEmployeeConstant.FORMAT_DATE);
  }
  get IdEmployee(): FormControl {
    return this.LeaveEmployeeFormGroup.get(ExitEmployeeConstant.ID_EMPLOYEE) as FormControl;
  }
  get ReleaseDate(): FormControl {
    return this.LeaveEmployeeFormGroup.get(ExitEmployeeConstant.RELEASE_DATE) as FormControl;
  }
  get IdExitReason(): FormControl {
    return this.LeaveEmployeeFormGroup.get(ExitEmployeeConstant.ID_exit_REASON) as FormControl;
  }
  get CommentRh(): FormControl {
    return this.LeaveEmployeeFormGroup.get(ExitEmployeeConstant.COMMENT_RH) as FormControl;
  }
  get Status(): FormControl {
    return this.LeaveEmployeeFormGroup.get(ExitEmployeeConstant.STATUS) as FormControl;
  }
  get LegalReleaseDate(): FormControl {
    return this.LeaveEmployeeFormGroup.get(ExitEmployeeConstant.LEGAL_RELEASE_DATE) as FormControl;
  }
  get LegalExitDate(): FormControl {
    return this.LeaveEmployeeFormGroup.get(ExitEmployeeConstant.LEGAL_EXIT_DATE) as FormControl;
  }
  get Message(): FormControl {
    return this.LeaveEmployeeFormGroup.get(SharedConstant.MESSAGE) as FormControl;
  }

  get ExitDepositDate(): FormControl {
    return this.LeaveEmployeeFormGroup.get(ExitEmployeeConstant.EXIT_DEPOSIT_DATE) as FormControl;
  }

  validCommentary(): boolean {
    if (this.Message.value) {
      return this.Message.value.replace(/^\s+|\s+$/g, '') === '';
    } else {
      return true;
    }
  }
  showStepper() {
    if (this.LeaveEmployeeFormGroup.valid) {
      const exitEmployee: ExitEmployee = Object.assign({}, this.employeeExit, this.LeaveEmployeeFormGroup.getRawValue());
      exitEmployee.Status = this.statusCode.Waiting;
      if (this.exitEmployeeAttachementFileInfo.length !== NumberConstant.ZERO) {
        exitEmployee.ExitFileInfo = this.exitEmployeeAttachementFileInfo;
      }
      this.subscriptions.push(this.exitEmployeeService.save(exitEmployee, !this.isUpdateMode).subscribe((res) => {
        this.Status.setValue(this.statusCode.Waiting);
        this.showStepperBool.emit(true);
        this.showStartBtn = false;
      }));
    } else {
      this.validationService.validateAllFormFields(this.LeaveEmployeeFormGroup);
    }
  }
  isFormChanged(): boolean {
    return this.LeaveEmployeeFormGroup.touched;
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

}
