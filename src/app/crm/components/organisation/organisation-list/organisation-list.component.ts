import {Component, Input, OnInit, ViewContainerRef} from '@angular/core';
import {FormModalDialogService} from '../../../../shared/services/dialog/form-modal-dialog/form-modal-dialog.service';
import {ContactCrmService} from '../../../services/contactCrmService/contact-crm.service';
import {NumberConstant} from '../../../../constant/utility/number.constant';
import {SortDescriptor, State} from '@progress/kendo-data-query';
import {GridSettings} from '../../../../shared/utils/grid-settings.interface';
import {ColumnSettings} from '../../../../shared/utils/column-settings.interface';
import {OrganisationService} from '../../../services/organisation/organisation.service';
import {CrmConstant} from '../../../../constant/crm/crm.constant';
import {OrganisationConstant} from '../../../../constant/crm/organisation.constant';
import {SwalWarring} from '../../../../shared/components/swal/swal-popup';
import {TranslateService} from '@ngx-translate/core';
import {GrowlService} from '../../../../../COM/Growl/growl.service';
import {OrganisationSideNavService} from '../../../services/sid-nav/organisation-side-nav.service';
import {ActivatedRoute, Router} from '@angular/router';
import {
  Filter as predicate,
  Operator,
  OrderBy,
  OrderByDirection,
  PredicateFormat,
  Relation,
  SpecFilter
} from '../../../../shared/utils/predicate';
import {TiersConstants} from '../../../../constant/purchase/tiers.constant';
import {TiersService} from '../../../../purchase/services/tiers/tiers.service';
import {Organisation} from '../../../../models/crm/organisation.model';
import {SharedConstant} from '../../../../constant/shared/shared.constant';
import {ArchivePopupComponent} from '../../archiving/archive-popup/archive-popup.component';
import {GenericCrmService} from '../../../generic-crm.service';
import {Observable} from 'rxjs/Observable';
import {OpportunityService} from '../../../services/opportunity.service';
import {PopupSendMailComponent} from '../../../../mailing/components/template-email/popup-send-mail/popup-send-mail.component';
import {ModulesSettingsService} from '../../../../shared/services/modulesSettings/modules-settings.service';
import {UrlServicesService} from '../../../services/url-services.service';
import {ActionService} from '../../../services/action/action.service';
import {SpinnerService} from '../../../../../COM/spinner/spinner.service';
import {FileService} from '../../../../shared/services/file/file-service.service';
import {FileInfo, FileInfo as FInfo} from '../../../../models/shared/objectToSend';
import {SharedAccountingConstant} from '../../../../constant/accounting/sharedAccounting.constant';
import {PermissionService} from '../../../services/permission/permission.service';
import {ReducedCurrency} from '../../../../models/administration/reduced-currency.model';
import {CurrencyService} from '../../../../administration/services/currency/currency.service';
import {CityService} from '../../../../administration/services/city/city.service';
import {CountryService} from '../../../../administration/services/country/country.service';
import {CountryModelExcelModel} from '../../../../models/crm/countryModelExcel.model';
import {CityModelExcelModel} from '../../../../models/crm/cityModelExcel.model';
import {AuthService} from '../../../../login/Authentification/services/auth.service';
import {PermissionConstant} from '../../../../Structure/permission-constant';
import {ContactConstants} from '../../../../constant/crm/contact.constant';
import {ClaimType} from '../../../../models/crm/enums/claimType.enum';
import {SharedCrmConstant} from '../../../../constant/crm/sharedCrm.constant';
import {FiltrePredicateModel} from '../../../../models/shared/filtrePredicate.model';
import {FieldTypeConstant} from '../../../../constant/shared/fieldType.constant';
import {Filter} from '../../../../models/accounting/Filter';
import {isNullOrUndefined} from 'util';
import {OpportunityType} from '../../../../models/crm/enums/opportunityType.enum';
import {PagerSettings} from '@progress/kendo-angular-grid';

@Component({
  selector: 'app-organisationlist',
  templateUrl: './organisation-list.component.html',
  styleUrls: ['./organisation-list.component.scss']
})
export class OrganisationListComponent implements OnInit {
  public static TRANSLATE_CUSTOMER = 'CUSTOMER';
  public static TRANSLATE_PROSPECT = 'PROSPECTS.PROSPECT';
  @Input() isArchivingMode = false;
  @Input() fromRelatedArchiving = false;
  // this object to be used in the searchFilterValue
  public orgListParams = {
    pageNumber: 1,
    pageSize: 10,
    showSearchFilterComp: true
  };
  public predicate: PredicateFormat;
  public predicateForImport: PredicateFormat;
  public value: string;
  public convertedClients;
  public organisations;
  public response;
  private pageSize: number = NumberConstant.TEN;
  public ORGANISATION_LIST = 'ORGANISATION_LIST';
  public ORGANISATION_LIST_PROSPECT = 'ORGANISATION_LIST_PROSPECT';
  public prospectType = true;
  public clickedClientOnce = true;
  public clickedProspectOnce = true;
  showSidNav = false;
  public organisationToShowInSideNav;
  public organisationType = OrganisationConstant.PROSPECT_TYPE;
  public organisationFiltred: any;
  public cardViewB = false;
  public organisationsSelected: number [] = [];
  public selectKey = 'id';
  public pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
  public navItemActiveClass = 'active show';
  public navItemInactiveClass = 'show';
  public prospectNavItemClass = this.navItemActiveClass;
  public clientNavItemClass = this.navItemInactiveClass;

