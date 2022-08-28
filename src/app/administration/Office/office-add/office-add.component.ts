import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, OnDestroy, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { Country } from '../../../models/administration/country.model';
import { OfficeConstant } from '../../../constant/shared/office.constant';
import { CityDropdownComponent } from '../../../shared/components/city-dropdown/city-dropdown.component';
import { Office } from '../../../models/shared/office.model';
import { OfficeService } from '../../services/office/office.service';
import { unique, ValidationService } from '../../../shared/services/validation/validation.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { IModalDialogOptions } from 'ngx-modal-dialog';
import { PhoneConstants } from '../../../constant/purchase/phone.constant';
import { TiersConstants } from '../../../constant/purchase/tiers.constant';
import { isNullOrEmptyString } from '@progress/kendo-angular-grid/dist/es2015/utils';
import { Observable } from 'rxjs/Observable';
import { TiersAddressComponent } from '../../../shared/components/tiers-address/tiers-address.component';
import { TiersContactComponent } from '../../../shared/components/tiers-contact/tiers-contact.component';
import { ContactConstants } from '../../../constant/crm/contact.constant';
import {StyleConfigService} from '../../../shared/services/styleConfig/style-config.service';
import { Subscription } from 'rxjs/Subscription';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { AuthService } from '../../../login/Authentification/services/auth.service';

const SEPARATOR = '/';

@Component({
  selector: 'app-office-add',
  templateUrl: './office-add.component.html',
  styleUrls: ['./office-add.component.scss']
})
export class OfficeAddComponent implements OnInit, OnDestroy {
  @ViewChild(CityDropdownComponent)
  childListCity;
  Country: Country;
  isUpdateMode: boolean;
  public officeFormGroup: FormGroup;
  public officeToUpdate: Office;
  private id: number;
  private isSaveOperation = false;
  private subscriptions: Subscription[]= [];


  @ViewChild('emailInput') public emailInput: ElementRef;
  /*
    Collapse informations
     */
  public openCordinationDetailsCollapse = false;
  public openAddressDetailsCollapse = false;
  public openContactsCollapse = false;
  public addressCollapseIsOpened = false;
  public collapseContactOpened = false;
  public collapseAddressOpened = false;

  public contactPhoneHasError = false;
  public phoneHasError = false;
  public officeAddress = [];
  public officeContact = [];

  public hasAddOfficePermission: boolean;
  public hasUpdateOfficePermission: boolean;

  @Input() inputOptions: Partial<IModalDialogOptions<any>>;

  public defaultPhoneCountryTn = PhoneConstants.DEFAULT_COUNTRY_TN;
  public defaultPhoneCountryFr = PhoneConstants.DEFAULT_COUNTRY_FR;
  public defaultPhoneCountryGb = PhoneConstants.DEFAULT_COUNTRY_GB;

  /**
   * default dial code
   */
  public dialCode: string[] = [PhoneConstants.DEFAULT_DIAL_CODE_COUNTRY_TN];
  /*
 default country code
  */
  public countryCode: string[] = [PhoneConstants.DEFAULT_COUNTRY_TN];

  constructor(private router: Router, private fb: FormBuilder,
    private activatedRoute: ActivatedRoute, public officeService: OfficeService, private validationService: ValidationService,
    private styleConfigService: StyleConfigService, private authService: AuthService) {
      this.subscriptions.push(this.activatedRoute.params.subscribe(params => {
      this.id = +params['id'] || 0;
    }));
    this.hasAddOfficePermission = this.authService.hasAuthority(PermissionConstant.SettingsRHAndPaiePermissions.ADD_OFFICE);
    this.hasUpdateOfficePermission = this.authService.hasAuthority(PermissionConstant.SettingsRHAndPaiePermissions.UPDATE_OFFICE);
   }

  ngOnInit() {
    this.createAddForm();
    this.activatedRoute.params.subscribe(params => {
      this.id = +params[SharedConstant.ID_LOWERCASE] || NumberConstant.ZERO;
    });
    if (this.id) {
      this.isUpdateMode = true;
      this.getDataToUpdate();
    }
  }


