import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NumberConstant} from '../../../../constant/utility/number.constant';
import {State} from '@progress/kendo-data-query';
import {PagerSettings} from '@progress/kendo-angular-grid';
import {ContactCrmService} from '../../../services/contactCrmService/contact-crm.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ContactCrm} from '../../../../models/crm/contactCrm.model';
import {TiersService} from '../../../../purchase/services/tiers/tiers.service';
import {SideNavService} from '../../../services/sid-nav/side-nav.service';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {AddProspectComponent} from '../add-prospect/add-prospect.component';
import {ContactConstants} from '../../../../constant/crm/contact.constant';
import {OrganisationConstant} from '../../../../constant/crm/organisation.constant';
import {GrowlService} from '../../../../../COM/Growl/growl.service';
import {TranslateService} from '@ngx-translate/core';
import {ValidationService} from '../../../../shared/services/validation/validation.service';
import {OrganisationService} from '../../../services/organisation/organisation.service';
import {Organisation} from '../../../../models/crm/organisation.model';
import {DomSanitizer} from '@angular/platform-browser';
import {DateToRemember} from '../../../../models/crm/dateToRemember';
import {SwalWarring} from '../../../../shared/components/swal/swal-popup';
import {FileInfo} from '../../../../models/shared/objectToSend';
import {ExactDate} from '../../../../shared/helpers/exactDate';
import {ContactService} from '../../../../purchase/services/contact/contact.service';
import {Address} from '../../../../models/crm/address.model';
import {HttpCrmErrorCodes} from '../../../http-error-crm-codes';
import {CrmConstant} from '../../../../constant/crm/crm.constant';
import {GenericCrmService} from '../../../generic-crm.service';
import {ActionConstant} from '../../../../constant/crm/action.constant';
import {EnumValues} from 'enum-values';
import {LeadSourcesEnum} from '../../../../models/shared/enum/leadSources.enum';
import {PermissionService} from '../../../services/permission/permission.service';
import {Observable} from 'rxjs/Observable';
import {UrlServicesService} from '../../../services/url-services.service';
import {StyleConfigService} from '../../../../shared/services/styleConfig/style-config.service';
import {Filter, Operation, PredicateFormat, Relation} from '../../../../shared/utils/predicate';
import {DropdownService} from '../../../services/dropdowns/dropdown.service';
import {SharedConstant} from '../../../../constant/shared/shared.constant';
import {AuthService} from '../../../../login/Authentification/services/auth.service';
import {PermissionConstant} from '../../../../Structure/permission-constant';
import {Tiers} from '../../../../models/achat/tiers.model';
import {PhoneConstants} from '../../../../constant/purchase/phone.constant';
import {TiersConstants} from '../../../../constant/purchase/tiers.constant';
import {TiersAddressComponent} from '../../../../shared/components/tiers-address/tiers-address.component';



@Component({
  selector: 'app-detail-contact-crm',
  templateUrl: './detail-contact-crm.component.html',
  styleUrls: ['./detail-contact-crm.component.scss']
})
export class DetailContactCrmComponent implements OnInit {

  /**
   * The contact id from url
   */
  public idContact;
  /**
   * The mode either client or prospect
   */
  public isClientMode = false;
  /**
   * The object to be used in html
   */
  public contactData = new ContactCrm();

  public formatDate: string = this.translateService.instant(SharedConstant.DATE_FORMAT);

  public CUSTOMER = 'CUSTOMER';
  public value: string;

  public contactDotNetToUpdate;
  private pageSize = NumberConstant.TEN;

  public salutations: Array<any> = ['MR', 'MRS'];
  public addressFormGroup: FormGroup;
  /**
   * manipulation des dates
   */
  public dateOfBirth;
  public datesToRememberFormGroup: FormGroup;
  public datesToRemTab: Array<Date> = [];
  private idsDateToDelete: number [] = [];
  public toDay = new Date();
  /**
   * The list of organisations
   */
  public organisationsList: Organisation[];
  public organisemFiltredList: Organisation[];
  /**
   constants to be used in the html file
   */
  public DETAILS = 'DETAILS';
  public firstCollapseIsOpened = true;
  public secondCollapseIsOpened = false;

  public datesToRememberCollapseIsOpened = false;
  public emailAlreadyTaken = false;
  public addContactForm: FormGroup;
  public dateChanged = false;

  public organisation = new Organisation();

  uuid = Math.floor(Math.random() * NumberConstant.ONE_THOUSAND);
  public BACK_TO_LIST = 'BACK_TO_LIST';

  public gridState: State = {
    skip: 0,
    take: this.pageSize,

    // Initial filter descriptor
    filter: {
      logic: 'and',
      filters: []
    }
  };

  imageData: string = null;
  prefix;
  public isPossibleToUpdateOrganisation = true;


