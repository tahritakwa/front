import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { GrowlService } from '../../../../COM/Growl/growl.service';
import { CompanyService } from '../../../administration/services/company/company.service';
import { CurrencyService } from '../../../administration/services/currency/currency.service';
import { AdministrativeDocumentConstant } from '../../../constant/payroll/administrative-document-constant';
import { ExpenseReportConstant } from '../../../constant/payroll/expense-resport.constant';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { Currency } from '../../../models/administration/currency.model';
import { AdministrativeDocumentStatusEnumerator } from '../../../models/enumerators/administrative-document-status.enum';
import { Employee } from '../../../models/payroll/employee.model';
import { ExpenseReportDetails } from '../../../models/payroll/expense-report-details.model';
import { ExpenseReport } from '../../../models/payroll/expense-report.model';
import { ObjectToSend } from '../../../models/sales/object-to-save.model';
import { Comment } from '../../../models/shared/comment.model';
import { CreatedData } from '../../../models/shared/created-data.model';
import { FileInfo } from '../../../models/shared/objectToSend';
import { EmployeeDropdownComponent } from '../../../shared/components/employee-dropdown/employee-dropdown.component';
import { SwalWarring } from '../../../shared/components/swal/swal-popup';
import { CommentService } from '../../../shared/services/signalr/comment/comment.service';
import { InformationTypeEnum } from '../../../shared/services/signalr/information/information.enum';
import { dateValueLT, ValidationService } from '../../../shared/services/validation/validation.service';
import { Filter, PredicateFormat } from '../../../shared/utils/predicate';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { EmployeeService } from '../../services/employee/employee.service';
import { ExpenseReportService } from '../../services/expense-report/expense-report.service';

@Component({
  selector: 'app-expense-report-request-add-request-add',
  templateUrl: './expense-report-request-add.component.html',
  styleUrls: ['./expense-report-request-add.component.scss'],
  providers: [CurrencyService]
})
export class ExpenseReportRequestAddComponent implements OnInit, OnDestroy {
  @ViewChild(EmployeeDropdownComponent) employeeDropdownComponent: EmployeeDropdownComponent;
  /**
   * Carousel Index
   */
  public carouselIndex = 0;

  /**
   * Form Group
   */
  expenseReportFormGroup: FormGroup;

  /**
   * All files Infos: every element is an array of fileInfo
   */
  public FilesInfos: Array<Array<FileInfo>> = new Array<Array<FileInfo>>();


  public deletedExpenseDetails: ExpenseReportDetails[] = [];
  /**
   * Id Entity
   */
  private id: number;

  /**
   * is updateMode
   */
  public isUpdateMode: boolean;

  /**
   * id Subscription
   */
  public idSubscription: Subscription;

  /**
   * Total expense report
   */
  public ExpenseReportTotalAmount = NumberConstant.ZERO;

  // a specific object to communicate with backend
  public objectToSend: ObjectToSend;

  // the epense report to update in update case
  public ObjectToUpdate: ExpenseReport;

  /**
   * ExpenseReport before update action
   */
  public expenseReportBeforeUpdate: ExpenseReport;

  // The Id of the connected Empployee
  public selectedEmployee = NumberConstant.ZERO;

  // connected Empployee
  public connectedUser;

  // Enum  Waiting , Accepted , Refused
  public statusCode = AdministrativeDocumentStatusEnumerator;

  // Is true if the connected user has the right to update or to validate the request
  public canUpdate = false;

  // Is true if we need to show all employee in the dropdown in case of the connected user
  // can validate all request ( no need to be the super heararchy to validate the request)
  public allEmployee = false;

  // Is true if the user change the form values
  public formHasBeenChanged = false;

  // Is true if the expense report to update is  Accepted or Rejected
  public RequestAlreadyValidate = true;

  // Is true if the list must contains only requests related to the connected user
  public myRequest = false;

  // List of ids of employees that has the connected user as super hierarchical
  public EmployeeHierarchy: number[] = [];

  // List of comments
  public commentsData: Comment[] = [];

  // Is true if the ExpenseReport is Accepted, Refused
  public isTraitedExpenseReport = false;

  public companyCurrency;
  searchPredicate: PredicateFormat;
  public tab = false;
  public ExpenseReportNumber = NumberConstant.ONE;
  // Permissions
  public hasUpdateExpenseReportPermission: boolean;
  public hasAddExpenseReportPermission: boolean;
  public hasValidateExpenseReportPermission: boolean;
  public hasRefuseExpenseReportPermission: boolean;

