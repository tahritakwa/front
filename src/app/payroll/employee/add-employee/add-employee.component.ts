import { DatePipe } from '@angular/common';
import {
  Component, OnInit, ViewChild, ViewContainerRef, ComponentRef,
  ViewChildren, QueryList, TemplateRef, OnDestroy
} from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxImageCompressService } from 'ngx-image-compress';
import { IModalDialog, IModalDialogOptions } from 'ngx-modal-dialog';
import { ModalDialogInstanceService } from 'ngx-modal-dialog/src/modal-dialog-instance.service';
import { Subscription } from 'rxjs/Subscription';
import { ContractConstant } from '../../../constant/payroll/Contract.constant';
import { EmployeeConstant } from '../../../constant/payroll/employee.constant';
import { SkillsMatrixConstant } from '../../../constant/payroll/skills-matrix.constant';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { ActiveAssignmentService } from '../../../immobilization/services/active-assignment/active-assignment.service';
import { Country } from '../../../models/administration/country.model';
import { Employee } from '../../../models/payroll/employee.model';
import { EmployeeService } from '../../services/employee/employee.service';
import {
  ValidationService,
  unique,
  isNumericWithHighDashs,
  isEqualLength,
  customEmailValidator
} from '../../../shared/services/validation/validation.service';
import { ContractStateEnumerator } from '../../../models/enumerators/contractStateEnumerator.model';
import { WrongPayslipActionEnumerator } from '../../../models/enumerators/wrong-payslip-action.enum';
import { ContractBonus } from '../../../models/payroll/contract-bonus.model';
import { Contract } from '../../../models/payroll/contract.model';
import { EmployeeDocument } from '../../../models/payroll/employee-document.model';
import { JobEmployee } from '../../../models/payroll/job-employee.model';
import { Payslip } from '../../../models/payroll/payslip.model';
import { Qualification } from '../../../models/payroll/qualification.model';
import { FileInfo } from '../../../models/shared/objectToSend';
import { CityDropdownComponent } from '../../../shared/components/city-dropdown/city-dropdown.component';
import { CountryDropdownComponent } from '../../../shared/components/country-dropdown/country-dropdown.component';
import { JobMultiselectComponent } from '../../../shared/components/job-multiselect/job-multiselect.component';
import { AddQualificationComponent } from '../../../shared/components/qualification/add-qualification/add-qualification.component';
import { SwalWarring } from '../../../shared/components/swal/swal-popup';
import { WrongPayslipListComponent } from '../../../shared/components/wrong-payslip-list/wrong-payslip-list.component';
import { FormModalDialogService } from '../../../shared/services/dialog/form-modal-dialog/form-modal-dialog.service';
import { Filter, Operation, PredicateFormat, Relation } from '../../../shared/utils/predicate';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { PayslipPreviewComponent } from '../../components/payslip-preview/payslip-preview.component';
import { ResignationEmployeeComponent } from '../../components/resignation-employee/resignation-employee.component';
import { AddContractComponent } from '../../contract/add-contract/add-contract.component';
import { AddEmployeeDocumentComponent } from '../../employee-document/add-employee-document/add-employee-document.component';
import { ContractService } from '../../services/contract/contract.service';
import { EmployeeTeamService } from '../../services/employee-team/employee-team.service';
import { PayslipService } from '../../services/payslip/payslip.service';
import { QualificationService } from '../../services/qualification/qualification.service';
import { TeamService } from '../../services/team/team.service';
import { Observable } from 'rxjs/Observable';
import { TranslateService } from '@ngx-translate/core';
import { EmployeeState } from '../../../models/enumerators/employee-state.enum';
import { EmployeeDocumentType } from '../../../models/enumerators/employee-document-type.enum';
import { AuthService } from '../../../login/Authentification/services/auth.service';

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.scss']
})
export class AddEmployeeComponent implements OnInit, OnDestroy {
  @ViewChildren(AddContractComponent) listContracts: QueryList<AddContractComponent>;
  @ViewChild('vc', { read: ViewContainerRef }) viewContainer: ViewContainerRef;
  @ViewChild('addContract', { read: TemplateRef }) template: TemplateRef<null>;
  Country: Country;
  @ViewChild(CityDropdownComponent)
  childListCity;
  @ViewChild(CountryDropdownComponent)
  childListCountry;


  /*
  * Id Entity
  */
  private id: number;
  /*
   * is updateMode
   */
  public isUpdateMode: boolean;
  /*
  * id Subscription
  */
  public idSubscription: Subscription;
  public validateUrl: string;
  public socialSecurityNumberMask: string;
  /*
   * Tiers to update
   */
  public employeeToUpdate: Employee;
  public employeeStateEnumerator = EmployeeState;
  contractStateEnumerator = ContractStateEnumerator;
  public hasUpdateEmployeePermission = false;
  public isUserWithReadContractManaging = false;
  public isUserWithUpdateContractManaging = false;
  public isUserWithReadBonusManaging = false;
  public isUserWithReadBaseSalary = false;
  public isUserInSuperHierarchicalEmployeeList;
  public pictureEmployesSrc: any;
  public employeeFormGroup: FormGroup;
  public predicateEmployeeTeam: PredicateFormat;
  public predicateTeam: PredicateFormat;
  public predicate: PredicateFormat;
  public employeeListSource: Employee[];
  public employeeListData: Employee[];
  public cinFileToUpload: Array<FileInfo>;
  public pictureFileInfo: FileInfo;
  private predicateOfActiveList: PredicateFormat;
  private dataActives: any[];
  private isEmptyActif: boolean;
  teams: any[] = new Array<any>();
  public IdentityPapersFormGroup: FormGroup;
  public ContractFormGroup: FormGroup;
  public GraduationFormGroup: FormGroup;
  public PayFormGroup: FormGroup;
  public ContactFormGroup: FormGroup;
  public employeetestFormGroup: FormGroup;
  public dateFormat: string = this.translate.instant(SharedConstant.DATE_FORMAT);
  hasPayPrivilege = false;
  hasContractPrivilege = false;
  public uuid = Math.floor(Math.random() * NumberConstant.ONE_THOUSAND);
  connectedEmployee: number;
  public receivedFormGroup: FormGroup;
  /**
   * For disable or enable bank and rib fields
   */
  public disableRibBank = true;
  /**
   * Is true if form must be disable
   */
  public isDisabled = false;
  @ViewChild(JobMultiselectComponent) jobMultiselect: JobMultiselectComponent;
  private isSaveOperation = false;
  private subscriptions: Subscription[] = [];
  public isModal = false;
  dialogOptions: Partial<IModalDialogOptions<any>>;
  public actionEnum = WrongPayslipActionEnumerator;


  public degitsAfterComma: number;

  /** Permissions */
  public hasAddEmployeePermission = false;
  public hasUpdateContract = false;
  public hasAddContract = false;
  public hasListContractPermission: boolean;
  public hasDeleteContractPermission: boolean;
  public hasResignationEmployeePermission = false;
  public hasCancelResignationEmployeePermission = false;
  public hasPayslipPreviewEmployeePermission = false;
  public hasSendEmployeeSharedDocumentsPasswordPermission = false;
  public hasShowContractPermission = false;
  public hasAddEmployeeDocumentPermission = false;
  public showResignationButton = false;
  public hasContractListPermission = false;
  public hasShowRemarkPermission = false;
  public hasListEmployeePermission = false;
  preview = false;