  public preventOpening = false;
  /**
   * files attributes
   */
  currentFileUpload: File;
  public pathPicture;
  public pictureFileInfo: FileInfo;
  public pictureContactSrc: any;
  changePicture = false;

  public isEmptyAdress: boolean;

  @Input() isArchivingMode = false;
  @Input() fromRelatedArchiving = false;
  @Input() contactDataFromOpportunity;
  @Output() backToOpportunityEvent = new EventEmitter<boolean>();
  @Input() isFromArchive = false;
  @Input() contactDataFromContactsList;
  @Output() backToList = new EventEmitter<void>();
  public adressTodisplay;
  @Input() source: string;

  public sourceType;
  public collapseAddressOpened = false;
  public openAddressDetailsCollapse = false;
  public typeTier = 1;
  public tiersAddress = [];

  pagerSettings: PagerSettings = {
    buttonCount: NumberConstant.FIVE, info: true, type: 'numeric', pageSizes: false, previousNext: true
  };
  private phonesToDelete = [];

  public leadSources = [];
  public prospect = 'PROSPECT';
  public client = 'CLIENT';
  public canUpdatePermission = true;
  public isPermittedOrganisationUpdate = true;
  public contactEntityName = ContactConstants.CONTACT_ENTITY_NAME;
  public parentPermission = 'DETAIL_CONTACT';
  private relatedContactsPermission: any;
  public mail = '';
  public firstPhone = '';
  public firstPhoneIsValid = true;
  public listPhoneValid: boolean[] = [];
  public lastPhoneIsValid = true;
  public CRMPermissions = PermissionConstant.CRMPermissions;
  public organisationClientToUpdate = new Tiers();
  public IdsDateToRemember = [];
  public phoneToUpdate = [];
  public phoneForm: FormGroup;
  public IdTiers = NumberConstant.ZERO;
  @Output()
  public phoneHasErrorEvent: EventEmitter<boolean[]> = new EventEmitter();
  public canCheck: boolean;

  /**
   *
   * @param router
   * @param contactCrmService
   * @param route
   * @param growlService
   * @param translateService
   * @param swallWarning
   * @param validationService
   * @param organisationService
   * @param sidNavService
   * @param fb
   * @param exactDate
   * @param tiersService
   * @param sanitizer
   * @param genericCrmService
   * @param contactDotNetService
   * @param permissionService
   */
  constructor(private router: Router,
              private contactCrmService: ContactCrmService,
              private route: ActivatedRoute,
              private styleConfigService: StyleConfigService,
              private growlService: GrowlService,
              private translateService: TranslateService,
              private swallWarning: SwalWarring,
              private validationService: ValidationService,
              private organisationService: OrganisationService,
              private activatedRoute: ActivatedRoute,
              private sidNavService: SideNavService,
              private fb: FormBuilder,
              private exactDate: ExactDate,
              private urlService: UrlServicesService,
              private tiersService: TiersService,
              public sanitizer: DomSanitizer,
              private genericCrmService: GenericCrmService,
              private contactDotNetService: ContactService,
              private permissionService: PermissionService,
              private dropdownService: DropdownService,
              public authService: AuthService) {
  }

  ngOnInit() {
    this.getDataFromUrl();
    this.getDataToUpdate();
    this.selectedPermission();
    this.prepareSalutations();
    this.initLeadSources();
  }

  getDataFromUrl() {
    this.activatedRoute.params.subscribe(params => {
      this.idContact = +params['id'] || 0;
      this.isClientMode = (params['isClient'] === 'true') || false;
    });
  }

  getDataToUpdate() {
    if (this.isClientMode === true) {
      this.createAddForm(true);
      this.getClientData();
    } else {
      this.createAddForm(false);
      this.getProspectData();
    }
  }

  convertPhoneProspectFromComp(phones): any {
    let phone = [];
    phones.forEach(
      (p) => {
        const data = {
          Id: p.id,
          Number: p.phone,
          CountryCode: p.countryCode + ' ',
          DialCode: p.dialCode,
          IsDeleted: p.isDeleted
        };
        phone.push(data);
      }
    );
    return phone;
  }

