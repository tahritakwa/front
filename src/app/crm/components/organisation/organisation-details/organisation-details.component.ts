import {Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {OrganisationService} from '../../../services/organisation/organisation.service';
import {Organisation} from '../../../../models/crm/organisation.model';
import {GridSettings} from '../../../../shared/utils/grid-settings.interface';
import {PagerSettings} from '@progress/kendo-angular-grid';
import {NumberConstant} from '../../../../constant/utility/number.constant';
import {ColumnSettings} from '../../../../shared/utils/column-settings.interface';
import {SortDescriptor, State} from '@progress/kendo-data-query';
import {OrganisationConstant} from '../../../../constant/crm/organisation.constant';
import {TranslateService} from '@ngx-translate/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {OrganisationSideNavService} from '../../../services/sid-nav/organisation-side-nav.service';
import {unique, uniquePropCrmJavaServices, ValidationService} from '../../../../shared/services/validation/validation.service';
import {GrowlService} from '../../../../../COM/Growl/growl.service';
import {ContactConstants} from '../../../../constant/crm/contact.constant';
import {SideNavService} from '../../../services/sid-nav/side-nav.service';
import {ContactCrmService} from '../../../services/contactCrmService/contact-crm.service';
import {DateToRemember} from '../../../../models/crm/dateToRemember';
import {SwalWarring} from '../../../../shared/components/swal/swal-popup';
import {TiersService} from '../../../../purchase/services/tiers/tiers.service';
import {Subscription} from 'rxjs/Subscription';
import {ContactCrm} from '../../../../models/crm/contactCrm.model';
import {ExactDate} from '../../../../shared/helpers/exactDate';
import {Address} from '../../../../models/crm/address.model';
import {CrmConstant} from '../../../../constant/crm/crm.constant';
import {ActionConstant} from '../../../../constant/crm/action.constant';
import {PermissionService} from '../../../services/permission/permission.service';
import {Observable} from 'rxjs/Observable';
import {SharedCrmConstant} from '../../../../constant/crm/sharedCrm.constant';
import {GenericCrmService} from '../../../generic-crm.service';
import {CurrencyService} from '../../../../administration/services/currency/currency.service';
import {StyleConfigService} from '../../../../shared/services/styleConfig/style-config.service';
import {UrlServicesService} from '../../../services/url-services.service';
import {TiersConstants} from '../../../../constant/purchase/tiers.constant';
import {ActionService} from '../../../services/action/action.service';
import {DropdownService} from '../../../services/dropdowns/dropdown.service';
import {AuthService} from '../../../../login/Authentification/services/auth.service';
import {PermissionConstant} from '../../../../Structure/permission-constant';

const NAME_REFERENCE = 'name';
const EMAIL_REFERENCE = 'email';
import {ReducedCurrency} from '../../../../models/administration/reduced-currency.model';
import {CountryService} from '../../../../administration/services/country/country.service';
import {CityService} from '../../../../administration/services/city/city.service';
import {TiersAddressComponent} from '../../../../shared/components/tiers-address/tiers-address.component';
import {OpportunityType} from '../../../../models/crm/enums/opportunityType.enum';

@Component({
  selector: 'app-organisation-details',
  templateUrl: './organisation-details.component.html',
  styleUrls: ['./organisation-details.component.scss']
})
export class OrganisationDetailsComponent implements OnInit, OnChanges, OnDestroy {

  @Output() changeUpdateMode = new EventEmitter<any>();
  @Input() isArchivingMode = false;
  @Input() fromRelatedArchiving = false;
  public organisationData = new Organisation();
  public idOrganisation;
  public convertedContacts;
  public showPermitted: Boolean = true;
  public addOrganisationForm: FormGroup;
  public clientDateToRemember;
  public firstCollapseIsOpened: Boolean = true;
  public secondeCollapseIsOpened: Boolean = false;
  private tierSubscription: Subscription;
  public datesToRememberCollapseIsOpened: Boolean = false;
  public dateOfBirth = new Date();
  public datesToRemeberFormGroup: FormGroup;
  public datesToRemTab: Array<Date> = [];
  public DETAILS = 'DETAILS';
  public CONTACT = 'CONTACT';
  public dataArray: any = [];
  public isOpened = false;
  public activitySectors = [];
  public activitySectorsFiltred = [];
  public oldMail = '';
  public oldName = '';
  private idsDateToDelete: number [] = [];
  uuid = Math.floor(Math.random() * NumberConstant.ONE_THOUSAND);

  public tiersAddress = [];
  @ViewChild(NAME_REFERENCE) public nameInput: ElementRef;
  @ViewChild(EMAIL_REFERENCE) public emailInput: ElementRef;

  /**
   * this is where to store data from .Net backend to be used in the update
   */
  private client;

  private pageSize = NumberConstant.TEN;
  public gridState: State = {
    skip: 0,
    take: this.pageSize,

    // Initial filter descriptor
    filter: {
      logic: 'and',
      filters: []
    }
  };
  public columnsConfig: ColumnSettings[] = [
    {
      field: OrganisationConstant.NAME,
      title: OrganisationConstant.NAME_CONSTANT,
      filterable: true
    },
    {
      field: OrganisationConstant.EMAIL,
      title: OrganisationConstant.EMAIL_CONSTANT,
      filterable: true
    }
  ];

  public columnsConfigContact: ColumnSettings[] = [
    {
      field: ContactConstants.NAME_field,
      title: ContactConstants.FULL_NAME,
      filterable: true
    },
    {
      field: ContactConstants.POST_field,
      title: ContactConstants.POST,
      filterable: true
    },
    {
      field: ContactConstants.EMAIL_field,
      title: ContactConstants.EMAIL,
      filterable: true
    },
    {
      field: ContactConstants.PHONE_field,
      title: ContactConstants.PHONE,
      filterable: true
    }
  ];
  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig
  };
  public gridSettingsContact: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfigContact
  };
  pagerSettings: PagerSettings = {
    buttonCount: NumberConstant.FIVE, info: true, type: 'numeric', pageSizes: false,
    previousNext: true
  };
  public sort: SortDescriptor[] = [{
    field: ContactConstants.FIRST_NAME,
    dir: 'asc'
  }];


  @Input() idOrganisationEvent;
  @Input() largeSidNav;
  @Output() backToOpportinutyEvent = new EventEmitter<boolean>();
  @Input() detailsData;
  @Input() isProspectType;
  @Output() showDetailContactEvent = new EventEmitter<any>();

  @Output() backToListEvent = new EventEmitter<any>();

  public prospectSourceType = ActionConstant.PROSPECT_SOURCE_TYPE;
  public clientSourceType = ActionConstant.CLIENT_SOURCE_TYPE;

  detailsTabIsSelected = true;
  public leadSources = [];
  public canUpdatePermission = true;
  public organisationEntityName = OrganisationConstant.ORGANISATION_ENTITY;
  private organisationsRelatedPermissions: any;
  formatSaleOptions: any;
  public parentPermission = 'DETAIL_ORGANIZATION';
  private isSaveOperation: boolean;
  public CRMPermissions = PermissionConstant.CRMPermissions;
  public currency = new ReducedCurrency();
  public currencyDataSource: Array<ReducedCurrency>;
  public currencyFiltredDataSource: Array<ReducedCurrency>;
