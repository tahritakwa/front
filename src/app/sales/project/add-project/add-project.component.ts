import { Component, OnInit, ViewChild, ViewEncapsulation, ViewContainerRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ValidationService, unique, dateValueLT, dateValueGT } from '../../../shared/services/validation/validation.service';
import { ProjectConstant } from '../../../constant/rh/project.constant';
import { ProjectService } from '../../services/project/project.service';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { PredicateFormat, Filter, Operation, Relation } from '../../../shared/utils/predicate';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { EmployeeProject } from '../../../models/rh/employee-project.model';
import { Observable } from 'rxjs/Observable';
import { ContactDropdownComponent } from '../../../shared/components/contact-dropdown/contact-dropdown.component';
import { ContactService } from '../../../purchase/services/contact/contact.service';
import { Contact } from '../../../models/shared/contact.model';
import { Project } from '../../../models/sales/project.model';
import { FormModalDialogService } from '../../../shared/services/dialog/form-modal-dialog/form-modal-dialog.service';
import { SwalWarring } from '../../../shared/components/swal/swal-popup';
import { isNullOrUndefined } from 'util';
import { FileInfo } from '../../../models/shared/objectToSend';
import { EmployeeProjectService } from '../../services/employee-project/employee-project.service';
import { AssignementModalComponent } from '../../components/assignment-modal/assignment-modal.component';
import { TranslateService } from '@ngx-translate/core';
import { PermissionConstant } from '../../../Structure/permission-constant';
import {AuthService} from '../../../login/Authentification/services/auth.service';