  getProspectData() {
    this.contactCrmService.getJavaGenericService().getEntityById(this.idContact).subscribe((data) => {
      this.contactData = data;
      this.phoneToUpdate = this.convertPhoneProspectFromComp(data.phone);

      const contactAddress = [];
      if (data.adress){
        contactAddress.push(
          {
            Id: data.adress.id,
            City: data.adress.city,
            Country: data.adress.country,
            IdCountry: data.adress.idCountry,
            IdCity: data.adress.idCity,
            Label: data.adress.label,
            PrincipalAddress: data.adress.principalAddress,
            Region: data.adress.region,
            CodeZip: data.adress.zipCode,
            ExtraAdress: data.adress.extraAddress,
            IdZipCodeNavigation: {
              Region: data.adress.region,
              Code: data.adress.zipCode,
              IdCity: data.adress.idCity,
              IdCityNavigation: null,
              Id: 0,
              IsDeleted: false,
              TransactionUserId: 0,
              CanEdit: true,
              CanDelete: true,
              CanShow: true,
              CanValidate: true,
              CanPrint: true,
              EntityName: null
            }
          }
        );
    }
      this.tiersAddress = contactAddress;
      //  this.phoneToUpdate = data.phone;
      data.phone.forEach((phone, i) => {

        this.phoneForm.value.Phone[i] = phone;
      });
      this.canCheck = true;
      this.checkContactTypeAndInitForm();
    });
  }

  preparePredicate(): PredicateFormat {
    const predicate: PredicateFormat = new PredicateFormat();
    predicate.Filter = new Array<Filter>();
    predicate.Filter.push(
      new Filter('Id', Operation.eq, this.idContact));
    predicate.Relation = new Array<Relation>();
    predicate.Relation.push.apply(predicate.Relation, [new Relation('IdTiersNavigation')]);
    return predicate;
  }

  getClientData() {
    const predicate = this.preparePredicate();
    this.contactDotNetService.getById(this.idContact).subscribe((data) => {
      if (data) {
        this.IdTiers = data.IdTiers;
        this.contactData = data;
        this.phoneToUpdate = data.Phone;
        this.adressTodisplay = data.Adress;
        this.tiersAddress = [];
          data.Phone.forEach((phone, i) => {

          this.phoneForm.value.Phone[i] = phone;
        });
        this.canCheck = true;


        this.checkContactTypeAndInitForm();
      }
    });
  }

  isContactPhoneHasError(phoneHasError: boolean[]) {
    this.phoneHasErrorEvent.emit(phoneHasError);
  }

  private initLeadSources() {
    this.dropdownService.getAllFiltreByName('SOURCE', 'CONTACT')
      .subscribe(data => {
        if (data) {
          data.forEach((filtreName) => {
              this.leadSources.push(filtreName.name);
            }
          );
        }
      });
  }

  checkUpdateOrganisationPossibility(idContact: number) {
    this.contactCrmService.getJavaGenericService().getData('isRelatedToOpp/' + idContact).subscribe((result) => {
      this.isPossibleToUpdateOrganisation = result.data;
    });
  }

  openOrganisationDropDown(event) {
    if (this.preventOpening === true) {
      event.preventDefault();
    }
    this.preventOpening = false;
  }

  private checkContactTypeAndInitForm() {
    if (this.isClientMode) {
      this.sourceType = ActionConstant.CLIENT_SOURCE_TYPE;
    } else if (!this.isClientMode) {
      this.sourceType = ActionConstant.PROSPECT_SOURCE_TYPE;
      this.loadListOfOrganisations();
      this.checkUpdateOrganisationPossibility(this.idContact);
    }
    this.getContactDetailData();
  }

  getContactDetailData() {
   // this.createAddressForm();
    if (this.contactData) {
      if (!this.isClientMode) {
        this.fillOrganisation();
        //this.checkContactAddress();
        if (this.contactData.photo) {
          this.getBase64File(this.contactData.photo);
        }
        this.fillDatesToRemember(this.contactData);
      } else if (this.isClientMode) {
        this.contactDotNetToUpdate = this.contactData;
        this.contactData = this.fillContactData(this.contactData);
      }
    //  this.initialiseAddress();
      this.setDateOfBirth(this.contactData);
      this.addContactForm.patchValue(this.contactData);
      this.mail = this.contactData.mail;
      this.addContactForm.value.Address = this.tiersAddress;
      this.addContactForm.updateValueAndValidity();
      //  this.initContactPhones();
    }
  }

  checkIfExistInList(): boolean {
    if (this.organisation && this.organisation.id && this.organisemFiltredList) {
      return this.organisemFiltredList.some(org => org.id === this.organisation.id);
    }
    return true;
  }

  private createAddForm(isContactFromDotnetRessource): void {
    this.addContactForm = this.fb.group({
      prefix: [''],
      name: ['', Validators.required],
      lastName: ['', Validators.required],
      organisation: [''],
      poste: ['', Validators.maxLength(NumberConstant.FIFTY)],
      mail: ['', [Validators.pattern(CrmConstant.MAIL_PATTERN), Validators.required]],
      phone: !isContactFromDotnetRessource ? this.fb.array([]) : [NumberConstant.ZERO],
      homePhone: [NumberConstant.ZERO],
      otherPhone: [NumberConstant.ZERO],
      assistantPhone: [NumberConstant.ZERO],
      assistantName: [''],
      fax: [AddProspectComponent.ZERO],
      linkedIn: [''],
      facebook: [''],
      twitter: [''],
      adress: [''],
      Id: [0.5],
      Address: this.fb.array([]),
      address: [''],
      description: [''],
      photo: [''],
      dateOfBirth: [''],
      datesToRemember: this.fb.array([]),
      leadSource: [undefined]

    });
    this.phoneForm = this.fb.group({
      Phone: this.fb.array([])
    });
    this.checkValidators();
  }

