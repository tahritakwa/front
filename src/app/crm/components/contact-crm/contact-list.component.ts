import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewContainerRef
} from '@angular/core';
import {SortDescriptor, State} from '@progress/kendo-data-query';
import {ContactCrmService} from '../../services/contactCrmService/contact-crm.service';
import {FormModalDialogService} from '../../../shared/services/dialog/form-modal-dialog/form-modal-dialog.service';
import {TiersService} from '../../../purchase/services/tiers/tiers.service';
import {NumberConstant} from '../../../constant/utility/number.constant';
import {ColumnSettings} from '../../../shared/utils/column-settings.interface';
import {GridSettings} from '../../../shared/utils/grid-settings.interface';
import {SideNavService} from '../../services/sid-nav/side-nav.service';
import {ContactConstants} from '../../../constant/crm/contact.constant';
import {SwalWarring} from '../../../shared/components/swal/swal-popup';
import {TranslateService} from '@ngx-translate/core';
import {OrganisationConstant} from '../../../constant/crm/organisation.constant';
import {GrowlService} from '../../../../COM/Growl/growl.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ContactService} from '../../../purchase/services/contact/contact.service';
import {Subscription} from 'rxjs/Subscription';
import {OrganisationService} from '../../services/organisation/organisation.service';
import {Filter, Operation, OrderBy, OrderByDirection, PredicateFormat, Relation} from '../../../shared/utils/predicate';
import {TiersConstants} from '../../../constant/purchase/tiers.constant';
import {OpportunityConstant} from '../../../constant/crm/opportunityConstant';
import {GenericCrmService} from '../../generic-crm.service';
import {AddProspectComponent} from './add-prospect/add-prospect.component';
import {SharedConstant} from '../../../constant/shared/shared.constant';
import {PopupSendMailComponent} from '../../../mailing/components/template-email/popup-send-mail/popup-send-mail.component';
import {CrmConstant} from '../../../constant/crm/crm.constant';
import {ArchivePopupComponent} from '../archiving/archive-popup/archive-popup.component';
import {ContactCrm} from '../../../models/crm/contactCrm.model';
import {Contact} from '../../../models/shared/contact.model';
import {Tiers} from '../../../models/achat/tiers.model';
import {Observable} from 'rxjs/Observable';
import {SharedCrmConstant} from '../../../constant/crm/sharedCrm.constant';
import {HttpCrmErrorCodes} from '../../http-error-crm-codes';
import {ModulesSettingsService} from '../../../shared/services/modulesSettings/modules-settings.service';
import {FileInfo as FInfo} from '../../../models/shared/objectToSend';
import {FileService} from '../../../shared/services/file/file-service.service';
import {SharedAccountingConstant} from '../../../constant/accounting/sharedAccounting.constant';
import {PermissionService} from '../../services/permission/permission.service';
import {CurrencyService} from '../../../administration/services/currency/currency.service';
import {CityService} from '../../../administration/services/city/city.service';
import {CountryService} from '../../../administration/services/country/country.service';
import {CountryModelExcelModel} from '../../../models/crm/countryModelExcel.model';
import {CityModelExcelModel} from '../../../models/crm/cityModelExcel.model';
import {PermissionConstant} from '../../../Structure/permission-constant';
import {AuthService} from '../../../login/Authentification/services/auth.service';


@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.scss']
})
export class ContactListComponent implements OnInit, OnChanges, OnDestroy {
  public static TRANSLATE_CUSTOMER = 'CUSTOMER';
  @Input() isArchivingMode = false;
  @Input() sourceParent: string;
  @Input() source: string;
  @Input() sourceId: number;
  @Input() related = false;
  @Input() isProspect = true;
  @Output() countContacts = new EventEmitter();
  @Input() fromRelatedArchiving = false;

  @Input() isFromOrgInsideOppDetails = false;
  public sideNavUpdateMode = false;
  dataToSendToPoPUp: any;

  public contactsPredicate: PredicateFormat = PredicateFormat.prepareContactPredicate();
  public tiersPredicate: PredicateFormat;

  public showDetailContact = false;
  public searchValue = '';
  public choosenFilterNumber = 0;
  public filterByOrg: boolean;
  public hideOrgColumn = false;
  public organisationList = [];
  public filteredOrganisationList = [];

  public clientsList = [];
  public filteredClientsList = [];

  public filterG = 'ALL_CONTACTS';
  public checkbox_column_width = 45;
  public checkbox_column_width_clients = 30;

  public deleteContactPossibility: any;
  public organizationToFilter;
  public showingModeIsContacts = true;
  public contactToShowInSideNav;
  public contactType = ContactConstants.PROSPECT_TYPE;
  public CRMPermissions = PermissionConstant.CRMPermissions;
  public gridState: State = {
    skip: 0,
    take: NumberConstant.TEN,

    // Initial filter descriptor
    filter: {
      logic: 'and',
      filters: []
    }
  };

  public gridStateContact: State = {
    skip: 0,
    take: NumberConstant.TEN,

    // Initial filter descriptor
    filter: {
      logic: 'and',
      filters: []
    }
  };
  public sort: SortDescriptor[] = [{
    field: ContactConstants.NAME_field,
    dir: 'asc'
  }];