public typeTier: number;
  /**
   *
   * @param tiersService
   * @param organisationService
   * @param growlService
   * @param translateService
   * @param router
   * @param exactDate
   * @param genericCrmService
   * @param validationService
   * @param fb
   * @param swallWarning
   * @param sideNavServiceOrganisation
   * @param contactCrmService
   * @param sidNavService
   * @param permissionService
   * @param currencyService
   */
  constructor(private tiersService: TiersService,
              private organisationService: OrganisationService,
              private growlService: GrowlService,
              private translateService: TranslateService,
              private router: Router,
              private exactDate: ExactDate,
              private actionsService: ActionService,
              private  genericCrmService: GenericCrmService,
              private activatedRoute: ActivatedRoute,
              private styleConfigService: StyleConfigService,
              private validationService: ValidationService,
              private fb: FormBuilder,
              private swallWarning: SwalWarring,
              public sideNavServiceOrganisation: OrganisationSideNavService,
              private contactCrmService: ContactCrmService,
              private urlService: UrlServicesService,
              private  sidNavService: SideNavService,
              private permissionService: PermissionService,
              private currencyService: CurrencyService,
              private dropdownService: DropdownService,
              public authService: AuthService,
              private countryService: CountryService,
              private cityService: CityService) {
  }

  ngOnInit() {
    this.typeTier = 1;
    this.getArchivingModes();
    this.getDataFromUrl();
    this.createAddForm();
    this.fillDropDowns();
    this.selectedPermission();
    this.getDataToUpdate();
    this.getArchivingModes();
  }

  getDataFromUrl() {
    this.activatedRoute.params.subscribe(params => {
      this.idOrganisation = +params['id'] || 0;
      this.isProspectType = (params['isProspect'] === 'true') || false;
    });
  }

  getArchivingModes() {
    this.isArchivingMode = this.actionsService.getIsArchivingMode();
    this.fromRelatedArchiving = this.actionsService.getFromRelatedArchiving();
  }

  getDataToUpdate() {
    if (this.isProspectType === true) {
      this.getOrganisationData(this.idOrganisation);
    } else {
      this.setIdCurrencyValidators();
      this.getClientData(this.idOrganisation);
    }
  }

  private setIdCurrencyValidators() {
    this.addOrganisationForm.controls['IdCurrency'].setValidators([Validators.required]);
  }

  private initLeadSources() {
    this.dropdownService.getAllFiltreByName('SOURCE', 'ORGANIZATION')
      .subscribe(data => {
        if (data) {
          data.forEach((filtreName) => {
              this.leadSources.push(filtreName.name);
            }
          );
        }
      });
  }

  ngOnChanges() {
  }

  fillDropDowns() {
    this.fillActivitySectors();
    this.initLeadSources();
  }


  public getOrganisationData(id: number) {
    this.organisationService.getJavaGenericService().getEntityById(id).subscribe(
      (data) => {
        if (data) {
          this.organisationData = data;
          this.tiersAddress =  this.organisationData.addresses;
          if ( this.tiersAddress &&  this.tiersAddress.length > 0 ) {
            this.tiersAddress.forEach((e, index) => {
              e.Id = this.organisationData.addresses[index].id  ;
              e.City = this.organisationData.addresses[index].city;
              e.Country = this.organisationData.addresses[index].country;
              e.IdCountry = this.organisationData.addresses[index].idCountry;
              e.IdCity = this.organisationData.addresses[index].idCity;
              e.Label = this.organisationData.addresses[index].label;
              e.PrincipalAddress = this.organisationData.addresses[index].principalAddress;
              e.Region = this.organisationData.addresses[index].region;
              e.CodeZip =  this.organisationData.addresses[index].zipCode;
              e.IdZipCodeNavigation = {
                Region: this.organisationData.addresses[index].region,
                  Code: this.organisationData.addresses[index].zipCode,
                  IdCity: e.IdCity,
                  IdCityNavigation: null,
                  Id: null,
                  IsDeleted: false,
                  TransactionUserId: 0,
                  CanEdit: true,
                  CanDelete: true,
                  CanShow: true,
                  CanValidate: true,
                  CanPrint: true,
                  EntityName: null
              };
              e.ExtraAdress =  this.organisationData.addresses[index].extraAddress;
            });
          this.getSelectedCurrencyProspet(this.organisationData.currencyId);
          }
          this.oldMail = this.organisationData.email;
          this.oldName = this.organisationData.name;
          if (Object.entries(data).length !== 0) {
            this.dataArray = [];
            this.dataArray.push(this.organisationData);
            this.datesToRemTab = [];
            data.datesToRemember.forEach((date) => {
              this.addDatesToRemember(new Date(date.date));
            });
            this.addOrganisationForm.patchValue(this.organisationData);
          }
        }
      }
    );
  }

  public getClientData(id: number ) {
    this.convertedContacts = [];
    this.tierSubscription = this.tiersService.getTiersById(id).subscribe(
      (data) => {
        if (data) {
          this.client = data;
          this.tiersAddress = this.client.Address;
          this.organisationData = new Organisation(data.Id, data.Name, data.Email, data.Phone,
            data.Address, data.Description, data.Fax, data.Linkedin, data.Facebook, data.Twitter, data.DateToRemember, data.Address
            , null, null, data.ActivitySector);
          this.organisationData.addresses = data.Address;
          this.clientDateToRemember = data.DateToRemember;
          this.getSelectedCurrency(data.IdCurrency);
          if (data.Contact) {
            data.Contact.forEach((contact) => {
              this.convertedContacts.push(this.convertContacts(contact));
            });
          }
          this.oldMail = this.organisationData.email;
          this.oldName = this.organisationData.name;
          this.gridSettingsContact.gridData = this.convertedContacts;
          //this.initAddressForm();
          if (Object.entries(data).length !== 0) {
            this.dataArray = [];
            this.dataArray.push(this.organisationData);
            this.gridSettings.gridData = this.dataArray;
            if (this.organisationData.datesToRemember) {
              this.datesToRemTab = [];
              this.organisationData.datesToRemember.forEach((date) => {
                this.addDatesToRemember(new Date(date.date));
              });
            } else {
              this.organisationData.datesToRemember = [];
            }
            this.addOrganisationForm.patchValue(this.organisationData);
          }

          this.organisationData.addresses = data.Address;
          if (this.organisationData.addresses && this.organisationData.addresses.length > 0 ) {
            this.organisationData.addresses.forEach((e, index) => {
                e.id = data.Address[index].Id > 0 && this.isProspectType === OpportunityType.PROSPECT ? data.Address[index].Id : null ;
              e.city = (data.Address[index] && data.Address[index].IdCityNavigation) ? data.Address[index].IdCityNavigation.Label : '' ;
              e.country = (data.Address[index] && data.Address[index].IdCountryNavigation) ? data.Address[index].IdCountryNavigation.NameFr : '';
                e.idCountry = data.Address[index].IdCountry;
                e.idCity = data.Address[index].IdCity;
                e.label = data.Address[index].Label;
                e.principalAddress = data.Address[index].PrincipalAddress;
                e.region = data.Address[index].Region;
                e.zipCode = data.Address[index].CodeZip;
                e.extraAddress = data.Address[index].ExtraAdress;
              }
            );
          }
          /*data.Address.forEach((e, i) => {


              this.cityService.getById(e.IdCity).subscribe(
                (city) => {
                  this.addOrganisationForm.value.addresses[i].city = city.Code;
                  this.organisationData.addresses[i].city = city.Code;
                  this.addOrganisationForm.patchValue(this.organisationData);
                }
              );
              this.countryService.getById(e.IdCountry).subscribe(
                (country) => {
                  this.addOrganisationForm.value.addresses[i].country = country.NameEn;
                  this.organisationData.addresses[i].country = country.NameEn;
                  this.addOrganisationForm.patchValue(this.organisationData);
                }
              );

            }
          );*/
          this.addOrganisationForm.patchValue(this.organisationData);
        }
      }
    );
  }

  /***
   * it take an organization and canverts it to a client (to be sent to .Net backend) using same attributes
   * @param organization
   */
  convertsOrganizationToClient() {
    const organization = this.convertAddOrganisationFormToOrganisation();
    this.client.Name = organization.name;
    this.client.Email = organization.email;
    this.client.Phone = organization.telephone;
    this.client.Fax = organization.fax;
    this.client.Linkedin = organization.linkedIn;
    this.client.Facebook = organization.facebook;
    this.client.Twitter = organization.twitter;
    this.client.Description = organization.description;
    this.client.Contact = [];
    this.client.IdCurrency = this.currencyID.value;
    this.client.ActivitySector = organization.activitySector;
    // @ts-ignore
    this.client.Address = organization.Address;
    return this.client;
  }

  convertContacts(contact): ContactCrm {
    return new ContactCrm(contact.Email, contact.Phone, contact.HomePhone,
      contact.OtherPhone, contact.AssistantName, contact.AssistantPhone, contact.Fax1,
      contact.Facebook, contact.Twitter, contact.Name, contact.Linkedin, contact.LastName,
      contact.Function, contact.DateOfBirth, contact.Description, contact.Adress);
  }

  private createAddForm(): void {
    this.addOrganisationForm = this.fb.group({
      name: ['', {
        validators: [Validators.required, Validators.pattern(CrmConstant.NAMES_PATTERN)], updateOn: 'blur'
      }],
      activitySector: ['', [Validators.required]],
      email: ['', {updateOn: 'blur'}],
      telephone: [NumberConstant.ZERO],
      fax: [NumberConstant.ZERO],
      linkedIn: [''],
      facebook: [''],
      twitter: [''],
      Id: [0.5],
      addresses: this.fb.array([]),
      Address: this.fb.array([]),
      description: [''],
      datesToRemember: this.fb.array([]),
      postalAddress: [''],
      leadSource: [''],
      IdCurrency: ['']

    });
    this.checkValidations();
  }

  get email(): FormControl {
    return this.addOrganisationForm.controls['email'] as FormControl;
  }

  get name(): FormControl {
    return this.addOrganisationForm.controls['name'] as FormControl;
  }

  fillActivitySectors() {
    this.dropdownService.getAllFiltreByName('ACTIVITY_SECTOR', 'ORGANIZATION')
      .subscribe(data => {
        if (data) {
          data.forEach((filtreName) => {
              this.activitySectors.push(filtreName.name);
              this.activitySectorsFiltred.push(filtreName.name);
            }
          );
        }
      });
  }


  checkValidations() {
    if (this.isProspectType) {
      this.email.setValidators([Validators.required, Validators.pattern(CrmConstant.MAIL_PATTERN)]);
      this.email.setAsyncValidators(uniquePropCrmJavaServices(OrganisationConstant.EMAIL, this.organisationService,
        CrmConstant.UPDATED_ELEMENT));
      this.name.setAsyncValidators(uniquePropCrmJavaServices(OrganisationConstant.NAME, this.organisationService,
        CrmConstant.UPDATED_ELEMENT));
    } else {
      this.email.setValidators([Validators.pattern(CrmConstant.MAIL_PATTERN)]);
      this.email.setAsyncValidators(unique(TiersConstants.EMAIL, this.tiersService, String(this.idOrganisation)));
      this.name.setAsyncValidators(unique(TiersConstants.NAME, this.tiersService, String(this.idOrganisation)));
    }
  }

  get currencyID(): FormControl {
    return this.addOrganisationForm.controls['IdCurrency'] as FormControl;
  }

  updateClientOrganisation() {
    if (this.addOrganisationForm.valid) {
      this.addOrganisationForm.value.currencyId = this.currencyID.value;
      this.client.idCurrency = this.currencyID.value;
      this.tiersService.saveTiers(this.convertsOrganizationToClient(), false).subscribe((data) => {
        this.changeUpdateMode.emit({'isUpdate': false});
        this.sideNavServiceOrganisation.hide(this.isProspectType);
        this.router.navigateByUrl(OrganisationConstant.ORGANISATION_LIST_URL);
      });
    } else {
      if (this.addOrganisationForm.controls[OrganisationConstant.NAME].invalid) {
        this.firstCollapseIsOpened = true;
      }
      if (this.addOrganisationForm.controls[OrganisationConstant.EMAIL].invalid) {
        this.secondeCollapseIsOpened = true;
      }
      this.validationService.validateAllFormFields(this.addOrganisationForm);
    }
  }

  checkDatesCollapseOpening() {
    (this.addOrganisationForm.get(OrganisationConstant.DATES_TO_REMIND) as FormArray)
      .controls.forEach((formGr, index) => {
      if (this.checkNumberofEventName(formGr.get(ContactConstants.EVENT_NAME).value) > 1) {
        this.datesToRememberCollapseIsOpened = true;
        this.addOrganisationForm.controls[OrganisationConstant.DATES_TO_REMIND].setErrors({'incorrect': true});
      }
    });
  }

  updateProspectOrganisation() {
    this.checkDatesCollapseOpening();
    if (this.addOrganisationForm.valid && this.organisationsRelatedPermissions.permissionValidForm) {
      let organisationToSend: Organisation;
      organisationToSend = this.convertAddOrganisationFormToOrganisation();
      organisationToSend.currencyId = this.addOrganisationForm.value.IdCurrency;
      this.organisationService.getJavaGenericService()
        .updateEntity(organisationToSend,
          this.idOrganisation)
        .subscribe((data) => {
            if (data) {
              this.isSaveOperation = true;
              if (this.canUpdatePermission) {
                this.permissionService.updatePermission(this.organisationsRelatedPermissions,
                  this.organisationEntityName, this.organisationData.id).subscribe(() => {
                }, (() => {
                  this.growlService.ErrorNotification(SharedCrmConstant.FAILURE_OPERATION);
                }));
              }
              this.growlService.successNotification(this.translateService.instant(OrganisationConstant.SUCCESS_OPERATION));
              this.changeUpdateMode.emit({'isUpdate': false});
              this.sideNavServiceOrganisation.hide(this.isProspectType);
              this.router.navigateByUrl(OrganisationConstant.ORGANISATION_LIST_URL);
            }
          }
        );
    } else {
      (this.addOrganisationForm.get(OrganisationConstant.DATES_TO_REMIND) as FormArray).controls.forEach((formGr, index) => {
        if (formGr.invalid || this.checkNumberofEventName(formGr.get(ContactConstants.EVENT_NAME).value
          || this.datesToRemTab[index] == null)) {
          this.datesToRememberCollapseIsOpened = true;
        }
      });
      if (this.addOrganisationForm.controls[OrganisationConstant.NAME].invalid) {
        this.firstCollapseIsOpened = true;
      }
      if (this.addOrganisationForm.controls[OrganisationConstant.EMAIL].invalid) {
        this.secondeCollapseIsOpened = true;
      }
      this.validationService.validateAllFormFields(this.addOrganisationForm);
    }
  }

  convertAddOrganisationFormToOrganisation() {
    const organisation = this.addOrganisationForm.getRawValue() as Organisation;

    organisation.addresses =   this.addOrganisationForm.getRawValue().Address ;
    if (organisation.addresses !== null && organisation.addresses.length > 0 ) {
      organisation.addresses.forEach((e, index) => {
          e.id =  organisation.addresses[index].Id > 0 ?  organisation.addresses[index].Id : null ;
          e.city =  this.addOrganisationForm.getRawValue().Address[index].City;
          e.country =  this.addOrganisationForm.getRawValue().Address[index].Country;
          e.idCountry =  organisation.addresses[index].IdCountry;
          e.idCity =  organisation.addresses[index].IdCity;
          e.label =  organisation.addresses[index].Label;
          e.principalAddress =  organisation.addresses[index].PrincipalAddress;
          e.region =  organisation.addresses[index].Region;
          e.zipCode =  organisation.addresses[index].CodeZip;
          e.extraAddress =  organisation.addresses[index].ExtraAdress;
        }
      );
    }
    organisation.dateRememberTodelete = this.idsDateToDelete;
    return organisation;
  }

  backToList() {
    this.router.navigateByUrl(this.urlService.getPreviousUrl());
  }

  returnToList() {
    const previousURL = this.urlService.getPreviousUrl().toString();
    const entity = previousURL.substring(10, previousURL.indexOf('/', 10)).toUpperCase();
    switch (entity) {
      case 'ARCHIVING' :
        this.router.navigateByUrl(OrganisationConstant.ORGANISATION_ARCHIVING_URL
          , {skipLocationChange: true});
        break;
      default :
        this.router.navigateByUrl(OrganisationConstant.ORGANISATION_LIST_URL
          , {skipLocationChange: true});
    }
  }

  isFromOpportunitySidNav(): boolean {
    return false;
  }

  checkSecondCollapse() {
    this.secondeCollapseIsOpened = !this.secondeCollapseIsOpened;
  }

  public sortChange(sort: SortDescriptor[]): void {
    this.sort = sort;
  }

  public dataStateChange(state: State): void {
    this.gridSettingsContact.state = state;
  }

  showDetails(e) {
    if (this.showPermitted && this.isProspectType) {
      this.showDetailContactEvent.emit({
        data: e.dataItem ? e.dataItem : e,
        parent: ContactConstants.ORGANISATION
      });
    }
  }

  public goToAdvancedEdit(dataItem) {
    this.sidNavService.show(dataItem, ContactConstants.ORGANISATION);
  }

  get datesToRemember(): FormArray {
    return this.addOrganisationForm.get(ContactConstants.DATES_TO_REMEMBER) as FormArray;
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
    this.datesToRemeberFormGroup = this.fb.group({
      id: [dateToRemember && dateToRemember.id ? dateToRemember.id : ''],
      eventName: [dateToRemember ? dateToRemember.eventName : '', [Validators.required,
        this.genericCrmService.uniqueValueInFormArray(Observable.of(this.datesToRemember), 'eventName')]],
      date: [dateToRemember ? dateToRemember.date : '', Validators.required]
    });
    return this.datesToRemeberFormGroup;
  }

  addDatesToRemember(date?: any) {
    date ? this.datesToRemTab.push(date) : this.datesToRemTab.push(null);
    this.datesToRemember.push(this.createDatesToRemForm(date));
  }

  changeDate(event, i: number) {
    (this.datesToRemember.controls[i] as FormGroup).controls['date'].setValue(this.exactDate.getDateExact(new Date(event)));
  }

  checkNumberofEventName(eventName: string) {
    const datesToRemTab = [];
    (this.addOrganisationForm.get(OrganisationConstant.DATES_TO_REMIND) as FormArray).controls.forEach((date) => {
      datesToRemTab.push(date.value);
    });
    const valueArr = datesToRemTab.map(function (item) {
      return item.eventName;
    });
    const valueToReturn = valueArr.filter(item => item === eventName).length;
    valueToReturn > 1 ? this.addOrganisationForm.controls[OrganisationConstant.DATES_TO_REMIND].setErrors({'incorrect': true}) :
      this.addOrganisationForm.controls[OrganisationConstant.DATES_TO_REMIND].setErrors(null);
    return valueToReturn;
  }

  checkBackInterface() {
    return this.urlService.getBackMessage();
  }


  handleFiltreActivitySectors(value) {
    this.activitySectors = this.activitySectorsFiltred.filter(o => o.enumText.toLowerCase().indexOf(value.toLowerCase()) !== -1);
  }

  selectedPermission() {
    this.permissionService.getResult().subscribe(data => {
      if (data && data.permission && (data.parent === this.parentPermission)) {
        this.organisationsRelatedPermissions = data.permission;
      }
    });
  }

  loadPermission(canUpdatePermission) {
    this.canUpdatePermission = canUpdatePermission;
  }

  /**get tiers Currency symbol */
  getSelectedCurrency(idCurrency) {
    if (idCurrency) {
      this.currencyService.getById(idCurrency.Id).subscribe(currency => {
        this.formatSaleOptions = {
          idCurrency: currency ? currency.Id : null,
          style: 'currency',
          currency: currency ? currency.Code : null,
          currencyDisplay: 'symbol',
          minimumFractionDigits: currency ? currency.Precisioncurrency : null
        };
        if (this.client)  {
          this.client.IdCurrencyNavigation = currency;
        }
        this.addOrganisationForm.controls['IdCurrency'].setValue(this.formatSaleOptions.idCurrency);
      });
    }

  }

  onNameMouseOut() {
    this.nameInput.nativeElement.blur();
  }

  onEmailMouseOut() {
    this.emailInput.nativeElement.blur();
  }

  getFooterClass(): string {
    return this.styleConfigService.getFooterClassSettingLayoutAddComponent();
  }

  /**
   * this method will be called by CanDeactivateGuard service to check the leaving component possibility
   */
  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (this.isSaveOperation) {
      this.isSaveOperation = false;
      return true;
    }
    return this.validationService.handleCanDeactivateToLeaveCurrentComponent(this.isOrganisationFormGroupChanged.bind(this));
  }

  isOrganisationFormGroupChanged(): boolean {
    return this.addOrganisationForm.touched;
  }

  ngOnDestroy(): void {
    this.actionsService.resetArchivingMode();
  }


  getSelectedCurrencyProspet(idCurrency) {
    if (idCurrency) {
      this.currencyService.getById(idCurrency).subscribe(currency => {
        this.formatSaleOptions = {
          idCurrency: currency.Id,
          style: 'currency',
          currency: currency.Code,
          currencyDisplay: 'symbol',
          minimumFractionDigits: currency.Precision
        };

        this.addOrganisationForm.controls['IdCurrency'].setValue(this.formatSaleOptions.idCurrency);
      });
    }

  }

  public collapseAddressOpened = false;
  public openAddressDetailsCollapse = false;
  private checkCollapseAddressStateOnUpdate() {
    if (this.Address.value.length === NumberConstant.ZERO) {
      this.collapseAddressOpened = true;
    }
    if (!this.openAddressDetailsCollapse) {
      this.collapseAddressOpened = false;
      this.Address.controls = this.Address.controls
        .filter(adress => !TiersAddressComponent.isEmptyAdressFields(adress.value));
    }
  }

  private checkCollapseAddressOnCloseValidation() {
    const addressFormArray = this.addOrganisationForm.controls.Address as FormArray;
    if (addressFormArray.value.length > 0 && !addressFormArray.valid) {
      this.openAddressDetailsCollapse = true;
    }
  }
  get Address(): FormArray {
    return this.addOrganisationForm.get(TiersConstants.ADDRESS) as FormArray;
  }

}