  get adress(): FormGroup {
    return this.addContactForm.get(ContactConstants.ADRESS) as FormGroup;
  }

  get phone(): FormGroup {
    return this.addContactForm.get(OrganisationConstant.PHONE_VAL) as FormGroup;
  }

  public validateFirstPhone() {
    this.firstPhoneIsValid = (!this.genericCrmService.isNullOrUndefinedOrEmpty(this.firstPhone) &&
      this.firstPhone.trim().length - NumberConstant.THREE >= NumberConstant.SEVEN);
  }

  get datesToRemember(): FormArray {
    return this.addContactForm.get(ContactConstants.DATES_TO_REMEMBER) as FormArray;
  }

  deleteDateToRemember(i) {
    if ((this.datesToRemember.at(i).get('eventName').value && (!this.datesToRemTab[i])) ||
      (!this.datesToRemember.at(i).get('eventName').value
        && (this.datesToRemTab[i]))) {
      this.swallWarning.CreateSwal(this.translateService.instant(ContactConstants.ANNULER_OPERATION)).then((result) => {
        if (result.value) {
          this.datesToRemember.removeAt(i);
          this.datesToRemTab.splice(i, 1);
        }
      });
    } else if (this.datesToRemember.at(i).get('eventName').value && this.datesToRemTab[i]) {
      this.swallWarning.CreateSwal(this.translateService.instant(ContactConstants.DELETE_DATE)).then((result) => {
        if (result.value) {
          this.datesToRemember.removeAt(i);
          this.datesToRemTab.splice(i, 1);
        }
      });
    } else {
      this.datesToRemember.removeAt(i);
      this.datesToRemTab.splice(i, 1);
    }
    if (this.datesToRemember.at(i).get('id').value) {
      this.idsDateToDelete.push(this.datesToRemember.at(i).get('id').value);
    }
  }

  createDatesToRemForm(dateToRemember?: DateToRemember): FormGroup {
    this.datesToRememberFormGroup = this.fb.group({
      id: [dateToRemember && dateToRemember.id ? dateToRemember.id : ''],
      eventName: new FormControl(dateToRemember ? dateToRemember.eventName : undefined, [Validators.required,
        this.genericCrmService.uniqueValueInFormArray(Observable.of(this.datesToRemember), 'eventName')]),
      date: new FormControl(dateToRemember ? dateToRemember.date : undefined)
    });
    return this.datesToRememberFormGroup;
  }

  addDatesToRemeber(date?: any) {
    date ? this.datesToRemTab.push(date) : this.datesToRemTab.push(null);
    this.datesToRemember.push(this.createDatesToRemForm(date));
  }

  changeDate(event, i: number) {
    this.datesToRemTab[i] = event;
  }

  update() {
    this.emailAlreadyTaken = false;
    this.checkRememberDateEventName();
    this.checkCollapseAddressOnCloseValidation();
    if (this.addContactForm.valid && this.checkLastPhone()) {
      this.checkContactModeAndSave();
    } else {
      this.checkInvalidRememberDateForm();
      this.checkNameControlValidity();
      this.checkMailAndPhoneControlValidity();
      this.validationService.validateAllFormFields(this.addContactForm);
    }
  }

  private checkMailAndPhoneControlValidity() {
    if (this.addContactForm.controls[OrganisationConstant.MAIL].invalid ||
      this.addContactForm.controls[OrganisationConstant.PHONE_VAL].invalid) {
      this.secondCollapseIsOpened = true;
    }
  }

  private checkNameControlValidity() {
    if (this.addContactForm.controls[OrganisationConstant.NAME].invalid) {
      this.firstCollapseIsOpened = true;
    }
  }

  private checkInvalidRememberDateForm() {
    (this.addContactForm.get(OrganisationConstant.DATES_TO_REMIND) as FormArray).controls.forEach((formGr, index) => {
      if (formGr.invalid || this.checkNumberOfEventsName(formGr.get(ContactConstants.EVENT_NAME).value
        || this.datesToRemTab[index] == null)) {
        this.checkNullRememberDate(index);
        this.datesToRememberCollapseIsOpened = true;
      }
    });
  }

  private checkNullRememberDate(index: number) {
    if (this.datesToRemTab[index] == null) {
      this.dateChanged = true;
    }
  }