  public columnsConfig: ColumnSettings[] = [
    {
      field: ContactConstants.NAME_field,
      title: ContactConstants.FULL_NAME,
      tooltip: ContactConstants.FULL_NAME,
      _width: 180,
      filterable: true
    },
    {
      field: ContactConstants.POST_field,
      title: ContactConstants.POST,
      tooltip: ContactConstants.POST,
      _width: 140,
      filterable: true
    },
    {
      field: ContactConstants.EMAIL_field,
      title: ContactConstants.EMAIL,
      tooltip: ContactConstants.EMAIL,
      _width: 160,
      filterable: true
    },
    {
      field: ContactConstants.PHONE_field,
      title: ContactConstants.PHONE,
      tooltip: ContactConstants.PHONE,
      _width: 150,
      filterable: false
    },
    {
      field: ContactConstants.ORGANISATION_field,
      title: ContactConstants.ORGANISATION_TITLE,
      tooltip: ContactConstants.ORGANISATION_TITLE,
      _width: 180,
      filterable: true
    }
  ];
  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig,
  };


  public pagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;


  public columnsConfigContacts: ColumnSettings[] = [
    {
      field: ContactConstants.FIRST_NAME_CONTACT,
      title: ContactConstants.FULL_NAME,
      _width: 180,
      filterable: true
    },
    {
      field: ContactConstants.FONCTION_CONTACT,
      title: ContactConstants.POST,
      _width: 160,
      filterable: true
    },
    {
      field: ContactConstants.EMAIL_CONTACT,
      title: ContactConstants.EMAIL,
      _width: 140,
      filterable: true
    },
    {
      field: ContactConstants.TELEPHONE_CONTACT,
      title: ContactConstants.PHONE,
      _width: 160,
      filterable: true
    },
    {
      field: ContactConstants.TIER_CONTACT,
      title: ContactConstants.ORGANISATION_TITLE,
      _width: 180,
      filterable: true
    }
  ];
  public gridSettingsContacts: GridSettings = {
    state: this.gridStateContact,
    columnsConfig: this.columnsConfigContacts,
  };
  private contactSubscription: Subscription;
  cardViewB = false;
  public selectedRows: number [] = [];
  public listMails: string[] = [];
  public isFromOrganisationArchive: boolean;
  public isFromArchive: boolean;
  private oldSerachValue = '';
  public tabActiveClass = 'tab-pane active show';
  public tabInactiveClass = 'tab-pane';
  public navItemActiveClass = 'nav-link nav-link-new active show navTitle';
  public navItemInactiveClass = 'nav-link nav-link-new show navTitle';
  public tabProspectClass = this.tabActiveClass;
  public tabClientClass = this.tabInactiveClass;
  public prospectNavItemClass = this.navItemActiveClass;
  public clientNavItemClass = this.navItemInactiveClass;
  public readonly IS_PROSPECT_PARAM = 'isProspect';
  public sortParams = SharedCrmConstant.DEFAULT_SORT;
  public showSendMail = true;
  public fileinfo: FInfo = new FInfo();
  private currentFileUpload: File;
  public shouldShow = false;

  spinner = false;
  public organisationsRelatedPermissions: any;
  EXCEL_FILE_MAX_SIZE = 5;
  public uuid = Math.floor(Math.random() * NumberConstant.ONE_THOUSAND);


  public predicate: PredicateFormat;
  public parentPermission = 'ADD_CONTACT';

  private realtedContactsPermissions: any;


  private contactEntityName = ContactConstants.CONTACT_ENTITY_NAME;
  public countries = [];
  public countriesFilter = [];
  public cities = [];
  public citiesFilter = [];


  countryModelExcel: Array<CountryModelExcelModel> = [];
  cityModelExcel: Array<CityModelExcelModel> = [];
  public tabType = 1;
  public hasAddPermission = false;
  public hasOnlyClientPermission = false;
  /**
   *
   * @param router
   * @param contactCrmService
   * @param translate
   * @param formModalDialogService
   * @param sidNavService
   * @param growlService
   * @param organisationService
   * @param viewRef
   * @param tiersService
   * @param swallWarning
   * @param contactService
   * @param genericCrmService
   * @param activatedRoute
   */
  constructor(private router: Router,
              private contactCrmService: ContactCrmService,
              private translate: TranslateService,
              private formModalDialogService: FormModalDialogService,
              private  sidNavService: SideNavService,
              private growlService: GrowlService,
              private organisationService: OrganisationService,
              private viewRef: ViewContainerRef,
              private tiersService: TiersService,
              private swallWarning: SwalWarring,
              private contactService: ContactService,
              private genericCrmService: GenericCrmService,
              private activatedRoute: ActivatedRoute,
              private serviceModulesSettings: ModulesSettingsService,
              protected fileServiceService: FileService,
              private permissionService: PermissionService,
              private currencyService: CurrencyService,
              public cityService: CityService,
              private countryService: CountryService,
              public authService: AuthService) {
    this.initTiersPredicate();
  }

  updateListAfterUpdateContactFromOrgDetails() {
    this.sidNavService.getResult().subscribe((data) => {
      if (data && data.value === true && data.source === 'organization-details') {
        this.initRelatedGridDataSourceContacts();
      }
    });
  }

  ngOnInit() {
    this.hasAddPermission = this.authService.hasAuthority(PermissionConstant.CRMPermissions.ADD_CONTACT);
    this.hasOnlyClientPermission = this.authService.hasAuthority(PermissionConstant.CRMPermissions.VIEW_CONTACT_CLIENT) && (! this.authService.hasAuthority(PermissionConstant.CRMPermissions.VIEW_CONTACT_LEAD));
    this.getCountriesList();
    this.selectedPermission();
    this.updateListAfterUpdateContactFromOrgDetails();
    this.redirectListByContactType();
    this.checkSendMail();
    this.activatedRoute.params.subscribe(params => {
      const organisationId = params[CrmConstant.ORGANISATION_ID];
      const archive = params[CrmConstant.ARCHIVE];
      if (organisationId) {
        this.isFromArchive = true;
        this.isFromOrganisationArchive = true;
        this.isArchivingMode = archive === 'true';
        this.initRelatedIsProspectsContactsGrid(organisationId, this.isArchivingMode);
      }
    });
    if (!this.related && !this.source && !this.isFromArchive) {
      this.initGridDataSource(this.gridState.skip);
      this.getContactsFromDotNet();
      this.getAllOrganisations();
      this.loadSideNavEvent();
    }
  }

  checkSendMail() {
    this.serviceModulesSettings.getModulesSettings().subscribe(data => {
      if (!data[SharedConstant.MAILING]) {
        this.showSendMail = false;
      }
    });
  }

  private redirectListByContactType() {
    this.activatedRoute.queryParams
      .subscribe(params => {
        if ((Object.keys(params).length > NumberConstant.ZERO && params[(this.IS_PROSPECT_PARAM)] === false) ||  this.hasOnlyClientPermission)  {
          this.switchTabStyleClient();
        } else if (Object.keys(params).length > NumberConstant.ZERO) {
          this.switchTabStyleProspect();
        } else if (this.related) {
          if (this.isProspect) {
            this.switchTabStyleProspect();
          } else {
            this.switchTabStyleClient();
          }
        }
      });
  }

  switchTabStyleClient() {
    this.contactType = ContactConstants.CLIENT_TYPE;
    this.tabProspectClass = this.tabInactiveClass;
    this.tabClientClass = this.tabActiveClass;
    this.clientNavItemClass = this.navItemActiveClass;
    this.prospectNavItemClass = this.navItemInactiveClass;
    this.changeShowingMode(2);
  }

  switchTabStyleProspect() {
    this.contactType = ContactConstants.PROSPECT_TYPE;
    this.tabProspectClass = this.tabActiveClass;
    this.tabClientClass = this.tabInactiveClass;
    this.prospectNavItemClass = this.navItemActiveClass;
    this.clientNavItemClass = this.navItemInactiveClass;
    this.changeShowingMode(1);
  }

  public isNotArchivingModeAndFromRelated() {
    return this.related && (!this.fromRelatedArchiving) && !this.isFromArchive;
  }

  private loadSideNavEvent() {
    this.sidNavService.getResult().subscribe((data) => {
      if (!data.value && this.showingModeIsContacts) {
        this.initPage();
        this.initGridDataSource(this.gridState.skip);
      } else if (!data.value && !this.showingModeIsContacts) {
        this.getContactsFromDotNet();
      }
    });
  }

  initRelatedIsProspectsContactsGrid(organisationId, isArchive) {
    const page = this.gridSettings.state.skip / this.gridSettings.state.take;
    const service = isArchive ? OpportunityConstant.PROSPECTS_CONTACTS_ORGANISATION + '/archived' :
      OpportunityConstant.PROSPECTS_CONTACTS_ORGANISATION;
    this.contactSubscription = this.contactCrmService.getJavaGenericService()
      .getData(service + `?idOrganisation=${organisationId}&page=${page}&size=${this.gridSettings.state.take}`)
      .subscribe((data) => {
        this.countContacts.emit(data.totalElements);
        this.gridSettings.gridData = {
          data: data.contactCrmDtoList,
          total: data.totalElements
        };
      });
  }

  initRelatedIsNotProspectsContactsGrid() {
    const contacts = [];
    this.showingModeIsContacts = false;
    this.tiersService.getTiersById(this.sourceId).subscribe((client) => {
        client.Contact.forEach(data => {
          const contact = {
            FirstName: data.FirstName + ' ' + data.LastName,
            Fonction: data.Fonction,
            Tel1: data.Tel1,
            Email: data.Email,
            IdTiers: data.IdTiers,
            Id: data.Id,
            organisationName: client.Name
          };
          contacts.push(contact);
        });
        this.countContacts.emit(contacts.length);
        this.gridSettingsContacts.gridData = {
          data: contacts,
          total: contacts.length
        };
      }
    );

  }

  ngOnChanges(simpleChanges: SimpleChanges): void {
    if (simpleChanges.sourceId !== undefined && this.related) {
      this.initRelatedGridDataSourceContacts();
    }
  }

  /**
   * Grid data source initiation
   * */
  initGridDataSource(page) {
    this.contactSubscription =
      this.contactCrmService.getJavaGenericService().getEntityList(`${ContactConstants.IS_ARCHIVED}${this.isArchivingMode}?page=${page}&size=${this.gridState.take}&sort=${this.sortParams}`)
        .subscribe(data => {
          this.gridSettings.gridData = {
            data: data.contactCrmDtoList,
            total: data.totalElements
          };
        });
  }

  onPageChange(event, fromCard?) {
    if (!fromCard) {
      this.gridSettings.state = event;
    }
    const page = fromCard ? event : (event.skip / event.take);
    if (this.choosenFilterNumber === 1 && this.organizationToFilter !== null && this.organizationToFilter !== undefined) {
      this.filterByOrganization(this.organizationToFilter, page);
    } else if (this.related) {
      this.initRelatedGridDataSourceContacts();
    } else {
      this.checkIsFinalSearchFilter(page);
    }
  }

  private checkIsFinalSearchFilter(page) {
    if (!this.genericCrmService.isNullOrUndefinedOrEmpty(this.searchValue)) {
      this.finalSearchAndFilter(page);
    } else {
      this.initGridDataSource(page);
    }
  }

  onContactPageChange(event, fromCard?) {
    this.getContactsFromDotNet();
  }

  public contactDataStateChange(state: any): void {
    this.tiersPredicate.OrderBy = new Array<OrderBy>();
    if (state.sort && state.sort.length > 0 && state.sort[NumberConstant.ZERO]) {
      this.tiersPredicate.OrderBy.push(new OrderBy(state.sort[NumberConstant.ZERO].field, state.sort[NumberConstant.ZERO].dir));
    }
    this.gridSettingsContacts.state = state;
    this.gridStateContact = state;
    this.isProspect = false;
  }

  public dataStateChange(state: any): void {
    if (state.sort[NumberConstant.ZERO] && state.sort[NumberConstant.ZERO].field === this.columnsConfig[3].field) {
      return;
    }
    this.sortParams = (state.sort.length > 0) ? `${state.sort[NumberConstant.ZERO].field},${state.sort[NumberConstant.ZERO].dir}` :
      this.sortParams = SharedCrmConstant.DEFAULT_SORT;
    this.gridSettings.state = state;
    this.gridState = state;
    this.isProspect = true;
  }

  public sortChange(sort: SortDescriptor[]): void {
    this.sort = sort;
    if (this.choosenFilterNumber === 1 && this.organizationToFilter !== null) {
      this.filterByOrganization(this.organizationToFilter, this.gridState.skip);
    } else if (this.related) {
      this.initRelatedGridDataSourceContacts();
    } else {
      this.isProspect ? this.initGridDataSource(this.gridState.skip) : this.getContactsFromDotNet();
    }
  }

  public removeHandler(dataItem) {
    if (this.contactType === ContactConstants.PROSPECT_TYPE) {
      this.swallWarning.CreateSwal(this.translate.instant(ContactConstants.PUP_UP_DELETE_CONTACT_TEXT)).then((result) => {
        if (result.value) {
          this.contactCrmService.getJavaGenericService().deleteEntity(dataItem.id).subscribe((data) => {
              this.deleteContactPossibility = data;

            }, error => {
            }, () => {
              if (this.deleteContactPossibility === true) {
                if (this.related) {
                  this.initRelatedGridDataSourceContacts();
                } else {
                  this.growlService.successNotification(this.translate.instant(OrganisationConstant.SUCCESS_OPERATION));
                  this.initGridDataSource(this.gridState.skip);
                }
              }

            }
          );
        }
      });
    } else {
      const client = dataItem;
      this.swallWarning.CreateSwal(this.translate.instant(ContactConstants.PUP_UP_DELETE_CONTACT_TEXT)).then((result) => {
        if (result.value) {
          this.checkIfContactRelatedAndDelete(event, client);
        }
      });
    }
  }

  private checkIfContactRelatedAndDelete(event, client) {
    this.contactCrmService.getJavaGenericService()
      .getData(ContactConstants.CHECK_EXIST_RELATED_CONTACT_CLIENT + client.Id)
      .subscribe(data => {
        this.deleteContactPossibility = data;
      }, (error => {
      }), () => {
        if (this.deleteContactPossibility === true) {
          this.removeClientContact(event, client);
        }
      });
  }

  private removeClientContact(event, client) {
    this.contactService.remove(client).subscribe(data => {
      this.gridSettingsContacts.gridData.data =
        this.gridSettingsContacts.gridData.data.filter(emp => emp.Id !== client.Id);
      this.initFilterVariables(this.choosenFilterNumber);
    });
  }

  private impossibleDeleteRelatedToClaim() {
    this.swallWarning.CreateSwal(this.translate.instant(ContactConstants.IMPOSSIBLE_TO_DELETE_CONTACT_RELATED_TO_CLAIM),
      this.translate.instant(ContactConstants.SUPPRESSION_IMPOSSIBLE_EXPLICATION),
      ContactConstants.OK, ContactConstants.CANCEL, true, true);
  }

  private impossibleDeleteRelatedToOpportunity() {
    this.swallWarning.CreateSwal(this.translate.instant(ContactConstants.IMPOSSIBLE_TO_DELETE_CONTACT_RELATED_TO_OPP),
      this.translate.instant(ContactConstants.SUPPRESSION_IMPOSSIBLE_EXPLICATION),
      ContactConstants.OK, ContactConstants.CANCEL, true, true);
  }

  private impossibleDeleteRelatedToOpp_Claim() {
    this.swallWarning.CreateSwal(this.translate.instant(ContactConstants.IMPOSSIBLE_TO_DELETE_CONTACT_RELATED_TO_OPP_CLAIM),
      this.translate.instant(ContactConstants.SUPPRESSION_IMPOSSIBLE_EXPLICATION),
      ContactConstants.OK, ContactConstants.CANCEL, true, true);
  }

  goToDetails(dataItem) {
    this.router.navigateByUrl(ContactConstants.CONTACT_DETAILS_URL
      .concat(this.isProspect ? String(dataItem.id) : String(dataItem.Id)).concat('/' + !this.isProspect), {skipLocationChange: true});
  }

  filterContacts(nb: number) {
    switch (nb) {
      case NumberConstant.ZERO: {
        this.initFilterVariables(NumberConstant.ZERO);
        if (this.showingModeIsContacts) {
          this.initGridDataSource(this.gridState.skip);
        } else {
          this.prepareFinalPredicate();
          this.getContactsFromDotNet();
        }

        break;
      }
      case NumberConstant.ONE : {
        this.initFilterVariables(NumberConstant.ONE);
        break;
      }
    }
  }

  private initFilterVariables(filterType: number) {
    this.hideOrgColumn = false;

    if (filterType === NumberConstant.ZERO) {
      this.filterG = 'ALL_CONTACTS';
      this.choosenFilterNumber = 0;
      this.filterByOrg = false;
      this.organizationToFilter = null;
      this.initPage();
    } else if (filterType === NumberConstant.ONE) {
      this.filterG = 'ORGANISM_LABEL';
      this.choosenFilterNumber = NumberConstant.ONE;
      this.filterByOrg = true;
      this.initPage();
    }
  }

  public filterByOrganization(event, page) {
    this.hideOrgColumn = true;
    this.organizationToFilter = event;
    if (event && (event.id || event.Id)) {
      this.searchValue ? this.getProspectPageByOrganizationIdAndSearchValue(page) : this.getProspectContactPageByFilter(event, page);
    } else {
      this.checkSearchValueAndGetAllContact(page);
    }
  }

  public finalSearchAndFilterByClient(event?) {
    this.organizationToFilter = event;
    if (event) {
      this.hideOrgColumn = true;
      if (this.searchValue) {
        this.resetStateContactsGrid();
        this.checkSearchValueAndInitPredicateInClientsMode();
      } else {
        this.prepareFinalPredicate();
        this.getContactsFromDotNet();
      }
    } else {
      this.hideOrgColumn = false;
      this.prepareFinalPredicate();
      this.getContactsFromDotNet();
    }
  }

  private checkSearchValueAndGetAllContact(page) {
    if (this.searchValue) {
      this.finalSearchAndFilter(page);
    } else {
      this.hideOrgColumn = false;
      this.initPage();
      if (this.showingModeIsContacts) {
        page.skip ? this.initGridDataSource(this.gridState.skip) : this.initGridDataSource(page);
      }
    }
  }

  private getProspectContactPageByFilter(event, page) {
    const service = this.isArchivingMode ? '/archived/pages' : '/pages';
    this.contactCrmService.getJavaGenericService().getData(ContactConstants.GET_BY_ORGANISATION_URL + event.id
      + service + '?page=' + page + '&size=' + this.gridState.take).subscribe((data) => {
      this.gridSettings.gridData = {
        data: data.contactCrmDtoList,
        total: data.totalElements
      };
    });
  }

  getAllOrganisations() {
    this.organisationService.getJavaGenericService().getEntityList(`/filter-contact/archived/${this.isArchivingMode}`)
      .subscribe(data => {
        this.organisationList = data;
        this.filteredOrganisationList = data;
      });
    this.tiersService.processDataServerSide(this.tiersPredicate)
      .subscribe((data) => {
        this.clientsList = this.getOnlyClientsWithContacts(data.data);
        this.filteredClientsList = this.getOnlyClientsWithContacts(data.data);
      });
  }

  private getOnlyClientsWithContacts(clientsList: Tiers[]): Tiers[] {
    return clientsList.filter(tier => tier.Contact.length !== 0);
  }

  public filterOrganizationsList(value) {
    this.filteredOrganisationList = this.organisationList.filter(o => o.name.toLowerCase().indexOf(value.toLowerCase()) !== -1);
  }

  public filterClientList(event) {
    this.filteredClientsList = this.clientsList.filter(o => o.Name.toLowerCase().indexOf(event.toLowerCase()) !== -1);
  }

  initPage() {
    if (this.showingModeIsContacts) {
      this.gridState.skip = 0;
    } else {
      this.gridStateContact.skip = 0;
      this.contactDataStateChange(this.gridStateContact);
    }
  }

  ngOnDestroy(): void {
    if (this.contactSubscription !== undefined && this.contactSubscription !== null) {
      this.contactSubscription.unsubscribe();
    }
  }

  SidNavEvent() {
    this.showDetailContact = false;
  }

  checkTypeItem(e) {
    return e.type === this.translate.instant(ContactListComponent.TRANSLATE_CUSTOMER);
  }

  changeShowingMode(event) {
    this.tabType = event;
    this.contactType = event === 1 ? ContactConstants.PROSPECT_TYPE : ContactConstants.CLIENT_TYPE;
    this.isProspect = this.contactType === ContactConstants.PROSPECT_TYPE;
    this.showingModeIsContacts = event === 1;
    this.showDetailContact = false;
    this.selectedRows = [];
    /**
     * To save filter or search value result
     */
    this.initFilterVariables(NumberConstant.ZERO);
    if (!this.showingModeIsContacts) {
      this.gridSettingsContacts.state.skip = 0;
      if (this.related) {
        this.initRelatedIsNotProspectsContactsGrid();
      } else {
        this.getContactsFromDotNet();
      }
    }
  }

  getContactsFromDotNet() {
    this.contactsPredicate.Filter.push(new Filter(ContactConstants.ID_TIERS_NAVIGATION, Operation.eq, TiersConstants.CUSTOMER_TYPE));
    this.contactService.reloadServerSideData(this.gridSettingsContacts.state, this.contactsPredicate,
      ContactConstants.DATA_SOURCE_PREDICATE).subscribe((data) => {
      const tiersId = [];
      const allContacts = data.data;
      for (let i = 0; i < allContacts.length; i++) {
        tiersId.push(allContacts[i].IdTiers);
      }
      this.getClientName(tiersId, allContacts, data.total);
      if (this.isDataAndTotalChanged(data)) {
        this.contactDataStateChange(this.gridStateContact);
      }
      if (!this.isProspect) {
        this.countContacts.emit(allContacts.length);
      }
    });
  }

  getClientName(tiersId: Array<number>, allContacts: any, total: number) {
    if (!this.genericCrmService.isNullOrUndefinedOrEmpty(tiersId)) {
      this.tiersService.getTiersListByArray(tiersId).subscribe(clients => {
        const contactDotNetList = [];
        clients.forEach(client => {
          const filteredContacts = allContacts.filter((contact) => contact.IdTiers === client.Id);
          this.checkFilteredList(filteredContacts, client, contactDotNetList);
        });
        this.gridSettingsContacts.gridData = {
          data: contactDotNetList,
          total: total
        };
      });
    }
  }

  checkFilteredList(filteredContacts, client, contactDotNetList) {
    if (filteredContacts.length === NumberConstant.ONE) {
      filteredContacts[0].organisationName = client.Name;
      contactDotNetList.push(filteredContacts[0]);
    } else {
      filteredContacts.forEach((_contact) => {
        _contact.organisationName = client.Name;
        contactDotNetList.push(_contact);
      });
    }
  }

  changeViewToCard(x) {
    this.cardViewB = true;
  }

  changeViewToList(e) {
    this.cardViewB = false;

  }

  getCardDetail(event) {
    this.showDetailContact = true;
    this.contactToShowInSideNav = {value: true, 'data': event, 'isToUpdate': true, 'prospectType': true};
  }

  deleteFromCard(event) {
    event = {dataItem: event};
    this.removeHandler(event);
  }

  private initRelatedGridDataSourceContacts() {
    switch (this.source) {
      case 'organisation':
        this.isProspect ? this.initRelatedIsProspectsContactsGrid(this.sourceId, this.isArchivingMode) :
          this.initRelatedIsNotProspectsContactsGrid();
        break;
      default  :
        return;
    }

  }

  sendMail() {
    this.listMails = [];
    if (this.showingModeIsContacts) {
      this.contactCrmService.getContactsByIds(this.selectedRows).subscribe((data) => {
        this.getEmailsFromList(data);
      });
    } else {
      for (const contactId of this.selectedRows) {
        this.contactService.getById(contactId).subscribe((contact: Contact) => {
          this.listMails.push(contact.Email);
        });
      }
    }
    this.dataToSendToPoPUp = {
      listMails: this.listMails
    };
    this.showSendMailPopup();
    this.resetSelection();
  }

  private getEmailsFromList(list: ContactCrm[]) {
    list.map(contact => {
      this.listMails.push(contact.mail);
    });
  }

  resetSelection() {
    this.selectedRows = [];
  }

  showSendMailPopup() {
    this.formModalDialogService.openDialog(
      'Send Mail', PopupSendMailComponent, this.viewRef, this.initGrid.bind(this), this.dataToSendToPoPUp,
      false, SharedConstant.MODAL_DIALOG_SIZE_XM);
  }

  finalSearchAndFilter(page: number) {
    if (this.showingModeIsContacts) {
      this.resetStateProspectsGrid();
      this.searchAndFilterProspectContact(page);
    } else {
      this.finalSearchAndFilterByClient(this.organizationToFilter);
    }
  }

  private resetStateProspectsGrid() {
    if (this.searchValue !== this.oldSerachValue) {
      this.gridSettings.state.skip = 0;
    }
  }

  private resetStateContactsGrid() {
    if (this.searchValue !== this.oldSerachValue) {
      this.gridSettingsContacts.state.skip = 0;
    }
  }

  private checkSearchValueAndInitPredicateInClientsMode() {
    this.prepareFinalPredicate();
    this.getContactsFromDotNet();
  }

  private initTiersPredicate() {
    this.tiersPredicate = PredicateFormat.prepareTiersPredicateWithContacts(TiersConstants.CUSTOMER_TYPE);
    this.tiersPredicate.OrderBy = new Array<OrderBy>();
    this.tiersPredicate.OrderBy.push(new OrderBy(OrganisationConstant.NAME_TIERS, OrderByDirection.asc));
  }

  private prepareFinalPredicate() {
    if (this.contactsPredicate.Filter !== []) {
      this.contactsPredicate.Filter = new Array<Filter>();
    }
    this.contactsPredicate.Filter.push(new Filter(ContactConstants.ID_TIERS_NAVIGATION, Operation.eq, TiersConstants.CUSTOMER_TYPE));
    if (this.organizationToFilter && this.organizationToFilter.Id) {
      this.addFilterByTiersToPredicate(this.organizationToFilter.Id);
    }
    if (this.searchValue) {
      this.contactsPredicate.Filter.push(new Filter('FirstName', Operation.contains, this.searchValue,
        false, true));
      this.contactsPredicate.Filter.push(new Filter('LastName', Operation.contains, this.searchValue,
        false, true));
      this.contactsPredicate.Filter.push(new Filter('Email', Operation.contains, this.searchValue,
        false, true));
    }
    this.contactsPredicate.Relation = new Array<Relation>();
    this.contactsPredicate.Relation.push(new Relation(TiersConstants.ID_CURRENCY_NAVIGATION));
    this.contactsPredicate.Relation.push(new Relation(TiersConstants.ID_TAXEGROUP_TIERS_NAVIGATION));
    this.contactsPredicate.Filter.push(new Filter(TiersConstants.ID_TYPE_TIERS, Operation.eq, TiersConstants.CUSTOMER_TYPE));
    this.oldSerachValue = this.searchValue;
  }

  private addFilterByTiersToPredicate(clientId: number) {
    if (clientId) {
      this.contactsPredicate.Filter.push(new Filter('IdTiers', Operation.eq, clientId,
        false, false));
    }
  }

  private searchAndFilterProspectContact(page: number) {
    if (this.choosenFilterNumber === NumberConstant.ZERO || !this.organizationToFilter.id) {
      this.checkSearchValue(page);
    } else if (this.choosenFilterNumber === NumberConstant.ONE) {
      this.checkSearchValueAndFilter(page);
    }
  }

  private checkSearchValueAndFilter(page: number) {
    this.searchValue ? this.getProspectPageByOrganizationIdAndSearchValue(page) : this.filterByOrganization(this.organizationToFilter,
      this.gridState.skip);
  }

  private checkSearchValue(page: number) {
    this.searchValue ? this.getProspectPageBySearchValue(page) : this.initGridDataSource(this.gridState.skip / this.gridState.take);
  }

  getProspectPageBySearchValue(page) {
    const service = this.isArchivingMode ? '/archived/' : '';
    this.contactCrmService.getJavaGenericService().getData(ContactConstants.SEARCH + this.searchValue
      + service + '?page=' + page + '&size=' + this.gridState.take).subscribe((data) => {
      this.gridSettings.state.skip = ((page + 1) * this.gridSettings.state.take) - this.gridSettings.state.take;
      this.gridSettings.gridData = {
        data: data.contactCrmDtoList,
        total: data.totalElements
      };
    });
  }

  getProspectPageByOrganizationIdAndSearchValue(page) {
    const service = this.isArchivingMode ? '/archived/' : '';
    this.contactCrmService.getJavaGenericService().getData(ContactConstants.SEARCH + this.searchValue +
      ContactConstants.ORGANIZATION_ID + this.organizationToFilter.id + service + '?page=' + page + '&size=' + this.gridState.take)
      .subscribe((data) => {
        this.gridSettings.gridData = {
          data: data.contactCrmDtoList,
          total: data.totalElements
        };
      });
  }

  private isDataAndTotalChanged(value) {
    return this.gridSettingsContacts.gridData !== undefined && this.gridSettingsContacts.gridData.data !== value.data &&
      this.gridSettingsContacts.gridData.data.length !== value.data.length;
  }

  public openAddPopUp() {
    this.formModalDialogService.openDialog(null, AddProspectComponent, this.viewRef,
      this.initRelatedGridDataSourceContacts.bind(this), {
        source: this.source,
        data: this.sourceId,
        contactType: this.isProspect
      },
      false, SharedConstant.MODAL_DIALOG_SIZE_ML);
  }

  archiveFromCard(event) {
    this.archiveSelected(event);
  }

  restoreFromCard(event) {
    this.restoreSelected(event);
  }

  public archiveSelected(dataItem) {
    this.contactCrmService.getJavaGenericService().getData('archive/dependency/'.concat(dataItem.id)).subscribe(archiveDependency => {
      const dataToSendToPoPUp = {
        isArchiving: true,
        archiveDependency: archiveDependency,
        source: 'contact',
        sourceId: dataItem.id,
        textHeader: this.translate.instant(ContactConstants.PUP_UP_ARCHIVE_CONTACT_TEXT)
      };
      this.showPopUp(dataToSendToPoPUp, CrmConstant.ARCHIVING_TITLE);
    });
  }

  public restoreSelected(dataItem) {
    this.contactCrmService.getJavaGenericService().getData('restore/dependency/'.concat(dataItem.id)).subscribe(archiveDependency => {

      const dataToSendToPoPUp = {
        isArchiving: false,
        archiveDependency: archiveDependency,
        source: 'contact',
        sourceId: dataItem.id,
        textHeader: this.translate.instant(ContactConstants.RESTART_CONTACT_TEXT)
      };
      this.showPopUp(dataToSendToPoPUp, CrmConstant.REACTIVATION_TITLE);
    });
  }

  initGrid() {
    if (this.related) {
      this.initRelatedGridDataSourceContacts();
    } else {
      this.initGridDataSource(this.gridState.skip);
    }
  }

  showPopUp(dataToSendToPoPUp, titre) {
    this.formModalDialogService.openDialog(titre, ArchivePopupComponent, this.viewRef, this.initGrid.bind(this),
      dataToSendToPoPUp, false, SharedConstant.MODAL_DIALOG_SIZE_M);
  }

  /**
   * this method will be called by CanDeactivateGuard service to check the leaving component possibility
   */
  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    return this.genericCrmService.handleCanDeactivateToLeaveCurrentComponent(this.isUpdateMode.bind(this));
  }

  isUpdateMode(): boolean {
    return this.showDetailContact && this.sideNavUpdateMode;
  }

  setSideNavUpdateMode(event) {
    this.sideNavUpdateMode = event;
  }

  ContactListInit(event) {
    this.initGridDataSource(this.gridState.skip);
  }


  public downLoadFile(event) {
    this.contactCrmService.downloadContactExcelTemplate(this.countryModelExcel, this.cityModelExcel).subscribe(
      res => {

        this.fileinfo.FileData = res.base64File;
        this.fileinfo.Name = 'ImportContact.xlsx';

        this.fileServiceService.downLoadFile(this.fileinfo);
      });
  }

  public incomingFile(event) {
    //this.createEmptyImportSupplierFormGroup();


    this.currentFileUpload = event.target.files[0];
    if (this.currentFileUpload) {
      const reader = new FileReader();
      reader.readAsBinaryString(this.currentFileUpload);
      this.handleInputChange(this.currentFileUpload);
      this.currentFileUpload = undefined;

    }

  }

  saveFile(base64result, file) {
    this.contactCrmService.saveContactFromFile({
      'base64File': base64result,
      'name': file.name
    }).subscribe(
      e => {
        e.forEach((element) => {
            this.permissionService.savePermission(this.realtedContactsPermissions, this.contactEntityName, element.id).subscribe(() => {
              this.initGridDataSource(this.gridState.skip);
            });
          }
        );

        //  this.goToOrganisationList();
      });
  }

  selectedPermission() {
    this.permissionService.getResult().subscribe(data => {
      if (data) {
        if (data && data.permission && (data.parent === this.parentPermission)) {
          this.realtedContactsPermissions = data.permission;
        }
      }
    });
  }


  handleInputChange(file) {
    const reader = new FileReader();
    const maxSize = this.EXCEL_FILE_MAX_SIZE * SharedAccountingConstant.ONE_MEGABYTE;
    if (file.size < maxSize) {
      if (file.type.match(/-*excel/) || file.type.match(/-*xls-*/) || file.type.match(/-*spreadsheet-*/)) {
        reader.onloadend = this._handleReaderLoaded.bind(this, file);
        reader.readAsDataURL(file);
      } else {
        alert(this.translate.instant(SharedAccountingConstant.INVALID_FILE_TYPE));
      }
    } else {
      alert(this.translate.instant(SharedAccountingConstant.EXCEL_FILE_MAX_SIZE_EXCEEDED, {maxSize: maxSize}));
    }

  }

  _handleReaderLoaded(file, e) {
    const reader = e.target;
    const base64result = reader.result.substr(reader.result.indexOf(',') + 1);

    if (base64result !== undefined) {
      this.saveFile(base64result, file);
    }
  }


  getCountriesList() {

    this.countryService.getAllUserWithoutState().subscribe(
      (countries) => {
        this.countries = countries;

        this.cityService.getAllUserWithoutState().subscribe(
          (city) => {
            this.cities = city;

            this.fillData(countries, city);
          }
        );


      }
    );


  }

  fillData(countries, cities) {
    countries.data.forEach((country) => {
        const data = {
          Id: country.Id,
          NameEn: country.NameEn,
          NameFr: country.NameFr

        };
        this.countryModelExcel.push(data);
      }
    );
    cities.data.forEach((city) => {
        const data = {
          Id: city.Id,
          Code: city.Code,
          IdCountry: city.IdCountry

        };
        this.cityModelExcel.push(data);
      }
    );

  }

}