@Component({
  selector: 'app-add-project',
  templateUrl: './add-project.component.html',
  styleUrls: ['./add-project.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AddProjectComponent implements OnInit {
  @ViewChild(ContactDropdownComponent) childListContactDropDown;
  public projectFormGroup: FormGroup;
  public isUpdateMode = false;
  public id: number = NumberConstant.ZERO;
  public projectToUpdate: Project;
  public freeResources: EmployeeProject[];
  public assignResources: EmployeeProject[];
  savedExpectedEndDate: Date = null;
  public contractsToUpload: FileInfo[] = new Array<FileInfo>();
  public dateFormat = this.translate.instant(SharedConstant.DATE_FORMAT);
  private purchasePrecision: number;
  formatDate = this.translate.instant(SharedConstant.DATE_FORMAT);
  public haveUpdatePermission: boolean;
  public haveAddPermission: boolean;
  public disablePickList = false;

  constructor(private fb: FormBuilder, public projectService: ProjectService, private contactService: ContactService,
    private router: Router, private validationService: ValidationService, private activatedRoute: ActivatedRoute,
    private employeeProjectService: EmployeeProjectService, private translate: TranslateService,
    private formModalDialogService: FormModalDialogService, private viewRef: ViewContainerRef, private swalWarring: SwalWarring,
    private authService: AuthService) {
    // check if is an update mode
    this.activatedRoute.params.subscribe(params => {
      this.id = params[SharedConstant.ID_LOWERCASE] || NumberConstant.ZERO;
      this.isUpdateMode = this.id > NumberConstant.ZERO;
    });
  }

  ngOnInit() {
    this.haveUpdatePermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.UPDATE_SERVICES_CONTRACT);
    this.haveAddPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.ADD_SERVICES_CONTRACT);
    this.disablePickList = this.isUpdateMode  && !this.haveUpdatePermission;
    this.createProjectForm();
    if (this.isUpdateMode) {
      this.getDataToUpdate();
    } else {
      this.initResources();
    }
  }

  /**
   * Get list of free resouces, not affected to the project
   */
  private initResources() {
    this.employeeProjectService.getProjectResources(this.id).subscribe(result => {
      this.assignResources = result.filter(resource => resource.AssignmentDate);
      this.freeResources = result.filter((resource: EmployeeProject) => !resource.AssignmentDate);
    });
  }

  createProjectForm() {
    this.projectFormGroup = this.fb.group({
      Name: [{value :'',disabled: this.isUpdateMode && !this.haveUpdatePermission}, Validators.required, unique(ProjectConstant.NAME, this.projectService, String(this.id))],
      StartDate: [{value :'',disabled: this.isUpdateMode && !this.haveUpdatePermission}, Validators.required],
      ExpectedEndDate: [{value :'',disabled: this.isUpdateMode && !this.haveUpdatePermission}, Validators.required],
      IsBillable: [{value :true,disabled: this.isUpdateMode && !this.haveUpdatePermission}],
      ProjectType: [{value :'',disabled: this.isUpdateMode && !this.haveUpdatePermission}, Validators.required],
      IdTaxe: [{value :'',disabled: this.isUpdateMode && !this.haveUpdatePermission}, Validators.required],
      AverageDailyRate: [{value :'',disabled: this.isUpdateMode && !this.haveUpdatePermission}, [Validators.required, Validators.min(NumberConstant.ONE), Validators.max(NumberConstant.ONE_BILLION)]],
      IdTiers: [{ value: '', disabled: this.isUpdateMode }, Validators.required],
      IdContact: [{value :'',disabled: this.isUpdateMode && !this.haveUpdatePermission}, Validators.required],
      IdCurrency: [{ value: '', disabled: this.isUpdateMode }, Validators.required],
      BillingAddress: [{ value: '', disabled: true }],
      BillingMailAddress: [{ value: '', disabled: true }],
      IdSettlementMode: [{value :'',disabled: this.isUpdateMode && !this.haveUpdatePermission}, Validators.required],
      EmployeeProject: this.fb.array([]),
      IdBankAccount: [{value :'',disabled: this.isUpdateMode && !this.haveUpdatePermission}],
      ReferenceProject: [{value :'',disabled: this.isUpdateMode && !this.haveUpdatePermission}],
      ReferenceBC: [{value :'',disabled: this.isUpdateMode && !this.haveUpdatePermission}],
      LabelInInvoice: [{value :'',disabled: this.isUpdateMode && !this.haveUpdatePermission}],
      ProjectLabel: [{value :'',disabled: this.isUpdateMode && !this.haveUpdatePermission}]
    });
    this.addStartDateEndDateValidators();
  }

  setAverageDailyRateValidator(pattern: number) {
    this.projectFormGroup.controls[ProjectConstant.AVAIRAGE_DAILY_RATE]
      .setValidators([Validators.required, Validators.min(NumberConstant.ONE), Validators.max(NumberConstant.ONE_BILLION),
      Validators.pattern('[-+]?[0-9]*\.?[0-9]{0,' + pattern + '}')]);
  }

  /**
   * add start/ExpectedEndDate date validators
   */
  private addStartDateEndDateValidators() {
    this.StartDate.setValidators([Validators.required, dateValueLT(new Observable(o => o.next(this.ExpectedEndDate.value)))]);
    this.ExpectedEndDate.setValidators([Validators.required, dateValueGT(new Observable(o => o.next(this.StartDate.value)))]);
  }

  /**
    * update ExpectedEndDate Validity
    * @param x
    */
  public updateEndDateValidity(x: any) {
    this.ExpectedEndDate.updateValueAndValidity();
  }

  /**
   * update StartDate Validity
   * @param x
   */
  public updateStartDateValidity(x: any) {
    this.StartDate.updateValueAndValidity();
  }

  public showUnassignmentDate(date: Date): boolean {
    return (new Date(date)).getTime() < new Date().getTime();
  }
  /**
   * Save
   */
  save() {
    this.assignEmployeeToProject();
    if (this.projectFormGroup.valid) {
      const project: Project = Object.assign({}, this.projectToUpdate, this.projectFormGroup.getRawValue());
      project.FilesInfos = this.contractsToUpload;
      const t = project.EmployeeProject.filter(x => isNullOrUndefined(x.UnassignmentDate));
      // If confirm that all employee project without endDate will be the endDate of the project
      if (!isNullOrUndefined(project.ExpectedEndDate) && project.ExpectedEndDate.toString() !== '') {
        if (project.EmployeeProject.filter(x => isNullOrUndefined(x.UnassignmentDate)).length > NumberConstant.ZERO) {
          this.swalWarring.CreateSwal(ProjectConstant.CONFIRM_PROJECT_UPDATE_TEXT, SharedConstant.WARNING_TITLE,
            SharedConstant.CONTINUE, SharedConstant.CANCEL).then((result) => {
              if (result.value) {
                this.projectService.save(project, !this.isUpdateMode).subscribe(() => {
                  this.router.navigate([ProjectConstant.PROJECT_LIST_URL]);
                });
              }
            });
        } else {
          this.projectService.save(project, !this.isUpdateMode).subscribe(() => {
            this.router.navigate([ProjectConstant.PROJECT_LIST_URL]);
          });
        }
      } else {
        const savedEndDate = new Date(this.savedExpectedEndDate);
        const savedEndDateNewFormat = new Date(savedEndDate.getFullYear(),
          savedEndDate.getMonth(), savedEndDate.getDate());
        const projectExpectedEndDate = new Date(project.ExpectedEndDate);
        const projectExpectedEndDateNewFormat = new Date(projectExpectedEndDate.getFullYear(),
          projectExpectedEndDate.getMonth(), projectExpectedEndDate.getDate());
          if (savedEndDateNewFormat.getTime() !== projectExpectedEndDateNewFormat.getTime() && project.ExpectedEndDate.toString() !== '') {
          this.swalWarring.CreateSwal(ProjectConstant.CONFIRM_PROJECT_END_DATE_CHANGE_TEXT, SharedConstant.WARNING,
            SharedConstant.CONTINUE, SharedConstant.CANCEL).then((result) => {
              if (result.value) {
                this.projectService.save(project, !this.isUpdateMode).subscribe(() => {
                  this.router.navigate([ProjectConstant.PROJECT_LIST_URL]);
                });
              }
            });
        } else {
          this.projectService.save(project, !this.isUpdateMode).subscribe(() => {
            this.router.navigate([ProjectConstant.PROJECT_LIST_URL]);
          });
        }
      }
    } else {
      this.validationService.validateAllFormFields(this.projectFormGroup);
    }
  }

  /**
   * Retrieve the period to edit
   */
  getDataToUpdate() {
    this.projectService.getModelByConditionWithHistory(this.preparePredicate()).subscribe(data => {
      this.projectToUpdate = data;
      if (data.FilesInfos) {
        this.contractsToUpload = data.FilesInfos;
      }
      if (this.projectToUpdate.IsBillable) {
        this.IsBillable.disable();
      }
      if (this.projectToUpdate.EmployeeProject === null) {
        this.projectToUpdate.EmployeeProject = new Array<EmployeeProject>();
      }
      this.projectToUpdate.StartDate = new Date(this.projectToUpdate.StartDate);
      this.projectToUpdate.ExpectedEndDate = this.projectToUpdate.ExpectedEndDate !== null ?
        new Date(this.projectToUpdate.ExpectedEndDate) : null;
      this.savedExpectedEndDate = this.projectToUpdate.ExpectedEndDate;
      this.projectFormGroup.patchValue(this.projectToUpdate);
      this.purchasePrecision = this.projectToUpdate.IdCurrencyNavigation.Precision;
      this.setAverageDailyRateValidator(this.purchasePrecision);
      this.childListContactDropDown.SetContact(this.projectToUpdate.IdTiers);
      this.IdCurrency.setValue(this.projectToUpdate.IdCurrency);
      this.contactService.getById(this.projectToUpdate.IdContact).subscribe((contact: Contact) => {
        this.BillingAddress.setValue(contact.Adress);
        this.BillingMailAddress.setValue(contact.Email);
      });
      this.initResources();
    });
  }

  /**
   * Prepare predicate for get the project with the specific id
   */
  preparePredicate() {
    const predicate = new PredicateFormat();
    predicate.Filter = new Array<Filter>();
    predicate.Filter.push(new Filter(SharedConstant.ID, Operation.eq, this.id));
    predicate.Relation = new Array<Relation>();
    predicate.Relation.push(new Relation(ProjectConstant.ID_CURRENCY_NAVIGATION));
    predicate.Relation.push(new Relation(ProjectConstant.EMPLOYEE_PROJECT));
    return predicate;
  }

  /**
* on select Tiers Prepare supplier
* @param $event
*/
  receiveSupplier($event) {
    // Intialise currency and contact with null value in every selection
    this.childListContactDropDown.SetContact(this.IdTiers.value);
    const tiers = $event.supplierDataSource.filter(c => c.Id === this.IdTiers.value)[0];
    if (tiers) {
      const id = tiers.IdCurrency;
      this.IdCurrency.setValue(id);
    } else {
      this.clearSupplierRelativeControls();
    }
  }

  /**
   * Empty all fields if no customer is selected in the dropdown
   */
  private clearSupplierRelativeControls() {
    this.IdContact.reset();
    this.IdCurrency.reset();
    this.BillingAddress.reset();
    this.BillingMailAddress.reset();
    this.childListContactDropDown.contactDataSource = [];
    this.childListContactDropDown.contactFiltredDataList = [];
  }

  receiveContact($event) {
    if (this.IdContact.value) {
      this.contactService.getById(this.IdContact.value).subscribe((data: Contact) => {
        this.BillingAddress.setValue(data.Adress);
        this.BillingMailAddress.setValue(data.Email);
      });
    } else {
      this.BillingAddress.reset();
      this.BillingMailAddress.reset();
    }
  }

  /**
     * For assign an employee from a project
     */
  private assignResourcesFormGroup(employeeProject: EmployeeProject) {
    const assignFormGroup = this.fb.group({
      Id: [employeeProject.Id ? employeeProject.Id : NumberConstant.ZERO],
      IdEmployee: [employeeProject.IdEmployee],
      IdProject: [employeeProject.IdProject],
      AssignmentDate: [employeeProject.AssignmentDate],
      AverageDailyRate: [employeeProject.AverageDailyRate ? employeeProject.AverageDailyRate : ''],
      IsBillable: [employeeProject ? employeeProject.IsBillable : false],
      AssignmentPercentage: [employeeProject ? employeeProject.AssignmentPercentage : NumberConstant.ONE_HUNDRED],
      CompanyCode: [employeeProject ? employeeProject.CompanyCode : '']
    });
    if (employeeProject.UnassignmentDate) {
      assignFormGroup.addControl(ProjectConstant.UNASSIGNMENTDATE, this.fb.control(employeeProject.UnassignmentDate));
    }
    return assignFormGroup;
  }

  /**
   * Assign employees to the current project
   */
  public assignEmployeeToProject() {
    // Clear form array
    while (this.EmployeeProject.length !== NumberConstant.ZERO) {
      this.EmployeeProject.removeAt(NumberConstant.ZERO);
    }
    this.assignResources.forEach(assign => {
      this.EmployeeProject.push(this.assignResourcesFormGroup(assign));
    });
    this.freeResources.filter(m => m.UnassignmentDate).forEach(unassign => {
      this.EmployeeProject.push(this.assignResourcesFormGroup(unassign));
    });
  }

  /**
   * Opens the information model for assignment information
   */
  public setAssignementInformations(employeeProject: EmployeeProject) {
    employeeProject.ShowControl = this.freeResources.includes(employeeProject) ? false : true;
    employeeProject.ShowBillableOption = this.IsBillable.value;
    const data = {};
    data[ProjectConstant.EMPLOYEE_PROJECT_TO_SEND] = employeeProject;
    data[ProjectConstant.PURCHASE_PRECISION] = this.purchasePrecision;
    data[ProjectConstant.PROJECT_START_DATE] = this.StartDate.value;
    data[ProjectConstant.PROJECT_END_DATE] = this.ExpectedEndDate.value;
    this.formModalDialogService.openDialog(ProjectConstant.HISTORY_ASSIGNMENT,
      AssignementModalComponent, this.viewRef, this.onCloseMoveToAssignModal.bind(this), data,
      true, SharedConstant.MODAL_DIALOG_SIZE_M);
  }

  /**
   * on close assignment informations modal
   * @param data
   */
  private onCloseMoveToAssignModal(data: any): void {
    if (data !== undefined) {
      const employeeProject: EmployeeProject = data.value;
      if (employeeProject) {
        const index = this.assignResources.findIndex(m => m.IdEmployee === employeeProject.IdEmployee);
        this.assignResources[index].AssignmentDate = employeeProject.AssignmentDate;
        this.assignResources[index].AverageDailyRate = employeeProject.AverageDailyRate;
        this.assignResources[index].UnassignmentDate = employeeProject.UnassignmentDate;
        this.assignResources[index].IsBillable = employeeProject.IsBillable;
        this.assignResources[index].AssignmentPercentage = !employeeProject.IsBillable ?
          NumberConstant.ZERO : employeeProject.AssignmentPercentage;
        this.assignResources[index].CompanyCode = employeeProject.CompanyCode;
      }
    }
  }

  public onMoveToAssignResources(employeeProjects: Array<EmployeeProject>) {
    if((this.isUpdateMode && this.haveUpdatePermission) || (!this.isUpdateMode && this.haveAddPermission))
    {
      for (let i = 0; i < employeeProjects[ProjectConstant.ITEMS].length; i++) {
        const index = this.assignResources.findIndex(m => m.IdEmployee ===
          employeeProjects[ProjectConstant.ITEMS][i].IdEmployee);
        if (index >= NumberConstant.ZERO) {
          this.assignResources[index].AssignmentDate = new Date();
          this.assignResources[index].UnassignmentDate = undefined;
          this.assignResources[index].IsBillable = this.projectFormGroup.controls['IsBillable'].value;
        }
      }
    }
  }

  public onMoveToFreeResources(employeeProjects: Array<EmployeeProject>) {
    if((this.isUpdateMode && this.haveUpdatePermission) || (!this.isUpdateMode && this.haveAddPermission))
    {
      for (let i = 0; i < employeeProjects[ProjectConstant.ITEMS].length; i++) {
        const index = this.freeResources.findIndex(m => m.IdEmployee ===
          employeeProjects[ProjectConstant.ITEMS][i].IdEmployee);
        if (index >= NumberConstant.ZERO) {
          this.freeResources[index].UnassignmentDate = new Date();
          this.freeResources[index].CompanyCode = null;
        }
      }
    }
  }

  get Name(): FormControl {
    return this.projectFormGroup.get(ProjectConstant.NAME) as FormControl;
  }

  get StartDate(): FormControl {
    return this.projectFormGroup.get(ProjectConstant.START_DATE) as FormControl;
  }

  get ExpectedEndDate(): FormControl {
    return this.projectFormGroup.get(ProjectConstant.EXPECTED_END_DATE) as FormControl;
  }

  get ProjectType(): FormControl {
    return this.projectFormGroup.get(ProjectConstant.PROJECT_TYPE) as FormControl;
  }

  get IdTaxe(): FormControl {
    return this.projectFormGroup.get(ProjectConstant.ID_TAXE) as FormControl;
  }

  get IdCurrency(): FormControl {
    return this.projectFormGroup.get(ProjectConstant.ID_CURRENCY) as FormControl;
  }

  get AverageDailyRate(): FormControl {
    return this.projectFormGroup.get(ProjectConstant.AVAIRAGE_DAILY_RATE) as FormControl;
  }

  get IdTiers(): FormControl {
    return this.projectFormGroup.get(ProjectConstant.ID_TIERS) as FormControl;
  }

  get BillingAddress(): FormControl {
    return this.projectFormGroup.get(ProjectConstant.BILLING_ADDRESS) as FormControl;
  }

  get BillingMailAddress(): FormControl {
    return this.projectFormGroup.get(ProjectConstant.BILLING_MAIL_ADDRESS) as FormControl;
  }

  get EmployeeProject(): FormArray {
    return this.projectFormGroup.get(ProjectConstant.EMPLOYEE_PROJECT) as FormArray;
  }

  get IdSettlementMode(): FormControl {
    return this.projectFormGroup.get(ProjectConstant.ID_SETTLEMENT_MODE) as FormControl;
  }

  get IdContact(): FormControl {
    return this.projectFormGroup.get(ProjectConstant.ID_CONTACT) as FormControl;
  }

  get IsBillable(): FormControl {
    return this.projectFormGroup.get(ProjectConstant.IS_BILLABLE) as FormControl;
  }

  get HistoryOfProjectAssignments(): FormArray {
    return this.projectFormGroup.get(ProjectConstant.HISTORY_OF_PROJECT_ASSIGNMENTS) as FormArray;
  }

  get ItemDesignation(): FormControl {
    return this.projectFormGroup.get(ProjectConstant.LABEL_IN_INVOICE) as FormControl;
  }

  get ProjectLabel(): FormControl {
    return this.projectFormGroup.get(ProjectConstant.PROJECT_LABEL) as FormControl;
  }
}