  private checkContactModeAndSave() {
    if (!this.isClientMode && this.relatedContactsPermission.permissionValidForm) {
      this.updateContact();
    } else {
      const contact = this.convertAddContactFormToContact(this.addContactForm);
      const contactDotNet = this.convertProspectToContact(contact);
      this.saveContactDotNet(contactDotNet);
    }
  }

  private saveContactDotNet(contactDotNet) {
    this.organisationClientToUpdate.Contact = [];
    this.organisationClientToUpdate.Contact.push(contactDotNet);
    this.tiersService.saveTiers(this.organisationClientToUpdate, false).subscribe((data) => {
      this.validateAndReturn();
    });
  }

  private updateContact() {
   // this.addContactForm.controls['adress'].setValue(this.addressFormGroup.value);
    this.contactCrmService.getJavaGenericService()
      .updateEntity(this.convertAddContactFormToContact(this.addContactForm),
        this.contactData.id)
      .subscribe((data) => {
        if (data != null) {
          if (data.errorCode === HttpCrmErrorCodes.EMAIL_IS_ALREADY_USED) {
            this.emailAlreadyTaken = true;
            this.addContactForm.controls[ContactConstants.EMAIL_field].markAsPending();
          } else {
            this.deleteContactPhones();
            if (this.canUpdatePermission) {
              this.permissionService.updatePermission(this.relatedContactsPermission, this.contactEntityName, this.contactData.id)
                .subscribe();
            }
            this.growlService.successNotification(this.translateService.instant(OrganisationConstant.SUCCESS_OPERATION));
            this.validateAndReturn();
          }
        }
      });
  }

  private checkRememberDateEventName() {
    let dateUpdated = true;
    (this.addContactForm.get(OrganisationConstant.DATES_TO_REMIND) as FormArray).controls.forEach((formGr, index) => {
      if (dateUpdated) {
        if (this.checkNumberOfEventsName(formGr.get(ContactConstants.EVENT_NAME).value) > 1 || this.datesToRemTab[index] == null) {
          if (this.datesToRemTab[index] == null) {
            this.dateChanged = true;
            dateUpdated = false;
          }
          this.datesToRememberCollapseIsOpened = true;
          this.addContactForm.controls[OrganisationConstant.DATES_TO_REMIND].setErrors({'incorrect': true});
        }
      }
    });
  }

  reWriteEmail() {
    this.emailAlreadyTaken = false;
  }
  fetchAddressFromFrom(form){
    return {
      id: form.value.Address[0].Id > 0 && !this.isClientMode ? form.value.Address[0].Id : null,
      city: form.value.Address[0].City,
      country: form.value.Address[0].Country,
      idCountry: form.value.Address[0].IdCountry,
      idCity: form.value.Address[0].IdCity,
      label: form.value.Address[0].Label,
      principalAddress: form.value.Address[0].PrincipalAddress,
      region: form.value.Address[0].Region,
      zipCode: form.value.Address[0].CodeZip,
      extraAddress: form.value.Address[0].ExtraAdress
    };
  }
  convertAddContactFormToContact(form: FormGroup) {

    let contact = new ContactCrm();
    contact = form.value;
    const datesToReturn: Array<DateToRemember> = [];
    if (this.datesToRemTab.length > 0) {
      this.datesToRemTab.forEach((date, index) => {
        const name = contact.datesToRemember[index][ContactConstants.EVENT_NAME];
        datesToReturn.push(new DateToRemember(contact.datesToRemember[index]['id'], name, this.exactDate.getDateExact(new Date(date))));
      });
    }
    contact.datesToRemember = datesToReturn;
    this.dateOfBirth ? contact.dateOfBirth = this.exactDate.getDateExact(this.dateOfBirth) : contact.dateOfBirth = null;
    if (this.organisation != null) {
      contact.organisationId = this.organisation.id;
    } else {
      contact.organisationId = null;
    }
    contact.adress = form.value.Address && form.value.Address.length > 0 && form.value.Address[0] ? this.fetchAddressFromFrom(form) as Address : null;



    contact.dateRememberTodelete = this.idsDateToDelete;
    contact.phone = this.convertPhoneProspect();
    return contact;
  }

  convertPhoneProspect(): any {
    let phone = [];
    this.phoneProspect.value.forEach(
      (p) => {
        const data = {
          id: p.Id,
          phone: p.Number,
          countryCode: p.CountryCode,
          dialCode: p.DialCode,
          delete: p.IsDeleted
        };
        phone.push(data);
      }
    );
    return phone;
  }

  loadListOfOrganisations() {
    this.organisationService.getJavaGenericService().getEntityList('')
      .subscribe(data => {
          this.organisationsList = data;
          this.organisemFiltredList = data;
        }
      );
  }

  getOrganisation(id: number) {
    this.organisationService.getJavaGenericService().getEntityById(id).subscribe(data => {
      this.organisation = data;
      this.addContactForm.controls['organisation'].setValue(this.organisation);
    });
  }


