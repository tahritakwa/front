import {Component, ComponentRef, OnInit, ViewContainerRef} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {ContactCrm} from '../../../../models/crm/contactCrm.model';
import {FileInfo} from '../../../../models/shared/objectToSend';
import {ActivatedRoute, Router} from '@angular/router';
import {ValidationService} from '../../../../shared/services/validation/validation.service';
import {ContactCrmService} from '../../../services/contactCrmService/contact-crm.service';
import {ContactConstants} from '../../../../constant/crm/contact.constant';
import {OrganisationService} from '../../../services/organisation/organisation.service';
import {FormModalDialogService} from '../../../../shared/services/dialog/form-modal-dialog/form-modal-dialog.service';
import {SharedConstant} from '../../../../constant/shared/shared.constant';
import {OrganisationConstant} from '../../../../constant/crm/organisation.constant';
import {GrowlService} from '../../../../../COM/Growl/growl.service';
import {ExactDate} from '../../../../shared/helpers/exactDate';
import {TeamService} from '../../../../payroll/services/team/team.service';
import {Employee} from '../../../../models/payroll/employee.model';
import {Address} from '../../../../models/crm/address.model';
import {HttpCrmErrorCodes} from '../../../http-error-crm-codes';
import {CrmConstant} from '../../../../constant/crm/crm.constant';
import {OrganisationAddComponent} from '../../organisation/organisation-add/organisation-add.component';
import {IModalDialog, IModalDialogOptions} from 'ngx-modal-dialog';
import {ModalDialogInstanceService} from 'ngx-modal-dialog/src/modal-dialog-instance.service';
import {TiersService} from '../../../../purchase/services/tiers/tiers.service';
import {PredicateFormat} from '../../../../shared/utils/predicate';
import {Organisation} from '../../../../models/crm/organisation.model';
import {AddNewOpportunityComponent} from '../../opportunity/add-new-opportunity/add-new-opportunity.component';
import {Tiers} from '../../../../models/achat/tiers.model';
import {ContactDOtNet} from '../../../../models/crm/contactDotNet.model';
import {EnumValues} from 'enum-values';
import {LeadSourcesEnum} from '../../../../models/shared/enum/leadSources.enum';
import {PermissionService} from '../../../services/permission/permission.service';
import {GenericCrmService} from '../../../generic-crm.service';
import {NumberConstant} from '../../../../constant/utility/number.constant';
import {OpportunityType} from '../../../../models/crm/enums/opportunityType.enum';
import {Observable} from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription';
import {pairwise} from 'rxjs/operators';
import {ContactService} from '../../../../purchase/services/contact/contact.service';
import {DropdownService} from '../../../services/dropdowns/dropdown.service';
import {AuthService} from '../../../../login/Authentification/services/auth.service';
import {PermissionConstant} from '../../../../Structure/permission-constant';
import {PhoneConstants} from '../../../../constant/purchase/phone.constant';
import {TiersAddressComponent} from '../../../../shared/components/tiers-address/tiers-address.component';
import {TiersConstants} from '../../../../constant/purchase/tiers.constant';
import {CountryService} from '../../../../administration/services/country/country.service';
import {CityService} from '../../../../administration/services/city/city.service';
import {forkJoin} from 'rxjs/observable/forkJoin';

@Component({
  selector: 'app-add-prospect',
  templateUrl: './add-prospect.component.html',
  styleUrls: ['./add-prospect.component.scss']
})
export class AddProspectComponent implements OnInit, IModalDialog {

  public static ZERO = 0;
  public addContactForm: FormGroup;
  public phoneForm: FormGroup;
  public organizationsList = [];
  public prospectOrganisationList = [];
  public clientOrganisationList = [];
  public clientOrganisationListConverted = [];
  public organisemFiltredList = [];
  public pictureContactySrc: any;

  public pictureFileInfo: FileInfo;
  public pathPicture;

  private currentFileUpload: File;


  public salutations: Array<string> = ['MR', 'MRS'];
  public salutationValue = 'MR';
  public listResponsiblesUsers: Array<Employee>;

  public firstCollapseIsOpened: Boolean = true;
  public secondeCollapseIsOpened: Boolean = false;
  public datesToRememberCollapseIsOpened: Boolean = false;
  public emailAlreadyTaken = false;

  private dataFromTeams;
  public teamsList = [];
  public datesToRememberFormGroup: FormGroup;
  public listPhoneValid: boolean[] = [];
  public optionDialog: Partial<IModalDialogOptions<any>>;
  public isModal;
  public source;
  public sourceId;
  public prospectType = true;
  public contactType = true;
  public predicate: PredicateFormat;