  constructor(private fb: FormBuilder, private translate: TranslateService,
    public employeeService: EmployeeService,
    private employeeTeamService: EmployeeTeamService,
    private teamService: TeamService,
    private contractService: ContractService,
    private qualificationService: QualificationService,
    private payslipService: PayslipService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private viewRef: ViewContainerRef,
    private validationService: ValidationService,
    private swalWarrings: SwalWarring,
    private activeAssignmentService: ActiveAssignmentService,
    private formModalDialogService: FormModalDialogService,
    private modalService: ModalDialogInstanceService,
    public authService: AuthService, private datePipe: DatePipe,
    private imageCompress: NgxImageCompressService) {
    this.idSubscription = this.activatedRoute.params.subscribe(params => {
      this.id = + params[EmployeeConstant.PARAM_ID] || NumberConstant.ZERO;
    });
    this.predicate = new PredicateFormat();
    this.cinFileToUpload = new Array<FileInfo>();
  }

  /**
   * init Grid Active DataSource
   * */
  initGridActiveDataSource() {
    this.preparePredicateOfActiveList();
    this.subscriptions.push(this.activeAssignmentService.processDataServerSide(this.predicateOfActiveList)
      .subscribe(data => {
        if (data && data.data && data.data.length > NumberConstant.ZERO) {
          this.isEmptyActif = false;
          this.dataActives = data.data;
          this.dataActives.forEach((x) => {
            x.AcquisationDate ? x.AcquisationDate = new Date(x.AcquisationDate) : x.AcquisationDate = null;
            x.AbandonmentDate ? x.AbandonmentDate = new Date(x.AbandonmentDate) : x.AbandonmentDate = null;
          });
        } else {
          this.isEmptyActif = true;
        }
      }
      ));
  }
  /**
   * prepare Predicate Of Teams List
   */
  generateTeams() {
    this.teams = new Array<any>();
    this.predicateEmployeeTeam = new PredicateFormat();
    this.predicateEmployeeTeam.Filter = new Array<Filter>();
    this.predicateEmployeeTeam.Filter.push(new Filter(EmployeeConstant.ID_EMPLOYEE, Operation.eq, this.employeeToUpdate.Id));
    this.subscriptions.push(this.employeeTeamService.readPredicateData(this.predicateEmployeeTeam).subscribe(data => {
      const res = data.filter(x => x.IdEmployee === this.id);
      res.forEach(employeeTeam => {
        this.predicateTeam = new PredicateFormat();
        this.predicateTeam.Filter = new Array<Filter>();
        this.predicateTeam.Filter.push(new Filter(EmployeeConstant.ID, Operation.eq, employeeTeam.IdTeam));
        this.teamService.getModelByConditionWithHistory(this.predicateTeam).subscribe(result => {
          this.employeeService.getEmployeeById(result.IdManager).subscribe(e => {
            result.IdManagerNavigation = e;
            this.teams.push({
              Name: result.Name,
              IdManagerNavigation: result.IdManagerNavigation,
              CreationDate: result.CreationDate,
              EmployeeTeam:
              {
                AssignmentDate: employeeTeam.AssignmentDate,
                UnassignmentDate: employeeTeam.UnassignmentDate,
                AssignmentPercentage: employeeTeam.AssignmentPercentage
              },
              IdEmployee: employeeTeam.IdEmployee
            });
          });
        });
      });
    }));
  }
  /**
   * prepare Predicate Of Active List
   */
  private preparePredicateOfActiveList(): void {
    this.predicateOfActiveList = new PredicateFormat();
    this.predicateOfActiveList.Filter = new Array<Filter>();
    this.predicateOfActiveList.Filter.push(new Filter(EmployeeConstant.ID_EMPLOYEE, Operation.eq, this.id));
    this.predicateOfActiveList.Relation = new Array<Relation>();
    this.predicateOfActiveList.Relation.push.apply(this.predicateOfActiveList.Relation,
      [new Relation(EmployeeConstant.ID_ACTIVE_NAVIGATION)]);
  }

