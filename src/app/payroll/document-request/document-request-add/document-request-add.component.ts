import { Component, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { isNullOrUndefined } from 'util';
import { GrowlService } from '../../../../COM/Growl/growl.service';
import { AdministrativeDocumentConstant } from '../../../constant/payroll/administrative-document-constant';
import { DocumentRequestConstant } from '../../../constant/payroll/document-request.constant';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { AdministrativeDocumentStatusEnumerator } from '../../../models/enumerators/administrative-document-status.enum';
import { DocumentRequest } from '../../../models/payroll/document-request.model';
import { Employee } from '../../../models/payroll/employee.model';
import { ObjectToSend } from '../../../models/sales/object-to-save.model';
import { Comment } from '../../../models/shared/comment.model';
import { CreatedData } from '../../../models/shared/created-data.model';
import { AddSharedDocumentComponent } from '../../../rh/shared-document/add-shared-document/add-shared-document.component';
import { EmployeeDropdownComponent } from '../../../shared/components/employee-dropdown/employee-dropdown.component';
import { SwalWarring } from '../../../shared/components/swal/swal-popup';
import { FormModalDialogService } from '../../../shared/services/dialog/form-modal-dialog/form-modal-dialog.service';
import { CommentService } from '../../../shared/services/signalr/comment/comment.service';
import { InformationTypeEnum } from '../../../shared/services/signalr/information/information.enum';
import { dateValueGT, ValidationService } from '../../../shared/services/validation/validation.service';
import { PredicateFormat } from '../../../shared/utils/predicate';
import { StarkPermissionsService } from '../../../stark-permissions/stark-permissions.module';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { DocumentRequestService } from '../../services/document-request/document-request.service';
import { EmployeeService } from '../../services/employee/employee.service';
import { DocumentRequestShowComponent } from '../document-request-show/document-request-show.component';

const SEPARATOR = '/';

@Component({
  selector: 'app-document-request-add',
  templateUrl: './document-request-add.component.html',
  styleUrls: ['./document-request-add.component.scss']
})
export class DocumentRequestAddComponent implements OnInit, OnDestroy {
  /**
   * List grid component view child
   */
  @ViewChild('contributorsDocumentGrid') contributorsDocumentGrid: DocumentRequestShowComponent;
  @ViewChild('myDocumentGrid') myDocumentGrid: DocumentRequestShowComponent;
  @ViewChild(EmployeeDropdownComponent) employeeDropdownComponent: EmployeeDropdownComponent;
  /**
   * is updateMode
   */
  public isUpdateMode = false;
  /**
   * Set true if component is call for validation
   */
  public isValidateMode = false;
  /**
   * document Form group
   */
  public documentRequestAddFormGroup: FormGroup;
  /**
   * document to update
   */
  public documentToUpdate: DocumentRequest;
  /**
   * ExpenseReport before update action
   */
  public documentBeforeUpdate: DocumentRequest;
  /**
   * Enum  Waiting , Accepted , Refused
   */
  public statusCode = AdministrativeDocumentStatusEnumerator;
  /**
   * Is my document or not
   */
  public isMyDocument = true;
  /**
   * is true if document has been already validate
   */
  public documentAlreadyValidate = true;
  // The Id of th connected Empployee
  public selectedEmployee = NumberConstant.ZERO;
  public employeeAssociated: Employee;
  // connected user
  public connectedUser;
  // can validate all request ( no need to be the super heararchy to validate the request)
  public allEmployee = false;

  // Is true if we need to show all employee in the dropdown in case of the connected user
  // Is true if the user change the form values
  public formHasBeenChanged = false;
  // List of ids of employees that has the connected user as super hierarchical
  public EmployeeHierarchy: number[] = [];
  // Is true if the connected user has the right to update the request
  public canUpdate = false;
  // Is true if the connected user has the right to validate the request
  public canValidate = false;
  /**
   * Set true if document request state is waiting
   */
  public waitingState = false;
  /**
   * Format Date
   */
  public formatDate: string = this.translate.instant(SharedConstant.DATE_FORMAT);
  /**
   * Min date
   */
  public minDate: Date;
  // List of comments
  public commentsData: Comment[] = [];
  public tab = false;
  public hasUpdateDocumentsPermission = false;
  public hasAddPermission: boolean;
  public hasRefusePermission: boolean;
  /**
   * Employee Selected by dropdown list
   */
  public currentEmployee: Employee;
  idCommentToEdit = NumberConstant.ZERO;
  toEditComent: Comment;
  /**
   * Id Entity
   */
  private id: number;
  /**
   * predicate
   */
  private predicate: PredicateFormat;
  private isSaveOperation = false;
  private subscriptions: Subscription[] = [];


  /**
   * Constructor
   * @param fb
   * @param activatedRoute
   * @param router
   * @param documentRequestService
   * @param validationService
   */
  constructor(private fb: FormBuilder,
              private activatedRoute: ActivatedRoute, private router: Router,
              private employeeService: EmployeeService,
              private swalWarrings: SwalWarring,
              private commentService: CommentService,
              private documentRequestService: DocumentRequestService, private validationService: ValidationService,
              private translate: TranslateService, public authService: AuthService,
              private growlService: GrowlService,
              private viewRef: ViewContainerRef,
              private formModalDialogService: FormModalDialogService) {
    this.subscriptions.push(this.activatedRoute.params.subscribe(params => {
      this.id = +params[SharedConstant.ID_LOWERCASE] || NumberConstant.ZERO;
    }));
  }

  /**
   * Get Label
   */
  get Label(): FormControl {
    return this.documentRequestAddFormGroup.get(DocumentRequestConstant.LABEL) as FormControl;
  }

  /**
   * Get Id DocumentRequest type
   */
  get IdDocumentRequestType(): FormControl {
    return this.documentRequestAddFormGroup.get(DocumentRequestConstant.ID_DOCUMENT_REQUEST_TYPE) as FormControl;
  }

  /**
   * Get DeadLine
   */
  get DeadLine(): FormControl {
    return this.documentRequestAddFormGroup.get(DocumentRequestConstant.DEADLINE) as FormControl;
  }

  /**
   * Get Description
   */
  get Description(): FormControl {
    return this.documentRequestAddFormGroup.get(DocumentRequestConstant.DESCRIPTION) as FormControl;
  }

  get IdEmployee(): FormControl {
    return this.documentRequestAddFormGroup.get(DocumentRequestConstant.ID_EMPLOYEE) as FormControl;
  }

  get Message(): FormControl {
    return this.documentRequestAddFormGroup.get(SharedConstant.MESSAGE) as FormControl;
  }

  /**
   * Ng on init
   */
  ngOnInit() {
    this.canValidate = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.VALIDATE_DOCUMENTREQUEST);
    this.hasAddPermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.ADD_DOCUMENTREQUEST);
    this.hasUpdateDocumentsPermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.UPDATE_DOCUMENTREQUEST);
    this.hasRefusePermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.REFUSE_DOCUMENTREQUEST);
    this.createAddForm();
    this.minDate = this.setMinDate(new Date());
    this.isUpdateMode = this.id > NumberConstant.ZERO;
    this.subscriptions.push(this.employeeService.getConnectedEmployee().subscribe(
      (res: Employee) => {
        this.selectedEmployee = res.Id;
    if (!this.isUpdateMode) {
      this.documentRequestAddFormGroup.controls[DocumentRequestConstant.ID_EMPLOYEE]
        .setValue(this.selectedEmployee);
    }
  }));
    this.subscriptions.push(this.employeeService.getEmployeesHierarchicalList().subscribe(data => {
        this.EmployeeHierarchy = data.map(x => x.Id);
        if (this.isUpdateMode) {
          this.getDataToUpdate();
        }
      }
    ));
    this.commentService.initCommentHubConnection();
    this.subscribeOnCommentList();
  }

  ngOnDestroy(): void {
    this.commentService.destroyCommentHubConnection();
    if (this.subscriptions !== undefined) {
      this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }
  }

  /**
   * Add document request
   */
  public save(): void {
    if (this.documentRequestAddFormGroup.valid) {
      this.isSaveOperation = true;
      const documentRequest: DocumentRequest = Object.assign({}, this.documentToUpdate, this.documentRequestAddFormGroup.getRawValue());
      this.subscriptions.push(this.documentRequestService.save(documentRequest, !this.isUpdateMode).subscribe(() => {
        this.router.navigate([DocumentRequestConstant.DOCUMENT_REQUEST_LIST_URL]);
      }));
    } else {
      this.validationService.validateAllFormFields(this.documentRequestAddFormGroup);
    }
  }

  /**
   * update data in the grid after adding new item
   */
  public initializeDocumentGrid(documentRequest) {
    if (documentRequest.IdEmployee === this.selectedEmployee) {
      if (this.myDocumentGrid) {
        this.myDocumentGrid.initGridDataSource();
      }
    } else {
      if (this.contributorsDocumentGrid) {
        this.contributorsDocumentGrid.initGridDataSource();
      }
    }
  }

  checkRigths() {
    if (this.documentToUpdate.IdEmployee === this.selectedEmployee) {
      this.isMyDocument = true;
    } else {
      this.isMyDocument = false;
    }
    if ((!this.isMyDocument && this.EmployeeHierarchy.indexOf(this.documentToUpdate.IdEmployee) > -1)
      || (this.isUpdateMode && this.isMyDocument)) {
      this.canUpdate = true;
    } else {
      if (!this.canValidate) {
        this.allEmployee = true;
        if (this.employeeDropdownComponent) {
          this.employeeDropdownComponent.hierarchy = false;
          this.employeeDropdownComponent.initDataSource();
        }
        this.makeTheFormdisabled();
      }
    }
  }

  prepareCommentsList() {
    // Prepare Comment list
    this.commentsData = this.documentToUpdate.Comments;
    this.commentsData.forEach((x) => {
      this.getSrcPictureEmployee(x);
    });
  }

  checkIfDocumentHasBeenAlreadyValidated() {
    // Disable the input fields if the document state is not: Waiting or if the leave endDate < todays date
    if (this.documentToUpdate.Status !== AdministrativeDocumentStatusEnumerator.Waiting) {
      this.makeTheFormdisabled();
      this.documentAlreadyValidate = true;
    } else {
      this.documentAlreadyValidate = false;
    }
  }

  /**
   * Make the formGroup disabled
   */
  makeTheFormdisabled() {
    this.documentRequestAddFormGroup.disable();
    this.documentRequestAddFormGroup.get(SharedConstant.MESSAGE).enable();
  }

  deletecomment(idComment: number) {
    const element = this.commentsData.find(x => x.Id === idComment);
    if (element && element.Employee.Id === this.selectedEmployee) {
      this.commentService.remove(element).subscribe(() => {
        const index = this.commentsData.findIndex(x => x.Id === idComment);
        this.commentsData.splice(index, NumberConstant.ONE);
        this.Message.reset();
      });
    } else {
      this.growlService.warningNotification(this.translate.instant(SharedConstant.UNAUTHRIZED_ERROR_MSG));
    }
  }

  editcomment(idComment: number) {
    const element = this.commentsData.find(x => x.Id === idComment);
    if (element && element.Employee.Id === this.selectedEmployee) {
      this.Message.setValue(element.Message);
      this.idCommentToEdit = element.Id;
      this.toEditComent = element;
    } else {
      this.growlService.warningNotification(this.translate.instant(SharedConstant.UNAUTHRIZED_ERROR_MSG));
    }
  }

  /**
   * change the drowpdown value with the connected user if user has clear the value
   * @param $event
   */
  public changeEmployeeDropdownValue($event) {
    if ($event.form.controls[DocumentRequestConstant.ID_EMPLOYEE].value === 0
      || $event.form.controls[DocumentRequestConstant.ID_EMPLOYEE].value === null
      || $event.form.controls[DocumentRequestConstant.ID_EMPLOYEE].value === undefined) {
      this.documentRequestAddFormGroup.controls[DocumentRequestConstant.ID_EMPLOYEE].setValue(this.selectedEmployee);
    }
    if (!isNullOrUndefined($event)) {
      this.currentEmployee = $event.employeeFiltredDataSource
        .filter(x => x.Id === this.documentRequestAddFormGroup.controls[DocumentRequestConstant.ID_EMPLOYEE].value)[0];
      this.currentEmployee && this.currentEmployee.HiringDate ? this.DeadLine.setValidators([Validators.required,
        dateValueGT(new Observable(o => o.next(this.currentEmployee.HiringDate)))]) : dateValueGT(Observable.of(null));
    }
  }


  public refuseDocumentRequest() {
    this.swalWarrings.CreateSwal(DocumentRequestConstant.REFUS_DOCUMENT_REQUEST_ALERT, null, AdministrativeDocumentConstant.OKAY).then((result) => {
      if (result.value) {
        const documentToSave: DocumentRequest = new DocumentRequest();
        // Update Mode
        Object.assign(documentToSave, this.documentRequestAddFormGroup.getRawValue());
        documentToSave.Status = this.statusCode.Refused;
        documentToSave.Code = this.documentToUpdate.Code;
        const objectToSend = new ObjectToSend(documentToSave);
        this.isSaveOperation = true;
        this.subscriptions.push(this.documentRequestService.validateDocumentRequest(objectToSend).subscribe(() => {
          this.router.navigate([DocumentRequestConstant.DOCUMENT_REQUEST_LIST_URL]);
        }));
      }
    });
  }

  addNew(): void {
    throw new Error('Method not implemented.');
  }

  changeTabs(): void {
    if (!this.tab) {
      this.tab = true;
    } else {
      this.tab = false;
    }
  }

  validCommentary(): boolean {
    if (this.Message.value) {
      return this.Message.value.replace(/^\s+|\s+$/g, '') === '';
    } else {
      return true;
    }
  }

  isFormChanged(): boolean {
    return this.documentRequestAddFormGroup.touched;
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

  /**
   * subscribe on notication list
   */
  private subscribeOnCommentList(): void {
    this.subscriptions.push(this.commentService.listCommentSubject.subscribe((data: Comment) => {
      this.getSrcPictureEmployee(data);
      this.commentsData.push(data);
    }));
  }

  /*
   * Prepare Add form component
  */
  private createAddForm(): void {
    this.documentRequestAddFormGroup = this.fb.group({
      Id: [0],
      Label: ['', [Validators.required, Validators.maxLength(NumberConstant.TWO_HUNDRED_FIFTY_FIVE)]],
      IdDocumentRequestType: ['', Validators.required],
      Description: ['', [Validators.required, Validators.maxLength(NumberConstant.TWO_HUNDRED_FIFTY_FIVE)]],
      DeadLine: ['', Validators.required],
      UploadedFile: [],
      IdEmployee: [0, [Validators.required]],
      Message: ['']
    });
  }

  private setMinDate(date: Date): Date {
    const minDate = new Date(date);
    minDate.setHours(NumberConstant.ZERO, NumberConstant.ZERO, NumberConstant.ZERO, NumberConstant.ZERO);
    return minDate;
  }

  /**
   * Get data to Update
   */
  private getDataToUpdate() {
    this.subscriptions.push(this.documentRequestService.getById(this.id).subscribe((data) => {
      this.documentToUpdate = data;
      this.minDate = this.setMinDate(data.DeadLine);
      this.documentBeforeUpdate = Object.assign({}, data);
      this.employeeAssociated = this.documentToUpdate.IdEmployeeNavigation;
      this.selectedEmployee = this.documentToUpdate.IdEmployee;
      if (!this.hasUpdateDocumentsPermission) {
        this.documentRequestAddFormGroup.disable();
      }
      if (this.documentToUpdate != null) {
        this.documentToUpdate.DeadLine = new Date(this.documentToUpdate.DeadLine);
        this.documentRequestAddFormGroup.patchValue(this.documentToUpdate);
        this.prepareCommentsList();
        this.checkRigths();
        this.checkIfDocumentHasBeenAlreadyValidated();
      }
    }));
  }

  /**
   * Add comment
   */
  private addComment(): void {
    if (this.Message.value) {
      // Prepare comment entity
      const commentEntity: Comment = new Comment();
      commentEntity.Id = NumberConstant.ZERO;
      if (this.toEditComent) {
        Object.assign(commentEntity, this.toEditComent);
      }
      commentEntity.Message = (this.Message.value as string).replace('\n', '<br>');
      commentEntity.CreationDate = new Date();
      commentEntity.IdEntityCreated = this.id;
      commentEntity.EmailCreator = this.connectedUser.Email;
      commentEntity.EntityName = DocumentRequestConstant.ENTITY_NAME;
      this.commentService.save(commentEntity, this.idCommentToEdit === NumberConstant.ZERO).subscribe(res => {
        if (res) {
          const createdData: CreatedData = new CreatedData(this.documentToUpdate.Id, this.documentToUpdate.Code);
          this.commentService.addCommentAndSendNotifTheSuperior(
            commentEntity,
            this.documentToUpdate.IdEmployee,
            createdData,
            InformationTypeEnum.ADD_COMMENT_DOCUMENT_REQUEST,
            true
          );
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

  private acceptDocumentRequest() { 
    const documentRequest: DocumentRequest = Object.assign({}, this.documentToUpdate, this.documentRequestAddFormGroup.getRawValue())
    const TITLE = DocumentRequestConstant.VALIDATE_REQUEST;
    this.formModalDialogService.openDialog(TITLE, AddSharedDocumentComponent,
      this.viewRef, null, documentRequest, true, SharedConstant.MODAL_DIALOG_CLASS_M);
  }

}