  private initContactPhones() {
    if (!this.isClientMode) {
      let phones: any = [];
      phones = this.contactData.phone;
      phones.forEach(phone => {
        this.addPhones(phone);
      });
    }
  }


  isEmptyAdressObject(obj) {
    return (obj && (Object.keys(obj).length === 0));
  }

  fillContactData(contact) {
    const contactToReturn = new ContactCrm(contact.Id, contact.Email, contact.Tel1, contact.HomePhone, contact.OtherPhone,
      contact.AssistantName, contact.AssistantPhone, contact.Fax1, contact.Facebook, contact.Twitter,
      contact.FirstName, contact.Linkedin, contact.LastName, contact.Fonction, contact.DateOfBirth,
      contact.Description, contact.Adress, contact.organisationName);
    this.tiersService.getTiersById(contact.IdTiers).subscribe((c) => {
        contactToReturn.organisationName = c.Name;
        this.organisationClientToUpdate = c;
      }
    );
    if (this.isClientMode && contact.IdTiersNavigation && contact.IdTiersNavigation.Name) {
      contactToReturn.organisationName = contact.IdTiersNavigation.Name;
    }
    this.fillDateToRememberClient(contact);
    return contactToReturn;
  }

  fillDateToRememberClient(contact) {
    this.datesToRemTab = [];
    this.IdsDateToRemember = [];
    if (contact.DateToRemember) {
      contact.DateToRemember.forEach((date) => {
        if (date.Date) {
          this.IdsDateToRemember.push(date);
          this.datesToRemTab.push(new Date(date.Date));
          const dateTo = new DateToRemember(date.Id, date.EventName, new Date(date.Date), undefined);
          this.datesToRemember.push(this.createDatesToRemForm(dateTo));
        }
      });
    }

  }


  public isAddressDetailsInputShown() {
    return this.isClientMode && !this.isEmptyAdressObject(this.contactData.adress);
  }

  setDateOfBirth(data) {
    this.dateOfBirth = data.dateOfBirth ? new Date(data.dateOfBirth) : null;
  }

  fillDatesToRemember(data) {
    this.datesToRemTab = [];
    if (this.isClientMode) {
      if (data.DateToRemember) {
        data.DateToRemember.forEach((date) => {
          this.addDatesToRemeber(new Date(date.date));
        });
      }
    } else {
      if (data.datesToRemember) {
        data.datesToRemember.forEach((date) => {
          this.addDatesToRemeber(new Date(date.date));
        });
      }
    }
  }

  fillOrganisation() {
    if (this.contactData.organisationId) {
      this.getOrganisation(this.contactData.organisationId);
    } else {
      this.organisation = null;
    }
  }

  getBase64File(fileName) {
    if (fileName !== null) {
      this.contactCrmService.getJavaGenericService().getFile('getpicture?fileName=' + fileName).subscribe(response => {
        if (response.base64File !== '') {
          this.imageData = 'data:image/' + (response.name).split('?')[0].split('.').pop() + ';base64,' + response.base64File;
        } else {
          this.imageData = null;
        }
      });
    } else {
      this.imageData = null;
    }
  }

  prepareSalutations() {
    this.salutations = this.salutations.map(sal => {
      return this.translateService.instant(sal);
    });
  }

  checkNumberOfEventsName(eventName: string) {
    const datesToRemTab = [];
    (this.addContactForm.get(OrganisationConstant.DATES_TO_REMIND) as FormArray).controls.forEach((date) => {
      datesToRemTab.push(date.value);
    });
    const valueArr = datesToRemTab.map(function (item) {
      return item.eventName;
    });
    const valueToReturn = valueArr.filter(item => item === eventName).length;
    valueToReturn > 1 ? this.addContactForm.controls[OrganisationConstant.DATES_TO_REMIND].setErrors({'incorrect': true}) :
      this.addContactForm.controls[OrganisationConstant.DATES_TO_REMIND].setErrors(null);
    return valueToReturn;
  }

  /**
   * To check if any of the address field is filled
   * @param adress
   */
 /* isAddressFilled(address: Address) {
    if (address) {
      if (address.city || address.country || address.extraAddress || address.zipCode) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }*/

  validateDate(i: number): boolean {
    if (this.datesToRemTab[i] == null) {
      this.addContactForm.controls[OrganisationConstant.DATES_TO_REMIND].setErrors({'incorrect': true});
      return false;
    } else {
      this.addContactForm.controls[OrganisationConstant.DATES_TO_REMIND].setErrors(null);
      return true;
    }
  }


  public uploadPictureFile(event) {
    this.changePicture = true;
    this.currentFileUpload = event.target.files[0];
    if (this.currentFileUpload) {
      const reader = new FileReader();
      reader.readAsBinaryString(this.currentFileUpload);
      this.handleInputChange(this.currentFileUpload);
    }
  }

