import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {AbstractControl, FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {PhoneConstants} from '../../../../constant/purchase/phone.constant';
import {NumberConstant} from '../../../../constant/utility/number.constant';
import {ValidationService} from '../../../../shared/services/validation/validation.service';
import {SwalWarring} from '../../../../shared/components/swal/swal-popup';
import {AuthService} from '../../../../login/Authentification/services/auth.service';
import {PermissionConstant} from '../../../../Structure/permission-constant';
import {isNullOrEmptyString} from '@progress/kendo-angular-grid/dist/es2015/utils';
import {isNotNullOrUndefinedAndNotEmptyValue} from '../../../../stark-permissions/utils/utils';

const EMPTY_STRING = '';

@Component({
  selector: 'app-contact-phone',
  templateUrl: './contact-phone.component.html',
  styleUrls: ['./contact-phone.component.scss']
})
export class ContactPhoneComponent implements OnInit , OnChanges {
  /**
   * Decorator to identify the phone parent form group from contactComponenet
   */
  @Input()
  public parentFormGroup: FormGroup;
  /**
   * Decorator to identify the phone to update from contactComponenet
   */
  @Input()
  public phoneToUpdate: any;
  /**
   * Decorator to update phone
   */
  @Input()
  public hasUpdatePhone: boolean;

  @Input()
  public isBankAgency: boolean;
  @Input()
  public isOffice: boolean;
  @Input()
  public isCompanySetup: boolean;
  /**
   * Decorator to identify if the phone componenet is valid
   */
  @Output()
  public phoneHasErrorEvent: EventEmitter<boolean[]> = new EventEmitter();

  /**
   * default dial code
   */
  public dialCode: string[] = [PhoneConstants.DEFAULT_DIAL_CODE_COUNTRY_TN];
  /*
 default country code
  */
  public countryCode: string[] = [PhoneConstants.DEFAULT_COUNTRY_TN];
  /**
   * preferredCountries
   */
  public defaultPhoneCountryTn = PhoneConstants.DEFAULT_COUNTRY_TN;
  public defaultPhoneCountryFr = PhoneConstants.DEFAULT_COUNTRY_FR;
  public defaultPhoneCountryGb = PhoneConstants.DEFAULT_COUNTRY_GB;
  public isUpdateMode = false;
  public hasError: boolean[] = [];
  private deletedPhones = NumberConstant.ZERO;
  @Input() idTiers: number;
  public hasUpdateCustomerPermission = false;
  public haveUpdateSupplierPermission = false;
  @Input()
  public canCheck: boolean;

  /**
   *
   * @param fb
   * @param validationService
   * @param contactService
   * @param swalWarring
   */
  constructor(private fb: FormBuilder, private validationService: ValidationService,
              private swalWarring: SwalWarring, private authService: AuthService) {
  }

  ngOnInit() {
    this.hasUpdateCustomerPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.UPDATE_CUSTOMER);
    this.haveUpdateSupplierPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.UPDATE_SUPPLIER);

    if (this.idTiers && this.idTiers > NumberConstant.ZERO && !this.hasUpdateCustomerPermission && !this.haveUpdateSupplierPermission && !this.isBankAgency && !this.isOffice &&
      !this.isCompanySetup
      || (this.isBankAgency && !this.hasUpdatePhone) || (this.isOffice && !this.hasUpdatePhone) ||
      (this.isCompanySetup && !this.hasUpdatePhone)) {
      this.Phone.disable();
    }
  }

  public get Phone(): FormArray {
    return this.parentFormGroup.get(PhoneConstants.PHONE) as FormArray;
  }

  public addPhone(phone?) {
    if (phone) {
      this.Phone.push(this.buildPhoneContact(phone));
    } else {
      this.addEmptyPhone();
    }
  }

  deletePhone(phone: AbstractControl, index) {
    if (this.Phone.length > NumberConstant.ONE) {
      this.swalWarring.CreateDeleteSwal(PhoneConstants.PHONE_ELEMENT, PhoneConstants.PHONE_PRONOUN).then((result) => {
        if (result.value) {
          this.countryCode.splice(index, NumberConstant.ONE);
          this.checkIsNewPhone(phone.value.Id, index);
          this.hasError.splice(index, NumberConstant.ONE);
        }
      });
    }
  }

  private checkIsNewPhone(id, index) {
    if (id !== NumberConstant.ZERO) {
      this.Phone.at(index).get(PhoneConstants.IS_DELETED).setValue(true);
      const phoneToDelete = this.Phone.at(index);
      this.Phone.controls.splice(index, NumberConstant.ONE);
      this.Phone.controls.push(phoneToDelete);
      this.deletedPhones++;
    } else {
      this.Phone.removeAt(index);
    }
  }

  onCountryChange(event, index) {
    this.countryCode[index] = event.iso2;
    this.dialCode[index] = event.dialCode;
    this.Phone.controls[index].get(PhoneConstants.PHONE_DIAL_CODE).setValue(event.dialCode);
    this.Phone.controls[index].get(PhoneConstants.PHONE_COUNTRY_CODE).setValue(event.iso2);
  }

  private addEmptyPhone() {
    this.isUpdateMode = false;
    if (this.Phone.valid) {
      this.Phone.insert(this.Phone.controls.length - this.deletedPhones,
        this.buildPhoneContact());
    } else {
      this.validationService.validateAllFormFields(this.parentFormGroup);
    }
  }

  private buildPhoneContact(phone?) {
    return this.fb.group({
      Id: [phone ? phone.Id : NumberConstant.ZERO],
      Number: [phone ? phone.Number : EMPTY_STRING],
      DialCode: [phone ? phone.DialCode : this.dialCode[NumberConstant.ZERO]],
      CountryCode: [phone ? phone.CountryCode : this.countryCode[NumberConstant.ZERO]],
      IsDeleted: [false]
    });
  }

  isPhoneRowVisible(ph) {
    return !ph.value.IsDeleted;
  }

  isLastAndIsDeletedFalse(phone: AbstractControl) {
    const phones = this.Phone.controls.filter(phoneControl => phoneControl.value.IsDeleted === false);
    return phones[phones.length - NumberConstant.ONE] === phone;
  }

  onError(isValidPhone, phoneControl: AbstractControl, index) {
    this.hasError[index] = !isValidPhone;
    if (isValidPhone || isNullOrEmptyString(phoneControl.value.Number)) {
      phoneControl.setErrors(null);
      phoneControl.markAsUntouched();
      this.hasError[index] = false;
    } else {
      phoneControl.setErrors({'wrongPattern': Validators.pattern});
      phoneControl.markAsTouched();
    }
    this.phoneHasErrorEvent.emit(this.hasError);
  }

  /**
   * onChanges life cycle
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (this.canCheck ) {
      if (isNotNullOrUndefinedAndNotEmptyValue(changes.phoneToUpdate.currentValue) &&
        changes.phoneToUpdate.currentValue.length > NumberConstant.ZERO) {
        this.isUpdateMode = true;
        this.countryCode = new Array(changes.phoneToUpdate.currentValue.length);
        changes.phoneToUpdate.currentValue.forEach((value, index) => {
          this.countryCode[index] = value.CountryCode.toString().trim();
          this.hasError.push(false);
          this.addPhone(value);
        });
      } else if (isNotNullOrUndefinedAndNotEmptyValue(changes.parentFormGroup)) {
        this.hasError.push(false);
        this.addEmptyPhone();
      }
    }}

}