  private createAddForm(office?: Office) {
    this.officeFormGroup = this.fb.group({
      OfficeName: [office ? office.OfficeName : undefined, [Validators.required, Validators.maxLength(NumberConstant.ONE_HUNDRED)]],
      IdOfficeManager: [office ? office.IdOfficeManager : undefined, [Validators.required]],
      PhoneNumber: [office ? office.PhoneNumber : undefined, [Validators.maxLength(NumberConstant.TWO_HUNDRED_FIFTY_FIVE)]],
      LinkedIn: [office ? office.LinkedIn : undefined],
      Facebook: [office ? office.Facebook : undefined],
      Twitter: [office ? office.Twitter : undefined],
      Email: [office ? office.Email : undefined, {
        validators: [Validators.pattern(SharedConstant.MAIL_PATTERN)],
        asyncValidators: unique(TiersConstants.EMAIL, this.officeService, String(this.id)), updateOn: 'blur'
      }],
      Fax: [office ? office.Fax : undefined],
      Contact: this.fb.array([]),
      Address: this.fb.array([]),
      IdPhone: [NumberConstant.ZERO],
      IdPhoneNavigation: this.buildIdPhoneNavigation(),
      CreationDate: new Date(),
      IdCreationUser: [undefined],
    });
  }

  /**
   * Sent the country selected to the city
   * @param $event
   */
  receiveCountryStatus($event) {
    this.Country = new Country();
    this.Country.Id = $event;
    this.childListCity.setCity(this.Country);
    if (this.Country.Id) {
      this.officeFormGroup.controls[OfficeConstant.ID_CITY].enable();
    } else {
      this.officeFormGroup.controls[OfficeConstant.ID_CITY].setValue(null);
      this.officeFormGroup.controls[OfficeConstant.ID_CITY].disable();
    }
  }

  save() {
    this.checkCollapseAddressOnCloseValidation();
    this.checkCollapseContactOnCloseValidation();
    if (this.officeFormGroup.valid) {
      this.isSaveOperation = true;
      const officeAssign: Office = Object.assign({}, this.officeToUpdate, this.officeFormGroup.value);
      this.subscriptions.push(this.officeService.save(officeAssign, !this.isUpdateMode).subscribe(() => {
        this.router.navigateByUrl(OfficeConstant.LIST_URL);
        this.isSaveOperation = true;
      }));
    } else {
      this.validateAndOpenInValidCollapses();
    }
  }
  validateAndOpenInValidCollapses() {
    if (this.officeFormGroup.controls.Address.invalid) {
      this.openAddressDetailsCollapse = true;
    }
    if (this.officeFormGroup.controls.Contact.invalid) {
      this.openContactsCollapse = true;
    }

    this.validationService.validateAllFormFields(this.officeFormGroup);
  }
  public getDataToUpdate() {
    this.subscriptions.push(this.officeService.getById(this.id).subscribe((data) => {
      this.officeToUpdate = data;
      if (this.officeToUpdate) {
       this.createAddForm(this.officeToUpdate);
      }
    this.checkCollapsesOnUpdate();
    if ((!this.hasUpdateOfficePermission && this.isUpdateMode) || (this.hasAddOfficePermission && !this.isUpdateMode)) {
      this.officeFormGroup.disable();
    }
    }));
  }

  private checkCollapsesOnUpdate() {
    this.checkCollapseAddressStateOnUpdate();
    this.checkCollapseContactStateOnUpdate();
  }

  private checkCollapseContactStateOnUpdate() {
    if (this.officeToUpdate && this.officeToUpdate.Contact &&
      this.officeToUpdate.Contact.length > NumberConstant.ZERO) {
      this.openContactsCollapse = true;
      this.officeContact = this.officeToUpdate.Contact;
    }
  }