  handleInputChange(file) {
    const pattern = /image-*/;
    const reader = new FileReader();
    if (!file.type.match(pattern)) {
      alert('invalid format');
      return;
    }
    reader.onloadend = this._handleReaderLoaded.bind(this, file);
    reader.readAsDataURL(file);
  }

  _handleReaderLoaded(file, e) {
    const reader = e.target;
    const base64result = reader.result.substr(reader.result.indexOf(',') + 1);

    if (base64result !== undefined) {
      this.saveFile(base64result, file);

    }
  }

  saveFile(base64Picture, file) {

    this.contactCrmService.getJavaGenericService().uploadFile('uploadpicture', {
      'base64File': base64Picture,
      'name': file.name,
      'directoryName': 'profilePictureStore'
    }).subscribe((data: String) => {
      if (data !== null) {
        this.addContactForm.controls['photo'].setValue(data);
        this.pathPicture = data;
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (e: any) => {
          this.pictureFileInfo = new FileInfo();
          this.pictureFileInfo.Name = file.name;
          this.pictureFileInfo.Extension = file.type;
          this.pictureFileInfo.FileData = reader.result.split(',')[1];
          this.pictureContactSrc = reader.result;
        };
      }
    });
  }

  getBackMessage(): string {
    return this.urlService.getBackMessage();
  }

  returnToParent() {
    this.router.navigateByUrl(this.urlService.getPreviousUrl());
  }

  returnToList() {
    const previousURL = this.urlService.getPreviousUrl().toString();
    const entity = previousURL.substring(10, previousURL.indexOf('/', 10)).toUpperCase();
    switch (entity) {
      case 'ORGANISATION' :
        this.router.navigateByUrl(this.urlService.getPreviousUrl()
          , {skipLocationChange: true });
        break;
      case 'ARCHIVING' :
        this.router.navigateByUrl(ContactConstants.CONTACT_ARCHIVING_URL
          , {skipLocationChange: true});
        break;
      default :
        this.router.navigateByUrl(ContactConstants.CONTACT_LIST_URL
          , {skipLocationChange: true});
    }
  }

  validateAndReturn() {
    this.router.navigateByUrl(ContactConstants.CONTACT_LIST_URL);
  }

  getFooterClass(): string {
    return this.styleConfigService.getFooterClassSettingLayoutAddComponent();
  }

  convertProspectToContact(contactCrm: ContactCrm) {
    const contact = this.contactDotNetToUpdate;
    contact.FirstName = contactCrm.name;
    contact.LastName = contactCrm.lastName;
    contact.Fonction = contactCrm.poste;
    contact.Email = contactCrm.mail;
    contact.Fax1 = contactCrm.fax;
    contact.Twitter = contactCrm.twitter;
    contact.Facebook = contactCrm.facebook;
    contact.Linkedin = contactCrm.linkedIn;
    contact.Description = contactCrm.description;
    contact.HomePhone = contactCrm.homePhone;
    contact.OtherPhone = contactCrm.otherPhone;
    contact.AssistantPhone = contactCrm.assistantPhone;
    contact.AssistantName = contactCrm.assistantName;
    contact.Adress = contactCrm.address;
    contact.DateToRemember = this.convertDatesToRemember(contactCrm);
    contact.Phone = this.Phone.value;
    return contact;
  }

  public get Phone(): FormArray {
    return this.phoneForm.get(PhoneConstants.PHONE) as FormArray;
  }

  convertDatesToRemember(contactCrm) {
    const dataToSend = [];
    let data;
    if (contactCrm.datesToRemember.length > 0) {
      contactCrm.datesToRemember.forEach((d) => {
          if (d.id !== '') {
            data = {
              Id: d.id,
              EventName: d.eventName,
              Date: d.date,
              IdContact: this.idContact
            };
          } else {
            data = {
              EventName: d.eventName,
              Date: d.date,
              IdContact: this.idContact
            };
          }
          dataToSend.push(data);
        }
      );
    }
    return dataToSend;
  }

  checkValidators() {
    if (this.isClientMode) {
      this.phone.setValidators([Validators.required]);
    } else {
      this.phone.clearValidators();
    }
  }

  handleFiltreOrganisation(value) {
    this.organisationsList = this.organisemFiltredList.filter(o => o.name.toLowerCase().indexOf(value.toLowerCase()) !== -1);
  }

/*  private createAddressForm() {
    this.addressFormGroup = new FormGroup({
      id: new FormControl(''),
      country: new FormControl(''),
      city: new FormControl(''),
      zipCode: new FormControl('', [Validators.minLength(NumberConstant.TWO)]),
      extraAddress: new FormControl(''),
    });
  }*/

