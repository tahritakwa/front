import { Component, OnInit } from '@angular/core';
import { AsyncValidator, AsyncValidatorFn, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { isNullOrEmptyString } from '@progress/kendo-angular-grid/dist/es2015/utils';
import { Observable } from 'rxjs/Observable';
import { GrowlService } from '../../../../COM/Growl/growl.service';
import { ContactConstants } from '../../../constant/crm/contact.constant';
import { GarageConstant } from '../../../constant/garage/garage.constant';
import { PhoneConstants } from '../../../constant/purchase/phone.constant';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { FileInfo } from '../../../models/shared/objectToSend';
import { SwalWarring } from '../../../shared/components/swal/swal-popup';
import { unique, ValidationService } from '../../../shared/services/validation/validation.service';
import { WorkerService } from '../../services/worker/worker.service';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { PermissionConstant } from '../../../Structure/permission-constant';

@Component({
  selector: 'app-add-worker',
  templateUrl: './add-worker.component.html',
  styleUrls: ['./add-worker.component.scss']
})
export class AddWorkerComponent implements OnInit {

  // URLS
  public listUrl = GarageConstant.WORKER_LIST_URL;

  // Update Properties

  isUpdateMode: boolean;
  workerToUpdate: any;
  private id: number;
  private saveDone = false;

  // FormGroup Properties
  workerFormGroup: FormGroup;

  // File Info Properties
  public ImgFileInfo: FileInfo;
  public workerImgSrc: any;

  // Phone Info Properties
  public workerPhoneHasError = false;
  public defaultPhoneCountryTn = PhoneConstants.DEFAULT_COUNTRY_TN;
  public defaultPhoneCountryFr = PhoneConstants.DEFAULT_COUNTRY_FR;
  public defaultPhoneCountryGb = PhoneConstants.DEFAULT_COUNTRY_GB;
  /**
    * default dial code
    */
  public dialCode: string = PhoneConstants.DEFAULT_DIAL_CODE_COUNTRY_TN;
  /*
 default country code
  */
  public countryCode: string = PhoneConstants.DEFAULT_COUNTRY_TN;

  workerPhone: any;
  // Permission Parameters
  public hasAddPermission: boolean;
  public hasUpdatePermission: boolean;
  constructor(private fb: FormBuilder,
    private activatedRoute: ActivatedRoute, private router: Router,
    private workerService: WorkerService, private growlService: GrowlService, private translateService: TranslateService,
    private validationService: ValidationService, private swalWarring: SwalWarring, private authService: AuthService) {
    this.activatedRoute.params.subscribe(params => {
      this.id = +params[SharedConstant.ID_LOWERCASE] || 0;
    });
    if (this.id !== NumberConstant.ZERO) {
      this.workerPhone = this.activatedRoute.snapshot.data['workerPhone'];
    }
  }

  ngOnInit() {
    this.hasAddPermission = this.authService.hasAuthority(PermissionConstant.SettingsGaragePermissions.ADD_WORKER);
    this.hasUpdatePermission = this.authService.hasAuthority(PermissionConstant.SettingsGaragePermissions.UPDATE_WORKER);
    this.createAddForm();
    this.isUpdateMode = (this.id > 0);
    if (this.isUpdateMode) {
      this.getDataToUpdate();
    }
  }
  /**
     * Create operation add form
    */
  private createAddForm(worker?): void {
    this.workerFormGroup = this.fb.group({
      Id: [worker ? worker.Id : 0],
      FirstName: [worker ? worker.FirstName : undefined, [Validators.required,
        Validators.maxLength(NumberConstant.FIFTY)]],
      LastName: [worker ? worker.LastName : undefined, [Validators.required, 
        Validators.maxLength(NumberConstant.FIFTY)]],
      Address: [worker ? worker.Address : undefined],
      Email: [worker ? worker.Email : undefined],
      IsResponsable: [worker ? worker.IsResponsable : false],
      Cin: [worker ? worker.Cin : undefined, {
        validators: [Validators.required],
        asyncValidators: unique('Cin', this.workerService, this.id ?
          String(this.id) : String(NumberConstant.ZERO)), updateOn: 'blur'
      }],
      IdPhone: [worker ?  worker.IdPhone : undefined],
      IdPhoneNavigation: this.buildIdPhoneNavigation(worker ?  worker.IdPhoneNavigation : null),
    });
    this.addSyncEmailValidationControl();
    this.addAsyncEmailValidationControl();
  }

  private buildIdPhoneNavigation(phone) {
    return this.fb.group({
      Id: [NumberConstant.ZERO],
      Number: [phone ? phone.Number : null],
      DialCode: [phone ? phone.DialCode : this.dialCode],
      CountryCode: [phone ? phone.CountryCode : this.countryCode],
      IsDeleted: [false]
    });
  }
  addSyncEmailValidationControl(): void {
    this.workerFormGroup.controls.Email.setValidators(
      this.validationService.conditionalValidator((() => this.workerFormGroup.controls.Email.value),
      Validators.pattern(SharedConstant.MAIL_PATTERN)));
  }

  addAsyncEmailValidationControl() {
    this.workerFormGroup.controls.Email.setAsyncValidators(
      this.validationService.conditionalAsyncUniqueValidator((() => this.workerFormGroup.controls.Email.value),
      'Email', this.workerService, this.id ?
      String(this.id) : String(NumberConstant.ZERO)));
  }
  get IdPhoneNavigation(): FormControl {
    return this.workerFormGroup.get(GarageConstant.ID_PHONE_NAVIGATION) as FormControl;
  }

  get IdPhone(): FormControl {
    return this.workerFormGroup.get(GarageConstant.ID_PHONE) as FormControl;
  }

  isValidPhone(isValidPhone) {
    if (isValidPhone || isNullOrEmptyString(this.IdPhoneNavigation.value.Number)) {
      this.workerPhoneHasError = false;
      this.IdPhoneNavigation.hasError(null);
      this.IdPhoneNavigation.markAsUntouched();
    } else {
      this.workerPhoneHasError = true;
      this.IdPhoneNavigation.setErrors({'wrongPattern': Validators.pattern});
      this.IdPhoneNavigation.markAsTouched();
    }
  }

  onCountryPhoneChange(phoneInformation) {
    this.IdPhoneNavigation.get(PhoneConstants.PHONE_DIAL_CODE).setValue(phoneInformation.dialCode);
    this.IdPhoneNavigation.get(PhoneConstants.PHONE_COUNTRY_CODE).setValue(phoneInformation.iso2);
  }

  loadPhoneCountryFlag() {
    if (this.workerPhone && this.workerPhone.IdPhoneNavigation) {
      return this.workerPhone.IdPhoneNavigation.CountryCode.toString().trim();
    }
  }

  /**
 * Get data to Update
 */
  private getDataToUpdate() {
    this.workerService.getById(this.id).subscribe((data) => {
      this.workerToUpdate = data;
      if (this.workerToUpdate) {
        if (data.ImgFileInfo) {
          this.ImgFileInfo = data.ImgFileInfo;
          this.workerImgSrc = GarageConstant.BASE_IMAGE.concat((String)(this.workerToUpdate.ImgFileInfo.Data));
        }
        if (!this.hasUpdatePermission) {
          this.workerFormGroup.disable();
        }
        this.createAddForm(this.workerToUpdate);
      }
    });
  }

  cancelAction() {
    this.router.navigateByUrl(GarageConstant.WORKER_LIST_URL);
  }
  /**
  *  save method
  */
  save() {
    if (this.workerFormGroup.valid && !this.workerPhoneHasError) {
      this.workerToUpdate = Object.assign({}, this.workerToUpdate, this.workerFormGroup.getRawValue());
      this.workerToUpdate.ImgFileInfo = this.ImgFileInfo;
      this.workerService.save(this.workerToUpdate, !this.isUpdateMode).subscribe(() => {
        this.saveDone = true;
        this.router.navigateByUrl(GarageConstant.WORKER_LIST_URL);
      });
    } else {
      this.validationService.validateAllFormFields(this.workerFormGroup);
    }
  }
  /**
  *  remove worker picture
  */
  removeWorkerPicture(event) {
    event.preventDefault();
    this.swalWarring.CreateDeleteSwal(ContactConstants.PICTURE_ELEMENT, ContactConstants.PRONOUN_CETTE).then((result) => {
      if (result.value) {
        this.ImgFileInfo = null;
        this.workerImgSrc = null;
      }
    });
  }
  /**
   *  change worker picture
   */
  public onFileChanged(event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e: any) => {
        this.ImgFileInfo = new FileInfo();
        this.ImgFileInfo.Name = file.name;
        this.ImgFileInfo.Extension = file.type;
        this.ImgFileInfo.FileData = (<string>reader.result).split(',')[1];
        this.workerImgSrc = reader.result;
      };
    }
  }
  /**
    * this method will be called by CanDeactivateGuard service to check the leaving component possibility
    */
  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    return this.validationService.handleCanDeactivateToLeaveCurrentComponent(() => !this.saveDone
      && this.workerFormGroup.dirty);
  }
}