  private checkCollapseAddressStateOnUpdate() {
    if (this.officeToUpdate && this.officeToUpdate.Address &&
      this.officeToUpdate.Address.length > NumberConstant.ZERO) {
      this.openAddressDetailsCollapse = true;
      this.officeAddress = this.officeToUpdate.Address;
    }
  }
  public openContactDetailCollapse() {
    if (this.Contact && this.Contact.length === NumberConstant.ZERO) {
      this.collapseContactOpened = true;
    }
    if (!this.openContactsCollapse) {
      this.collapseContactOpened = false;
      if (this.Contact && this.Contact.controls) {
        this.Contact.controls = this.Contact.controls
          .filter(contact => !TiersContactComponent.isEmptyContactFields(contact.value));
      }
    }
  }

  get Address(): FormArray {
    return this.officeFormGroup.get(ContactConstants.ADDRESS) as FormArray;
  }

  get Contact(): FormArray {
    return this.officeFormGroup.get(ContactConstants.CONTACT) as FormArray;
  }

  public openAddressDetailCollapse() {
    if (this.Address && this.Address.length === NumberConstant.ZERO) {
      this.collapseAddressOpened = true;
    }
    if (!this.openAddressDetailsCollapse) {
      this.collapseAddressOpened = false;
      if (this.Address && this.Address.controls) {
        this.Address.controls = this.Address.controls
          .filter(adress => !TiersAddressComponent.isEmptyAdressFields(adress.value));
      }
    }
  }

  public backToList() {
    this.router.navigateByUrl(SharedConstant.OFFICE_LIST_URL);
  }

  /**
   * remove empty address formGroup from formArray on close collapse address
   */
  private checkCollapseAddressOnCloseValidation() {
    if (this.Address && this.Address.controls &&
      this.Address.controls.length > 0 && !this.Address.valid) {
      this.openAddressDetailsCollapse = true;
    }
  }

  /**
   * remove empty address formGroup from formArray on close collapse address
   */
  private checkCollapseContactOnCloseValidation() {
    if (this.Contact && this.Contact.controls &&
      this.Contact.controls.length > 0 && !this.Contact.valid) {
      this.openContactsCollapse = true;
    }
  }

  isFormChanged(): boolean {
    return this.officeFormGroup.touched;
  }

  get PhoneNavigation(): FormControl {
    return this.officeFormGroup.get(TiersConstants.PHONE_NAVIGATION) as FormControl;
  }

  get IdPhone(): FormControl {
    return this.officeFormGroup.get(TiersConstants.ID_PHONE) as FormControl;
  }

  isValidPhone(isValidPhone) {
    if (isValidPhone || isNullOrEmptyString(this.PhoneNavigation.value.Number)) {
      this.phoneHasError = false;
      this.PhoneNavigation.setErrors(null);
      this.PhoneNavigation.markAsUntouched();
    } else {
      this.phoneHasError = true;
      this.PhoneNavigation.setErrors({ 'wrongPattern': Validators.pattern });
      this.PhoneNavigation.markAsTouched();
    }
  }


  onCountryPhoneChange(phoneInformation) {
    this.PhoneNavigation.get(PhoneConstants.PHONE_DIAL_CODE).setValue(phoneInformation.dialCode);
    this.PhoneNavigation.get(PhoneConstants.PHONE_COUNTRY_CODE).setValue(phoneInformation.iso2);
  }

  loadPhoneCountryFlag() {
    /*if (this.officeToUpdate && this.officeToUpdate.IdPhoneNavigation) {
      return this.officeToUpdate.IdPhoneNavigation.CountryCode.toString().trim();
    }*/
  }

  isContactPhoneHasError(contactPhoneValid: boolean[]) {
    if (contactPhoneValid.includes(true)) {
      this.contactPhoneHasError = true;
    }
  }

  onEmailMouseOut() {
    this.emailInput.nativeElement.blur();
  }

  private buildIdPhoneNavigation() {
    return this.fb.group({
      Id: [NumberConstant.ZERO],
      Number: [],
      DialCode: [this.dialCode[NumberConstant.ZERO]],
      CountryCode: [this.countryCode[NumberConstant.ZERO]],
      IsDeleted: [false]
    });
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

  getFooterClass(): string {
    return this.styleConfigService.getFooterClassSettingLayoutAddComponent();
  }
}