  get phones(): FormArray {
    return this.addContactForm.get(ContactConstants.PHONE.toLowerCase()) as FormArray;
  }

  get phoneProspect(): FormArray {
    return this.phoneForm.get(ContactConstants.PHONE) as FormArray;
  }

  private buildPhoneForm(): FormGroup {
    return this.fb.group({
      phone: ['', Validators.minLength(NumberConstant.SEVEN)],
    });
  }

  /**
   * @param phoneToAdd
   */
  addPhones(phoneToAdd?) {
    if (phoneToAdd) {
      if (!this.genericCrmService.isNullOrUndefinedOrEmpty(phoneToAdd)) {
        phoneToAdd = this.fb.group({id: phoneToAdd.id, phone: phoneToAdd.phone, contactCrm: phoneToAdd.contactCrm});
        this.phones.push(phoneToAdd);
        this.listPhoneValid.push(true);
      }
    } else {
      if (this.phones.length > NumberConstant.ZERO) {
        const phone = this.getLastPhoneValue();
        this.isValidPhone(phone);
      } else {
        this.phones.push(this.buildPhoneForm());
        this.listPhoneValid.push(true);
      }
    }
  }

  checkLastPhone() {
    if (this.phones.length > NumberConstant.ZERO && this.phones.value[NumberConstant.ZERO].phone !== '') {
      this.lastPhoneIsValid = !this.genericCrmService.isNullOrUndefinedOrEmpty(this.getLastPhoneValue().phone);
    } else {
      this.lastPhoneIsValid = true;
    }
    this.listPhoneValid[this.phones.length - NumberConstant.ONE] = this.lastPhoneIsValid;
    return this.lastPhoneIsValid;
  }

  private getLastPhoneValue() {
    return this.phones.value[this.phones.length - NumberConstant.ONE];
  }

  private isValidPhone(phone) {
    if (!this.genericCrmService.isNullOrUndefinedOrEmpty(phone.phone) &&
      phone.phone.trim().length - NumberConstant.THREE >= NumberConstant.SEVEN) {
      this.phones.push(this.buildPhoneForm());
      this.listPhoneValid.push(true);
    }
  }

  validatePhone(index) {
    this.listPhoneValid[index] = this.phones.value[index].phone.trim().length === NumberConstant.ZERO ||
      this.phones.value[index].phone.trim().length - NumberConstant.THREE >= NumberConstant.SEVEN;
  }

  /**
   * @param i
   * @param phoneToDelete
   */
  deletePhone(i, phoneToDelete) {
    if (this.phones.length > NumberConstant.ZERO) {
      this.swallWarning.CreateSwal(this.translateService.instant(ContactConstants.POP_UP_DELETE_PHONE_TEXT)).then((result) => {
        if (result.value) {
          this.phones.removeAt(i);
          this.phonesToDelete.push(phoneToDelete.id);
        }
      });
    }
  }

  private deleteContactPhones() {
    if (this.phonesToDelete.length > 0) {
      this.contactCrmService.deleteContactPhones(this.phonesToDelete).subscribe();
    }
  }

  selectedPermission() {
    this.permissionService.getResult().subscribe(data => {
      if (data && data.permission && (data.parent === this.parentPermission)) {
        this.relatedContactsPermission = data.permission;
      }
    });
  }

  loadPermission(canUpdatePermission) {
    this.canUpdatePermission = canUpdatePermission;
  }

  deleteAddress(addressFormGroup) {

    this.swallWarning.CreateSwal(this.translateService.instant(ContactConstants.POP_UP_DELETE_PHONE_TEXT)).then((result) => {
      if (result.value) {
        this.contactCrmService.deleteContactAddress(addressFormGroup.value.id, this.idContact).subscribe((data) => {
            this.addressFormGroup.reset();
          }
        );
      }
    });
  }




  private checkCollapseAddressStateOnUpdate() {
    this.tiersAddress = this.tiersAddress;
    if (this.Address.value.length === NumberConstant.ZERO) {
      this.collapseAddressOpened = true;
    }
    if (!this.openAddressDetailsCollapse) {
      this.collapseAddressOpened = false;
      this.Address.controls = this.Address.controls
        .filter(adress => !TiersAddressComponent.isEmptyAdressFields(adress.value));
    }
  }

  get Address(): FormArray {
    return this.addContactForm.get(TiersConstants.ADDRESS) as FormArray;
  }

  private checkCollapseAddressOnCloseValidation() {
    if ( TiersAddressComponent.isEmptyAdressFields(this.addContactForm.controls.Address.value)){
      this.Address.controls = this.Address.controls
        .filter(adress => !TiersAddressComponent.isEmptyAdressFields(adress.value));
      this.addContactForm.controls.Address.setErrors(null);
    }
  }
}