  /**
   * On init page
   * */
  ngOnInit() {
    /** Employee */
    this.hasAddEmployeePermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.ADD_EMPLOYEE);
    this.hasUpdateEmployeePermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.UPDATE_EMPLOYEE);
    this.hasResignationEmployeePermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.RESIGNATION_EMPLOYEE);
    /** Contract */
    this.hasAddContract = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.ADD_CONTRACT);
    this.hasUpdateContract = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.UPDATE_CONTRACT);
    this.hasListContractPermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.LIST_CONTRACT);
    this.hasDeleteContractPermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.DELETE_CONTRACT);
    this.hasShowContractPermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.SHOW_CONTRACT);
    this.hasCancelResignationEmployeePermission =
      this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.CANCEL_RESIGNATION_EMPLOYEE);
    this.hasPayslipPreviewEmployeePermission =
      this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.PAYSLIP_PREVIEW_EMPLOYEE);
    this.hasSendEmployeeSharedDocumentsPasswordPermission =
      this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.SEND_EMPLOYEE_SHARED_DOCUMENTS_PASSWORD);
    this.isUserWithReadContractManaging = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.LIST_CONTRACT);
    this.isUserWithUpdateContractManaging = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.UPDATE_CONTRACT);
    this.isUserWithReadBaseSalary = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.LIST_BASESALARY);
    this.isUserWithReadBonusManaging = this.authService.hasAuthority(PermissionConstant.SettingsRHAndPaiePermissions.LIST_BONUS);
    /** Remarks */
    this.hasShowRemarkPermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.SHOW_NOTE);
    this.hasListEmployeePermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.LIST_EMPLOYEE);
    this.loadSocialSecurityNumberMask();
    this.employeeToUpdate = new Employee();
    this.isUpdateMode = this.id > NumberConstant.ZERO;
    this.createAddForm();
    if (this.isUpdateMode) {
      this.hasPayPrivilege = true;
      this.getConnectedUserPrivileges();
      this.employeeService.getConnectedEmployee().subscribe(connectedEmployee => {
        this.connectedEmployee = connectedEmployee.Id;
        this.checkIsCurrentUserInSuperHierarchicalEmployeeList(this.connectedEmployee, this.id);
      });
      this.getDataToUpdate();
      this.initGridActiveDataSource();
      this.generateTeams();
    } else {
      this.generateDefaultEmployeeDocument();
    }
  }

  disableFromGroup() {
    this.employeeFormGroup.disable();
    this.IdentityPapersFormGroup.disable();
    this.PayFormGroup.disable();
    this.ContactFormGroup.disable();
    this.GraduationFormGroup.disable();
  }
  // Get connected user privileges
  getConnectedUserPrivileges() {
    this.subscriptions.push(this.employeeService.getConnectedEmployeePrivileges(this.id).subscribe(result => {
      if (result) {
        this.hasPayPrivilege = result.HasPayPrivilege;
        this.hasContractPrivilege = result.HasContractPrivilege;
      }
    }));
  }


  /**
   * Load the social security number mask
   */
  loadSocialSecurityNumberMask() {
    this.socialSecurityNumberMask = EmployeeConstant.SOCIAL_SECURITY_NUMBER_MASK;
  }


  checkIsCurrentUserInSuperHierarchicalEmployeeList(connectedEmployeeId: number, selectedEmployeeId: number) {
    this.subscriptions.push(this.employeeService.IsInConnectedUserHierarchy(connectedEmployeeId, selectedEmployeeId).subscribe(result => {
      this.isUserInSuperHierarchicalEmployeeList = result;
    }));
  }

  /**
   * Sent the country selected to the city
   * @param $event
   */
  receiveCountryStatus($event) {
    this.Country = new Country();
    this.Country.Id = $event;
    this.childListCity.setCity(this.Country);
  }

  cloneNewContractTemplate(data?) {
    const componentRef = this.viewContainer.createEmbeddedView(this.template, { option: { data: {}, viewReference: {}, hidden: true } });
    // set the input of the new component by passing data in options
    componentRef.context.option.viewReference = componentRef;
    if (data) {
      componentRef.context.option.data = data;
    }
  }
  removeContractFromContainer(viewIndex) {
    if (this.hasDeleteContractPermission) {
      this.swalWarrings.CreateSwal(EmployeeConstant.ARE_YOU_SURE_TO_DELETE_CONTRACT, SharedConstant.WARNING_TITLE,
        SharedConstant.CONTINUE, SharedConstant.CANCEL).then((result) => {
          if (result.value) {
            // remove the view
            if (viewIndex) {
              // find the index of the view from a reference
              const position = this.viewContainer.indexOf(viewIndex);
              // remove the view from container
              this.viewContainer.remove(position);
            }
          }
        });
    }
  }
  /**
   * Get the data source selected to be updated
   * */
  private getDataToUpdate() {
    this.subscriptions.push(this.employeeService.getById(this.id).subscribe((data: Employee) => {
      this.employeeToUpdate = data;
      if ((!this.hasUpdateEmployeePermission && this.isUpdateMode) || this.employeeToUpdate.Status === this.employeeStateEnumerator.Resigned) {
        this.isDisabled = true;
        this.disableFromGroup();
      }
      if (this.employeeToUpdate.Contract) {
        this.employeeToUpdate.Contract.forEach(
          contract => {
            this.cloneNewContractTemplate(contract);
            this.validateAllFormGroup();
          }
        );
      }
      if (this.employeeToUpdate.Picture) {
        this.employeeService.getPicture(this.employeeToUpdate.Picture).subscribe((picture: any) => {
          this.pictureFileInfo = new FileInfo();
          this.pictureFileInfo.Name =  this.employeeToUpdate.FirstName + ' ' +  this.employeeToUpdate.LastName;
          this.pictureFileInfo.Extension = 'image/png';
          this.pictureEmployesSrc = 'data:image/png;base64,' + picture;
          this.compressFile(this.pictureEmployesSrc);
        });
      }
      if (this.employeeToUpdate.CinFileInfo) {
        this.cinFileToUpload = this.employeeToUpdate.CinFileInfo;
      }
      if (this.employeeToUpdate.IdPaymentType === NumberConstant.SIX) {
        this.disableRibBank = false;
        this.Rib.setValidators([Validators.required, Validators.maxLength(NumberConstant.FIFTY), isNumericWithHighDashs()]);
        this.IdBank.setValidators([Validators.required]);
      }
      this.setQualificationsOfDataToUpdate(this.employeeToUpdate);
      this.setEmployeeDocumentList();
      this.employeeToUpdate.BirthDate = this.employeeToUpdate.BirthDate ?
        new Date(data.BirthDate) : this.employeeToUpdate.BirthDate;
      this.employeeToUpdate.HiringDate = this.employeeToUpdate.HiringDate ?
        new Date(data.HiringDate) : this.employeeToUpdate.HiringDate;
      this.employeeToUpdate.ResignationDate = this.employeeToUpdate.ResignationDate ?
        new Date(data.ResignationDate) : this.employeeToUpdate.ResignationDate;
      this.employeeToUpdate.ResignationDepositDate = this.employeeToUpdate.ResignationDepositDate ?
        new Date(data.ResignationDepositDate) : this.employeeToUpdate.ResignationDepositDate;
      this.employeeToUpdate.Qualification = [];
      this.employeeToUpdate.EmployeeDocument = [];
      this.employeeFormGroup.patchValue(this.employeeToUpdate);
      this.receiveCountryStatus(data.IdCountry);
      this.IdentityPapersFormGroup.patchValue(this.employeeToUpdate);
      this.ContractFormGroup.patchValue(this.employeeToUpdate);
      this.ContractFormGroup.controls[EmployeeConstant.JOB_EMPLOYEE].patchValue(this.buildJobs(this.employeeToUpdate.JobEmployee));
      this.GraduationFormGroup.patchValue(this.employeeToUpdate);
      this.PayFormGroup.patchValue(this.employeeToUpdate);
      this.ContactFormGroup.patchValue(this.employeeToUpdate);
      this.markAsUntouchedAllFromGroup();
    }));
  }

  markAsUntouchedAllFromGroup() {
    this.employeeFormGroup.markAsUntouched();
    this.IdentityPapersFormGroup.markAsUntouched();
    this.PayFormGroup.markAsUntouched();
    this.ContactFormGroup.markAsUntouched();
    this.GraduationFormGroup.markAsUntouched();
  }

  buildJobs(jobEmployee: JobEmployee[]): number[] {
    const result = new Array<number>();
    if (jobEmployee) {
      jobEmployee.forEach(x => {
        result.push(x.IdJob);
      });
    }
    return result;
  }

  /**
   * generate Qualification FormGroup from Contract object
   * @param currentContract
   */
  public generateQualificationFormGroupFromQualification(currentQualification: Qualification): FormGroup {
    let currentQualificationFormGroup: FormGroup;
    currentQualificationFormGroup = this.fb.group({
      Id: [currentQualification.Id],
      IdEmployee: [currentQualification.IdEmployee, [Validators.required]],
      University: [currentQualification.University, [Validators.required]],
      IdQualificationCountry: [currentQualification.IdQualificationCountry],
      IdQualificationType: [currentQualification.IdQualificationType],
      QualificationDescritpion: [currentQualification.QualificationDescritpion],
      GraduationYearDate: [currentQualification.GraduationYearDate
        ? new Date(currentQualification.GraduationYearDate)
        : '', [Validators.required]],
      IsDeleted: [false],
      QualificationFileInfo: [currentQualification.QualificationFileInfo
        ? currentQualification.QualificationFileInfo
        : new Array<FileInfo>()],
      QualificationAttached: [currentQualification.QualificationAttached
        ? currentQualification.QualificationAttached
        : '']

    });

    return currentQualificationFormGroup;
  }
  /**
   * Set the document list of employee
   * */
  setEmployeeDocumentList(): any {
    let employeeDocuments: EmployeeDocument[];
    employeeDocuments = [];
    employeeDocuments = this.employeeToUpdate.EmployeeDocument;
    if (employeeDocuments && employeeDocuments.length > NumberConstant.ZERO) {
      employeeDocuments.forEach((x) => {
        this.addEmployeeDocument(this.generateEmployeeDocumentFormGroupFromEmployeeDocument(x));
      }
      );
    } else {
      this.generateDefaultEmployeeDocument();
    }
  }
  generateDefaultEmployeeDocument(): any {
    // Default Passport block
    this.generatePermanentEmployeeDocument(EmployeeDocumentType.Passport,
      EmployeeConstant.PASSPORT_NUMBER);

    // Default WorkAuthorization block
    this.generatePermanentEmployeeDocument(EmployeeDocumentType.WorkAuthorization,
      EmployeeConstant.WORK_AUTHORIZATION_NUMBER);

    // Default Visa block
    this.generatePermanentEmployeeDocument(EmployeeDocumentType.Visa,
      EmployeeConstant.VISA_NUMBER);

    // Default ResidencePermit block
    this.generatePermanentEmployeeDocument(EmployeeDocumentType.ResidencePermit,
      EmployeeConstant.RESIDENCE_PERMIT_NUMBER);
  }
  /**
   * generate a Permanent EmployeeDocument using type and label
   * @param type
   * @param label
   */
  generatePermanentEmployeeDocument(type: number, label: string): void {
    const currentEmployeeDocument = new EmployeeDocument();
    currentEmployeeDocument.IdEmployee = this.id;
    currentEmployeeDocument.Type = type;
    currentEmployeeDocument.Label = label;
    currentEmployeeDocument.IsPermanent = true;
    this.addEmployeeDocument(this.generateEmployeeDocumentFormGroupFromEmployeeDocument(currentEmployeeDocument));
  }
  /**
   * generate EmployeeDocument FormGroup From EmployeeDocument
   * @param currentEmployeeDocument
   */
  generateEmployeeDocumentFormGroupFromEmployeeDocument(currentEmployeeDocument: EmployeeDocument): FormGroup {
    let currentEmployeeDocumentFormGroup: FormGroup;
    currentEmployeeDocumentFormGroup = this.fb.group({
      Id: [currentEmployeeDocument.Id ? currentEmployeeDocument.Id : NumberConstant.ZERO],
      IdEmployee: [currentEmployeeDocument.IdEmployee ? currentEmployeeDocument.IdEmployee : NumberConstant.ZERO, [Validators.required]],
      ExpirationDate: [currentEmployeeDocument.ExpirationDate ? new Date(currentEmployeeDocument.ExpirationDate) : ''],
      Label: [currentEmployeeDocument.Label ? currentEmployeeDocument.Label : '', [Validators.required]],
      Type: [currentEmployeeDocument.Type, [Validators.required]],
      Value: [currentEmployeeDocument.Value, [Validators.minLength(NumberConstant.FOUR), Validators.maxLength(NumberConstant.SIXTEEN)]],
      AttachedFileInfo: [currentEmployeeDocument.AttachedFileInfo ? currentEmployeeDocument.AttachedFileInfo : ''],
      AttachedFile: [currentEmployeeDocument.AttachedFile ? currentEmployeeDocument.AttachedFile : null],
      IsDeleted: [currentEmployeeDocument.IsDeleted ? currentEmployeeDocument.IsDeleted : false],
      IsPermanent: [currentEmployeeDocument.IsPermanent ? currentEmployeeDocument.IsPermanent : false]
    });
    return currentEmployeeDocumentFormGroup;
  }
  /**
   *
   * @param newEmployeeDocumentFormGroup
   */
  addEmployeeDocument(newEmployeeDocumentFormGroup: FormGroup): any {
    this.EmployeeDocument.push(newEmployeeDocumentFormGroup);
  }

  /**
   * Set the employee to update qualifications
   * */
  public setQualificationsOfDataToUpdate(currentEmployee: Employee) {
    if (currentEmployee.Qualification) {
      for (const currentQualification of currentEmployee.Qualification) {
        this.addQualification(this.generateQualificationFormGroupFromQualification(currentQualification));
      }
    }
  }

  /**
   * Create the employee form
   * */
  private createAddForm() {
    this.IdentityPapersFormGroup = this.fb.group({
      Cin: ['', isEqualLength(NumberConstant.EIGHT), unique(EmployeeConstant.CIN, this.employeeService, String(this.id))],
      CinAttached: [''],
      EmployeeDocument: this.fb.array([])
    });
    this.ContractFormGroup = this.fb.group({
      Id: [NumberConstant.ZERO],
      JobEmployee: [''],
      IdOffice: ['']
    });
    this.GraduationFormGroup = this.fb.group({
      IdGrade: [''],
      Qualification: this.fb.array([])
    });
    this.PayFormGroup = this.fb.group({
      IdPaymentType: [''],
      Rib: ['', [Validators.maxLength(NumberConstant.FIFTY), isNumericWithHighDashs()]],
      SocialSecurityNumber: [''],
      Echelon: ['', Validators.compose([Validators.min(NumberConstant.ONE), Validators.max(NumberConstant.NINE_HUNDRED_NINTTY_NINE),
      Validators.pattern('^[0-9]*')])],
      Category: ['', [Validators.maxLength(NumberConstant.FIFTY)]],
      ChildrenNumber: ['', Validators.compose([Validators.min(NumberConstant.ZERO),
      Validators.max(NumberConstant.FIFTY_NINE), Validators.pattern('^[0-9]*')])],
      ChildrenNoScholar: ['', Validators.compose([Validators.min(NumberConstant.ZERO),
      Validators.max(NumberConstant.FIFTY_NINE), Validators.pattern('^[0-9]*')])],
      ChildrenDisabled: ['', Validators.compose([Validators.min(NumberConstant.ZERO),
      Validators.max(NumberConstant.FIFTY_NINE), Validators.pattern('^[0-9]*')])],
      DependentParent: ['', Validators.compose([Validators.min(NumberConstant.ZERO),
      Validators.max(NumberConstant.TWO), Validators.pattern('^[0-9]*')])],
      HomeLoan: ['', [Validators.min(NumberConstant.ZERO)]],
      FamilyLeader: [false],
      IsForeign: [false],
      IdBank: ['']
    });
    this.ContactFormGroup = this.fb.group({
      PersonalPhone: [''],
      ProfessionalPhone: [''],
      Facebook: ['', [Validators.maxLength(NumberConstant.TWO_HUNDRED_FIFTY_FIVE),
      Validators.pattern('^https:\\/\\/www\\.facebook\\.com\\/[a-zA-Z0-9_.+-/@]+$')]],
      Linkedin: ['', [Validators.maxLength(NumberConstant.TWO_HUNDRED_FIFTY_FIVE),
      Validators.pattern('^https:\\/\\/www\\.linkedin\\.com\\/[a-zA-Z0-9_.+-/@]+$')]]
    });
    this.employeeFormGroup = this.fb.group({
      Id: [NumberConstant.ZERO],
      FirstName: ['', [Validators.required, Validators.maxLength(NumberConstant.ONE_HUNDRED)]],
      LastName: ['', [Validators.required, Validators.maxLength(NumberConstant.ONE_HUNDRED)]],
      Sex: ['', [Validators.required]],
      IdCitizenship: ['', [Validators.required]],
      BirthDate: [undefined],
      BirthPlace: ['', [Validators.maxLength(NumberConstant.FIFTY)]],
      Email: [undefined, [Validators.required, Validators.maxLength(NumberConstant.FIFTY),
      Validators.email],
        unique(SharedConstant.EMAIL, this.employeeService, String(this.id))],
      MaritalStatus: [''],
      IdUpperHierarchy: [''],
      IdTeam: [''],
      Notes: [''],
      IdCountry: [''],
      IdCity: [''],
      ZipCode: ['', [Validators.min(NumberConstant.ZERO), Validators.max(NumberConstant.ONE_MILLION)]],
      AddressLine1: ['', [Validators.maxLength(NumberConstant.TWO_HUNDRED_FIFTY_FIVE)]],
      AddressLine2: ['', [Validators.maxLength(NumberConstant.TWO_HUNDRED_FIFTY_FIVE)]],
      AddressLine3: ['', [Validators.maxLength(NumberConstant.TWO_HUNDRED_FIFTY_FIVE)]],
      AddressLine4: ['', [Validators.maxLength(NumberConstant.TWO_HUNDRED_FIFTY_FIVE)]],
      AddressLine5: ['', [Validators.maxLength(NumberConstant.TWO_HUNDRED_FIFTY_FIVE)]],
      PersonalEmail: ['', [customEmailValidator()]]
    });
    if (this.isUpdateMode) {
      // If update mode, user can set matricule value, the back don't generate matricule value
      this.employeeFormGroup.addControl(EmployeeConstant.REGISTRATION_NUMBER,
        this.fb.control('', [Validators.required, Validators.maxLength(NumberConstant.TEN)],
          unique(EmployeeConstant.REGISTRATION_NUMBER, this.employeeService, String(this.id))));
    } else {
      // But if new employee, the matricule is not required, the back generate value for this field
      this.employeeFormGroup.addControl(EmployeeConstant.REGISTRATION_NUMBER, this.fb.control(''));
    }
  }
  /**
   * update BirthDate Validity
   * @param x
   */
  public updateBirthDateValidity(x: any) {
    this.BirthDate.updateValueAndValidity();
  }
  /**
   *  Birth Date getter
   */
  get BirthDate(): FormControl {
    return this.employeeFormGroup.get(EmployeeConstant.BIRTH_DATE) as FormControl;
  }
  /**
   * Add new Qualification to the employee form
   * @param newQualificationFormGroup
   */
  addQualification(newQualificationFormGroup: FormGroup): void {
    newQualificationFormGroup.addControl(EmployeeConstant.HIDE, new FormControl(true));
    this.Qualification.insert(NumberConstant.ZERO, newQualificationFormGroup);

  }
  /**
   * Delete Qualification
   * @param i
   */
  deleteQualification(i: number): void {
    this.swalWarrings.CreateSwal(EmployeeConstant.WONT_BE_ABLE_TO_REVERT).then((result) => {
      if (result.value) {
        if ((this.Qualification.at(i) as FormGroup).controls[EmployeeConstant.ATTRIBUT_ID].value === NumberConstant.ZERO) {
          this.Qualification.removeAt(i);
        } else {
          const qualification: Qualification = Object.assign({}, null, this.Qualification.at(i).value);
          this.subscriptions.push(this.qualificationService.remove(qualification).subscribe(() => {
            this.Qualification.removeAt(i);
          }));
        }
      }
    });
  }

  /**
   *Add new contract popup
   * */
  addNewContract() {
    if (this.employeeToUpdate.Status !== this.employeeStateEnumerator.Resigned) {
      let dataToSend: Date;
      const array = [];
      if (this.listContracts.length > NumberConstant.ZERO) {
        this.listContracts.forEach(contractComponent => {
          array.push(new Date(contractComponent.StartDate.value));
          if (contractComponent.EndDate.value) {
            array.push(new Date(contractComponent.EndDate.value));
          }
        });
        dataToSend = new Date(Math.max.apply(null, array));
        dataToSend = new Date(dataToSend.setDate(dataToSend.getDate() + NumberConstant.ONE));
      }
      this.formModalDialogService.openDialog(EmployeeConstant.ADD_CONTRACT,
        AddContractComponent, this.viewRef, this.onCloseContractModal.bind(this),
        dataToSend, true, SharedConstant.MODAL_DIALOG_SIZE_L);
    }
  }


  /**
   * on close contract modal
   * @param data
   */
  private onCloseContractModal(data: any): void {
    if ((data as Contract) && data.CheckContractToAdd) {
      data.IdEmployee = this.id;
      this.cloneNewContractTemplate(data);
    }
  }
  /**
   * on close qualification modal
   * @param data
   */
  private onCloseQualificationModal(data: any): void {
    if (data !== undefined) {
      this.addQualification(data as FormGroup);
    }
  }

  /**
   *Add new qualification popup
   * */
  addNewQualification() {
    this.formModalDialogService.openDialog(EmployeeConstant.ADD_QUALIFICATION,
      AddQualificationComponent, this.viewRef, this.onCloseQualificationModal.bind(this), null, true, SharedConstant.MODAL_DIALOG_SIZE_M);
  }

  /**
   *Add new employee document modal
   * */
  addNewEmployeeDocument() {
    this.formModalDialogService.openDialog(EmployeeConstant.ADD_DOCUMENT,
      AddEmployeeDocumentComponent, this.viewRef, this.onCloseEmployeeDocumentModal.bind(this), null, true);
  }


  /**
   * on close employee document modal
   * @param data
   */
  private onCloseEmployeeDocumentModal(data: any): void {
    if (data !== undefined) {
      this.addEmployeeDocument(data as FormGroup);
    }
  }

  /**
   *initilise employee data source
   * */
  initDataSource(): void {
    this.subscriptions.push(this.employeeService.readPredicateData(this.predicate).subscribe(data => {
      this.employeeListSource = data;
      this.employeeListData = this.employeeListSource.slice(NumberConstant.ZERO);
    }));
  }

  /**
   * generate ContractBonuses from the FormControl
   * */
  generateContractBonusesFromContractFormGroup(contractFG: FormGroup): ContractBonus[] {
    const contractBonuses = new Array<ContractBonus>();
    let contractBonusesBonusId: number[];
    const contractBonusFC = contractFG.get(EmployeeConstant.CONTRACT_BONUS) as FormControl;
    contractBonusesBonusId = contractBonusFC.value as number[];

    if (contractBonusesBonusId) {
      contractBonusesBonusId.forEach((x) => {
        contractBonuses.push(new ContractBonus(x, contractFG.get(EmployeeConstant.ATTRIBUT_ID).value));
      });
    }
    return contractBonuses;
  }

  /**
   * removing currentEmployeeDocument from currentEmployeeDocumentList if it
   * is deleted and not yet saved employeeDocument
   * @param currentEmployeeDocumentList
   * @param currentEmployeeDocument
   */
  employeeDocumentListButThisIfThisIsDeletedAndNotSavedEmployeeDocument(currentEmployeeDocumentList: EmployeeDocument[],
    currentEmployeeDocument: EmployeeDocument): EmployeeDocument[] {
    if (currentEmployeeDocument.IsDeleted && currentEmployeeDocument.Id === NumberConstant.ZERO) {
      currentEmployeeDocumentList = currentEmployeeDocumentList.filter(x => x !== currentEmployeeDocument);
    }
    return currentEmployeeDocumentList;
  }

  /**
   * Upload Picture Related To Employes
   * @param event
   */
  public uploadPictureFile(event) {
    const file = event.target.files[NumberConstant.ZERO];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e: any) => {
        this.pictureFileInfo = new FileInfo();
        this.pictureFileInfo.Name = file.name;
        this.pictureFileInfo.Extension = file.type;
        this.pictureEmployesSrc = reader.result;
        this.compressFile(reader.result);
      };
    }
  }

  compressFile(image) {
    this.imageCompress.compressFile(image, -1, 50, 50).then(
      result => {
        this.pictureFileInfo.FileData = (result).split(',')[1];
      });
  }

  /**
   *Save employee
   * */
  save(preview?: boolean) {
    let contractValidity = true;
    const contracts = new Array<Contract>();
    this.listContracts.forEach(contractComponent => {
      if (contractComponent.contractFormGroupValidity()) {
        contracts.push(contractComponent.buildContractFromContractFormGroup());
      } else {
        contractValidity = false;
        contractComponent.ValidateFormGroup();
      }
    });
    if (contractValidity && (this.employeeFormGroup.valid || this.employeeFormGroup.disabled)
      && this.employeeToUpdate.Status !== this.employeeStateEnumerator.Resigned
      && (this.IdentityPapersFormGroup.valid || this.IdentityPapersFormGroup.disabled)
      && (this.ContractFormGroup.valid || this.ContractFormGroup.disabled)
      && (this.GraduationFormGroup.valid || this.GraduationFormGroup.disabled)
      && (this.PayFormGroup.valid || this.PayFormGroup.disabled)
      && (this.ContactFormGroup.valid || this.ContactFormGroup.disabled)) {
      this.isSaveOperation = true;
      let obj: Employee = Object.assign({}, this.employeeToUpdate, this.employeeFormGroup.getRawValue());
      obj = Object.assign(obj, this.IdentityPapersFormGroup.getRawValue());
      obj = Object.assign(obj, this.ContractFormGroup.getRawValue());
      obj = Object.assign(obj, this.GraduationFormGroup.getRawValue());
      obj = Object.assign(obj, this.PayFormGroup.getRawValue());
      obj = Object.assign(obj, this.ContactFormGroup.getRawValue());
      obj.Contract = [];
      obj.Contract = contracts;
      if (this.jobMultiselect) {
        obj.JobEmployee = this.jobMultiselect.selectedJobEmployee;
      } else {
        const jobEmployee: JobEmployee[] = [];
        if (this.employeeToUpdate.JobEmployee) {
          this.employeeToUpdate.JobEmployee.forEach((elt) => {
            jobEmployee.push(new JobEmployee(elt.IdJob, obj.Id));
          });
          obj.JobEmployee = jobEmployee;
        }
      }
      if (this.isUserInSuperHierarchicalEmployeeList && !obj.Note) {
        obj.Note = [];
      }
      // search if there are deleted and not created employee document
      for (const currentEmployeeDocument of obj.EmployeeDocument) {
        // removing the deleted and not yet saved employee document
        obj.EmployeeDocument = this.employeeDocumentListButThisIfThisIsDeletedAndNotSavedEmployeeDocument(obj.EmployeeDocument,
          currentEmployeeDocument);
      }
      // save file
      obj.PictureFileInfo = this.pictureFileInfo;
      obj.CinFileInfo = this.cinFileToUpload;
      // Check to empty the rib field if the payment type field is not transferred
      if (this.disableRibBank === true &&
        obj.Rib !== '' && obj.IdBank !== null) {
        obj.Rib = null;
        obj.IdBank = null;
      }
      const contractWithBonusOrBenefitWithNoEndDate = obj.Contract.filter(x => x.EndDate &&
        (x.ContractBonus && x.ContractBonus.find(y => !y.ValidityEndDate)
          || x.ContractBenefitInKind && x.ContractBenefitInKind.find(y => !y.ValidityEndDate)));
      if (contractWithBonusOrBenefitWithNoEndDate && contractWithBonusOrBenefitWithNoEndDate.length > NumberConstant.ZERO) {
        this.swalWarrings.CreateSwal(ContractConstant.BONUS_OR_BENEFITS_IN_KIND_WITH_NO_END_DATE, SharedConstant.WARNING_TITLE,
          EmployeeConstant.YES, EmployeeConstant.NO).then((result) => {
            if (result.value) {
              this.saveEmployee(obj, preview);
            }
          });
      } else {
        this.saveEmployee(obj, preview);
      }
    } else {
      this.validateAllFormGroup();
    }
  }

  saveEmployee(employee: Employee, preview?: boolean) {
    this.preview = preview;
    if (preview) {
      this.checkEmployeeDataChangesForPreview(employee);
    } else {
      this.employeeToUpdate = employee;
      if (this.isUpdateMode && (this.hasShowContractPermission || this.hasUpdateContract)) {
        this.subscriptions.push(
          this.contractService.checkBeforeUpdateIfContractsHaveAnyPayslipOrTimesheet(this.employeeToUpdate.Contract, false)
            .subscribe(res => {
              if (res.model.Payslip.length > NumberConstant.ZERO || res.model.TimeSheet.length > NumberConstant.ZERO) {
                this.formModalDialogService.openDialog(ContractConstant.WRONG_ENTITIES, WrongPayslipListComponent,
                  this.viewRef, this.actionToDo.bind(this), res.model, true, SharedConstant.MODAL_DIALOG_SIZE_M);
              } else {
                this.actionToSave(this.employeeToUpdate);
              }
            }));
      } else {
        this.actionToSave(this.employeeToUpdate);
      }
    }
  }
  actionToDo(action) {
    switch (action) {
      case this.actionEnum.MarkPayslipToWrong:
        this.employeeToUpdate.Contract.forEach(contract => {
          contract.UpdatePayslipAndTimeSheets = true;
        });
        this.actionToSave(this.employeeToUpdate);
        break;
      case this.actionEnum.DoNotMarkPayslipToWrong:
        this.actionToSave(this.employeeToUpdate);
        break;
      case this.actionEnum.Cancel:
        break;
    }
  }
  private actionToSave(objectToSave: Employee) {
    objectToSave.FirstName = objectToSave.FirstName.trim();
    objectToSave.LastName = objectToSave.LastName.trim();
    if ((this.hasUpdateEmployeePermission || this.hasAddEmployeePermission)) {
      this.employeeService.save(objectToSave, !this.isUpdateMode, null, false).subscribe(data => {
        this.refresh(data);
        if (this.preview) {
          this.payslipPreview();
        } else if (this.hasListEmployeePermission && !this.isModal) {
          this.router.navigate([EmployeeConstant.EMPLOYEE_LIST_URL]);
        } else {
          this.dialogOptions.onClose();
          this.modalService.closeAnyExistingModalDialog();
        }
      });
    }
  }

  refresh(employee) {
    this.id = employee.Id;
    this.isUpdateMode = true;
    if (this.viewContainer) {
      this.viewContainer.clear();
    }
    this.ngOnInit();
  }
  /**
   * Check if employee data has changes
   * if data change alert user for the save of employee before preview payslip
   * if not make the preview directly
   * @param employee
   */
  checkEmployeeDataChangesForPreview(employee: Employee) {
    this.employeeToUpdate = employee;
    let isDirty = true;
    if (this.listContracts.length > NumberConstant.ZERO) {
      this.listContracts.forEach(contractComponent => {
        isDirty = isDirty && (contractComponent.contractFormGroup.dirty ||
          contractComponent.salaryFormGroup.dirty || contractComponent.bonusFormGroup.dirty
          || contractComponent.benefitInKindFormGroup.dirty || contractComponent.otherAdvantagesFormGroup.dirty);
      });
    } else {
      isDirty = false;
    }
    if (this.employeeFormGroup.dirty || (isDirty && !this.employeeFormGroup.dirty)) {
      this.swalWarrings.CreateSwal(EmployeeConstant.EMPLOYEE_PREVIEW_ALERT,
        SharedConstant.ARE_YOU_SURE_TO_CONTINUE, EmployeeConstant.YES, EmployeeConstant.NO).then((result) => {
          if (result.value) {
            if (this.isUpdateMode && (this.hasShowContractPermission || this.hasUpdateContract)) {
              this.subscriptions.push(
                this.contractService.checkBeforeUpdateIfContractsHaveAnyPayslipOrTimesheet(employee.Contract, false)
                  .subscribe(res => {
                    if (res.model.Payslip.length > NumberConstant.ZERO || res.model.TimeSheet.length > NumberConstant.ZERO) {
                      this.formModalDialogService.openDialog(ContractConstant.WRONG_ENTITIES, WrongPayslipListComponent,
                        this.viewRef, this.actionToDo.bind(this), res.model, true, SharedConstant.MODAL_DIALOG_SIZE_M);
                    } else {
                      this.actionToSave(this.employeeToUpdate);
                    }
                  }));
            } else {
              this.subscriptions.push(this.employeeService.save(employee, !this.isUpdateMode).subscribe(data => {
                this.refresh(data);
                this.payslipPreview();
              }));
            }
          }
        });
    } else {
      this.payslipPreview();
    }
  }

  /**
   * Call payslip preview service for make a preview of employee payslip for the current month
   */
  payslipPreview(): void {
    const predicate = new PredicateFormat();
    predicate.Filter = new Array<Filter>();
    predicate.Filter.push(new Filter(EmployeeConstant.ID_EMPLOYEE, Operation.eq, this.employeeToUpdate.Id));
    predicate.Relation = new Array<Relation>();
    predicate.Relation.push.apply(predicate.Relation, [new Relation(ContractConstant.ID_CONTRACT_TYPE_NAVIGATION)]);
    this.subscriptions.push(this.contractService.readPredicateData(predicate).subscribe(contracts => {
      if (contracts.length > NumberConstant.ZERO) {
        contracts.forEach(contract => {
          contract.ContractReference = contract.IdContractTypeNavigation.Code + SharedConstant.BLANK_SPACE +
            SharedConstant.OPEN_PARENTHESIS +
            this.datePipe.transform(new Date(contract.StartDate), this.dateFormat)
            + SharedConstant.DASH + (contract.EndDate ? this.datePipe.transform(new Date(contract.EndDate),
              this.dateFormat) : SharedConstant.EMPTY) + SharedConstant.CLOSE_PARENTHESIS;
        });
        const payslip = new Payslip();
        payslip.IdEmployee = this.id;
        this.payslipService.getPayslipPreviewInformation(payslip).subscribe(data => {
          const previewData = data;
          previewData.payslipReportLines = data.PayslipReportLinesViewModels;
          previewData.maxDays = data.NumberOfDaysWorkedByCompanyInMonth;
          this.formModalDialogService.openDialog(EmployeeConstant.PAYSLIP_PREVIEW, PayslipPreviewComponent, this.viewRef,
            null, { 'payslip': previewData, 'contracts': contracts }, true, SharedConstant.MODAL_DIALOG_SIZE_M);
        });
      } else {
        this.swalWarrings.CreateSwal(EmployeeConstant.NO_EMPLOYEE_CONTRACT,
          EmployeeConstant.NO_CONTRACT, SharedConstant.OKAY, null, true);
      }
    }));
  }

  /**
   * If the payement type is Virement (Transfer), enable Rib field in employee
   * Receive the value send by Payement type dropdown component
   * @param $event
   */
  receivedMessage($event) {
    if ($event === NumberConstant.SIX) {
      this.disableRibBank = false;
      this.Rib.setValidators([Validators.required, Validators.maxLength(NumberConstant.FIFTY), isNumericWithHighDashs()]);
      this.IdBank.setValidators([Validators.required]);
    } else {
      this.Rib.setValidators([Validators.maxLength(NumberConstant.FIFTY), isNumericWithHighDashs()]);
      this.PayFormGroup.controls[EmployeeConstant.RIB].setValue('');
      this.PayFormGroup.controls[EmployeeConstant.ID_BANK].setValue('');
      this.IdBank.setValidators([Validators.nullValidator]);
      this.disableRibBank = true;
    }
    this.Rib.updateValueAndValidity();
    this.IdBank.updateValueAndValidity();
  }
  getLevel(Rate) {
    switch (Rate) {
      case 1: {
        return SkillsMatrixConstant.BEGINNER;
      }
      case 2: {
        return SkillsMatrixConstant.AMATEUR;
      }
      case 3: {
        return SkillsMatrixConstant.INTERMEDIATE;
      }
      case 4: {
        return SkillsMatrixConstant.GOOD;
      }
      case 5: {
        return SkillsMatrixConstant.EXCELLENT;
      }
      case 6: {
        return SkillsMatrixConstant.EXPERT;
      }
      default:
        break;
    }
  }
  generateAndSendSharedDocumentsPassword() {
    this.employeeService.GenerateAndSendSharedDocumentsPassword(this.employeeToUpdate.Id).subscribe();
  }

  validateAllFormGroup() {
    this.validationService.validateAllFormFields(this.employeeFormGroup);
    this.validationService.validateAllFormFields(this.IdentityPapersFormGroup);
    this.validationService.validateAllFormFields(this.ContractFormGroup);
    this.validationService.validateAllFormFields(this.GraduationFormGroup);
    this.validationService.validateAllFormFields(this.PayFormGroup);
    this.validationService.validateAllFormFields(this.ContactFormGroup);
  }
  get Matricule(): FormControl {
    return this.employeeFormGroup.get(EmployeeConstant.REGISTRATION_NUMBER) as FormControl;
  }

  get IdCountry(): FormControl {
    return this.employeeFormGroup.get(EmployeeConstant.ID_COUNTRY) as FormControl;
  }

  get IdCity(): FormControl {
    return this.employeeFormGroup.get(EmployeeConstant.ID_CITY) as FormControl;
  }

  get ZipCode(): FormControl {
    return this.employeeFormGroup.get(EmployeeConstant.ZIP_CODE) as FormControl;
  }

  get AddressLine1(): FormControl {
    return this.employeeFormGroup.get(EmployeeConstant.ADDRESSLINE1) as FormControl;
  }

  get AddressLine2(): FormControl {
    return this.employeeFormGroup.get(EmployeeConstant.ADDRESSLINE2) as FormControl;
  }

  get AddressLine3(): FormControl {
    return this.employeeFormGroup.get(EmployeeConstant.ADDRESSLINE3) as FormControl;
  }

  get AddressLine4(): FormControl {
    return this.employeeFormGroup.get(EmployeeConstant.ADDRESSLINE4) as FormControl;
  }

  get AddressLine5(): FormControl {
    return this.employeeFormGroup.get(EmployeeConstant.ADDRESSLINE5) as FormControl;
  }

  get PersonalEmail(): FormControl {
    return this.employeeFormGroup.get(EmployeeConstant.PERSONALEMAIL) as FormControl;
  }

  get Cin(): FormControl {
    return this.IdentityPapersFormGroup.get(EmployeeConstant.CIN) as FormControl;
  }

  get JobEmployee(): FormControl {
    return this.ContractFormGroup.get(EmployeeConstant.JOB_EMPLOYEE) as FormControl;
  }

  get IdGrade(): FormControl {
    return this.GraduationFormGroup.get(EmployeeConstant.ID_GRADE) as FormControl;
  }

  get IdPaymentType(): FormControl {
    return this.PayFormGroup.get(EmployeeConstant.ID_PAYMENT_TYPE) as FormControl;
  }

  get Rib(): FormControl {
    return this.PayFormGroup.get(EmployeeConstant.RIB) as FormControl;
  }

  get IdBank(): FormControl {
    return this.PayFormGroup.get(EmployeeConstant.ID_BANK) as FormControl;
  }
  get SocialSecurityNumber(): FormControl {
    return this.PayFormGroup.get(EmployeeConstant.SOCIAL_SECURITY_NUMBER) as FormControl;
  }

  get Echelon(): FormControl {
    return this.PayFormGroup.get(EmployeeConstant.ECHELON) as FormControl;
  }

  get Category(): FormControl {
    return this.PayFormGroup.get(EmployeeConstant.CATEGORY) as FormControl;
  }

  get ChildrenNumber(): FormControl {
    return this.PayFormGroup.get(EmployeeConstant.DEPENDENT_CHILDREN_NUMBER) as FormControl;
  }

  get ChildrenNoScholar(): FormControl {
    return this.PayFormGroup.get(EmployeeConstant.CHILDREN_NO_SCHOLAR) as FormControl;
  }

  get ChildrenDisabled(): FormControl {
    return this.PayFormGroup.get(EmployeeConstant.CHILDREN_DISABLED) as FormControl;
  }
  get DependentParent(): FormControl {
    return this.PayFormGroup.get(EmployeeConstant.DEPENDENT_PARENT_NUMBER) as FormControl;
  }
  get HomeLoan(): FormControl {
    return this.PayFormGroup.get(EmployeeConstant.HOME_LOAN) as FormControl;
  }
  get FamilyLeader(): FormControl {
    return this.PayFormGroup.get(EmployeeConstant.FAMILY_LEADER) as FormControl;
  }
  get IsForeign(): FormControl {
    return this.PayFormGroup.get(EmployeeConstant.IS_FOREIGN) as FormControl;
  }
  get MaritalStatus(): FormControl {
    return this.employeeFormGroup.get(EmployeeConstant.MARITAL_STATUS) as FormControl;
  }
  get PersonalPhone(): FormControl {
    return this.ContactFormGroup.get(EmployeeConstant.PERSONAL_PHONE) as FormControl;
  }

  get ProfessionalPhone(): FormControl {
    return this.ContactFormGroup.get(EmployeeConstant.PROFESSIONAL_PHONE) as FormControl;
  }

  get Facebook(): FormControl {
    return this.ContactFormGroup.get(EmployeeConstant.FACEBOOK) as FormControl;
  }

  get Linkedin(): FormControl {
    return this.ContactFormGroup.get(EmployeeConstant.LINKEDIN) as FormControl;
  }
  get State(): FormArray {
    return this.ContractFormGroup.get(ContractConstant.STATE) as FormArray;
  }
  /**
   * Employee's contract list
   */
  get EmployeeDocument(): FormArray {
    return this.IdentityPapersFormGroup.get(EmployeeConstant.EMPLOYEE_DOCUMENT) as FormArray;
  }
  /**
   * Employee's qualification list
   */
  get Qualification(): FormArray {
    return this.GraduationFormGroup.get(EmployeeConstant.QUALIFICATION) as FormArray;
  }

  get FirstName(): FormControl {
    return this.employeeFormGroup.get(EmployeeConstant.FIRST_NAME) as FormControl;
  }

  get LastName(): FormControl {
    return this.employeeFormGroup.get(EmployeeConstant.LAST_NAME) as FormControl;
  }

  get Email(): FormControl {
    return this.employeeFormGroup.get(EmployeeConstant.EMAIL) as FormControl;
  }

  get Sex(): FormControl {
    return this.employeeFormGroup.get(EmployeeConstant.GENDRE) as FormControl;
  }

  get IdCitizenship(): FormControl {
    return this.employeeFormGroup.get(EmployeeConstant.ID_CITIZEN_SHIP) as FormControl;
  }

  get BirthPlace(): FormControl {
    return this.employeeFormGroup.get(EmployeeConstant.BIRTH_PLACE) as FormControl;
  }

  get IdUpperHierarchy(): FormControl {
    return this.employeeFormGroup.get(EmployeeConstant.BIRTH_PLACE) as FormControl;
  }

  get IdTeam(): FormControl {
    return this.employeeFormGroup.get(EmployeeConstant.ID_TEAM) as FormControl;
  }

  get Notes(): FormControl {
    return this.employeeFormGroup.get(EmployeeConstant.NOTES) as FormControl;
  }

  get IdOffice(): FormArray {
    return this.ContractFormGroup.get(EmployeeConstant.ID_OFFICE) as FormArray;
  }

  get Id(): FormControl {
    return this.ContractFormGroup.get(SharedConstant.ID) as FormControl;
  }

  dialogInit(reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
    this.dialogOptions = options;
    this.isModal = true;
  }


  /**
   * Open the resignation form in popup
   */
  public resignationClick(employee?: Employee): void {
    const dataToSend = employee ? employee : undefined;
    this.formModalDialogService.openDialog(EmployeeConstant.RESIGNATION, ResignationEmployeeComponent, this.viewRef,
      this.onCloseResignationModal.bind(this), dataToSend, true);
  }

  /**
   * on close employee document modal
   * @param data
   */
  private onCloseResignationModal(resignationDataFormGroup?: any): void {
    if (resignationDataFormGroup) {
      let currentDate: Date = new Date();
      currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
      let resignationDate: Date = new Date(resignationDataFormGroup.get(EmployeeConstant.RESIGNATION_DATE).value);
      resignationDate = new Date(resignationDate.getFullYear(), resignationDate.getMonth(), resignationDate.getDate());
      if (resignationDate.getTime() < currentDate.getTime()) {
        this.swalWarrings.CreateSwal(EmployeeConstant.RESIGN_IMMEDIATLY_EMPLOYEE, SharedConstant.WARNING_TITLE,
          SharedConstant.OKAY, SharedConstant.CANCEL).then((result) => {
            if (result.value) {
              this.employeeToUpdate.ResignationDate = resignationDataFormGroup.get(EmployeeConstant.RESIGNATION_DATE).value;
              this.employeeToUpdate.ResignationDepositDate = resignationDataFormGroup.get(EmployeeConstant.RESIGNATION_DEPOSIT_DATE).value;
              this.save();
            }
          });
      } else {
        this.employeeToUpdate.ResignationDate = resignationDataFormGroup.get(EmployeeConstant.RESIGNATION_DATE).value;
        this.employeeToUpdate.ResignationDepositDate = resignationDataFormGroup.get(EmployeeConstant.RESIGNATION_DEPOSIT_DATE).value;
        this.save();
      }
    }
  }

  /**
   * Cancel resignation swal
   */
  public cancelResignationSwal() {
    this.swalWarrings.CreateSwal(EmployeeConstant.CANCEL_RESIGNATION_CONFIRM_CLICK,
      null, EmployeeConstant.YES, EmployeeConstant.NO).then((result) => {
        if (result.value) {
          this.employeeToUpdate.ResignationDate = null;
          this.employeeToUpdate.ResignationDepositDate = null;
          this.save();
        }
      });
  }

  public checkFormGroupValidity(ref: any): boolean {
    const contractComponent = this.listContracts.filter(item => item.viewReference === ref)[NumberConstant.ZERO];
    if (contractComponent) {
      this.receivedFormGroup = contractComponent.contractFormGroup;
      return !this.receivedFormGroup.valid && !this.receivedFormGroup.disabled;
    } else {
      return false;
    }
  }

  isFormChanged(): boolean {
    if (this.employeeFormGroup.touched || this.ContactFormGroup.touched || this.PayFormGroup.touched || this.GraduationFormGroup.touched
      || this.IdentityPapersFormGroup.touched) {
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

  ngOnDestroy(): void {
    if (this.subscriptions) {
      this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }
    if (this.idSubscription) {
      this.idSubscription.unsubscribe();
    }
  }

  downLoadFile(file) {
    const downloadLink = document.createElement('a');
    const imageTab = file.split(SharedConstant.COMMA);
    const byteArray =  new Buffer(imageTab[NumberConstant.ONE], 'base64');
    const blob = new Blob([byteArray], {type : imageTab[NumberConstant.ZERO].substring(imageTab[NumberConstant.ZERO]
      .indexOf(SharedConstant.COLON) + NumberConstant.ONE, imageTab[NumberConstant.ZERO].indexOf(SharedConstant.SEMICOLON))});
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = ''.concat(this.employeeToUpdate.FirstName, ' ', this.employeeToUpdate.LastName);
    document.body.appendChild(downloadLink);
    downloadLink.click();
  }

}
