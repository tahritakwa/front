import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {AbstractControl, FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {isNumeric, ValidationService, customEmailValidator} from '../../services/validation/validation.service';
import {SwalWarring} from '../swal/swal-popup';
import {TranslateService} from '@ngx-translate/core';
import {TiersConstants} from '../../../constant/purchase/tiers.constant';
import {NumberConstant} from '../../../constant/utility/number.constant';
import {ContactService} from '../../../purchase/services/contact/contact.service';
import {ContactConstants} from '../../../constant/crm/contact.constant';
import {FileInfo} from '../../../models/shared/objectToSend';
import {isNotNullOrUndefinedAndNotEmptyValue} from '../../../stark-permissions/utils/utils';
import {isNullOrEmptyString} from '@progress/kendo-angular-grid/dist/es2015/utils';
import {SharedConstant} from '../../../constant/shared/shared.constant';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { PermissionConstant } from '../../../Structure/permission-constant';


@Component({
  selector: 'app-tiers-contact',
  templateUrl: './tiers-contact.component.html',
  styleUrls: ['./tiers-contact.component.scss']
})

export class TiersContactComponent implements OnInit, OnChanges {


  /**
   * Decorator to identify the tiersFormGroup
   */
  @Input()
  public tiersFormGroup: FormGroup;
  /**
   * Decorator to identify the tiersContact
   */
  @Input()
  public tiersContactToUpdate: any;
  /**
   * Decorator to identify the contact label
   */
  @Input()
  public contactLabel = this.translate.instant(TiersConstants.CONTACT);
  /**
   * Decorator to identify collapse "open" action
   */
  @Input()
  public collapseOnOpenAction: boolean;
  /**
   * Decorator to update contact permission action
   */
  @Input()
  public hasUpdateContactPermission: boolean;
  /**
   * Decorator to agence action
   */
  @Input()
  public isBankAgency: boolean;
  /**
   * Decorator to office action
   */
  @Input()
  public isOffice: boolean;
  /**
   * Decorator to company setup action
   */
  @Input()
  public isCompanySetup: boolean;
  /**
   * Decorator to identify if the phone componenet is valid
   */
  @Output()
  public phoneHasErrorEvent: EventEmitter<boolean[]> = new EventEmitter();

  /**
   * array of contact label with boolean flag
   */
  public contactLabelEditable: boolean[] = [];
  /**
   * flag of boolean  to identify  contact label state
   */
  public isUpdate: boolean[] = [];
  /**
   * phone to update  ( case update mode)
   */
  public phoneToUpdate = [];
  /**
   * array of contact picture source
   */
  public picturesContactsSrc: any[] = [];
  /**
   * array of contact picture file info
   */
  public picturesFileInfo: FileInfo[] = [];

  /**
   * uiid
   */
  public uuid = Math.floor(Math.random() * NumberConstant.ONE_THOUSAND);
  @Input()
  public typeTier;
  public hasUpdateCustomerPermission = false;
  public hasUpdateSupplierPermission = false;
  idTiers = NumberConstant.ZERO;

  public static isEmptyContactFields(contact) {
    return isNullOrEmptyString(contact.FirstName) && isNullOrEmptyString(contact.LastName)
      && isNullOrEmptyString(contact.Email) && isNullOrEmptyString(contact.Fax1) &&
      (isNullOrEmptyString(contact.Fonction) && isNullOrEmptyString(contact.Adress));
  }

  /**
   *
   * @param fb
   * @param validationService
   * @param contactService
   * @param swalWarring
   * @param translate
   */
  constructor(private fb: FormBuilder, private validationService: ValidationService,
              private contactService: ContactService,
              private swalWarring: SwalWarring, private translate: TranslateService, private authService: AuthService) {
  }



  ngOnInit() {
    this.idTiers = this.tiersFormGroup.value.Id;
    this.hasUpdateCustomerPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.UPDATE_CUSTOMER);
    this.hasUpdateSupplierPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.UPDATE_SUPPLIER);
  }

  public get contact(): FormArray {
    return this.tiersFormGroup.get(TiersConstants.CONTACT) as FormArray;
  }

  addNewContact() {
    if (this.contact.valid) {
      this.isUpdate[this.isUpdate.length + NumberConstant.ONE] = false;
      this.contactLabelEditable.push(false);
      this.contact.push(this.buildContactForm());
    } else {
      this.validationService.validateAllFormFields(this.tiersFormGroup);
    }
  }

  public deleteContact(contact: AbstractControl, index) {
    this.swalWarring.CreateDeleteSwal(ContactConstants.CONTACT_ELEMENT, ContactConstants.PRONOUN_CE).then((result) => {
      if (result.value) {
        this.picturesFileInfo = null;
        this.picturesContactsSrc = null;
        this.checkIsNewContact(contact.value.Id, index);
        this.contactLabelEditable.splice(index, NumberConstant.ONE);
      }
    });
  }

  private buildContactForm(tiersContact?): FormGroup {
    return this.fb.group({
      Id: [tiersContact ? tiersContact.Id : NumberConstant.ZERO],
      IdTiers: [tiersContact ? tiersContact.IdTiers : null],
      IdCompany: [tiersContact ? tiersContact.IdCompany : null],
      Label: [tiersContact ? tiersContact.Label : this.contactLabel],
      FirstName: [tiersContact ? tiersContact.FirstName : SharedConstant.EMPTY
        , Validators.required],
      LastName: [tiersContact ? tiersContact.LastName : SharedConstant.EMPTY, Validators.required],
      Phone: this.fb.array([]),
      Fax1: [tiersContact ? tiersContact.Fax1 : SharedConstant.EMPTY, isNumeric()],
      Email: [tiersContact ? tiersContact.Email : SharedConstant.EMPTY, Validators.pattern(SharedConstant.MAIL_PATTERN)],
      Fonction: [tiersContact ? tiersContact.Fonction : SharedConstant.EMPTY],
      Adress: [tiersContact ? tiersContact.Adress : SharedConstant.EMPTY],
      IsDeleted: [false],
      PictureFileInfo: [tiersContact ? tiersContact.PictureFileInfo : SharedConstant.EMPTY],
      UrlPicture: [tiersContact ? tiersContact.UrlPicture : SharedConstant.EMPTY],
      PictureToDelete: [false],
      CreationDate: [tiersContact? tiersContact.CreationDate : null],
      WasLead: ['false']
    });
  }


  /**
   * change contact flag
   * @param index
   * @param value
   */
  editContactLabel(index, value) {
    this.contactLabelEditable[index] = value;
    this.isUpdate[index] = true;
  }

  /**
   * check if TiersContact is new by Id
   * @param id
   * @param index
   * @private
   */
  private checkIsNewContact(id, index) {
    if (id !== NumberConstant.ZERO) {
      this.contact.at(index).get(ContactConstants.IS_DELETED).setValue(true);
      Object.keys((this.contact.at(index) as FormGroup).controls).forEach(key => {
        (this.contact.at(index) as FormGroup).get(key).setErrors(null);
      });
    } else {
      this.contact.removeAt(index);
    }
  }

  /**
   *
   * @param event
   * @param index
   */
  uplodadPicture(event, index) {
    const file = event.target.files[NumberConstant.ZERO];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      if(file.type.startsWith("image/")){
      reader.onload = () => {
        this.picturesFileInfo[index] = new FileInfo();
        this.picturesFileInfo[index].Name = file.name;
        this.picturesFileInfo[index].Extension = file.type;
        this.picturesFileInfo[index].FileData = (<string>reader.result).split(',')[1];
        this.picturesContactsSrc[index] = reader.result;

        this.contact.at(index).get('PictureFileInfo').setValue(this.picturesFileInfo[index]);
        this.contact.at(index).get('PictureToDelete').setValue(false);
        this.contact.at(index).get('UrlPicture').setValue(this.picturesFileInfo[index].Data);
      };
    }
  }
  }

  /**
   * check f contact row is visible by IsDeleted flag
   * @param contact
   */
  isContactRowVisible(contact) {
    return !contact.value.IsDeleted;
  }

  /**
   * check if contact phone is valid format
   * @param phoneHasError
   */
  isContactPhoneHasError(phoneHasError: boolean[]) {
    this.phoneHasErrorEvent.emit(phoneHasError);
  }

  /**
   * remove contact picture
   * @param event
   * @param i
   */
  removeContactPicture(event, i, contact) {
    event.preventDefault();
    this.swalWarring.CreateDeleteSwal(ContactConstants.PICTURE_ELEMENT, ContactConstants.PRONOUN_CETTE).then((result) => {
      if (result.value) {
        this.picturesFileInfo[i] = null;
        this.picturesContactsSrc[i] = null;
        contact.controls['PictureToDelete'].setValue(true);
        contact.get('UrlPicture').setValue(null);
        contact.get('PictureFileInfo').setValue(null);
      }
    });
  }

  /**
   * load contact picture
   * @param contact
   * @param index
   * @private
   */
  private loadContactPicture(contact, index) {
    if (isNotNullOrUndefinedAndNotEmptyValue(contact.PictureFileInfo)) {
      this.picturesContactsSrc[index] = SharedConstant.PICTURE_BASE + contact.PictureFileInfo.Data;
    }
  }

  /**
   * load contact in update mode
   * @param changes
   * @private
   */
  private getContactToUpdate(changes: SimpleChanges) {
    changes.tiersContactToUpdate.currentValue.forEach((value, index) => {
      this.isUpdate[index] = true;
      this.loadContactPicture(value, index);
      this.contactLabelEditable.push(false);
      this.contact.push(this.buildContactForm(value));
      this.phoneToUpdate[index] = value.Phone;
    });
  }

  /**
   * onChanges life cycle
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.collapseOnOpenAction !== undefined && changes.collapseOnOpenAction.currentValue && !this.isBankAgency) {
      this.addNewContact();
    } else if (changes.tiersContactToUpdate !== undefined && changes.tiersContactToUpdate.currentValue !== undefined
      && changes.tiersContactToUpdate.currentValue.length > NumberConstant.ZERO) {
      this.getContactToUpdate(changes);
    }
  }

}