  public leadSources = [];
  private realtedContactsPermissions: any;
  private contactEntityName = ContactConstants.CONTACT_ENTITY_NAME;
  public uuid = Math.floor(Math.random() * NumberConstant.ONE_THOUSAND);
  private typeSubscription: Subscription;
  public parentPermission = 'ADD_CONTACT';
  public contactTypes = [];
  public selectedContactType;
  private selectedTiersIdFromModal: number;
  public selectedOrganisation: any;
  private readonly IS_PROSPECT_PARAM = CrmConstant.IS_PROSPECT_PARAM;
  public isFormGroupChanged = false;
  public mail = '';
  public firstPhone = '';
  public firstPhoneIsValid = true;
  public phoneToUpdate = [];
  dialogInit(reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
    this.optionDialog = options;
    this.isModal = true;
    this.firstCollapseIsOpened = false;
    this.source = options.data.source;
    this.sourceId = options.data.data;
    this.contactType = options.data.contactType;
    this.prospectType = options.data.contactType;
  }

  public CRMPermissions = PermissionConstant.CRMPermissions;

  /**
   *
   * @param formBuilder
   * @param validationService
   * @param fb
   * @param router
   * @param translate
   * @param formModalDialogService
   * @param growilService
   * @param exactDate
   * @param teamService
   * @param genericCrmServices
   * @param contactService
   * @param viewRef
   * @param employeeService
   * @param modalService
   * @param organisationService
   * @param tiersService
   * @param permissionService
   * @param genericCrmService
   * @param route
   * @param route
   */
  constructor(
              private countryService: CountryService,
              private cityService: CityService,
              private formBuilder: FormBuilder,
              private validationService: ValidationService,
              private fb: FormBuilder,
              private router: Router,
              private translate: TranslateService,
              private formModalDialogService: FormModalDialogService,
              private growilService: GrowlService,
              private exactDate: ExactDate,
              private genericCrmServices: GenericCrmService,
              private contactService: ContactCrmService,
              private viewRef: ViewContainerRef,
              private modalService: ModalDialogInstanceService,
              private organisationService: OrganisationService,
              private tiersService: TiersService,
              private permissionService: PermissionService,
              private genericCrmService: GenericCrmService,
              private route: ActivatedRoute,
              private contactDOtNetService: ContactService,
              private dropdownService: DropdownService,
              public authService: AuthService) {
  }


  ngOnInit() {

    this.selectedPermission();
    this.preparePredicate();
    this.translateSalutations();
    this.initTypesList();
    this.initLeadSources();
    this.createAddForm();
    this.loadListOrganisation(this.sourceId);
    this.checkAndSetContactType();
    this.changeContactFormListener();
  }

  private translateSalutations() {
    this.salutations = this.salutations.map(sal => {
      return this.translate.instant(sal);
    });
    this.salutationValue = this.translate.instant(this.salutations[0] );
  }

  private checkAndSetContactType() {
    if (!this.source) {
      this.typeSubscription = this.route
        .queryParams
        .subscribe(params => {
          // Defaults to true if no query param provided.
          this.contactType = JSON.parse(params['parameters']) !== null ? JSON.parse(params['parameters']) : true;
          if (this.contactType) {
            this.getAllOrganisation();
          } else {
            this.getTiersListCustomerType();
          }
        });
    }
  }

  validateDuplicatedMail(event) {
    if (this.addContactForm.controls[ContactConstants.MAIL].valid) {
      this.contactService.getJavaGenericService().getData(`/validate-mail?contactMail=${this.mail}`).subscribe(data => {
        if (data) {
          this.secondeCollapseIsOpened = true;
          this.emailAlreadyTaken = true;
        }
      });
      this.contactDOtNetService.getUnicity('Email', this.mail).subscribe(data => {
        if (data) {
          this.secondeCollapseIsOpened = true;
          this.emailAlreadyTaken = true;
        }
      });
      const {relatedTarget} = event;
      if (relatedTarget) {
        relatedTarget.click();
      }
    }
  }

  private setContactType() {
    if (this.contactType) {
      this.selectedContactType = this.contactTypes[NumberConstant.ZERO];
      this.switchToProspectList();
    } else {
      this.selectedContactType = this.contactTypes[NumberConstant.ONE];
      this.switchToClientList();
    }
  }

