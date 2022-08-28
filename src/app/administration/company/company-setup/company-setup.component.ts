import {Component, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {Company} from '../../../models/administration/company.model';
import {Subscription} from 'rxjs/Subscription';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {EntityAxisValues, FileInfo, ObjectToSave} from '../../../models/shared/objectToSend';
import {CompanyService} from '../../services/company/company.service';
import {ValidationService, unique, isNumeric, customEmailValidator} from '../../../shared/services/validation/validation.service';
import {FormModalDialogService} from '../../../shared/services/dialog/form-modal-dialog/form-modal-dialog.service';
import {CompanyConstant} from '../../../constant/Administration/company.constant';
import {SwalWarring} from '../../../shared/components/swal/swal-popup';
import {SharedConstant} from '../../../constant/shared/shared.constant';
import {GrowlService} from '../../../../COM/Growl/growl.service';
import {TranslateService} from '@ngx-translate/core';
import {TimeSheetService} from '../../../rh/services/timesheet/timesheet.service';
import {NumberConstant} from '../../../constant/utility/number.constant';
import {ActivitySectorsEnum} from '../../../models/shared/enum/activitySectors.enum';
import {EnumValues} from 'enum-values';
import {TiersConstants} from '../../../constant/purchase/tiers.constant';
import {ContactConstants} from '../../../constant/crm/contact.constant';
import {TiersContactComponent} from '../../../shared/components/tiers-contact/tiers-contact.component';
import {TiersAddressComponent} from '../../../shared/components/tiers-address/tiers-address.component';
import {NgxImageCompressService} from 'ngx-image-compress';
import {StarkRolesService} from '../../../stark-permissions/service/roles.service';
import {RoleConfigConstant} from '../../../Structure/_roleConfigConstant';
import {DayOfWeek} from '../../../models/enumerators/day-of-week.enum';
import {Contact} from '../../../models/shared/contact.model';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { PermissionConstant } from '../../../Structure/permission-constant';

const TIMEZONES_JSON = require('angular-timezone/timezones.json');

@Component({
  selector: 'app-company-setup',
  templateUrl: './company-setup.component.html',
  styleUrls: ['./company-setup.component.scss']
})

export class CompanySetupComponent implements OnInit {
  /*
 * id Subscription
 */
  public idSubscription: Subscription;
  public companySubscription: Subscription;

  public pictureCompanySrc: any;
  public pictureFileInfo: FileInfo;
  public companyToUpdate: Company;

  public companyFormGroup: FormGroup;
  public purchaseSettingsFormGroup: FormGroup;
  public timesheetFormGroup: FormGroup;
  public payFormGroup: FormGroup;

  public cnssAffiliationMask: string;

  public invoicingEndMonthVariable = true;
  public designationEditionVariable = true;
  public activeDesignationEdition = true;
  public activeRelationSupplierItems =true;
  public timeSheetPerDay = false;
  public payDependOnTimesheetVariable = false;
  public activeNoteRequired =false;

  public companyContacts = [];
  public companyAdresses = [];
  public collapseAddressOpened = false;
  public collapseContactOpened = false;
  public contactPhoneHasError = false;

  public activityAreas = [];
  public activityAreasFiltred = [];
  public openTiersContactsCollapse = false;
  public openAddressDetailsCollapse = false;
  public openFinancialInformationsCollapse = false;
  public timeZones: any = [];
  public timeZonesFiltred: any = [];
  public mondayVariable = false;
  public tuesDayVariable = false;
  public wednesdayVariable = false;
  public thursdayVariable = false;
  public fridayVariable = false;
  public saturdayVariable = false;
  public sundayVariable = false;
  public havePayrollRole = false;
  public haveTimesheetRole = false;
  public hasUpdateCompanyPermission: boolean;
  public hasShowRhTabPermission: boolean;
  public hasShowPayTabPermission: boolean;
  public havePurchaseResponsibleRole: boolean;
  public hrFormGroup: FormGroup;
  public payrollFormGroup: FormGroup;
  public dayOfWeekFormGroup: FormGroup;
  constructor(private fb: FormBuilder,
              private formModalDialogService: FormModalDialogService,
              public companyService: CompanyService,
              private swalWarrings: SwalWarring,
              private viewRef: ViewContainerRef,
              private validationService: ValidationService,
              private growlService: GrowlService,
              private translate: TranslateService,
              private timeSheetService: TimeSheetService,
              private roleService: StarkRolesService,
              private authService: AuthService,
              private imageCompress: NgxImageCompressService) {
  }

  ngOnInit() {
    this.hasUpdateCompanyPermission = this.authService.hasAuthority(PermissionConstant.SettingsRHAndPaiePermissions.UPDATE_COMPANY);
    this.hasShowRhTabPermission = this.authService.hasAuthority(PermissionConstant.SettingsRHAndPaiePermissions.RH_VIEW_COMPANY);
    this.hasShowPayTabPermission = this.authService.hasAuthority(PermissionConstant.SettingsRHAndPaiePermissions.PAYROLL_VIEW_COMPANY);
    this.companyToUpdate = new Company();
    this.createAddForm();
    this.getCurrentCompany();
    this.initActivityAreas();
    this.loadcnssAffiliationMask();
    this.timeZones = TIMEZONES_JSON;
    this.timeZonesFiltred = TIMEZONES_JSON;
  }

  isContactPhoneHasError(contactPhoneValid: boolean[]) {
    if (contactPhoneValid.includes(true)) {
      this.contactPhoneHasError = true;
    }
  }

  /**
   * get current company
   */

  public getCurrentCompany() {
    this.companySubscription = this.companyService.getCurrentCompanyWithContactPictures().subscribe((data: Company) => {
      // Set companytoUpdate with the companty data return by the service
      this.companyToUpdate = data;
      this.companyToUpdate.IdCurrencyNavigation = null;

      // If data is not null
      if (this.companyToUpdate) {
        // set variables
        this.activeNoteRequired = this.companyToUpdate.NoteIsRequired;
        this.initCompanyAdresses();
        this.initCompanyContacts();
        if (this.companyToUpdate.AttachmentUrl) {
          this.companyService.getPicture(this.companyToUpdate.AttachmentUrl).subscribe((res: any) => {
            this.pictureCompanySrc = SharedConstant.PICTURE_BASE + res;
          });
        }
        this.timeSheetPerDay = this.companyToUpdate.TimeSheetPerHalfDay;
        this.payDependOnTimesheetVariable = this.companyToUpdate.PayDependOnTimesheet;
        // create and set form group
        this.companyFormGroup.patchValue(this.companyToUpdate);
        if (this.companyToUpdate.PurchaseSettings != null) {
          this.purchaseSettingsFormGroup.patchValue(this.companyToUpdate.PurchaseSettings);
        }
        if (this.companyToUpdate.DaysOfWeekWorked) {
          this.mondayVariable = this.companyToUpdate.DaysOfWeekWorked.some(x => x === DayOfWeek.Monday);
          this.tuesDayVariable = this.companyToUpdate.DaysOfWeekWorked.some(x => x === DayOfWeek.Tuesday);
          this.wednesdayVariable = this.companyToUpdate.DaysOfWeekWorked.some(x => x === DayOfWeek.Wednesday);
          this.thursdayVariable = this.companyToUpdate.DaysOfWeekWorked.some(x => x === DayOfWeek.Thursday);
          this.fridayVariable = this.companyToUpdate.DaysOfWeekWorked.some(x => x === DayOfWeek.Friday);
          this.saturdayVariable = this.companyToUpdate.DaysOfWeekWorked.some(x => x === DayOfWeek.Saturday);
          this.sundayVariable = this.companyToUpdate.DaysOfWeekWorked.some(x => x === DayOfWeek.Sunday);
        }
        this.activeDesignationEdition = this.companyToUpdate.AllowEditionItemDesignation;
        this.activeRelationSupplierItems= this.companyToUpdate.AllowRelationSupplierItems;
        this.timesheetFormGroup.patchValue(this.companyToUpdate);
        this.payFormGroup.patchValue(this.companyToUpdate);
        this.checkCollapsesOnUpdate();
        if (!this.hasUpdateCompanyPermission) {
             this.companyFormGroup.disable();
             this.payFormGroup.disable();
             this.timesheetFormGroup.disable();
        }
      }
    });
    this.roleService.hasOnlyRoles([RoleConfigConstant.SESSION_PAIE])
      .then(x => {
        this.havePayrollRole = x;
      });
    this.roleService.hasOnlyRoles([RoleConfigConstant.Resp_RhConfig])
      .then(x => {
        this.haveTimesheetRole = x;
      });
  }

  /**
   * Load the social security number mask
   */
  loadcnssAffiliationMask() {
    this.cnssAffiliationMask = CompanyConstant.CNSS_AFFILIATION_MASK;
  }

  public clickTimeSheetPerHalfDay() {
    this.timeSheetPerDay = !this.timeSheetPerDay;
    this.TimeSheetPerHalfDay.setValue(this.timeSheetPerDay);
  }

  public clickPayDependOnTimesheet() {
    this.payDependOnTimesheetVariable = !this.payDependOnTimesheetVariable;
    this.PayDependOnTimesheet.setValue(this.payDependOnTimesheetVariable);
  }

  public clickMonday() {
    this.mondayVariable = !this.mondayVariable;
    this.Monday.setValue(this.mondayVariable);
  }

  public clickTuesday() {
    this.tuesDayVariable = !this.tuesDayVariable;
    this.Tuesday.setValue(this.tuesDayVariable);
  }

  public clickWednesday() {
    this.wednesdayVariable = !this.wednesdayVariable;
    this.Wednesday.setValue(this.wednesdayVariable);
  }

  public clickThursday() {
    this.thursdayVariable = !this.thursdayVariable;
    this.Thursday.setValue(this.thursdayVariable);
  }

  public clickFriday() {
    this.fridayVariable = !this.fridayVariable;
    this.Friday.setValue(this.fridayVariable);
  }

  public clickSaturday() {
    this.saturdayVariable = !this.saturdayVariable;
    this.Saturday.setValue(this.saturdayVariable);
  }

  public clickSunday() {
    this.sundayVariable = !this.sundayVariable;
    this.Sunday.setValue(this.sundayVariable);
  }

  private initActivityAreas() {
    const activityAreas = EnumValues.getNamesAndValues(ActivitySectorsEnum);
    this.activityAreas = activityAreas.map((activityArea: any) => {
      return activityArea = { enumValue: activityArea.value, enumText: this.translate.instant(activityArea.name) };
    });
    this.activityAreasFiltred = this.activityAreas;
  }

  public handleFiltreActivityAreas(value) {
    this.activityAreas = this.activityAreasFiltred.filter(o => o.enumText.toLowerCase().indexOf(value.toLowerCase()) !== -1);
  }

  /**
   * Build contact form
   */
  private generateContactForm(contact: Contact): FormGroup {
    return this.fb.group({
      Id: [contact.Id],
      FirstName: [contact.FirstName, Validators.required],
      LastName: [contact.LastName, Validators.required],
      Tel1: [contact.Tel1, [Validators.required]],
      Fax1: [contact.Fax1],
      Email: [contact.Email, Validators.pattern(SharedConstant.MAIL_PATTERN)],
      Adress: [contact.Adress],
      Fonction: [contact.Fonction],
      IsDeleted: [contact.IsDeleted]
    });
  }

  /**
   * generate contact
   */
  generateContact(contact: Contact): void {
    this.Contact.push(this.generateContactForm(contact));
  }

  /**
   * delete contact
   * @param i
   */
  deleteContact(i: number): void {
    if (this.Contact.at(i).get('Id').value === 0) {
      this.Contact.removeAt(i);
    } else {
      this.Contact.at(i).get('IsDeleted').setValue(true);
    }
  }

  /**
   * Build contact form
   */
  private buildContactForm(): FormGroup {
    return this.fb.group({
      Id: [0],
      FirstName: ['', Validators.required],
      LastName: ['', Validators.required],
      Tel1: ['', [Validators.required, isNumeric()]],
      Fax1: [''],
      Email: ['', Validators.pattern(SharedConstant.MAIL_PATTERN)],
      Adress: [''],
      Fonction: [''],
      IsDeleted: [false]
    });
  }

  /**
   * add new contact
   */
  addContact(): void {
    this.Contact.push(this.buildContactForm());
  }

  /**
   * show/hide contact
   * @param i
   */
  isRowVisible(i): boolean {
    return !this.Contact.at(i).get('IsDeleted').value;
  }

  /**
   * Upload Picture Related To Employes
   * @param event
   */
  public uploadPictureFile(event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      if (file.type.startsWith("image/")) {
        reader.onload = (e: any) => {
          this.pictureFileInfo = new FileInfo();
          this.pictureFileInfo.Name = file.name;
          this.pictureFileInfo.Extension = file.type;
          this.pictureCompanySrc = reader.result;
          this.compressFile(reader.result);    
        };
      }
    }
  }

  compressFile(image) {
    const orientation = -1;
    this.imageCompress.compressFile(image, orientation, 50, 50).then(
      result => {
        this.pictureFileInfo.FileData = (result).split(',')[1];
      });
  }

  /**
   * on  save
   * */
  public save(): void {
    if (this.companyFormGroup.valid && this.purchaseSettingsFormGroup.valid) {
      const object: ObjectToSave = new ObjectToSave();
      let model: Company = Object.assign({}, this.companyToUpdate, this.companyFormGroup.value);
      model = Object.assign(model, this.timesheetFormGroup.getRawValue());
      model = Object.assign(model, this.payFormGroup.getRawValue());
      model.PurchaseSettings = Object.assign({}, this.companyToUpdate.PurchaseSettings, this.purchaseSettingsFormGroup.value);
      model.SaleSettings = Object.assign({}, this.companyToUpdate.SaleSettings, this.purchaseSettingsFormGroup.value);
      // assign company to contacts
      if (model.Contact !== null) {
        for (const contact of model.Contact) {
          contact.IdCompany = this.companyToUpdate.Id;
        }
      }
      // assign company to adresses
      if (model.Address !== null) {
        for (const address of model.Address) {
          address.IdCompany = this.companyToUpdate.Id;
        }
      }
      // save file
      model.PictureFileInfo = this.pictureFileInfo;
      model.Logo = this.pictureCompanySrc;
      object.Model = model;
      object.EntityAxisValues = Array<EntityAxisValues>();
      this.SetDaysWorkedList(object);
      object.Model.IdDefaultTaxNavigation = null;
      this.companyService.updateCompany(object).subscribe(() => {
        this.ngOnInit();
      });
    } else {
      this.checkCollapseAddressCollapse();
      this.checkCollapseContactCollapse();
      this.checkFinancialInformationCollapse();
      this.validationService.validateAllFormFields(this.companyFormGroup);
      this.growlService.warningNotification(this.translate.instant(CompanyConstant.CHECK_INFORMATIONS));
    }

  }

  private SetDaysWorkedList(object: ObjectToSave) {
    object.Model.DaysOfWeekWorked = new Array<number>();
    if (!this.payDependOnTimesheetVariable) {
      if (this.mondayVariable) {
        object.Model.DaysOfWeekWorked.push(DayOfWeek.Monday);
      }
      if (this.tuesDayVariable) {
        object.Model.DaysOfWeekWorked.push(DayOfWeek.Tuesday);
      }
      if (this.wednesdayVariable) {
        object.Model.DaysOfWeekWorked.push(DayOfWeek.Wednesday);
      }
      if (this.thursdayVariable) {
        object.Model.DaysOfWeekWorked.push(DayOfWeek.Thursday);
      }
      if (this.fridayVariable) {
        object.Model.DaysOfWeekWorked.push(DayOfWeek.Friday);
      }
      if (this.saturdayVariable) {
        object.Model.DaysOfWeekWorked.push(DayOfWeek.Saturday);
      }
      if (this.sundayVariable) {
        object.Model.DaysOfWeekWorked(DayOfWeek.Sunday);
      }
    } else {
      object.Model.DaysOfWeekWorked = null;
    }
  }

  activateDesignationEdition() {
    this.activeDesignationEdition = !this.activeDesignationEdition;
    this.companyFormGroup.controls[CompanyConstant.ALLOW_EDITION_ITEM_DESIGNATION].setValue(this.activeDesignationEdition);
  }
  activateRelationSupplierItems() {
    this.activeRelationSupplierItems = !this.activeRelationSupplierItems;
    this.companyFormGroup.controls[CompanyConstant.ALLOW_RELATION_SUPPLIER_ITEMS].setValue(this.activeRelationSupplierItems);
  }

  activateNote() {
    this.activeNoteRequired = !this.activeNoteRequired;
    this.companyFormGroup.controls[CompanyConstant.NOTE_IS_REQUIRED].setValue(this.activeNoteRequired);
  }

  /**
   * Create the company form
   */
  private createAddForm() {
    this.purchaseSettingsFormGroup = this.fb.group({
      FiscalStamp: ['', Validators.min(NumberConstant.ONE)],
      IdPurchasingManager: [''],

    });

    this.timesheetFormGroup = this.fb.group({
      TimeSheetPerHalfDay: [false],
      AutomaticCandidateMailSending: [false]
    });

    this.payFormGroup = this.fb.group({
      PayDependOnTimesheet: [false],
      Category: [''],
      DaysOfWork: ['', [Validators.max(NumberConstant.THIRTY_ONE), Validators.min(NumberConstant.TWENTY)]]
    });
    this.dayOfWeekFormGroup = this.fb.group({
      Monday: [false],
      Tuesday: [false],
      Wednesday: [false],
      Thursday: [false],
      Friday: [false],
      Saturday: [false],
      Sunday: [false],
    });
    this.companyFormGroup = this.fb.group({
      Id: [0],
      Name: ['', [Validators.required]],
      Siret: [''],
      VatNumber: [''],
      MatriculeFisc: [''],
      CommercialRegister: [''],
      IdCurrency: ['', [Validators.required]],
      WithholdingTax: [true, Validators.required],
      CnssAffiliation: ['', [Validators.minLength(CompanyConstant.SOCIAL_SECURITY_NUMBER_LENGTH),
      Validators.maxLength(CompanyConstant.SOCIAL_SECURITY_NUMBER_LENGTH)]],
      AmputationPerHour: [true],
      TimeInterval: [Validators.min(NumberConstant.TEN)],
      WebSite: [''],
      Contact: this.fb.array([]),
      Address: this.fb.array([]),
      ActivityArea: [''],
      Timezone: [''],
      Email: ['', Validators.pattern(SharedConstant.MAIL_PATTERN)],
      Tel1: [''],
      IdZipCode: [{ value: '' }, [Validators.required]],
      AllowRelationSupplierItems: [false, Validators.required],
      AllowEditionItemDesignation: [false, Validators.required],
      IdDefaultTax: [''],
      IdTaxe: [''],
      FiscalStamp: ['', [Validators.min(NumberConstant.ZERO)]],
      NoteIsRequired: [false, Validators.required]
    });
  }

  /**
   * getters
   */
  get Contact(): FormArray {
    return this.companyFormGroup.get(CompanyConstant.CONTACT) as FormArray;
  }

  get WebSite(): FormControl {
    return this.companyFormGroup.get(CompanyConstant.WEBSITE) as FormControl;
  }

  get Tel1(): FormControl {
    return this.companyFormGroup.get(CompanyConstant.TEL_1) as FormControl;
  }

  // purchaseSettingsFormGroup getters
  get PurchaseOtherTaxes(): FormControl {
    return this.purchaseSettingsFormGroup.get(CompanyConstant.PURCHASE_OTHER_TAXES) as FormControl;
  }

  get FiscalStamp(): FormControl {
    return this.companyFormGroup.get(CompanyConstant.FISCAL_STAMP) as FormControl;
  }

  get IdPurchasingManager(): FormControl {
    return this.purchaseSettingsFormGroup.get(CompanyConstant.ID_PURCHASING_MANAGER) as FormControl;
  }

  get AllowEditionItemDesignation(): FormControl {
    return this.companyFormGroup.get(CompanyConstant.ALLOW_EDITION_ITEM_DESIGNATION) as FormControl;
  }

  get Email(): FormControl {
    return this.companyFormGroup.get(CompanyConstant.EMAIL) as FormControl;
  }
  get AllowRelationSupplierItems(): FormControl {
    return this.companyFormGroup.get(CompanyConstant.ALLOW_RELATION_SUPPLIER_ITEMS) as FormControl;
  }

  get NoteIsRequired(): FormControl {
    return this.companyFormGroup.get(CompanyConstant.NOTE_IS_REQUIRED) as FormControl;
  }
  /**
   * AmputationPerHour getter
   */
  get TimeSheetPerHalfDay(): FormControl {
    return this.timesheetFormGroup.get(CompanyConstant.TIMESHEET_PER_HALF_DAY) as FormControl;
  }

  get PayDependOnTimesheet(): FormControl {
    return this.payFormGroup.get(CompanyConstant.PAY_DEPEND_ON_TIMESHEET) as FormControl;
  }

  get DaysOfWork(): FormControl {
    return this.payFormGroup.get(CompanyConstant.DAYS_OF_WORK) as FormControl;
  }

  get Name(): FormControl {
    return this.companyFormGroup.get(CompanyConstant.NAME) as FormControl;
  }

  get Siret(): FormControl {
    return this.companyFormGroup.get(CompanyConstant.SIRET) as FormControl;
  }

  get VatNumber(): FormControl {
    return this.companyFormGroup.get(CompanyConstant.VAT_NUMBER) as FormControl;
  }

  get MatriculeFisc(): FormControl {
    return this.companyFormGroup.get(CompanyConstant.MATRICULE_FISC) as FormControl;
  }

  get CommercialRegister(): FormControl {
    return this.companyFormGroup.get(CompanyConstant.COMMERCIAL_REGISTER) as FormControl;
  }

  get IdCurrency(): FormControl {
    return this.companyFormGroup.get(CompanyConstant.ID_CURRENCY) as FormControl;
  }

  get CnssAffiliation(): FormControl {
    return this.companyFormGroup.get(CompanyConstant.CNSS_AFFILIATION) as FormControl;
  }

  get Category(): FormControl {
    return this.payFormGroup.get(CompanyConstant.CATEGORY) as FormControl;
  }

  public openAddressDetailCollapse() {
    if (this.companyFormGroup.value.Address && this.companyFormGroup.value.Address.length === NumberConstant.ZERO) {
      this.collapseAddressOpened = true;
    }
    if (!this.openAddressDetailsCollapse) {
      this.collapseAddressOpened = false;
      this.Address.controls = this.Address.controls
        .filter(adress => !TiersAddressComponent.isEmptyAdressFields(adress.value));
    }
  }

  get Address(): FormArray {
    return this.companyFormGroup.get(TiersConstants.ADDRESS) as FormArray;
  }

  public openContactDetailCollapse() {
    if (this.companyFormGroup.value.Contact && this.companyFormGroup.value.Contact.length === NumberConstant.ZERO) {
      this.collapseContactOpened = true;
    }
    if (!this.openTiersContactsCollapse) {
      this.collapseContactOpened = false;
      this.Contact.controls = this.Contact.controls
        .filter(contact => !TiersContactComponent.isEmptyContactFields(contact.value));
    }
  }

  /**
   * remove empty contact formGroup from formArray on close collapse contact
   */
  private checkCollapseContactCollapse() {
    const contactFormArray = this.companyFormGroup.controls.Contact as FormArray;
    if (contactFormArray.controls.length > 0 && !contactFormArray.valid) {
      this.openTiersContactsCollapse = true;
    }
  }

  /**
   * remove empty address formGroup from formArray on close collapse address
   */
  private checkCollapseAddressCollapse() {
    const addressFormArray = this.companyFormGroup.controls.Address as FormArray;
    if (addressFormArray.controls.length > 0 && !addressFormArray.valid) {
      this.openAddressDetailsCollapse = true;
    }
  }

  /**
   * on update
   */

  private checkCollapsesOnUpdate() {
    if (this.companyToUpdate.Address !== null) {
      if (this.companyToUpdate.Address.length > NumberConstant.ZERO) {
        this.openAddressDetailsCollapse = true;
        this.companyAdresses = this.companyToUpdate.Address;
      }
    }
    if (this.companyToUpdate.Contact !== null) {
      if (this.companyToUpdate.Contact.length > NumberConstant.ZERO) {
        this.openTiersContactsCollapse = true;
        this.companyContacts = this.companyToUpdate.Contact;
      }
    }
  }

  handleTimeZoneFiltreChange(value) {
    this.timeZones = this.timeZonesFiltred.filter(o => o.text.toLowerCase().indexOf(value.toLowerCase()) !== -1);
  }

  removeCompanyPicture(event, i) {
    event.preventDefault();
    this.swalWarrings.CreateDeleteSwal(ContactConstants.PICTURE_ELEMENT, ContactConstants.PRONOUN_CETTE).then((result) => {
      if (result.value) {
        this.pictureCompanySrc = null;
        this.pictureFileInfo = null;
        this.companyToUpdate.Logo = null;
        this.companyToUpdate.AttachmentUrl = null;
      }
    });
  }

  /**
   * init lists
   */

  initCompanyAdresses() {
    if (this.companyToUpdate.Address == null) {
      this.companyToUpdate.Address = [];
    } else {
      this.companyAdresses = this.companyToUpdate.Address;
    }
  }

  initCompanyContacts() {
    if (this.companyToUpdate.Contact == null) {
      this.companyToUpdate.Contact = [];
    } else {
      this.companyContacts = this.companyToUpdate.Contact;
    }
  }

  get IdZipCode(): FormControl {
    return this.companyFormGroup.get(CompanyConstant.ZIPCODE) as FormControl;
  }

  get Monday(): FormControl {
    return this.dayOfWeekFormGroup.get(SharedConstant.MONDAY) as FormControl;
  }

  get Tuesday(): FormControl {
    return this.dayOfWeekFormGroup.get(SharedConstant.TUESDAY) as FormControl;
  }

  get Wednesday(): FormControl {
    return this.dayOfWeekFormGroup.get(SharedConstant.WEDNESDAY) as FormControl;
  }

  get Thursday(): FormControl {
    return this.dayOfWeekFormGroup.get(SharedConstant.THURSDAY) as FormControl;
  }

  get Friday(): FormControl {
    return this.dayOfWeekFormGroup.get(SharedConstant.FRIDAY) as FormControl;
  }

  get Saturday(): FormControl {
    return this.dayOfWeekFormGroup.get(SharedConstant.SATURDAY) as FormControl;
  }

  get Sunday(): FormControl {
    return this.dayOfWeekFormGroup.get(SharedConstant.SUNDAY) as FormControl;

  }

  private checkFinancialInformationCollapse() {
    this.openFinancialInformationsCollapse = !this.FiscalStamp.valid;
  }

  OnselectDefaultTax(event) {
    event = event != undefined ? event : null;
    this.companyFormGroup.controls['IdDefaultTax'].setValue(event);
  }

  deleteTiersPicture() {
    this.pictureFileInfo = new FileInfo();
    this.pictureCompanySrc = null;
  }
}
