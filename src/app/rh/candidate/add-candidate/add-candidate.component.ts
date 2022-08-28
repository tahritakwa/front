import { Component, Input, OnDestroy, OnInit, ViewContainerRef, ViewChild, ElementRef } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { IModalDialogOptions } from 'ngx-modal-dialog';
import { ModalDialogInstanceService } from 'ngx-modal-dialog/src/modal-dialog-instance.service';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { CandidateConstant } from '../../../constant/rh/candidate.constant';
import { CvConstant } from '../../../constant/rh/cv.constant';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { Qualification } from '../../../models/payroll/qualification.model';
import { Candidate } from '../../../models/rh/candidate.model';
import { CurriculumVitae } from '../../../models/rh/curriculumvitae.model';
import { FileInfo } from '../../../models/shared/objectToSend';
import { Resource } from '../../../models/shared/ressource.model';
import { QualificationService } from '../../../payroll/services/qualification/qualification.service';
import { AddQualificationComponent } from '../../../shared/components/qualification/add-qualification/add-qualification.component';
import { SwalWarring } from '../../../shared/components/swal/swal-popup';
import { FormModalDialogService } from '../../../shared/services/dialog/form-modal-dialog/form-modal-dialog.service';
import { ResourceService } from '../../../shared/services/resource/resource.service';
import { isEqualLength, unique, ValidationService } from '../../../shared/services/validation/validation.service';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { CandidateService } from '../../services/candidate/candidate.service';


@Component({
  selector: 'app-add-candidate',
  templateUrl: './add-candidate.component.html',
  styleUrls: ['./add-candidate.component.scss']
})
export class AddCandidateComponent implements OnInit, OnDestroy {

  @Input() group: FormGroup;
  @Input()
  service: ResourceService<Resource>;
  @ViewChild('BackToList') backToList: ElementRef;
  /**
   * fromGroup of candidate
   */
  public candidateFormGroup: FormGroup;
  public adressFormGroup: FormGroup;
  public documentFormGroup: FormGroup;
  public graduationFormGroup: FormGroup;
  public contactFormGroup: FormGroup;
  public candidate: Candidate;
  /**
   * candidate to update
   */
  public candidateToUpdate: Candidate;
  /**
   * Is true if form must be disable
   */
  public isDisabled = false;
  public isUpdateMode: boolean;
  public isModal = false;
  dialogOptions: Partial<IModalDialogOptions<any>>;
  public CvFileToUpload: Array<FileInfo>;
  private id: number;
  private isSaveOperation = false;
  private subscriptions: Subscription[] = [];


  /** Permission */
  public hasAddPermission: boolean;
  public hasUpdatePermission: boolean;

  dialogInit(options: Partial<IModalDialogOptions<any>>) {
    this.isModal = true;
    this.dialogOptions = options;
  }


  public formatDate = this.translate.instant(SharedConstant.DATE_FORMAT);

  constructor(private fb: FormBuilder, private activatedRoute: ActivatedRoute,
              private router: Router, private qualificationService: QualificationService,
              private swalWarrings: SwalWarring, public candidateService: CandidateService, private validationService: ValidationService,
              private viewRef: ViewContainerRef, private formModalDialogService: FormModalDialogService,
              public authService: AuthService,
      private modalService: ModalDialogInstanceService, private translate: TranslateService) {
    this.subscriptions.push(this.activatedRoute.params.subscribe(params => {
      this.id = +params['id'] || 0;
      this.isUpdateMode = this.id > 0 && !this.isModal ? true : false;
    }));
  }