  private preparePredicate() {
    this.predicate = this.genericCrmServices.preparePredicateForClientsList(this.predicate);
  }

  private initTypesList() {
    this.contactTypes = EnumValues.getNames(OpportunityType).map((type: any) => {
      return type = {enumValue: type, enumText: this.translate.instant(type)};
    });
    this.selectedContactType = this.contactTypes[0];
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

  getAllOrganisation(oldOrganisationListLength?: number) {
    this.organisationService.getJavaGenericService().getEntityList()
      .subscribe(data => {
          if (data) {
            const organisations = data.filter(organisation => organisation.idClient == null);
            this.prospectOrganisationList = organisations;
            this.organizationsList = organisations;
            this.organisemFiltredList = organisations;
          }
        }, () => {
        }, () => {
          this.setContactType();
          this.handleAddNewElementToOrganisationDropdown(oldOrganisationListLength, true);
        }
      );
  }

  private handleAddNewElementToOrganisationDropdown(oldOrganisationListLength: number, prospectType: boolean) {
    if (!this.genericCrmService.isNullOrUndefinedOrEmpty(oldOrganisationListLength)) {
      this.setDefaultValueToOrganisationList(oldOrganisationListLength, prospectType);
    }
  }

  get phones(): FormArray {
    return this.addContactForm.get(ContactConstants.PHONE) as FormArray;
  }

  addPhone() {
    if (this.firstPhone && this.firstPhoneIsValid) {
      if (this.phones.length > NumberConstant.ZERO) {
        const phone = this.phones.value[this.phones.length - NumberConstant.ONE];
        this.isValidPhone(phone);
      } else {
        this.phones.push(this.buildPhoneForm());
        this.listPhoneValid.push(true);
      }
    }
  }

  private buildPhoneForm(): FormGroup {
    return this.fb.group({
      phone: ['', Validators.minLength(NumberConstant.SEVEN)],
    });
  }

  public validateFirstPhone() {
    this.firstPhoneIsValid = (!this.genericCrmService.isNullOrUndefinedOrEmpty(this.firstPhone) &&
      this.firstPhone.trim().length - NumberConstant.THREE >= NumberConstant.SEVEN);
  }

  validatePhone(index) {
    this.listPhoneValid[index] = this.phones.value[index].phone.trim().length === NumberConstant.ZERO ||
      this.phones.value[index].phone.trim().length - NumberConstant.THREE >= NumberConstant.SEVEN;
  }

  private isValidPhone(phone) {
    if (!this.genericCrmService.isNullOrUndefinedOrEmpty(phone.phone) &&
      phone.phone.trim().length - NumberConstant.THREE >= NumberConstant.SEVEN) {
      this.phones.push(this.buildPhoneForm());
      this.listPhoneValid.push(true);
    }
  }

  deletePhone(i) {
    if (this.phones.length > 0) {
      this.phones.removeAt(i);
    }
  }

  private createAddForm(): void {
    this.addContactForm = this.fb.group({
      prefix: [''],
      name: ['', [Validators.required, Validators.pattern(CrmConstant.NAMES_PATTERN)]],
      lastName: ['', [Validators.required, Validators.pattern(CrmConstant.NAMES_PATTERN)]],
      organisation: [null],
      poste: ['', Validators.maxLength(NumberConstant.FIFTY)],
      mail: ['', [Validators.pattern(CrmConstant.MAIL_PATTERN), Validators.required]],
      Phone: this.fb.array([]),
      homePhone: [AddProspectComponent.ZERO],
      otherPhone: [AddProspectComponent.ZERO],
      assistantPhone: [AddProspectComponent.ZERO],
      team: [''],
      employeesPermittedTo: [''],
      assistantName: [''],
      fax: [AddProspectComponent.ZERO],
      linkedIn: [''],
      facebook: [''],
      twitter: [''],
      Id: [0.5],
      Address: this.fb.array([]),
      adress: [''],
      dateOfBirth: [''],
      datesToRemember: this.fb.array([]),
      description: [''],
      photo: [''],
      leadSource: [undefined]
    });
    this.phoneForm = this.fb.group({
      Phone: this.fb.array([])
    });

  }

  private changeAddressFCParContactType() {
    this.addContactForm.controls['Phone'].reset();
      this.addContactForm.controls['Phone'] = this.fb.array([]);
  }
  public get Phone(): FormArray {
    return this.phoneForm.get(PhoneConstants.PHONE) as FormArray;
  }

  get adress(): FormGroup {
    return this.addContactForm.get(ContactConstants.ADRESS) as FormGroup;
  }

  public uploadPictureFile(event) {

    this.currentFileUpload = event.target.files[0];
    if (this.currentFileUpload) {
      const reader = new FileReader();
      reader.readAsBinaryString(this.currentFileUpload);
      this.handleInputChange(this.currentFileUpload);
    }
  }

  saveFile(base64Picture, file) {
    this.contactService.getJavaGenericService().uploadFile('uploadpicture', {
      'base64File': base64Picture,
      'name': file.name,
      'directoryName': 'profilePictureStore'
    }).subscribe((data: String) => {
      if (data !== null) {
        this.pathPicture = data;
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (e: any) => {
          this.pictureFileInfo = new FileInfo();
          this.pictureFileInfo.Name = file.name;
          this.pictureFileInfo.Extension = file.type;
          this.pictureFileInfo.FileData = reader.result.split(',')[1];
          this.pictureContactySrc = reader.result;
        };
      }
    });
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


  save() {
    this.emailAlreadyTaken = false;
    this.isFormGroupChanged = false;
    this.checkCollapseAddressOnCloseValidation();
    if (this.addContactForm.valid && this.realtedContactsPermissions.permissionValidForm
      && (this.prospectType ? this.firstPhoneIsValid : true)) {
      this.addContactForm.patchValue({'photo': this.pathPicture});
      if (this.prospectType) {
        this.saveProspectContact();
      } else {
        this.saveClientContact();
      }
    } else {
      if (this.addContactForm.controls[ContactConstants.NAME_field].invalid ||
        this.addContactForm.controls[ContactConstants.LAST_NAME_field].invalid) {
        this.firstCollapseIsOpened = true;
      }
      if (this.addContactForm.controls[ContactConstants.MAIL].invalid) {
        this.secondeCollapseIsOpened = true;
      }
      this.checkEventNameValidation();
      this.validationService.validateAllFormFields(this.addContactForm);
      this.checkDateToRememberCollapse();
      this.returnValidationOnEventName();
    }
  }

  private checkEventNameValidation() {
    const invalidNameValue = this.datesToRemember.controls.find((fg: FormGroup) => fg.controls['eventName'].invalid);
    if (!invalidNameValue) {
      this.datesToRemember.controls.forEach((fg: FormGroup) => fg.controls['eventName'].clearValidators());
    }
  }

  private returnValidationOnEventName() {
    this.datesToRemember.controls.forEach((fg: FormGroup) => fg.controls['eventName'].setValidators([Validators.required,
      this.genericCrmService.uniqueValueInFormArray(Observable.of(this.datesToRemember), 'eventName')]));
  }

  private saveClientContact() {
    const contact = this.addContactForm.value;
    const tiers: Tiers = this.clientOrganisationList.find(org => org.Id === contact.organisation.id);
    tiers.Contact.push(this.convertContactToDotNet(contact));
    this.tiersService.saveTiers(tiers, false).subscribe(() => {
      this.onBackToListOrCancel(false);
    });
  }

  convertContactToDotNet(c) {

    const contact: ContactDOtNet = new ContactDOtNet();
    contact.Email = c.mail;
    contact.FirstName = c.name;
    contact.LastName = c.lastName;
    contact.Fonction = c.poste;
    contact.Tel1 = c.phone;
    contact.Fax1 = c.fax;
    contact.Twitter = c.twitter;
    contact.Facebook = c.facebook;
    contact.Adress = c.Address  && c.Address.length ?  c.Address[0].Country + ' ' + c.Address[0].City + ' ' +  c.Address[0].CodeZip : '';
    contact.Linkedin = c.linkedIn;
    contact.DateToRemember = this.convertDatesToRemember(c);
    contact.Phone = this.Phone.value;
    return contact;
  }

  fillContactToSave() {
  //  this.addContactForm.value.adress =   this.addContactForm.value.Address ;
    if (  this.addContactForm.value.Address !== null &&   this.addContactForm.value.Address.length > 0 ) {
      this.addContactForm.value.adress = {
        id: this.addContactForm.value.Address[0].Id > 0 && this.prospectType ? this.addContactForm.value.Address[0].Id : null,
        city: this.addContactForm.value.Address[0].City,
        country: this.addContactForm.value.Address[0].Country,
        idCountry: this.addContactForm.value.Address[0].IdCountry,
        idCity: this.addContactForm.value.Address[0].IdCity,
        label: this.addContactForm.value.Address[0].Label,
        principalAddress: this.addContactForm.value.Address[0].PrincipalAddress,
        region: this.addContactForm.value.Address[0].Region,
        zipCode: this.addContactForm.value.Address[0].CodeZip,
        extraAddress: this.addContactForm.value.Address[0].ExtraAdress
      };
    }
    return this.addContactForm;
  }

  private saveProspectContact() {
    this.contactService.getJavaGenericService().saveEntity(this.convertContactFormToContact(this.fillContactToSave())).subscribe(data => {
      if (data != null) {
        if (data.errorCode === HttpCrmErrorCodes.EMAIL_IS_ALREADY_USED) {
          this.emailAlreadyTaken = true;
          this.addContactForm.controls[ContactConstants.EMAIL_field].markAsPending();
          this.secondeCollapseIsOpened = true;
        } else {
          this.permissionService.savePermission(this.realtedContactsPermissions, this.contactEntityName, data.id).subscribe(() => {
            this.growilService.successNotification(this.translate.instant(OrganisationConstant.SUCCESS_OPERATION));
            this.onBackToListOrCancel(true);
          });
        }
      }
    });
  }

  checkDateToRememberCollapse() {
    if (this.datesToRemember.invalid) {
      this.datesToRememberCollapseIsOpened = true;
    }
  }

  showAddOrganisationPopUp() {
    this.formModalDialogService.openDialog(null, OrganisationAddComponent, this.viewRef,
      this.loadListOrganisation.bind(this), {'prospectType': this.prospectType},
      true, SharedConstant.MODAL_DIALOG_SIZE_L);
  }
  convertPhoneProspect(): any {
    const phone = [];
    this.phones.value.forEach(
      (p) => {
        const data = {
          id : p.Id,
          phone : p.Number,
          countryCode : p.CountryCode,
          dialCode: p.DialCode,
          isDeleted : p.IsDeleted
        };
        phone.push(data);
      }
    );
    return phone ;
  }
  convertContactFormToContact(form: FormGroup) {

    let contact: ContactCrm;
    form.value.organisationId ? form.value.organisationId = this.addContactForm.get(ContactConstants.ORGANISATION).value.id : 0 ;
    contact = form.value;
    contact.phone = this.convertPhoneProspect();
    if (this.source) {
      contact.organisationId = this.sourceId;
    } else {
      contact.organisationId = this.addContactForm.value.organisation != null ?
        this.addContactForm.get(ContactConstants.ORGANISATION).value.id : null;
    }

    contact.dateOfBirth = contact.dateOfBirth ? this.exactDate.getDateExact(contact.dateOfBirth) : null;
    contact.datesToRemember.forEach((date) => {
      date.date = this.exactDate.getDateExact(date.date);
    });
    contact.adress = this.isAddressFilled(contact.adress) === true ? contact.adress : null;

    return contact;
  }

  /**
   * To check if any of the address field is filled
   * @param adress
   */
  isAddressFilled(address: Address) {
    if (address.city || address.country || address.extraAddress || address.zipCode) {
      return true;
    } else {
      return false;
    }
  }

  reWriteEmail() {
    this.emailAlreadyTaken = false;
  }

  get datesToRemember(): FormArray {
    return this.addContactForm.get(ContactConstants.DATES_TO_REMEMBER) as FormArray;
  }

  createDatesToRemForm(): FormGroup {
    this.datesToRememberFormGroup = this.fb.group({
      eventName: new FormControl('', [Validators.required,
        this.genericCrmService.uniqueValueInFormArray(Observable.of(this.datesToRemember), 'eventName')]),
      date: new FormControl('', Validators.required)
    });
    // this.addDateValidation();
    return this.datesToRememberFormGroup;
  }

  addDatesToRemeber() {
    this.datesToRemember.push(this.createDatesToRemForm());
  }

  deleteDateToRemember(i) {
    this.datesToRemember.removeAt(i);
  }

  public changeDateSelection(event) {
    if (event) {
      // this.datesToRememberFormGroup.controls['eventName'].setValue(event);
    }
  }

  handleFiltreOrganisation(value) {
    if (this.prospectType) {
      this.organizationsList = this.organisemFiltredList.filter(o => o.name.toLowerCase().indexOf(value.toLowerCase()) !== -1);
    } else {
      this.organizationsList = this.clientOrganisationListConverted.filter(o => o.name.toLowerCase().indexOf(value.toLowerCase()) !== -1);
    }
  }


  onBackToListOrCancel(isProspect?) {
    if (!this.isModal) {
      this.router.navigateByUrl(ContactConstants.CONTACT_LIST_URL.concat(this.IS_PROSPECT_PARAM + isProspect));
    } else {
      this.optionDialog.onClose();
      this.modalService.closeAnyExistingModalDialog();
    }
  }

  public switchToProspectList() {
    this.prospectType = true;
    this.setOrganisationControl();
    this.organizationsList = this.prospectOrganisationList;
  //  this.changeAddressFCParContactType();
  }

  public switchToClientList() {
    this.prospectType = false;
    this.setOrganisationControl();
    this.organizationsList = this.clientOrganisationListConverted;
   // this.changeAddressFCParContactType();
  }

  private setOrganisationControl() {
    this.addContactForm.controls['organisation'].reset();
    if (this.prospectType) {
      this.addContactForm.controls['organisation'].clearValidators();
    } else {
      this.addContactForm.controls['organisation'].setValidators([Validators.required]);
      if (this.source) {
        this.addContactForm.controls['organisation'].setValue(new Organisation(this.selectedTiersIdFromModal));
      }
    }
    this.addContactForm.controls['organisation'].updateValueAndValidity();
  }

  private getTiersListCustomerType(oldClientOrganismListLength?: number) {
    this.tiersService.processDataServerSide(this.predicate).subscribe(data => {
      this.clientOrganisationListConverted = [];
      this.clientOrganisationList = data.data.filter((c) => c.IdTypeTiers == NumberConstant.ONE);
      this.clientOrganisationList.forEach((client) => {
        this.clientOrganisationListConverted.push(this.convertClientToOrganisation(client));
      });
    }, () => {
    }, () => {
      this.setContactType();
      this.handleAddNewElementToOrganisationDropdown(oldClientOrganismListLength, false);
    });
  }

  convertClientToOrganisation(client): Organisation {
    return new Organisation(client.Id, client.Name, client.Email, client.Phone,
      client.Adress, client.Description, client.Fax1, client.Linkedin, client.Facebook, client.Twitter,
      this.translate.instant(AddNewOpportunityComponent.TRANSLATE_CUSTOMER));
  }

  selectedPermission() {
    this.permissionService.getResult().subscribe(data => {
      if (data && data.permission && (data.parent === this.parentPermission)) {
        this.realtedContactsPermissions = data.permission;
      }
    });
  }

  private loadListOrganisation(id?) {
    this.selectedTiersIdFromModal = id;
    if (this.prospectType) {
      this.getAllOrganisation(this.organizationsList.length);
    } else {
      this.getTiersListCustomerType(this.organizationsList.length);
    }
  }

  private setDefaultValueToOrganisationList(oldOrganismListLength: number, prospectType: boolean) {
    if (this.organizationsList.length > oldOrganismListLength) {
      this.selectedOrganisation = this.organizationsList.find(tiers => tiers.id === this.selectedTiersIdFromModal);
      this.addContactForm.updateValueAndValidity();
    }
  }

  /**
   * this method will be called by CanDeactivateGuard service to check the leaving component possibility
   */
  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    return this.genericCrmService.handleCanDeactivateToLeaveCurrentComponent(this.isContactFormGroupChanged.bind(this));
  }

  isContactFormGroupChanged(): boolean {
    return this.isFormGroupChanged;
  }

  changeContactFormListener() {
    Object.keys(this.addContactForm.controls).forEach(control => {
      this.addContactForm.get(control).valueChanges.pipe(pairwise()).subscribe(([prev, next]: [any, any]) => {
        if ((!this.genericCrmService.isNullOrUndefinedOrEmpty(prev) && this.genericCrmService.isNullOrUndefinedOrEmpty(next))
          || !this.genericCrmService.isNullOrUndefinedOrEmpty(next) && prev !== next) {
          this.isFormGroupChanged = true;
        }
      });
    });
  }
  convertDatesToRemember(contactCrm) {
    const dataToSend = [];
    let data ;
    if (contactCrm.datesToRemember.length > 0) {
      contactCrm.datesToRemember.forEach((d) => {
            data = {
              EventName: d.eventName,
              Date: d.date,
            };
            dataToSend.push(data);
        }
      );
    }
    return dataToSend;
  }
  public typeTier = 1;
  public tiersAddress = [];
  public collapseAddressOpened = false;
  public openAddressDetailsCollapse = false;

  public openAddressDetailCollapse() {
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