  private isSaveOperation = false;
  idCommentToEdit = NumberConstant.ZERO;
  toEditComent: Comment;

  private subscriptions: Subscription[] = [];
  connectedEmployee = new Employee();
  // Constructor
  constructor(private fb: FormBuilder,
              private validationService: ValidationService,
              private swalWarrings: SwalWarring,
              private employeeService: EmployeeService,
              private expenseReportService: ExpenseReportService,
              private router: Router,
              private commentService: CommentService,
              public currencyService: CurrencyService,
              private activatedRoute: ActivatedRoute,
              private companyService: CompanyService,
              private translate: TranslateService,
              private growlService: GrowlService,
              public authService: AuthService
  ) {
    this.idSubscription = this.activatedRoute.params.subscribe(params => {
      this.id = + params[SharedConstant.ID_LOWERCASE] || 0;
    });
  }

  /**
   *  on init
   */
  ngOnInit(): void {
    this.hasValidateExpenseReportPermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.VALIDATE_EXPENSEREPORT);
    this.hasUpdateExpenseReportPermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.UPDATE_EXPENSEREPORT);
    this.hasAddExpenseReportPermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.ADD_EXPENSEREPORT);
    this.hasRefuseExpenseReportPermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.REFUSE_EXPENSEREPORT);

    this.searchPredicate = new PredicateFormat();
    this.searchPredicate.Filter = new Array<Filter>();
    this.subscriptions.push(this.companyService.getCurrentCompany().subscribe(company => {
      this.companyCurrency = company.IdCurrencyNavigation.Symbole;
    }));
    this.createAddForm();
    this.isUpdateMode = this.id > NumberConstant.ZERO;
    const dataUser = localStorage.getItem(SharedConstant.USER);
    this.connectedUser = JSON.parse(dataUser);
    this.subscriptions.push(
      this.employeeService.getConnectedEmployee().subscribe(result => {
        this.connectedEmployee = result;
        if (!this.isUpdateMode) {
          this.selectedEmployee = this.connectedEmployee.Id;
          this.expenseReportFormGroup.controls[ExpenseReportConstant.ID_EMPLOYEE].setValue(this.selectedEmployee);
        }
        this.employeeService.getEmployeesHierarchicalList().subscribe(data => {
          this.EmployeeHierarchy = data.map(x => x.Id);
          if (this.isUpdateMode) {
            this.getDataToUpdate();
          } else {
            this.ExpenseReportDetails.push(this.buildExpenseReportDetailsForm());
            this.FilesInfos.push(new Array<FileInfo>());
            this.setCarouselIndex(this.ExpenseReportDetails.length);
          }
        });
      }));
    this.commentService.initCommentHubConnection();
    this.subscribeOnCommentList();
  }
  ngOnDestroy(): void {
    this.commentService.destroyCommentHubConnection();
    if (this.subscriptions !== undefined) {
      this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }
    this.idSubscription.unsubscribe();
  }

  /**
   * create main foràm
   */
  private createAddForm(): void {
    this.expenseReportFormGroup = this.fb.group({
      Id: [0],
      IdEmployee: [0, [Validators.required]],
      Purpose: ['', [Validators.required, Validators.maxLength(NumberConstant.TWO_HUNDRED_FIFTY_FIVE)]],
      ExpenseReportDetails: this.fb.array([]),
      Message: ['']
    });
  }

  /**
   * Build Expense Report Details Form
   */
  private buildExpenseReportDetailsForm(): FormGroup {
    const currentDate = new Date();
    return this.fb.group({
      Id: [NumberConstant.ZERO],
      IdExpenseReportDetailsType: ['', Validators.required],
      Description: ['', [Validators.required, Validators.maxLength(NumberConstant.TWO_HUNDRED_FIFTY_FIVE)]],
      Date: [new Date(), [Validators.required, dateValueLT(Observable.of(currentDate))]],
      Amount: ['', [Validators.required, Validators.min(NumberConstant.ONE), Validators.max(NumberConstant.ONE_MILLION)]],
      AttachmentUrl: [undefined],
      IdExpenseReport: [NumberConstant.ZERO],
      IdCurrency: [undefined, Validators.required],
      IsDeleted: [false]
    });
  }

  /**
   * add new expense
   */
  addExpense(): void {
    this.ExpenseReportDetails.push(this.buildExpenseReportDetailsForm());
    this.ExpenseReportNumber += NumberConstant.ONE;
    this.setCarouselIndex(this.ExpenseReportDetails.length);
    this.FilesInfos.push(new Array<FileInfo>());

  }

  /**
   * delete expense
   * @param i
   */
  deleteExpense(i: number): void {
    if (this.ExpenseReportDetails.at(i).get(ExpenseReportConstant.ID).value !== NumberConstant.ZERO) {
      // TODO update expenses
      if (this.ObjectToUpdate.ExpenseReportDetails.length > 0) {
        const deletedExpense = this.ObjectToUpdate.ExpenseReportDetails
          .filter(x => x.Id === (+this.ExpenseReportDetails.at(i).get(ExpenseReportConstant.ID).value))[NumberConstant.ZERO];
        deletedExpense.IsDeleted = true;
        this.deletedExpenseDetails.push(deletedExpense);
      }
    }
    this.ExpenseReportDetails.removeAt(i);
    this.ExpenseReportNumber -= NumberConstant.ONE;
    this.FilesInfos.splice(i, 1);
    this.setCarouselIndex(this.ExpenseReportDetails.length);
    this.calculateExpenseReportTotal();
  }

  /**
   * get expenses as formArray
   */
  get ExpenseReportDetails(): FormArray {
    return this.expenseReportFormGroup.get(ExpenseReportConstant.EXPENSE_REPORT_DETAILS) as FormArray;
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

  /**
   * get the informations related to the object to update
   */
  getDataToUpdate() {
    this.subscriptions.push(this.expenseReportService.getById(this.id).subscribe((data: ExpenseReport) => {
      this.ObjectToUpdate = data;
      if (this.ObjectToUpdate.ExpenseReportDetails) {
        this.ExpenseReportNumber = this.ObjectToUpdate.ExpenseReportDetails.length;
      }
      this.expenseReportBeforeUpdate = Object.assign({}, data);
      if (this.expenseReportBeforeUpdate.Status !== AdministrativeDocumentStatusEnumerator.Waiting) {
        this.isTraitedExpenseReport = true;
      }
      if (this.ObjectToUpdate) {
        this.selectedEmployee = this.ObjectToUpdate.IdEmployee;
        // Update Amount
        this.ExpenseReportTotalAmount = data.TotalAmount;
        // ExpenseReportDetails infos
        if (data.ExpenseReportDetails.length > 0) {
          data.ExpenseReportDetails.forEach(element => {
            element.Date = new Date(element.Date);
            this.ExpenseReportDetails.push(this.buildExpenseReportDetailsForm());
            const filesInfos: Array<FileInfo> = element.FilesInfos ? element.FilesInfos : new Array<FileInfo>();
            this.FilesInfos.push(filesInfos);
          });
        }
        this.prepareCommentsList();
        this.expenseReportFormGroup.patchValue(this.ObjectToUpdate);
        this.checkRights();
        this.checkIfDocumentHasBeenAlreadyValidated();
        this.setCarouselIndex(1);
      } else {
        this.isSaveOperation = true;
        this.router.navigate([ExpenseReportConstant.EXPENSE_REPORT_ADD_URL]);
      }

    }));
  }

  checkRights() {
    if (this.ObjectToUpdate.IdEmployee === this.connectedEmployee.Id) {
      this.myRequest = true;
    }
    // Check If the user has the right to update
    // 1- check if the request is associeted to the connected user
    // 2- check if the connected user has the right to validate the request (if IdConnectedUser != IdEmployee)
    if ((!this.myRequest && this.EmployeeHierarchy.indexOf(this.ObjectToUpdate.IdEmployee) > -1)
      || (this.isUpdateMode && this.myRequest)) {
      this.canUpdate = true;
    } else {
      if (!this.hasValidateExpenseReportPermission) {
        this.isSaveOperation = true;
        this.router.navigate([ExpenseReportConstant.EXPENSE_REPORT_ADD_URL]);
      } else {
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
    this.commentsData = this.ObjectToUpdate.Comments;
    this.commentsData.forEach((x) => {
      this.getSrcPictureEmployee(x);
    });
  }
  checkIfDocumentHasBeenAlreadyValidated() {
    // check if the request is not validated already
    if (this.ObjectToUpdate.Status === this.statusCode.Waiting) {
      this.RequestAlreadyValidate = false;
    } else {
      // Make form Disabled
      this.makeTheFormdisabled();
    }
  }

  /**
   * Make the formGroup disabled
   */
  makeTheFormdisabled() {
    this.expenseReportFormGroup.disable();
    this.expenseReportFormGroup.get(SharedConstant.MESSAGE).enable();
    this.ExpenseReportDetails.controls
      .forEach(control => {
          control.disable();
        }
      );
  }
  /**
   * @param index
   */
  setCarouselIndex(index: number) {
    this.carouselIndex = index;
  }

  /**
   * event = id of the selected currency
   */
  checkPrecisionAndcalculateExpenseReportTotal($event, expenseReportDetails: FormGroup) {
    if ($event) {
      this.subscriptions.push(this.currencyService.getById($event).subscribe(
        (res: Currency) => {
          if (res) {
            // check amount Presion after changing the currency
            expenseReportDetails.controls[ExpenseReportConstant.AMOUNT].setValidators([Validators.required,
              Validators.min(NumberConstant.ONE),
              Validators.pattern('[-+]?[0-9]*\.?[0-9]{0,' + res.Precision + '}')]);
            expenseReportDetails.controls[ExpenseReportConstant.AMOUNT].updateValueAndValidity();
          }
        }
      ));
      // Calculate the total amount
      this.calculateExpenseReportTotal();
    } else {
      expenseReportDetails.controls[ExpenseReportConstant.AMOUNT].setValidators([Validators.required, Validators.min(NumberConstant.ONE),
        Validators.max(NumberConstant.ONE_MILLION)]);
      expenseReportDetails.controls[ExpenseReportConstant.AMOUNT].updateValueAndValidity();
    }
  }
  /**
   * Calculate total expense report
   */
  calculateExpenseReportTotal() {
    if (this.ExpenseReportDetails.controls.filter(x => x.get(ExpenseReportConstant.AMOUNT).valid).length ===
      this.ExpenseReportDetails.controls.filter(x => x.get(ExpenseReportConstant.ID_CURRENCY).valid).length) {
      this.subscriptions.push(this.expenseReportService.calculateTotalAmount(this.ExpenseReportDetails.value).subscribe(result => {
        this.ExpenseReportTotalAmount = result;
      }));
    }
  }
  public createObjectFromTheForm(): ExpenseReport {
    // TODO Save new expense report
    const expenseReport = new ExpenseReport();
    Object.assign(expenseReport, this.expenseReportFormGroup.getRawValue());
    expenseReport.TotalAmount = this.ExpenseReportTotalAmount;
    // put image in every expenseReportDetail
    if (expenseReport.ExpenseReportDetails) {
      let index = 0;
      expenseReport.ExpenseReportDetails.forEach(
        (expenseReportDetail) => {
          expenseReportDetail.FilesInfos = this.FilesInfos[index];
          index++;
        }
      );
    }
    return expenseReport;
  }

  /**
   * Add expense report request
   */
  public onAddExpenseReportRequestClick(): void {
    if (this.expenseReportFormGroup.valid) {
      // TODO Save new expense report
      const expenseReport = this.createObjectFromTheForm();
      this.isSaveOperation = true;
      if (this.id > NumberConstant.ZERO) {
        // Update Mode
        Object.assign(this.ObjectToUpdate, expenseReport);
        if (this.deletedExpenseDetails.length > NumberConstant.ZERO) {
          this.deletedExpenseDetails.forEach(deletedDetail => {
            this.ObjectToUpdate.ExpenseReportDetails.push(deletedDetail);
          });
        }
        this.objectToSend = new ObjectToSend(this.ObjectToUpdate);
        this.subscriptions.push(this.expenseReportService.updateExpenseReport(this.objectToSend).subscribe(() => {
          this.router.navigate([ExpenseReportConstant.EXPENSE]);
        }));
      } else {
        // Add Mode
        this.objectToSend = new ObjectToSend(expenseReport);
        this.subscriptions.push(this.expenseReportService.saveExpenseReport(this.objectToSend).subscribe((res) => {
          this.router.navigate([ExpenseReportConstant.EXPENSE]);
        }));
      }
    } else {
      this.validationService.validateAllFormFields(this.expenseReportFormGroup);
    }
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
      commentEntity.Message = (this.Message.value as string)
        .replace('\n', '<br>');
      commentEntity.CreationDate = new Date();
      commentEntity.IdEntityCreated = this.id;
      commentEntity.EmailCreator = this.connectedUser.Email;
      commentEntity.EntityName = ExpenseReportConstant.ENTITY_NAME;
      this.commentService.save(commentEntity, true).subscribe(res => {
        if (res) {
          const createdData: CreatedData = new CreatedData(this.ObjectToUpdate.Id, this.ObjectToUpdate.Code);
          this.commentService.addCommentAndSendNotifTheSuperior(commentEntity, this.ObjectToUpdate.IdEmployee,
            createdData, InformationTypeEnum.ADD_COMMENT_EXPENSE_REPORT_REQUEST, true);
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

  deletecomment(idComment: number) {
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

  editcomment(idComment: number) {
    const element = this.commentsData.find(x => x.Id === idComment);
    if (element && element.Employee.Id === this.connectedEmployee.Id) {
      this.Message.setValue(element.Message);
      this.idCommentToEdit = element.Id;
      this.toEditComent = element;
    } else {
      this.growlService.warningNotification(this.translate.instant(SharedConstant.UNAUTHRIZED_ERROR_MSG));
    }
  }

  getSwalText(state): string {
    if (state === this.statusCode.Accepted) {
      return ExpenseReportConstant.VALIDATE_EXPENSE_REPORT_REQUEST_ALERT;
    }
    if (state === this.statusCode.Refused) {
      return ExpenseReportConstant.REFUS_EXPENSE_REPORT_REQUEST_ALERT;
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

  /**
   * return the visibility of a validityPeriod
   * @param i
   */
  isRowVisible(i): boolean {
    return !this.ExpenseReportDetails.at(i).get(ExpenseReportConstant.IS_DELETED).value;
  }

  /**
   * change the drowpdown value with the connected user if user has clear the value
   * @param $event
   */
  public changeEmployeeDropdownValue($event) {
    if ($event.form.controls[ExpenseReportConstant.ID_EMPLOYEE].value === NumberConstant.ZERO
      || $event.form.controls[ExpenseReportConstant.ID_EMPLOYEE].value === null
      || $event.form.controls[ExpenseReportConstant.ID_EMPLOYEE].value === undefined) {
      this.expenseReportFormGroup.controls[ExpenseReportConstant.ID_EMPLOYEE].setValue(this.selectedEmployee);
    }
  }

  /**
   * Accept or reject request
   * @param state
   */
  public setRequestState(state) {
    if (this.expenseReportFormGroup.valid) {
      this.swalWarrings.CreateSwal(this.getSwalText(state), null, AdministrativeDocumentConstant.OKAY).then((result) => {
        if (result.value) {
          const expenseReport: ExpenseReport = new ExpenseReport();
          // Update Mode
          Object.assign(this.ObjectToUpdate, this.createObjectFromTheForm());
          if (this.deletedExpenseDetails.length > NumberConstant.ZERO) {
            this.deletedExpenseDetails.forEach(deletedDetail => {
              this.ObjectToUpdate.ExpenseReportDetails.push(deletedDetail);
            });
          }
          Object.assign(expenseReport, this.ObjectToUpdate);
          expenseReport.Status = state;
          this.objectToSend = new ObjectToSend(expenseReport);
          this.isSaveOperation = true;
          this.subscriptions.push(this.expenseReportService.validateExpenseReport(this.objectToSend).subscribe(() => {
            this.router.navigate([ExpenseReportConstant.EXPENSE]);
          }));
        }
      });
    } else {
      this.validationService.validateAllFormFields(this.expenseReportFormGroup);
    }
  }
  changeTabs(): void {
    if (!this.tab) {
      this.tab = true;
    } else {
      this.tab = false;
    }
  }
  get IdEmployee(): FormControl {
    return this.expenseReportFormGroup.get(ExpenseReportConstant.ID_EMPLOYEE) as FormControl;
  }

  get Message(): FormControl {
    return this.expenseReportFormGroup.get(SharedConstant.MESSAGE) as FormControl;
  }

  validCommentary(): boolean {
    if (this.Message.value) {
      return this.Message.value.replace(/^\s+|\s+$/g, '') === '';
    } else {
      return true;
    }
  }

  isFormChanged(): boolean {
    if (!this.ExpenseReportDetails.disabled && (this.expenseReportFormGroup.touched ||
      this.FilesInfos[NumberConstant.ZERO] && this.FilesInfos[NumberConstant.ZERO].length !== NumberConstant.ZERO
      || this.FilesInfos.length > NumberConstant.ONE)) {
      return true;
    }
    return false;
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

}