  ngOnInit() {
    this.hasAddPermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.ADD_CANDIDATE);
    this.hasUpdatePermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.UPDATE_CANDIDATE);
    this.createAddForm();
    if (this.isUpdateMode) {
      this.getDataToUpdate();
    }
  }

  get FirstName(): FormControl {
    return this.candidateFormGroup.get(CandidateConstant.FIRST_NAME) as FormControl;
  }

  get LastName(): FormControl {
    return this.candidateFormGroup.get(CandidateConstant.LAST_NAME) as FormControl;
  }

  get Email(): FormControl {
    return this.candidateFormGroup.get(CandidateConstant.EMAIL) as FormControl;
  }

  get Cin(): FormControl {
    return this.candidateFormGroup.get(CandidateConstant.CIN) as FormControl;
  }

  get IdOffice(): FormControl {
    return this.candidateFormGroup.get(CandidateConstant.ID_OFFICE) as FormControl;
  }

  get Id(): FormControl {
    return this.candidateFormGroup.get(CandidateConstant.ID_CANDIDATE) as FormControl;
  }

  get Sex(): FormControl {
    return this.candidateFormGroup.get(CandidateConstant.SEX) as FormControl;
  }

  get BirthDate(): FormControl {
    return this.candidateFormGroup.get(CandidateConstant.BIRTH_DATE) as FormControl;
  }

  get IdCitizenship(): FormControl {
    return this.candidateFormGroup.get(CandidateConstant.ID_CITIZENSHIP) as FormControl;
  }

  get IsForeign(): FormControl {
    return this.candidateFormGroup.get(CandidateConstant.IS_FOREIGN) as FormControl;
  }

  get AddressLine1(): FormControl {
    return this.adressFormGroup.get(CandidateConstant.ADDRESS_LINE1) as FormControl;
  }

  get AddressLine2(): FormControl {
    return this.adressFormGroup.get(CandidateConstant.ADDRESS_LINE2) as FormControl;
  }

  get AddressLine3(): FormControl {
    return this.adressFormGroup.get(CandidateConstant.ADDRESS_LINE3) as FormControl;
  }

  get AddressLine4(): FormControl {
    return this.adressFormGroup.get(CandidateConstant.ADDRESS_LINE4) as FormControl;
  }

  get AddressLine5(): FormControl {
    return this.adressFormGroup.get(CandidateConstant.ADDRESS_LINE5) as FormControl;
  }

  get Qualification(): FormArray {
    return this.graduationFormGroup.get(SharedConstant.QUALIFICATION) as FormArray;
  }

  get CurriculumVitae(): FormArray {
    return this.documentFormGroup.get(CandidateConstant.CurriculumVitae) as FormArray;
  }

  get LinkedIn(): FormControl {
    return this.contactFormGroup.get(CandidateConstant.LINKEDIN) as FormControl;
  }

  get Facebook(): FormControl {
    return this.contactFormGroup.get(CandidateConstant.FACEBOOK) as FormControl;
  }

  get PersonalPhone(): FormControl {
    return this.contactFormGroup.get(CandidateConstant.PERSONAL_PHONE) as FormControl;
  }

  get ProfessionalPhone(): FormControl {
    return this.contactFormGroup.get(CandidateConstant.PROFESSIONAL_PHONE) as FormControl;
  }

  /**
   * Candidate Add
   */
  public save(): void {
    if (this.candidateFormGroup.valid && this.adressFormGroup.valid && this.graduationFormGroup.valid
      && this.documentFormGroup.valid && this.contactFormGroup.valid) {
      this.isSaveOperation = true;
      this.candidateFormGroup.updateValueAndValidity();
      let candidateAssign: Candidate = Object.assign({}, this.candidateToUpdate, this.candidateFormGroup.value);
      candidateAssign = Object.assign(candidateAssign, this.adressFormGroup.value);
      candidateAssign = Object.assign(candidateAssign, this.documentFormGroup.value);
      candidateAssign = Object.assign(candidateAssign, this.graduationFormGroup.value);
      candidateAssign = Object.assign(candidateAssign, this.contactFormGroup.value);
      // search if there are deleted and not created candidate document
      for (const currentCandidateDocument of candidateAssign.CurriculumVitae) {
        // removing the deleted and not yet saved candidate document
        candidateAssign.CurriculumVitae =
          this.candidateCVtListButThisIfThisIsDeletedAndNotSavedCandidateCV(candidateAssign.CurriculumVitae,
            currentCandidateDocument);
      }
      this.subscriptions.push(this.candidateService.save(candidateAssign, !this.isUpdateMode).subscribe(() => {
        if (this.isModal) {
          this.dialogOptions.onClose();
          this.modalService.closeAnyExistingModalDialog();
        } else {
          this.router.navigateByUrl(CandidateConstant.CANDIDATE_LIST_URL);
        }
      }));
    } else {
      this.validateAllFormGroup();
    }
  }

  // candidate FormGroup get controls

  /***
   * validate all formGroup fields
   */
  public validateAllFormGroup() {
    this.validationService.validateAllFormFields(this.candidateFormGroup);
    this.validationService.validateAllFormFields(this.adressFormGroup);
    this.validationService.validateAllFormFields(this.graduationFormGroup);
    this.validationService.validateAllFormFields(this.documentFormGroup);
    this.validationService.validateAllFormFields(this.contactFormGroup);
  }

  /**
   *  removing currentCandidateDocument from currentCandidateDocumentList if it
   * is deleted and not yet saved
   * @param currentCandidateCVList
   * @param currentCandidateCV
   */
  candidateCVtListButThisIfThisIsDeletedAndNotSavedCandidateCV(currentCandidateCVList: CurriculumVitae[],
                                                               currentCandidateCV: CurriculumVitae): CurriculumVitae[] {
    if (currentCandidateCV.IsDeleted && currentCandidateCV.Id === 0) {
      currentCandidateCVList = currentCandidateCVList.filter(x => x !== currentCandidateCV);
    }
    return currentCandidateCVList;
  }

  /**
   * add Cv document Period
   */
  public addCvDocument(): void {
    this.CurriculumVitae.push(this.buildAddCVForm());
    this.CurriculumVitae.markAsTouched();
  }

  /**
   * build add cv Form
   * @param cv
   */
  public buildAddCVForm(curriculumVitae?: CurriculumVitae): FormGroup {
    return this.fb.group({
      Id: [curriculumVitae ? curriculumVitae.Id : 0, [Validators.required]],
      Entitled: [curriculumVitae ? curriculumVitae.Entitled : '', [Validators.required, Validators.maxLength(NumberConstant.ONE_HUNDRED)]],
      DepositDate: [curriculumVitae ? new Date(curriculumVitae.DepositDate) : '', [Validators.required]],
      CvFileInfo: [curriculumVitae && curriculumVitae.CvFileInfo ? curriculumVitae.CvFileInfo : new Array<FileInfo>()],
      CurriculumVitaePath: [curriculumVitae ? curriculumVitae.CurriculumVitaePath : ''],
      IsDeleted: [false]
    });
  }

  public setQualificationsOfDataToUpdate(currentCandidate: Candidate) {
    if (currentCandidate.Qualification) {
      for (const currentQualification of currentCandidate.Qualification) {
        this.addQualification(this.generateQualificationFormGroupFromQualification(currentQualification));
      }
    }
  }

  addQualification(newQualificationFormGroup: FormGroup): void {
    newQualificationFormGroup.addControl(SharedConstant.HIDE, new FormControl(true));
    this.Qualification.insert(0, newQualificationFormGroup);
  }

  deleteQualification(i: number): void {
    this.swalWarrings.CreateSwal(SharedConstant.WONT_BE_ABLE_TO_REVERT).then((result) => {
      if (result.value) {
        if ((this.Qualification.at(i) as FormGroup).controls[SharedConstant.ID].value === 0) {
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

  addNewQualification() {
    this.formModalDialogService.openDialog(SharedConstant.ADD_QUALIFICATION,
      AddQualificationComponent, this.viewRef, this.onCloseQualificationModal.bind(this),
      {'qualifiedColumnName': SharedConstant.ID_CANDIDATE}, true, SharedConstant.MODAL_DIALOG_SIZE_M);
  }

  public generateQualificationFormGroupFromQualification(currentQualification: Qualification): FormGroup {
    let currentQualificationFormGroup: FormGroup;
    currentQualificationFormGroup = this.fb.group({
      Id: [currentQualification.Id],
      IdCandidate: [currentQualification.IdCandidate, [Validators.required]],
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
   * Set the candidate to update cv
   * */
  public setCvDataToUpdate(currentCanidate: Candidate) {
    if (currentCanidate.CurriculumVitae) {
      for (const currentCv of currentCanidate.CurriculumVitae) {
        this.addCv(this.buildAddCVForm(currentCv));
      }
    }
  }

// adress FormGroup get controls

  /**
   * Add new contract to the candidate form
   * @param newContractFormGroup
   */
  addCv(newCvFormGroup: FormGroup): void {
    newCvFormGroup.addControl(CandidateConstant.HIDE, new FormControl(true));
    this.CurriculumVitae.push(newCvFormGroup);

  }

  /**
   * Back to list
   */
  public goBackToList() {
    this.router.navigateByUrl(CandidateConstant.CANDIDATE_LIST_URL);
  }

  /**
   * return the visibility of a CurriculumVitae
   * @param i
   */
  isCvDocumentRowVisible(i): boolean {
    return !this.CurriculumVitae.at(i).get(SharedConstant.IS_DELETED).value;
  }

  /**
   * clear cv document
   */
  public deleteCvDocument(position): void {

    this.swalWarrings.CreateSwal(SharedConstant.WONT_BE_ABLE_TO_REVERT).then((result) => {
      if (result.value) {
        if (this.CurriculumVitae.at(position).get(SharedConstant.ID).value === NumberConstant.ZERO) {
          this.CurriculumVitae.removeAt(position);
        } else {
          this.CurriculumVitae.at(position).get(SharedConstant.IS_DELETED).setValue(true);
          this.CurriculumVitae.at(position).get(SharedConstant.ID).clearValidators();
          this.CurriculumVitae.at(position).get(CvConstant.ENTITLED).clearValidators();
          this.CurriculumVitae.at(position).get(CvConstant.DEPOSIT_DATE).clearValidators();
          this.CurriculumVitae.at(position).get(CvConstant.ENTITLED).updateValueAndValidity();
          this.CurriculumVitae.at(position).get(CvConstant.DEPOSIT_DATE).updateValueAndValidity();
        }
      }
    });
  }

  isFormChanged(): boolean {
    if (this.candidateFormGroup.touched || this.adressFormGroup.touched || this.graduationFormGroup.touched ||
      this.documentFormGroup.touched || this.contactFormGroup.touched) {
      return true;
    }
    return false;
  }

// documents FormGroup get controls

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

// adress FormGroup get controls

  ngOnDestroy(): void {
    if (this.subscriptions !== undefined) {
      this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }
  }

  /*
    * Prepare Add form component
   */
  private createAddForm(candidate?: Candidate) {
    this.candidateFormGroup = this.fb.group({
      Id: [candidate ? candidate.Id : 0],
      FirstName: [candidate ? candidate.FirstName : undefined,
        [Validators.required, Validators.maxLength(NumberConstant.ONE_HUNDRED)]],
      LastName: [candidate ? candidate.LastName : undefined,
        [Validators.required, Validators.maxLength(NumberConstant.ONE_HUNDRED)]],
      Email: [candidate ? candidate.Email : undefined,
        [Validators.required, Validators.maxLength(NumberConstant.FIFTY),
          Validators.email],
        unique(SharedConstant.EMAIL, this.candidateService, String(this.id))],
      BirthDate: [candidate ? candidate.BirthDate : undefined],
      Cin: [candidate ? candidate.Cin : undefined,
        isEqualLength(NumberConstant.EIGHT), unique(CandidateConstant.CIN, this.candidateService, String(this.id))],
      Sex: [candidate ? candidate.Sex : undefined,
        [Validators.required]],
      IdOffice: [candidate ? candidate.IdOffice : undefined,
        [Validators.required]],
      IdCitizenship: [candidate ? candidate.IdCitizenship : undefined,
        [Validators.required]],
      IsForeign: [candidate ? candidate.IsForeign : false]
    });
    this.adressFormGroup = this.fb.group({
      AddressLine1: [candidate ? candidate.AddressLine1 : undefined,
        [Validators.maxLength(NumberConstant.ONE_HUNDRED)]],
      AddressLine2: [candidate ? candidate.AddressLine2 : undefined,
        [Validators.maxLength(NumberConstant.ONE_HUNDRED)]],
      AddressLine3: [candidate ? candidate.AddressLine3 : undefined,
        [Validators.maxLength(NumberConstant.ONE_HUNDRED)]],
      AddressLine4: [candidate ? candidate.AddressLine4 : undefined,
        [Validators.maxLength(NumberConstant.ONE_HUNDRED)]],
      AddressLine5: [candidate ? candidate.AddressLine5 : undefined,
        [Validators.maxLength(NumberConstant.ONE_HUNDRED)]]
    });
    this.documentFormGroup = this.fb.group({
      CurriculumVitae: this.fb.array([])
    });
    this.graduationFormGroup = this.fb.group({
      Qualification: this.fb.array([]),
    });
    this.contactFormGroup = this.fb.group({
      Facebook: [candidate ? candidate.Facebook : undefined,
        [Validators.maxLength(NumberConstant.TWO_HUNDRED_FIFTY_FIVE),
          Validators.pattern('^https:\\/\\/www\\.facebook\\.com\\/[a-zA-Z0-9_.+-/@]+$')]],
      LinkedIn: [candidate ? candidate.LinkedIn : undefined,
        [Validators.maxLength(NumberConstant.TWO_HUNDRED_FIFTY_FIVE),
          Validators.pattern('^https:\\/\\/www\\.linkedin\\.com\\/[a-zA-Z0-9_.+-/@]+$')]],
      PersonalPhone: [candidate ? candidate.PersonalPhone : undefined,
        [Validators.maxLength(NumberConstant.ONE_HUNDRED)]],
      ProfessionalPhone: [candidate ? candidate.ProfessionalPhone : undefined,
        [Validators.maxLength(NumberConstant.ONE_HUNDRED)]],
    });
  }

  /**
   * Get data to Update
   */
  private getDataToUpdate() {
    this.subscriptions.push(this.candidateService.getById(this.id).subscribe((data) => {
      this.candidateToUpdate = data;
      this.isDisabled = !this.hasUpdatePermission;
      if (this.isDisabled) {
        this.disableFromGroup();
      }
      this.candidateToUpdate.BirthDate = this.candidateToUpdate.BirthDate ?
        new Date(data.BirthDate) : this.candidateToUpdate.BirthDate;
      if (this.candidateToUpdate != null) {
        this.createAddForm(this.candidateToUpdate);
        this.setCvDataToUpdate(this.candidateToUpdate);
        this.setQualificationsOfDataToUpdate(this.candidateToUpdate);
      }
    }));

  }

  private onCloseQualificationModal(data: any): void {
    if (data !== undefined && !data[SharedConstant.QUALIFIED_COLUMN_NAME]) {
      this.addQualification(data as FormGroup);
    }
    this.Qualification.markAsTouched();
  }

  disableFromGroup() {
    this.candidateFormGroup.disable();
    this.adressFormGroup.disable();
    this.contactFormGroup.disable();
    this.documentFormGroup.disable();
    this.graduationFormGroup.disable();
  }
}