  public showCountryCityCol = true;
  public sideNavUpdateMode = false;
  public listClients;
  public listMails: string[] = [];
  dataToSendToPoPUp: any;
  public showSendMail = true;
  public CRMPermissions = PermissionConstant.CRMPermissions;
  public gridState: State = {
    skip: 0,
    take: this.pageSize,

    // Initial filter descriptor
    filter: {
      logic: 'and',
      filters: []
    }
  };
  public sort: SortDescriptor[] = [{
    field: OrganisationConstant.NAME,
    dir: 'asc'
  }];
  public columnsConfig: ColumnSettings[] = [
    {
      field: OrganisationConstant.NAME,
      title: CrmConstant.NAME,
      filterable: true,
      _width: 150
    },
    {
      field: OrganisationConstant.EMAIL,
      title: CrmConstant.EMAIL,
      filterable: true,
      _width: 150
    },
    {
      field: OrganisationConstant.PHONE,
      title: CrmConstant.PHONE,
      filterable: true,
      _width: 150
    },
    {
      field: OrganisationConstant.ADDRESSES,
      title: OrganisationConstant.ADDRESSES_TITLE,
      filterable: true,
      _width: 150
    }
  ];

  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig,
  };
  public fileinfo: FInfo = new FInfo();
  private currentFileUpload: File;
  public shouldShow = false;
  public parentPermission = 'ADD_ORGANIZATION';
  spinner = false;
  public organisationsRelatedPermissions: any;
  EXCEL_FILE_MAX_SIZE = 5;
  private readonly IS_PROSPECT_PARAM = CrmConstant.IS_PROSPECT_PARAM;
  public uuid = Math.floor(Math.random() * NumberConstant.ONE_THOUSAND);
  // Currency List
  public currencyDataSource = [];
  public currencyFiltredDataSource: Array<ReducedCurrency>;
  countryModelExcel: Array<CountryModelExcelModel> = [];
  cityModelExcel: Array<CityModelExcelModel> = [];
  public hasAddPermission = false;
  public hasShowPermission = false;
  public hasOnlyClientPermission = false;
  public sortParams = SharedCrmConstant.DEFAULT_SORT;

  public filterFieldsColumns = [];
  public filterFieldsInputs = [];
  public predicateAdvancedSearch: PredicateFormat;
  public filters = new Array<Filter>();
  public predicateTiers: PredicateFormat[] = [];
  public predicateIdTypeTiers: PredicateFormat;
  public searchType = NumberConstant.ONE;

  /**
   *
   * @param tiersService
   * @param router
   * @param activatedRoute
   * @param contactCrmService
   * @param organisationService
   * @param translateService
   * @param formModalDialogService
   * @param growlService
   * @param sidNavService
   * @param swallWarning
   * @param genericCrmService
   * @param viewRef
   */
  constructor(public tiersService: TiersService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private contactCrmService: ContactCrmService,
              private organisationService: OrganisationService,
              private translateService: TranslateService,
              private formModalDialogService: FormModalDialogService,
              private growlService: GrowlService,
              private  sidNavService: OrganisationSideNavService,
              private swallWarning: SwalWarring,
              private  actionService: ActionService,
              private genericCrmService: GenericCrmService,
              private viewRef: ViewContainerRef,
              private urlService: UrlServicesService,
              private spinnerService: SpinnerService,
              private opportunityService: OpportunityService,
              private serviceModulesSettings: ModulesSettingsService,
              protected fileServiceService: FileService,
              private permissionService: PermissionService,
              private currencyService: CurrencyService,
              public cityService: CityService,
              private countryService: CountryService,
              public authService: AuthService) {
    this.predicateAdvancedSearch = PredicateFormat.prepareTiersPredicate(TiersConstants.CUSTOMER_TYPE);
    this.predicate = PredicateFormat.prepareTiersPredicateWithContacts(TiersConstants.CUSTOMER_TYPE);
    this.predicateIdTypeTiers = PredicateFormat.prepareIdTypeTiersPredicate(TiersConstants.CUSTOMER_TYPE);
  }


  ngOnInit() {
    this.hasAddPermission = this.authService.hasAuthority(PermissionConstant.CRMPermissions.ADD_ORGANISATION);
    this.hasShowPermission = this.authService.hasAuthority(PermissionConstant.CRMPermissions.VIEW_ORGANISATION_LEAD) || this.authService.hasAuthority(PermissionConstant.CRMPermissions.VIEW_ORGANISATION_CLIENT);
    this.hasOnlyClientPermission = this.authService.hasAuthority(PermissionConstant.CRMPermissions.VIEW_ORGANISATION_CLIENT) && (!this.authService.hasAuthority(PermissionConstant.CRMPermissions.VIEW_ORGANISATION_LEAD));
    this.initFilterCustomer();
    this.getCountriesList();
    this.selectedPermission();
    this.initDataSource();
    this.urlService.getPreviousUrl();
    this.redirectListByOrganisationType();
    this.checkSendMail();
    this.sidNavService.getResult().subscribe((data) => {
      if (!data.value) {
        if (data.prospectType) {
          this.orgListParams = {
            pageNumber: this.orgListParams.pageNumber,
            pageSize: this.pageSize,
            showSearchFilterComp: true
          };
          this.showSidNav = false;
        } else {
          this.initState();
          this.initClientGridDataSource();
          this.showSidNav = false;

        }
      }
    });
  }

  checkSendMail() {
    this.serviceModulesSettings.getModulesSettings().subscribe(data => {
      if (!data[SharedConstant.MAILING]) {
        this.showSendMail = false;
      }
    });
  }

  getOperatorPredicate(operator: Operator) {
    this.predicateAdvancedSearch.Operator = operator;
  }

  resetClickEvent() {
    this.initPredicateAdvancedSearch();
    this.initGridDataSource();
  }

  initPredicateAdvancedSearch() {
    this.predicateAdvancedSearch = new PredicateFormat();
    this.predicateAdvancedSearch.Filter = new Array<predicate>();
    this.predicateAdvancedSearch = PredicateFormat.prepareTiersPredicate(TiersConstants.CUSTOMER_TYPE);
    this.predicateTiers = [];
    this.predicateIdTypeTiers.OrderBy = new Array<OrderBy>();
    this.predicateIdTypeTiers.OrderBy.push.apply(this.predicateIdTypeTiers.OrderBy,
      [new OrderBy(TiersConstants.ID, OrderByDirection.desc)]);
    this.predicateTiers.push(this.predicateIdTypeTiers);
    this.predicateTiers.push(this.mergefilters());
    this.predicateTiers[NumberConstant.ONE].Filter = [];
    this.filters = new Array<Filter>();
  }

  searchClick() {
    this.filters = this.prepareFilter();
    this.gridSettings.state.skip = NumberConstant.ZERO;
    this.initGridDataSource();
  }

  prepareFilter() {
    const filters = new Array<Filter>();
    this.predicateAdvancedSearch.Filter.forEach(filter => {
      filters.push(new Filter(this.getFieldType(filter), this.getOperation(filter), filter.prop, filter.value));
    });
    if (this.predicateAdvancedSearch.SpecFilter.length > 0) {
      // tslint:disable-next-line:no-shadowed-variable
      this.predicateAdvancedSearch.SpecFilter.forEach((SpecFilter) => {
        if (SpecFilter.Prop === 'IdCountryNavigation.Id') {
          // tslint:disable-next-line:max-line-length
          filters.push(new Filter('country', SpecFilter.Predicate.Filter[0].operation + '', 'country', SpecFilter.Predicate.Filter[0].value));
        }
        if (SpecFilter.Prop === 'IdCityNavigation.Id') {
          // tslint:disable-next-line:max-line-length
          filters.push(new Filter('city', SpecFilter.Predicate.Filter[0].operation + '', 'city', SpecFilter.Predicate.Filter[0].value));
        }
      });
    }
    return filters;
  }
  getFieldType(filter: predicate): string {
    const type = this.organisationService.getType(filter, this.filterFieldsColumns, this.filterFieldsInputs);
    return this.organisationService.getFilterType(type);
  }

  getOperation(filter: predicate): string {
    return this.organisationService.getOperation(filter, this.filterFieldsColumns, this.filterFieldsInputs);
  }

  getFilterPredicate(filtre) {
    this.searchType = NumberConstant.ZERO;
    this.predicateTiers = [];
    this.predicateTiers.push(this.predicateIdTypeTiers);
    this.prepareSpecificFiltreFromAdvancedSearch(filtre);
    this.prepareFiltreFromAdvancedSearch(filtre);
    this.predicateTiers.push(this.mergefilters());
  }

  private prepareSpecificFiltreFromAdvancedSearch(filtre) {
    if (filtre.SpecificFiltre && !filtre.SpecificFiltreToDelete) {
      this.predicateAdvancedSearch.SpecFilter = this.predicateAdvancedSearch.SpecFilter.filter(value => value.Prop !== filtre.SpecificFiltre.Prop);
      this.predicateAdvancedSearch.SpecFilter.push(filtre.SpecificFiltre);
    } else if (filtre.SpecificFiltreToDelete) {
      this.predicateAdvancedSearch.SpecFilter = this.predicateAdvancedSearch.SpecFilter.filter(value => value.Prop !== filtre.SpecificFiltre.Prop);
    }
  }

  private prepareFiltreFromAdvancedSearch(filtreFromAdvSearch) {
    this.predicateAdvancedSearch.Filter = this.predicateAdvancedSearch.Filter.filter(value => value.prop !== filtreFromAdvSearch.prop);
    if (filtreFromAdvSearch.operation && !isNullOrUndefined(filtreFromAdvSearch.value) && !filtreFromAdvSearch.SpecificFiltre) {
      this.predicateAdvancedSearch.Filter.push(filtreFromAdvSearch);
    }
  }

  mergefilters() {
    let predicate = new PredicateFormat();
    if (this.predicateAdvancedSearch) {
      this.cloneAdvancedSearchPredicate(predicate);
    }

    return (predicate);
  }

  public cloneAdvancedSearchPredicate(targetPredicate: PredicateFormat) {
    targetPredicate.Filter = this.predicateAdvancedSearch.Filter;
    targetPredicate.IsDefaultPredicate = this.predicateAdvancedSearch.IsDefaultPredicate;
    targetPredicate.Operator = this.predicateAdvancedSearch.Operator;
    targetPredicate.OrderBy = this.predicateAdvancedSearch.OrderBy;
    targetPredicate.Relation = this.predicateAdvancedSearch.Relation;
    targetPredicate.SpecFilter = this.predicateAdvancedSearch.SpecFilter;
    targetPredicate.SpecificRelation = this.predicateAdvancedSearch.SpecificRelation;
    targetPredicate.page = this.predicateAdvancedSearch.page;
    targetPredicate.pageSize = this.predicateAdvancedSearch.pageSize;
    targetPredicate.values = this.predicateAdvancedSearch.values;
  }

  /**
   * Grid data source initiation
   * */

  initGridDataSource(event?) {
    if (event) {
      if (this.prospectType) {
        this.organisations = event.value.data;
        if (this.isDataAndTotalChanged(event.value)) {
          this.gridState.skip = 0;
          this.dataStateChange(this.gridState);
        }
        this.gridSettings.gridData = {
          data: event.value.data,
          total: event.value.total
        };
      } else {
        this.searchClientOrganization(event);
      }
      this.showCountryCityCol = event.showCityCountry;
      this.organisationFiltred = this.gridSettings;
    } else {
      if (!this.prospectType) {
        this.searchClientOrganization(event);
      } else {
        const service = this.isArchivingMode ? 'archive/pages' : 'pages';
        if (this.isArchivingMode) {
          this.organisationService.getJavaGenericService()
            .getEntityList(service + `?page=${this.gridState.skip}&size=${this.orgListParams.pageSize}`)
            .subscribe((dataArchive) => {
                if (dataArchive) {
                  for (const organisation of dataArchive.organisationDtoList) {
                    if (organisation.type === OrganisationListComponent.TRANSLATE_CUSTOMER) {
                      organisation.type = this.translateService.instant(OrganisationListComponent.TRANSLATE_CUSTOMER);
                    } else {
                      organisation.type = this.translateService.instant(OrganisationListComponent.TRANSLATE_PROSPECT);
                    }
                  }
                  this.organisations = dataArchive.organisationDtoList;
                  this.gridSettings.gridData = {
                    data: dataArchive.organisationDtoList,
                    total: dataArchive.totalElements
                  };
                  this.organisationFiltred = this.gridSettings;
                }
              }
            );
        } else {
          this.organisationService.getJavaGenericService()
            .sendData(service + `?page=${this.gridState.skip}&size=${this.orgListParams.pageSize}&sort=${this.sortParams}`, this.filters)
            .subscribe((data) => {
                if (data) {
                  for (const organisation of data.content) {
                    if (organisation.type === OrganisationListComponent.TRANSLATE_CUSTOMER) {
                      organisation.type = this.translateService.instant(OrganisationListComponent.TRANSLATE_CUSTOMER);
                    } else {
                      organisation.type = this.translateService.instant(OrganisationListComponent.TRANSLATE_PROSPECT);
                    }
                  }
                  this.organisations = data.content;
                  this.gridSettings.gridData = {
                    data: data.content,
                    total: data.numberOfElements
                  };
                  this.organisationFiltred = this.gridSettings;
                }
              }
            );
        }
      }
    }

  }

  getAdresse(adresse) {
    const addresseCountryCity = '';
    if (adresse.country) {
      return addresseCountryCity.concat(adresse.country).concat(', ').concat(adresse.city);
    } else {
      return addresseCountryCity;
    }
  }

  private initCustomersFiltreConfigOrganisation() {

    this.filterFieldsColumns.push(new FiltrePredicateModel(TiersConstants.NAME_TITLE, FieldTypeConstant.TEXT_TYPE, TiersConstants.NAME));

    this.filterFieldsColumns.push(new FiltrePredicateModel(TiersConstants.CURRENCY, FieldTypeConstant.CURRENCY_DROPDOWN_COMPONENT,
      TiersConstants.ID_CURRENCY_NAVIGATION_ID));

    this.filterFieldsColumns.push(new FiltrePredicateModel(OrganisationConstant.ACTIVITY_SECTOR, FieldTypeConstant.CRM_DROPDOWN_MULTISELECT_COMPONENT,
      OrganisationConstant.ACTIVITY_SECTOR));
    this.filterFieldsInputs.push(new FiltrePredicateModel(TiersConstants.CITY_TTTLE, FieldTypeConstant.CITY_DROPDOWN_COMPONENT,
      TiersConstants.CITY_FIELD, true, SharedConstant.SHARED, TiersConstants.ADDRESSES_MODEL, TiersConstants.ID_TIERS,
      TiersConstants.CITY_NAVIGATION_ID));

    this.filterFieldsInputs.push(new FiltrePredicateModel(TiersConstants.COUNTRY_TTTLE, FieldTypeConstant.COUNTRY_COMPONENT_DROPDOWN,
      TiersConstants.COUNTRY_NAVIGATION_ID));
  }

  initFilterCustomer() {
    this.predicateIdTypeTiers.OrderBy = new Array<OrderBy>();
    this.predicateIdTypeTiers.OrderBy.push.apply(this.predicateIdTypeTiers.OrderBy,
      [new OrderBy(TiersConstants.ID, OrderByDirection.desc)]);
    this.predicateTiers.push(this.predicateIdTypeTiers);
    this.predicateIdTypeTiers.Relation.push.apply(this.predicateIdTypeTiers.Relation,
      [new Relation(TiersConstants.ID_TIER_CATEGORY_NAVIGATION)]);
  }

  private initProspectFiltreConfigOrganisation() {
    this.filterFieldsColumns.push(new FiltrePredicateModel(CrmConstant.NAME, FieldTypeConstant.TEXT_TYPE, OrganisationConstant.NAME));
    this.filterFieldsColumns.push(new FiltrePredicateModel(OrganisationConstant.CURRENCY_LABEL, FieldTypeConstant.CURRENCY_DROPDOWN_COMPONENT,
      OrganisationConstant.CURRENCY));
    this.filterFieldsColumns.push(new FiltrePredicateModel(OrganisationConstant.ACTIVITY_SECTOR, FieldTypeConstant.CRM_DROPDOWN_MULTISELECT_COMPONENT,
      OrganisationConstant.ACTIVITY_SECTOR));
    this.filterFieldsInputs.push(new FiltrePredicateModel(TiersConstants.COUNTRY_TTTLE, FieldTypeConstant.COUNTRY_COMPONENT_DROPDOWN,
      TiersConstants.COUNTRY_FIELD, true, SharedConstant.SHARED, TiersConstants.ADDRESSES_MODEL, TiersConstants.ID_TIERS,
      TiersConstants.COUNTRY_NAVIGATION_ID));
    this.filterFieldsInputs.push(new FiltrePredicateModel(TiersConstants.CITY_TTTLE, FieldTypeConstant.CITY_DROPDOWN_COMPONENT,
      TiersConstants.CITY_FIELD, true, SharedConstant.SHARED, TiersConstants.ADDRESSES_MODEL, TiersConstants.ID_TIERS,
      TiersConstants.CITY_NAVIGATION_ID));
  }

  private searchClientOrganization(event) {
    if (event && event.value && event.value.data) {
      this.convertedClients = [];
      this.listClients = event.value.data.data;
      this.listClients.forEach((client) => {
        this.convertedClients.push(this.convertClientToOrganisation(client));
      });
      this.gridSettings.gridData = {
        data: this.convertedClients,
        total: event.value.data.total
      };
    } else {
      this.initClientGridDataSource();
    }
  }


  initClientGridDataSource() {
    this.orgListParams.showSearchFilterComp = false;
    this.convertedClients = [];
    this.tiersService.reloadServerSideDataWithListPredicate(this.gridSettings.state, this.predicateTiers,
      SharedConstant.GET_DATA_WITH_SPECIFIC_FILTER).subscribe(data => {
      this.listClients = data.data;
      this.listClients.forEach((client) => {
        this.convertedClients.push(this.convertClientToFillOnGrid(client));
      });
      this.gridSettings.gridData = {
        data: this.convertedClients,
        total: data.total
      };
      this.organisationFiltred = this.gridSettings;
    });
  }

  convertClientToFillOnGrid(client): Organisation {

    let organisationClient = new Organisation(client.Id, client.Name, client.Email, client.Phone,
      client.Adress, client.Description, client.Fax1, client.Linkedin, client.Facebook, client.Twitter,
      this.translateService.instant(OrganisationListComponent.TRANSLATE_CUSTOMER));
    organisationClient.addresses =  client.Address ;
    if (organisationClient.addresses !== null && organisationClient.addresses.length > 0 ) {
      organisationClient.addresses.forEach((e, index) => {
          e.id = client.Address[index].Id > 0 && this.organisationType === OpportunityType.PROSPECT ? client.Address[index].Id : null ;
          e.city = (client.Address[index] && client.Address[index].IdCityNavigation) ? client.Address[index].IdCityNavigation.Label : '' ;
          e.country = (client.Address[index] && client.Address[index].IdCountryNavigation) ? client.Address[index].IdCountryNavigation.NameFr : '';
          e.idCountry = client.Address[index].IdCountry;
          e.idCity = client.Address[index].IdCity;
          e.label = client.Address[index].Label;
          e.principalAddress = client.Address[index].PrincipalAddress;
          e.region = client.Address[index].Region;
          e.zipCode = client.Address[index].CodeZip;
          e.extraAddress = client.Address[index].ExtraAdress;
        }
      );
    }
    return organisationClient;
  }

  convertClientToOrganisation(client): Organisation {

    let organisationClient = new Organisation(client.Id, client.Name, client.Email, client.Phone,
      client.Adress, client.Description, client.Fax1, client.Linkedin, client.Facebook, client.Twitter,
      this.translateService.instant(OrganisationListComponent.TRANSLATE_CUSTOMER));
    organisationClient.addresses =  client.Address ;
    if (organisationClient.addresses !== null && organisationClient.addresses.length > 0 ) {
      organisationClient.addresses.forEach((e, index) => {
          e.id = client.Address[index].Id > 0 && this.organisationType === OpportunityType.PROSPECT ?client.Address[index].Id : null ;
          e.city = client.Address[index].IdCityNavigation.Label;
          e.country = client.Address[index].IdCountryNavigation.NameFr;
          e.idCountry = client.Address[index].IdCountry;
          e.idCity = client.Address[index].IdCity;
          e.label = client.Address[index].Label;
          e.principalAddress = client.Address[index].PrincipalAddress;
          e.region = client.Address[index].Region;
          e.zipCode = client.Address[index].CodeZip;
          e.extraAddress = client.Address[index].ExtraAdress;
        }
      );
    }
    return organisationClient;
  }

  onPageChange(event, card?) {
    this.pageSize = event.take ? event.take : this.pageSize;
    if (this.prospectType) {
      this.orgListParams = {
        pageNumber: card !== undefined ? event : (event.skip / NumberConstant.TEN) + NumberConstant.ONE,
        pageSize: this.pageSize,
        showSearchFilterComp: true
      };
      this.initGridDataSource();
    } else {
      this.initClientGridDataSource();
    }
  }

  public dataStateChange(state: any): void {
    if (state.sort) {
      this.sortParams = (state.sort.length > 0) ? `${state.sort[NumberConstant.ZERO].field},${state.sort[NumberConstant.ZERO].dir}` :
        this.sortParams = SharedCrmConstant.DEFAULT_SORT;
    }
    this.pageSize = state.take;
    this.gridSettings.state = state;
  }

  public sortChange(sort: SortDescriptor[]): void {
    this.sort = sort;
    if (!this.prospectType) {
      this.initClientGridDataSource();
    } else {
      this.initGridDataSource();
    }
  }

  public removeHandler(dataItem) {
    if (this.prospectType) {
      this.swallWarning.CreateSwal(this.translateService.instant(OrganisationConstant.PUP_UP_DELETE_ORGANIZATION_TEXT)).then((result) => {
        this.sidNavService.hide(this.prospectType);
        if (result.value) {
          let value;
          this.organisationService.getJavaGenericService().deleteEntity(dataItem.id).subscribe((data) => {
            value = data;
          }, (error => {
          }), () => {
            if (value === true) {
              this.initGridDataSource();
              this.growlService.successNotification(this.translateService.instant(OrganisationConstant.SUCCESS_OPERATION));
            }
          });
        }
      });
    } else {
      let value;
      this.opportunityService.getJavaGenericService()
        .getData(OrganisationConstant.CHECK_EXIST_OPPORTUNITY_BY_ORGANISATION_CLIENT + dataItem.id)
        .subscribe(data => {
          value = data;
        }, (error => {
        }), () => {
          if (value === true) {
            this.swallWarning.CreateSwal().then((result) => {
              if (result.value) {
                const clientToRemove = this.listClients.find(client => client.Id === dataItem.id);
                this.tiersService.removeTiers(clientToRemove).subscribe(() => {
                  this.initClientGridDataSource();
                });
              }
            });
          } else if (value.errorCode === OrganisationConstant.IMPOSSIBLE_TO_DELETE_ORGANIZATION_OPPORTUNITY) {
            this.swallWarning
              .CreateSwal(this.translateService.instant(OrganisationConstant.SUPPRESSION_IMPOSSIBLE_RELATED_TO_OPPORTUNITY),
                this.translateService.instant(OrganisationConstant.SUPPRESSION_IMPOSSIBLE),
                OrganisationConstant.OK, OrganisationConstant.CANCEL, true, true);
          }
        });
    }

  }


  public goToAdvancedEdit(dataItem) {
    this.actionService.setArchivingModes(this.isArchivingMode, this.fromRelatedArchiving);
    this.router.navigateByUrl(OrganisationConstant.ORGANISATION_DETAILS_URL
      .concat(String(dataItem.id)).concat('/' + this.prospectType), {skipLocationChange: true});
  }

  backToList() {
    this.sidNavService.hide(this.prospectType);
  }

  switchOrg() {
    this.filterFieldsColumns = [];
    this.filterFieldsInputs = [];
    this.initProspectFiltreConfigOrganisation();
    //this.organisationType = OrganisationConstant.PROSPECT_TYPE;
    this.orgListParams = {
      pageNumber: this.orgListParams.pageNumber,
      pageSize: this.pageSize,
      showSearchFilterComp: true
    };
    this.gridState = {
      skip: (this.orgListParams.pageNumber * NumberConstant.TEN) - NumberConstant.TEN,
      take: this.orgListParams.pageSize,

      // Initial filter descriptor
      filter: {
        logic: 'and',
        filters: []
      }
    };
    this.gridSettings.state = this.gridState;
    if (this.clickedProspectOnce) {
      this.prospectType = true;
      this.initState();
      this.initGridDataSource(this.gridState.skip);
    }
    this.showSidNav = false;
    this.clickedClientOnce = true;
    this.clickedProspectOnce = false;
  }

  switchClient() {
    this.filterFieldsColumns = [];
    this.filterFieldsInputs = [];
    this.initCustomersFiltreConfigOrganisation();
    this.organisationType = OrganisationConstant.CLIENT_TYPE;
    this.orgListParams.showSearchFilterComp = false;
    if (this.clickedClientOnce) {
      this.prospectType = false;
      this.initState();
      this.initClientGridDataSource();
    }
    this.showSidNav = false;
    this.clickedClientOnce = false;
    this.clickedProspectOnce = true;
  }

  initState() {
    this.gridState = {
      skip: 0,
      take: this.pageSize,

      // Initial filter descriptor
      filter: {
        logic: 'and',
        filters: []
      }
    };
    this.gridSettings.state = this.gridState;
  }

  changeViewToCard(x) {
    this.cardViewB = true;
  }

  changeViewToList(e) {
    this.cardViewB = false;

  }

  getcarddetail(event) {
    this.showSidNav = true;
    this.organisationToShowInSideNav = {value: true, 'data': event.id, 'isToUpdate': true, 'prospectType': this.prospectType};
  }

  deleteFromCard(event) {
    event = {dataItem: event};
    this.removeHandler(event.dataItem);
  }

  private isDataAndTotalChanged(value) {
    return this.gridSettings.gridData !== undefined && this.gridSettings.gridData.data !== value.data &&
      this.gridSettings.gridData.total !== value.total;
  }

  restoreFromCard(event) {
    this.restoreSelected(event);
  }

  archiveFromCard(event) {
    this.archiveSelected(event);
  }

  public archiveSelected(dataItem) {
    this.organisationService.getJavaGenericService().getData('archive/dependency/'.concat(dataItem.id)).subscribe(archiveDependency => {
      const dataToSendToPoPUp = {
        isArchiving: true,
        archiveDependency: archiveDependency,
        source: 'organisation',
        sourceId: dataItem.id,
        textHeader: this.translateService.instant(OrganisationConstant.ARCHIVE_ORGANISATION)
      };
      this.showPopUp(dataToSendToPoPUp, CrmConstant.ARCHIVING_TITLE);
    });
  }

  public restoreSelected(dataItem) {
    this.organisationService.getJavaGenericService().getData('restore/dependency/'.concat(dataItem.id)).subscribe(archiveDependency => {
      const dataToSendToPoPUp = {
        isArchiving: false,
        archiveDependency: archiveDependency,
        source: 'organisation',
        sourceId: dataItem.id,
        textHeader: this.translateService.instant(OrganisationConstant.RESTART_ORGANIZATION_TEXT)
      };
      this.showPopUp(dataToSendToPoPUp, CrmConstant.REACTIVATION_TITLE);
    });
  }

  showPopUp(dataToSendToPoPUp, titre) {
    this.formModalDialogService.openDialog(titre, ArchivePopupComponent, this.viewRef, this.initGridDataSource.bind(this),
      dataToSendToPoPUp, false, SharedConstant.MODAL_DIALOG_SIZE_M);
  }

  private redirectListByOrganisationType() {
    this.activatedRoute.queryParams
      .subscribe(params => {
        if ((Object.keys(params).length > NumberConstant.ZERO && params[(this.IS_PROSPECT_PARAM)] === false) || this.hasOnlyClientPermission) {
          this.clientNavItemClass = this.navItemActiveClass;
          this.prospectNavItemClass = this.navItemInactiveClass;
          this.prospectType = false;
          this.switchClient();
        } else {
          this.prospectNavItemClass = this.navItemActiveClass;
          this.clientNavItemClass = this.navItemInactiveClass;
          this.prospectType = true;
          this.switchOrg();
        }
      });
  }


  /**
   * this method will be called by CanDeactivateGuard service to check the leaving component possibility
   */
  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    return this.genericCrmService.handleCanDeactivateToLeaveCurrentComponent(this.isUpdateMode.bind(this));
  }

  isUpdateMode(): boolean {
    return this.showSidNav && this.sideNavUpdateMode;
  }

  setSideNavUpdateMode(event) {
    this.sideNavUpdateMode = event;
  }

  sendMail() {
    this.listMails = [];
    if (this.prospectType) {
      this.organisationService.getOrganisationsByIds(this.organisationsSelected).subscribe((list) => {
        list.map(organisation => {
          this.listMails.push(organisation.email);
        });
      });
    } else {
      this.tiersService.getTiersListByArray(this.organisationsSelected).subscribe(list => {
        list.map(tiers => {
          this.listMails.push(tiers.Email);
        });
      });
    }
    this.dataToSendToPoPUp = {
      listMails: this.listMails
    };
    this.showSendMailPopup();
    this.resetSelection();
  }

  showSendMailPopup() {
    this.formModalDialogService.openDialog(
      'Send Mail', PopupSendMailComponent, this.viewRef, this.initGridDataSource.bind(this), this.dataToSendToPoPUp,
      false, SharedConstant.MODAL_DIALOG_SIZE_XM);
  }

  resetSelection() {
    this.organisationsSelected = [];
  }

  OrganistaionListInit(value) {
    this.spinnerService.showLoader();
    this.initGridDataSource();
    this.spinnerService.hideLaoder();
  }

  public downLoadFile(event) {
    this.organisationService.downloadOrganisationExcelTemplate(this.currencyDataSource, this.countryModelExcel, this.cityModelExcel).subscribe(
      res => {

        this.fileinfo.FileData = res.base64File;
        this.fileinfo.Name = 'ImportOraganisation.xlsx';

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

  handleInputChange(file) {
    const reader = new FileReader();
    const maxSize = this.EXCEL_FILE_MAX_SIZE * SharedAccountingConstant.ONE_MEGABYTE;
    if (file.size < maxSize) {
      if (file.type.match(/-*excel/) || file.type.match(/-*xls-*/) || file.type.match(/-*spreadsheet-*/)) {
        reader.onloadend = this._handleReaderLoaded.bind(this, file);
        reader.readAsDataURL(file);
      } else {
        alert(this.translateService.instant(SharedAccountingConstant.INVALID_FILE_TYPE));
      }
    } else {
      alert(this.translateService.instant(SharedAccountingConstant.EXCEL_FILE_MAX_SIZE_EXCEEDED, {maxSize: maxSize}));
    }

  }

  _handleReaderLoaded(file, e) {
    const reader = e.target;
    const base64result = reader.result.substr(reader.result.indexOf(',') + 1);

    if (base64result !== undefined) {
      this.saveFile(base64result, file);
    }
  }


  saveFile(base64result, file) {
    this.organisationService.saveOrganisationFromFile({
      'base64File': base64result,
      'name': file.name
    }).subscribe(
      e => {
        e.forEach((element) => {
            this.permissionService.savePermission(this.organisationsRelatedPermissions,
              OrganisationConstant.ORGANISATION_ENTITY, element.id).subscribe(() => {
              this.initGridDataSource();
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
          this.organisationsRelatedPermissions = data.permission;
        }
      }
    });
  }

// get currency for model
  initDataSource(): void {
    this.preparePredicate();
    this.currencyService.listdropdownWithPerdicate(this.predicateForImport).subscribe((data: any) => {
      this.currencyDataSource = data.listData;
      this.currencyFiltredDataSource = this.currencyDataSource.slice(NumberConstant.ZERO);
    });
  }

  public preparePredicate() {
    this.predicateForImport = new PredicateFormat();
    this.predicateForImport.OrderBy = new Array<OrderBy>();
    this.predicateForImport.OrderBy.push(new OrderBy(SharedConstant.CODE, OrderByDirection.asc));
  }


  getCountriesList() {

    this.countryService.getAllUserWithoutState().subscribe(
      (countries) => {


        this.cityService.getAllUserWithoutState().subscribe(
          (city) => {


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
