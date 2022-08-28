import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild, ViewContainerRef} from '@angular/core';
import {FormModalDialogService} from '../../../../shared/services/dialog/form-modal-dialog/form-modal-dialog.service';
import {ActivatedRoute, Router} from '@angular/router';
import {GridSettings} from '../../../../shared/utils/grid-settings.interface';
import {SortDescriptor, State} from '@progress/kendo-data-query';
import {ColumnSettings} from '../../../../shared/utils/column-settings.interface';
import {NumberConstant} from '../../../../constant/utility/number.constant';
import {OpportunityService} from '../../../services/opportunity.service';
import {CategoryService} from '../../../services/category/category.service';
import {CrmConstant} from '../../../../constant/crm/crm.constant';
import {OrganisationService} from '../../../services/organisation/organisation.service';
import {SideNavService} from '../../../services/sid-nav/side-nav.service';
import {OpportunityFilterService} from '../../../services/opportunity-filter.service';
import {Organisation} from '../../../../models/crm/organisation.model';
import {Employee} from '../../../../models/payroll/employee.model';
import {ItemService} from '../../../../inventory/services/item/item.service';
import {OpportunityConstant} from '../../../../constant/crm/opportunityConstant';
import {FilterTypesEnum} from '../../../../models/crm/enums/FilterTypes.enum';
import {Opportunity} from '../../../../models/crm/opportunity.model';
import {ContactConstants} from '../../../../constant/crm/contact.constant';
import {SwalWarring} from '../../../../shared/components/swal/swal-popup';
import {TranslateService} from '@ngx-translate/core';
import {OrganisationConstant} from '../../../../constant/crm/organisation.constant';
import {OpportunityType} from '../../../../models/crm/enums/opportunityType.enum';
import {TiersService} from '../../../../purchase/services/tiers/tiers.service';
import {Operation} from '../../../../../COM/Models/operations';
import {AddNewOpportunityComponent} from '../add-new-opportunity/add-new-opportunity.component';
import {GenericCrmService} from '../../../generic-crm.service';
import {GrowlService} from '../../../../../COM/Growl/growl.service';
import {ArchivePopupComponent} from '../../archiving/archive-popup/archive-popup.component';
import {SharedConstant} from '../../../../constant/shared/shared.constant';
import {SharedCrmConstant} from '../../../../constant/crm/sharedCrm.constant';
import {Observable} from 'rxjs/Observable';
import {EnumValues} from 'enum-values';
import {AuthService} from '../../../../login/Authentification/services/auth.service';
import {PermissionConstant} from '../../../../Structure/permission-constant';
import {UserService} from '../../../../administration/services/user/user.service';

@Component({
  selector: 'app-list-opportunity',
  templateUrl: './opportunity-list.component.html',
  styleUrls: ['./opportunity-list.component.scss']
})


export class OpportunityListComponent implements OnInit, OnChanges {
  @ViewChild('toggle') toggle;
  @Input() isArchivingMode = false;
  @Input() fromRelatedArchiving = false;
  @Input() isProspect;
  @Input() source: string;
  @Input() sourceId: number;
  @Input() related = false;
  @Output() countOpportunites = new EventEmitter();

  public ALL_ORGANISATIONS = OrganisationConstant.ALL_ORGANIZATIONS;

  choosenFilterNumber = NumberConstant.ZERO;

  public kanbanIsCheck = false;

  public BY_TYPE_AFFAIRE = FilterTypesEnum['BY_TYPE_AFFAIRE'];

  public BY_GATEGORY = FilterTypesEnum['BY_GATEGORY'];

  public BY_EMPLOYEE = FilterTypesEnum['BY_EMPLOYEE'];

  public BY_ARTICLE = FilterTypesEnum['BY_ARTICLE'];

  public opportunitiesList: Array<Opportunity> = [];
  public sortParams = SharedCrmConstant.DEFAULT_SORT;
  public kanban = true;
  public organisationList: Array<Organisation> = [];
  public categoryList: Array<any> = [];
  public isOrganisationFilter = false;
  public isSearch = false;
  public isCategoryFilter = false;
  public isAllOpportunities = true;
  public filterG = 'ALL_OPPORTUNITY';
  public categoriesList: Array<string> = [];
  private pageSize = NumberConstant.TEN;
  private selectedCategoryType;
  employee: Array<Employee> = [];
  public employeeListId = [];
  public concerned = false;
  public listP: Array<any> = [];
  public objectif;
  private selectedCategory;

  private selectedEmployeeId;

  private selectedProductId;

  private selectedEmployee;

  private selectedProduct;

  public selectCategoryType;

  public selectOrganizationType;

  public showStaffingCategories = false;
  public showProductSaleCategories = false;
  public showCategoriesTypesNav = false;
  public COMMAND_COLUMN_WIDTH = NumberConstant.ONE_HUNDRED_FIFTY;

  public staffCategories;
  public productSaleCategories;
  public sideNavUpdateMode = false;
  private allOrganisation: Organisation = new Organisation(null, this.translate.instant(this.ALL_ORGANISATIONS));

  public selectedValue = this.allOrganisation;
  public opportunityTypes = [];

  showSidNav = false;
  public gridState: State = {
    skip: NumberConstant.ZERO,
    take: this.pageSize,

    // Initial filter descriptor
    filter: {
      logic: 'and',
      filters: []
    }
  };
  public organisation: any = '';
  public organisationData: any;
  public organisationId: number;
  public category = '';
  showOrganisationColumn = true;
  valueSelectedToSidNav;
  showKanban = false;
  public sort: SortDescriptor[] = [{
    field: CrmConstant.TITLE,
    dir: 'asc'
  }];

  oppFilter: any;

  categorySelected;

  public columnsConfig: ColumnSettings[] = [
    {
      field: CrmConstant.TITLE,
      title: 'TITLE',
      filterable: true,
      _width: 160
    },
    {
      field: CrmConstant.ORGANISATION_field,
      title: CrmConstant.ORGANISATION_TITLE,
      filterable: true,
      _width: 160
    },
    {
      field: CrmConstant.ESTIMATED_INCCOME,
      title: 'ESTIMATED_INCOME',
      filterable: true,
      _width: 140
    },
    {
      field: CrmConstant.RATING,
      title: 'PROBABILITY_OF_OCCURENCE',
      filterable: true,
      _width: 140
    },
    {
      field: CrmConstant.OBJECTIF_ID,
      title: 'OBJECTIVE_TYPE',
      filterable: true,
      _width: 160
    },
    {
      field: CrmConstant.CURRENT_POSITION_PIPE,
      title: CrmConstant.CURRENT_POSITION_PIPE,
      filterable: true,
      _width: 200
    },
    {
      field: CrmConstant.CURRENT_STEP,
      title: CrmConstant.STATUS_TITLE,
      filterable: true,
      _width: 180
    },
    {
      field: CrmConstant.OPPORTUNITY_TYPE,
      title: CrmConstant.OPPORTUNITY_TYPE_TITLE,
      filterable: true,
      _width: 140
    }
  ];
  public selectedTypeFilter;
  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig,
  };
  public pagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;

  private pageZero = 0;
  public STAFFING_TYPE = OpportunityConstant.TYPE_STAFFING;
  public PRODUCT_SALE_TYPE = OpportunityConstant.TYPE_PRODUCT_SALE;
  private listTiers = [];
  public opportunitiesSelected: number [] = [];
  public selectKey = 'id';
  public checkbox_column_width = 60;
  private isFromArchive: boolean;
  private relatedOrganisationId: number;
  private relatedContactId: number;
  private archive: boolean;
  public CRMPermissions = PermissionConstant.CRMPermissions;

  /**
   *
   * @param router
   * @param formModalDialogService
   * @param employeeService
   * @param viewRef
   * @param oppService
   * @param categoryService
   * @param sideNaveService
   * @param opportunityFilter
   * @param itemService
   * @param organisationService
   * @param swalWarring
   * @param translate
   * @param tiersService
   * @param genericCrmService
   * @param growlService
   * @param activatedRoute
   */
  constructor(private router: Router,
              private formModalDialogService: FormModalDialogService,
              private userService: UserService,
              private viewRef: ViewContainerRef,
              private oppService: OpportunityService,
              private categoryService: CategoryService,
              private sideNaveService: SideNavService,
              private opportunityFilter: OpportunityFilterService,
              private itemService: ItemService,
              private organisationService: OrganisationService,
              private swalWarring: SwalWarring,
              private  translate: TranslateService,
              private tiersService: TiersService,
              private genericCrmService: GenericCrmService,
              private growlService: GrowlService,
              private activatedRoute: ActivatedRoute,
              public authService: AuthService) {
    this.opportunityFilter.fromListToKanban(undefined, undefined, undefined);

    this.selectedCategory = this.opportunityFilter.categoryFromKanban;
    this.BY_TYPE_AFFAIRE = this.opportunityFilter.typeDAffaireFromKanban;
    this.selectedProductId = this.opportunityFilter.productIdFromKanban;
    this.selectedEmployeeId = this.opportunityFilter.employeeIdFromKanban;


  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.relatedOrganisationId = params[CrmConstant.ORGANISATION_ID];
      this.relatedContactId = params[CrmConstant.CONTACT_ID];
      this.archive = params[CrmConstant.ARCHIVE];
      if (this.relatedOrganisationId || this.relatedContactId) {
        this.isArchivingMode = this.archive;
        this.isFromArchive = true;
      }
    });
    this.initTypesList();
    /**
     * ici on traite l'affichage dans le cas ou c'est déclenché un filtre par organisation dans le kanban
     */
    if (this.isFromArchive) {
      if (this.relatedOrganisationId) {
        this.getFiltredProspectOpportunityPage(this.relatedOrganisationId, this.isArchivingMode, NumberConstant.ZERO);
      } else {
        this.getProspectOpporunityByContact(this.relatedContactId, this.isArchivingMode, NumberConstant.ZERO);
      }

    } else if (this.opportunityFilter.organisationId) {

      this.filterByOrganisationFromKanban();

    } else if (this.opportunityFilter.categoryFromKanban && (!this.opportunityFilter.employeeIdFromKanban) &&
      (!this.opportunityFilter.productIdFromKanban)) {

      this.filterByCategoryFromKanban();
    } else if (this.opportunityFilter.employeeIdFromKanban) {

      this.filterByCategoryAndEmployeeFromKanban();
    } else if (this.opportunityFilter.productIdFromKanban) {

      this.filterByCategoryAndProductFromKanban();
    } else if (this.related) {
      return;
    } else {
      this.initGridDataSource(this.gridState.skip);
      this.oppService.oppSaved.subscribe(data => {
        if (data) {
          this.initGridDataSource(this.gridState.skip);
        }
      });
    }
    this.showKanban = false;
  }

  initRelatedOpportunityAndIsProspectGridDataSourceFromOrganisation(id, page) {
    this.oppService.getJavaGenericService()
      .getData(OpportunityConstant.PROSPECT_ORGANISATION_URL +
        `?idOrganisation=${id}&page=${page}&size=${this.pageSize}`)
      .subscribe((data) => {
        this.countOpportunites.emit(data.totalElements);
        this.gridSettings.gridData = {
          data: data.opportunityDtoList,
          total: data.totalElements
        };
      });
    this.loadCategoriesByType();
  }

  initRelatedOpportunityAndIsNotProspectGridDataSourceFromOrganisation(page) {
    this.oppService.getJavaGenericService()
      .getData(OpportunityConstant.CLIENT_ORGANISATION_URL + `?idClient=${this.sourceId}&page=${page}&size=${this.pageSize}`)
      .subscribe((data) => {
        this.countOpportunites.emit(data.totalElements);
        this.gridSettings.gridData = {
          data: data.opportunityDtoList,
          total: data.totalElements
        };
      });
    this.loadCategoriesByType();
  }

  initRelatedOpportunityGridDataSourceFromContact(sourceId, page) {
    this.oppService.getJavaGenericService().getEntityList(OpportunityConstant.CUSTOMER +
      `?customerId=${this.sourceId}&page=${page}&size=${this.pageSize}`)
      .subscribe(data => {
        this.countOpportunites.emit(data.totalElements);
        this.gridSettings.gridData = {
          data: data.opportunityDtoList,
          total: data.totalElements
        };
      });
  }

  initClientRelatedOpportunityGridDataSourceFromContact(sourceId, page) {
    this.oppService.getJavaGenericService()
      .getData(OpportunityConstant.CLIENT_CONTACT_URL + `?idClient=${this.sourceId}&page=${page}&size=${this.pageSize}`)
      .subscribe((data) => {
        this.countOpportunites.emit(data.totalElements);
        this.gridSettings.gridData = {
          data: data.opportunityDtoList,
          total: data.totalElements
        };
      });
    this.loadCategoriesByType();
  }

  filterOpportunitiesByType(type, page) {
    this.oppService.getJavaGenericService()
      .getData(OpportunityConstant.TYPE_URL + `?opportunityType=${type}&page=${page}&size=${this.pageSize}`)
      .subscribe((data) => {
        this.initTable(data.opportunityDtoList);
        this.countOpportunites.emit(data.totalElements);
        this.gridSettings.gridData = {
          data: data.opportunityDtoList,
          total: data.totalElements
        };
      });
    this.loadCategoriesByType();
  }

  initRelatedOpportunityGridDataSource(page) {
    switch (this.source) {
      case OpportunityConstant.CONTACT :
        this.isProspect ? this.initRelatedOpportunityGridDataSourceFromContact(this.sourceId, page) :
          this.initClientRelatedOpportunityGridDataSourceFromContact(this.sourceId, page);
        break;
      case OpportunityConstant.ORGANISATION :
        this.isProspect ? this.initRelatedOpportunityAndIsProspectGridDataSourceFromOrganisation(this.sourceId, page) :
          this.initRelatedOpportunityAndIsNotProspectGridDataSourceFromOrganisation(page);
        break;
      default:
        return;
    }
  }

  ngOnChanges(simpleChange: SimpleChanges) {
    if (simpleChange.sourceId !== undefined && this.related) {
      this.initRelatedOpportunityGridDataSource(this.gridSettings.state.skip / NumberConstant.TEN);
    }
  }

  getListOfConcerned(id?: number) {
    this.oppService.getOpportunityByCategoryAndIsArchiving(id, this.isArchivingMode)
      .subscribe(data => {
        this.selectedCategoryType = Object.keys(data.categoryUsersId).toString();

        if (this.selectedCategoryType === this.PRODUCT_SALE_TYPE) {
          const obj = Object.entries(data.categoryUsersId);

          this.itemService.getItemsAfterFilter((obj[0])[1]).subscribe(product => {
            this.listP = [];
            product.listData.forEach(p => {
                this.listP.push(p);
              }
            );
          });
        } else if (this.selectedCategoryType === this.STAFFING_TYPE) {

          this.employeeListId = data.categoryUsersId.STAFFING;
          if (this.employeeListId) {
            this.userService.getUsersListByArray(this.employeeListId).subscribe(data1 => {
              this.employee = data1;
              this.oppService.employeeListId = data1;
            });
          }
        }
      });
  }

  initGridDataSource(page) {
    this.oppService.getJavaGenericService().getEntityList(OpportunityConstant.IS_ARCHIVED + this.isArchivingMode +
      `?page=${page}&size=${this.pageSize}&sort=${this.sortParams}`)
      .subscribe(data => {
        this.initTable(data.opportunityDtoList);
        this.gridSettings.gridData = {
          data: data.opportunityDtoList,
          total: data.totalElements
        };
      });
    this.loadCategoriesByType();
  }

  private initTable(data) {
    const tiersId = [];
    for (const opportunity of data) {
      if (opportunity.opportunityType === OpportunityType.CLIENT) {
        tiersId.push(opportunity.idClientOrganization);
      }
      if (!this.opportunityFilter.typeDAffaireFromKanban) {
        if (this.categoriesList.indexOf(opportunity.categoryId) < NumberConstant.ZERO) {
          const list = this.categoriesList.find(o => o === opportunity.category.type);
          if (list === null || list === undefined) {
            this.categoriesList.push(opportunity.category.type);
          }
        }
      }
    }
    this.setClientOpportunityOrganizationName(data, tiersId);
  }

  private setClientOpportunityOrganizationName(data, tierdIds) {
    this.tiersService.getTiersListByArray(tierdIds).subscribe((tiers) => {
      for (const opportunity of data) {
        if (opportunity.opportunityType === OpportunityType.CLIENT && tiers.length > NumberConstant.ZERO) {
          const organisationTiers = tiers.find(tier => tier.Id === opportunity.idClientOrganization);
          if (organisationTiers) {
            opportunity.organisationName = tiers.find(tier => tier.Id === opportunity.idClientOrganization).Name;
          }
        }
      }
    });
  }

  getStaffingCategories() {
    this.showStaffingCategories = true;
    this.showProductSaleCategories = false;
  }

  getProductSaleCategories() {
    this.showProductSaleCategories = true;
    this.showStaffingCategories = false;
  }

  private getIdsClientOrganizationRelatedToClientOpportunity() {
    this.organisationList = [this.allOrganisation];
    this.oppService.callService(Operation.GET, `${OpportunityConstant.BY_ID_CLIENT}?isArchived=${this.isArchivingMode}`).subscribe(data => {
      const tiersId = [];
      this.getTiersIds(data, tiersId);
      this.tiersService.getTiersListByArray(tiersId).subscribe((tiers) => {
        this.listTiers = tiers;
        tiers.forEach(tier => {
          this.organisationList.push(this.convertClientToOrganisation(tier));
        });
      });
    });
  }

  private getTiersIds(data, tiersId: any[]) {
    data.forEach(id => {
      tiersId.push(id);
    });
  }

  convertClientToOrganisation(client): Organisation {
    return new Organisation(client.Id, client.Name, client.Email, client.Phone,
      client.Adress, client.Description, client.Fax1, client.Linkedin, client.Facebook, client.Twitter,
      null, null, this.translate.instant(AddNewOpportunityComponent.TRANSLATE_CUSTOMER), client.Id);
  }

  private getOrganisationList() {
    this.organisationService.getJavaGenericService().getEntityList(`/filter-opportunity/archived/${this.isArchivingMode}`)
      .subscribe(data => {
        this.organisationList = [this.allOrganisation].concat(data);
      });
  }

  global_Filter(filter) {
    if (filter !== 'org') {
      this.showOrganisationColumn = true;
    } else {
      this.getSwitchValue(false);
      this.kanbanIsCheck = false;
      this.selectOrganizationType = this.opportunityTypes[0];
      this.organisationList = [this.allOrganisation];
    }

    this.showStaffingCategories = false;
    this.showProductSaleCategories = false;
    this.showCategoriesTypesNav = false;
    switch (filter) {
      /**
       * All opportunities filter selected so we render all opportunities list
       */
      case CrmConstant.FILTER_ALL: {
        this.initGridDataSource(this.gridState.skip);
        this.choosenFilterNumber = NumberConstant.ZERO;
        this.filterG = 'ALL_OPPORTUNITY';
        this.concerned = false;
        this.kanban = true;
        this.showKanban = false;
        this.isAllOpportunities = true;
        this.isCategoryFilter = false;
        this.isOrganisationFilter = false;
        this.isSearch = false;
        this.kanbanIsCheck = false;
        this.organisationData = this.ALL_ORGANISATIONS;
        break;
      }
      /**
       * Filter by organization selected
       */
      case CrmConstant.FILTER_ORG: {
        this.choosenFilterNumber = NumberConstant.ONE;
        this.initGridDataSource(this.gridState.skip);
        this.isCategoryFilter = false;
        this.concerned = false;
        this.isOrganisationFilter = true;
        this.kanban = true;
        this.filterG = 'PROSPECTS.ORGANISM_LABEL';
        this.organisationData = this.translate.instant(this.ALL_ORGANISATIONS);
        this.initOrganisationList();
        break;
      }
      /**
       * Filter by category selected
       */
      case CrmConstant.FILTER_OBJ: {
        this.kanban = true;
        this.concerned = false;
        this.isCategoryFilter = true;
        this.choosenFilterNumber = NumberConstant.TWO;
        this.selectCategoryType = null;
        this.isOrganisationFilter = false;
        this.filterG = 'OBJECTIVES';
        this.BY_TYPE_AFFAIRE = FilterTypesEnum['BY_TYPE_AFFAIRE'];
        this.BY_GATEGORY = FilterTypesEnum['BY_GATEGORY'];
        this.organisationData = this.ALL_ORGANISATIONS;
        break;
      }
      /**
       * No filter selected so we render all opportunities list
       */
      default: {
        this.isCategoryFilter = false;
        this.concerned = false;
        this.isOrganisationFilter = false;
        this.isSearch = false;
        this.organisationData = this.ALL_ORGANISATIONS;
        break;
      }
    }
  }

  loadRelatedCategories(categoryType) {
    this.showStaffingCategories = false;
    this.showProductSaleCategories = false;
    this.categorySelected = null;
    this.categoryList = [];
    this.BY_GATEGORY = FilterTypesEnum['BY_GATEGORY'];
    this.selectedCategoryType = categoryType;
    this.BY_TYPE_AFFAIRE = categoryType;
    if (categoryType === OpportunityConstant.TYPE_STAFFING) {
      this.BY_EMPLOYEE = FilterTypesEnum['BY_EMPLOYEE'];
    } else if (categoryType === OpportunityConstant.TYPE_PRODUCT_SALE) {
      this.BY_ARTICLE = FilterTypesEnum['BY_ARTICLE'];
    }
    this.categoryService.getListOfCategories(categoryType, this.isArchivingMode)
      .subscribe(category => {
        this.categoryList = category;
      });
  }

  loadCategoriesByType() {
    this.categoryService.getListOfCategories(this.STAFFING_TYPE, this.isArchivingMode)
      .subscribe(category => {
        this.staffCategories = category;
      });
    this.categoryService.getListOfCategories(this.PRODUCT_SALE_TYPE, this.isArchivingMode)
      .subscribe(category => {
        this.productSaleCategories = category;
      });
  }

  filterByObjectif(categoryType) {
    this.loadRelatedCategories(categoryType);
    this.oppService.getOppByTypeCategory(categoryType, NumberConstant.ONE, this.isArchivingMode)
      .subscribe(data => {
        if (data) {
          this.gridSettings.gridData = {
            data: data.opportunityDtoList,
            total: data.totalElements
          };
        }
      });

  }

  filterByCategory(category?, page?) {
    this.listP = [];
    this.employee = [];
    this.selectedProduct = undefined;
    this.selectedEmployee = undefined;
    this.categorySelected = category.title;
    this.selectedCategory = category;
    this.concerned = true;
    this.kanban = false;
    this.gridSettings.gridData = null;
    this.BY_GATEGORY = category.title;
    if (this.checkByStaffingTypeFilter()) {
      this.BY_EMPLOYEE = FilterTypesEnum['BY_EMPLOYEE'];
      this.unselectEmployeeAndProduct();
    } else if (this.checkFilterByProductSaleFilter()) {
      this.BY_ARTICLE = FilterTypesEnum['BY_ARTICLE'];
      this.unselectEmployeeAndProduct();
    }
    this.getListOfConcerned(category.id);
    this.setCategoryTitle(category);
    page = this.setFirstPage(page);
    this.getOpportunityByCategory(category, page);
  }


  private checkByStaffingTypeFilter() {
    return this.BY_TYPE_AFFAIRE === this.STAFFING_TYPE;
  }

  private checkFilterByProductSaleFilter() {
    return this.BY_TYPE_AFFAIRE.toString() === this.PRODUCT_SALE_TYPE;
  }

  private unselectEmployeeAndProduct() {
    this.selectedEmployeeId = undefined;
    this.selectedProductId = undefined;
  }

  private setCategoryTitle(category) {
    if (category !== undefined) {
      this.category = category.title;
    }
  }

  private setFirstPage(page) {
    if (page === undefined) {
      page = NumberConstant.ZERO;
    }
    return page;
  }

  private getOpportunityByCategory(category, page) {
    this.oppService.getOpportunityByCategoryWithPagination(category.id, page, this.pageSize,
      this.sortParams, this.isArchivingMode).subscribe(data => {
      this.initTable(data.opportunityDtoList);
      this.gridSettings.gridData = {
        data: data.opportunityDtoList,
        total: data.totalElements
      };
      this.setOpportunityFilterParams();

    });
  }

  private setOpportunityFilterParams() {
    this.oppFilter = {
      categoryId: this.categorySelected.id, data: {
        categoryFromList: this.selectedCategory,
        employeeIdFromList: null,
        typeDAffaireFromList: this.BY_TYPE_AFFAIRE,
        productIdFromList: null
      }
    };
  }

  filterByOrganization(organisation?, page?) {
    this.showOrganisationColumn = false;
    if (organisation !== undefined) {
      this.organisation = organisation;
    }
    page = page === undefined ? 0 : page;
    if (organisation.id === null) {
      this.filterByOrganizationType(this.selectedTypeFilter, page);
    } else {
      this.getFilteredOpportunityPage(page);
    }

  }

  private getFilteredOpportunityPage(page) {
    if (this.getSelectedOrganisationDetails(this.organisation).idClient === null) {
      this.getFiltredProspectOpportunityPage(this.organisation.id, this.isArchivingMode, page);
    } else {
      this.getFiltredClientOpportunityPage(this.organisation, page);
    }
  }

  private getFiltredProspectOpportunityPage(id, isArchiving, page) {
    this.oppService.getOppByIdOrganisation(id, page, this.pageSize, this.sortParams, isArchiving)
      .subscribe(data => {
        this.initTable(data.opportunityDtoList);
        this.gridSettings.gridData = {
          data: data.opportunityDtoList,
          total: data.totalElements
        };
      });
  }

  private getFiltredClientOpportunityPage(organisation, page) {
    if (!this.genericCrmService.isNullOrUndefinedOrEmpty(organisation.idClient)) {
      this.getFiltredClientOrganization(organisation, page);
    } else {
      this.getFiltredProspectOrganization(organisation, this.isArchivingMode, page);
    }
  }

  /*get filtred opportunity by organization prospect*/
  private getFiltredProspectOrganization(organisation, isArchive, page) {
    this.oppService.getOppByIdOrganisation(organisation.id, page, this.pageSize,
      this.sortParams, isArchive)
      .subscribe(data => {
        this.loadData(data);
      });
  }

  /*get filtred opportunity by contact prospect*/
  private getProspectOpporunityByContact(idContact, isArchive, page) {
    this.oppService.getOppByIdContact(idContact, page, this.pageSize, this.sortParams, isArchive)
      .subscribe(data => {
        this.loadData(data);
      });
  }

  /*get filtred opportunity by organization client*/
  private getFiltredClientOrganization(organisation, page) {
    this.oppService.getOppByIdClientOrganisation(organisation.idClient, page, this.pageSize, this.sortParams,
      this.isArchivingMode)
      .subscribe(data => {
        this.loadData(data);
      });
  }

  private loadData(data) {
    this.initTable(data.opportunityDtoList);
    this.gridSettings.gridData = {
      data: data.opportunityDtoList,
      total: data.totalElements
    };
  }

  private getSelectedOrganisationDetails(organisation): Organisation {
    return this.organisationList.filter(org => org.id === organisation.id &&
      org.name === organisation.name)[NumberConstant.ZERO];
  }

  onPageChange(event) {
    this.pageSize = event.take ? event.take : this.pageSize;
    if (this.isOrganisationFilter) {
      this.organisation = this.organisation === '' ? this.organisationList[0] : this.organisation;
      if (this.organisation !== this.organisationList[0]) {
        this.filterByOrganization(this.organisation, (event.skip / this.pageSize));
      } else {
        this.filterByOrganizationType(this.selectOrganizationType, (event.skip / this.pageSize));
      }
    } else if (this.isCategoryFilter) {
      const category = this.categoryList.find(cat => cat.title === this.categorySelected
        || cat.title === this.categorySelected.title);
      this.filterByCategory(category, (event.skip / this.pageSize));
    } else if (this.related) {
      this.initRelatedOpportunityGridDataSource(event.skip / this.pageSize);
    } else {
      this.initGridDataSource(event.skip / this.pageSize);
    }
  }

  showDetails(dataItem) {
    this.router.navigateByUrl(OpportunityConstant.OPPORTUNITY_DETAILS_URL
      .concat(String(dataItem.id)), {skipLocationChange: true});
  }

  findOrganisationToFilterBy(id: number) {
    this.organisationService.getJavaGenericService().getEntityById(id).subscribe((data) => {
      this.organisationData = data;
      this.organisation = this.organisationData.name;
      this.filterByOrganization(this.organisationData);
    });
  }


  filterByEmployee(event) {
    this.selectedEmployeeId = event.Id;
    this.BY_EMPLOYEE = event.FullName;
    this.oppService.opportunitiesByCategoryAndEmplyeeForDataGridAndIsArchived(event.Id, this.selectedCategory.id,
      (this.gridState.skip + NumberConstant.ONE), this.isArchivingMode).subscribe((data) => {
      this.gridSettings.gridData = {
        data: data.opportunityDtoList,
        total: data.totalElements
      };
      this.opportunityFilter.fromListToKanban(this.selectedCategory, event.Id);
      this.initTable(data);
      if (this.showKanban) {
        this.oppFilter = {
          categoryId: this.categorySelected.id, data: {
            categoryFromList: this.selectedCategory,
            employeeIdFromList: this.selectedEmployeeId,
            typeDAffaireFromList: this.BY_TYPE_AFFAIRE
          }
        };
      }
    }, {}, () => {
    });
  }

  filterByArticle(event) {
    this.selectedProductId = event.Id;
    this.BY_ARTICLE = event.Description;
    this.oppService.opportunitiesByCategoryAndProductForDataGrid(event.Id, this.selectedCategory.id,
      (this.gridState.skip + NumberConstant.ONE), this.isArchivingMode).subscribe((data) => {
      this.gridSettings.gridData = {
        data: data.opportunityDtoList,
        total: data.totalElements
      };
      this.initTable(data);
      if (this.showKanban) {
        this.oppFilter = {
          categoryId: this.categorySelected.id, data: {
            categoryFromList: this.selectedCategory,
            employeeIdFromList: this.selectedEmployeeId,
            typeDAffaireFromList: this.BY_TYPE_AFFAIRE,
            productIdFromList: this.selectedProductId
          }
        };
      }
    }, {}, () => {
    });
  }


  getEmployeeById(id: number) {
    this.BY_TYPE_AFFAIRE = FilterTypesEnum['STAFFING'];

    this.userService.getById(id).subscribe((data) => {
      this.BY_EMPLOYEE = data.FullName;
    });
  }

  getProductById(id: number) {

    this.itemService.getProductById(id).subscribe((data) => {

      this.BY_ARTICLE = data.Description;
      this.BY_TYPE_AFFAIRE = FilterTypesEnum['PRODUCT_SALE'];

    });
  }


  isThereStaffingTypeOpportunities() {
    return this.categoriesList[0] === OpportunityConstant.TYPE_STAFFING || this.categoriesList[1] === OpportunityConstant.TYPE_STAFFING;
  }

  isThereProductSaleTypeOpportunities() {
    return this.categoriesList[0] === OpportunityConstant.TYPE_PRODUCT_SALE || this.categoriesList[1] === OpportunityConstant.TYPE_PRODUCT_SALE;
  }

  filterByOrganisationFromKanban() {
    this.findOrganisationToFilterBy(this.opportunityFilter.organisationId);
    this.global_Filter(CrmConstant.FILTER_ORG);
    this.opportunityFilter.organisationId = undefined;
  }

  filterByCategoryFromKanban() {

    this.isCategoryFilter = true;
    this.choosenFilterNumber = NumberConstant.TWO;
    this.isOrganisationFilter = false;
    this.filterG = 'OBJECTIVES';
    this.kanban = false;

    this.selectedCategory = this.opportunityFilter.categoryFromKanban;
    this.category = this.selectedCategory;
    this.BY_GATEGORY = this.opportunityFilter.categoryFromKanban;

    this.BY_TYPE_AFFAIRE = this.opportunityFilter.typeDAffaireFromKanban;
    this.selectedCategoryType = this.opportunityFilter.typeDAffaireFromKanban;

    this.categoryService.getListOfCategories(this.BY_TYPE_AFFAIRE, this.isArchivingMode)
      .subscribe(category => {

        this.categoryList = category;

      });

    this.filterByObjectif(this.opportunityFilter.typeDAffaireFromKanban);
    this.filterByCategory(this.opportunityFilter.categoryFromKanban);
    this.isCategoryFilter = true;
    this.choosenFilterNumber = NumberConstant.TWO;
    this.isOrganisationFilter = false;
    this.filterG = 'OBJECTIVES';
    this.concerned = false;

    this.getOpportunitiesList();

    this.opportunityFilter.fromKanbanToList(undefined, undefined, undefined, undefined, undefined);

  }

  filterByCategoryAndEmployeeFromKanban() {

    this.isCategoryFilter = true;
    this.choosenFilterNumber = NumberConstant.TWO;
    this.isOrganisationFilter = false;
    this.filterG = 'OBJECTIVES';
    this.kanban = false;

    this.selectedCategory = this.opportunityFilter.categoryFromKanban;
    this.BY_GATEGORY = this.opportunityFilter.categoryFromKanban;

    this.BY_TYPE_AFFAIRE = this.opportunityFilter.typeDAffaireFromKanban;
    this.selectedCategoryType = this.opportunityFilter.typeDAffaireFromKanban;
    this.concerned = true;
    this.categoryService.getListOfCategories(this.BY_TYPE_AFFAIRE, this.isArchivingMode)
      .subscribe(category => {
        this.categoryList = category;
      });


    this.getEmployeeById(this.opportunityFilter.employeeIdFromKanban);

    this.oppService.opportunitiesByCategoryAndEmplyeeForDataGrid(this.opportunityFilter.employeeIdFromKanban,
      this.opportunityFilter.categoryFromKanban, (this.gridState.skip + NumberConstant.ONE)).subscribe((data) => {
      this.gridSettings.gridData = data;
      this.initTable(data);
    });
    this.oppService.getOpportunityConcernedAndResponsable(this.opportunityFilter.categoryFromKanban).subscribe(data => {
      if (data !== null) {
        this.userService.getUsersListByArray(data.employeeIds).subscribe(_rsponse => {
          if (_rsponse != null) {
            this.employee = _rsponse;
          }
        });
      }
    });

    this.getOpportunitiesList();
    this.getEmployeeById(this.opportunityFilter.employeeIdFromKanban);

    this.opportunityFilter.fromKanbanToList(undefined, undefined, undefined, undefined, undefined);
  }

  filterByCategoryAndProductFromKanban() {

    this.isCategoryFilter = true;
    this.choosenFilterNumber = NumberConstant.TWO;
    this.isOrganisationFilter = false;
    this.filterG = 'OBJECTIVES';
    this.kanban = false;

    this.selectedCategory = this.opportunityFilter.categoryFromKanban;
    this.BY_GATEGORY = this.opportunityFilter.categoryFromKanban;

    this.BY_TYPE_AFFAIRE = this.opportunityFilter.typeDAffaireFromKanban;
    this.selectedCategoryType = this.opportunityFilter.typeDAffaireFromKanban;
    this.concerned = true;

    this.categoryService.getListOfCategories(this.BY_TYPE_AFFAIRE, this.isArchivingMode)
      .subscribe(category => {
        this.categoryList = category;

      });


    this.getProductById(this.opportunityFilter.productIdFromKanban);
    this.oppService.opportunitiesByCategoryAndProductForDataGrid(this.opportunityFilter.productIdFromKanban,
      this.opportunityFilter.categoryFromKanban, (this.gridState.skip + NumberConstant.ONE), false).subscribe((data) => {
      this.gridSettings.gridData = data;
      this.initTable(data);
    });
    this.getOpportunitiesList();
    this.getProductById(this.opportunityFilter.productIdFromKanban);
    this.oppService.getOpportunityConcernedAndResponsable(this.opportunityFilter.categoryFromKanban).subscribe(data => {
      if (data !== null) {
        this.itemService.getItemsAfterFilter(data.productIds).subscribe(product => {
          product.listData.forEach(p => this.listP.push(p));
        });
      }
    });

    this.opportunityFilter.fromKanbanToList(undefined, undefined, undefined, undefined, undefined);
  }

  getOpportunitiesList() {
    this.oppService.getJavaGenericService().getEntityList()
      .subscribe((data) => {
        this.opportunitiesList = data;
        this.categoriesList = [];
        this.opportunitiesList.forEach((opp) => {
          this.categoryService.getJavaGenericService().getEntityById(opp.categoryId).subscribe(response => {
            const categoryType = response.categoryType;
            if (this.categoriesList.indexOf(categoryType) < NumberConstant.ZERO) {
              this.categoriesList.push(categoryType);
            }
          });

        });
      });
  }

  detailUpdatedSucess(e) {
    if (this.related && this.sourceId) {
      this.initRelatedOpportunityGridDataSource(this.gridSettings.state.skip / NumberConstant.TEN);
    } else {
      this.initGridDataSource(this.gridState.skip);
    }
  }

  setItemValue(e) {
  }

  public dataStateChange(state: any): void {
    this.sortParams = (state.sort.length > 0) ? `${state.sort[NumberConstant.ZERO].field},${state.sort[NumberConstant.ZERO].dir}` :
      this.sortParams = SharedCrmConstant.DEFAULT_SORT;
    this.gridSettings.state = state;
  }

  public sortChange(sort: SortDescriptor[]): void {
    if (!this.related) {
      this.sort = sort;
      this.initGridDataSource(this.gridState.skip);
    }
  }

  hideSidNav() {
    this.showSidNav = false;
  }

  public removeHandler(item) {
    const page = this.gridSettings.state.skip / NumberConstant.TEN;
    this.swalWarring.CreateSwal(this.translate.instant(ContactConstants.PUP_UP_DELETE_OPPORTUNITY_TEXT)).then((result) => {
      if (result.value) {
        this.oppService.getJavaGenericService().deleteEntity(item.id).subscribe((data) => {

            if (data) {
              if (this.related) {
                this.initRelatedOpportunityGridDataSource(page);
              } else {
                this.initGridDataSource(page);
                this.getOpportunitiesList();
              }
            }
          }
        );
      }
    });
  }

  closeKanban(e) {
    this.showKanban = false;
  }

  getSwitchValue(e, isQuickFilter?) {
    this.showKanban = e;
    this.kanbanIsCheck = !this.kanbanIsCheck;
    this.showStaffingCategories = false;
    this.showProductSaleCategories = false;
    this.showCategoriesTypesNav = false;

    if (e) {
      this.oppFilter = {
        categoryId: this.categorySelected.id,
        data: {
          categoryFromList: this.selectedCategory,
          employeeIdFromList: this.selectedEmployeeId,
          typeDAffaireFromList: this.BY_TYPE_AFFAIRE,
          productIdFromList: this.selectedProductId
        }
      };
      this.quickFilterByCategory(this.selectedCategory, true, isQuickFilter);
    } else {
      this.initDataGridAfterKanban();

    }
  }

  initDataGridAfterKanban() {
    this.kanban = false;
    if (this.selectedProductId) {
      this.getProductList();
    } else if (this.selectedEmployeeId) {
      this.getEmployeesList();
    } else if (this.selectedCategory) {
      this.filterByCategory(this.selectedCategory);
    }
  }

  private getEmployeesList() {
    const keys = Object.keys(this.employee);
    let employe;
    for (const key of keys) {
      if (this.employee[key].Id === this.selectedProductId) {
        employe = this.employee[key];
        this.filterByEmployee(employe);
      }
    }
  }

  private getProductList() {
    const keys = Object.keys(this.listP);
    let product;
    for (const key of keys) {
      if (this.listP[key].Id === this.selectedProductId) {
        product = this.listP[key];
        this.filterByArticle(product);
      }
    }
  }

  getConditionArticle() {
    if (this.selectedCategoryType === OpportunityConstant.TYPE_PRODUCT_SALE) {
      return this.concerned && this.categoryList;

    } else {
      return false;
    }

  }

  hideCategoriesNav() {
    this.showCategoriesTypesNav = !this.showCategoriesTypesNav;
    if (this.showCategoriesTypesNav === true) {
      this.toggle.nativeElement.classList.add('hide');
      this.toggle.nativeElement.classList.remove('show');
    }
    this.showStaffingCategories = false;
    this.showProductSaleCategories = false;
  }

  quickFilterByCategory(category, switchFlag, isQuickFilter) {
    this.isCategoryFilter = true;
    this.isOrganisationFilter = false;
    this.kanban = true;
    this.BY_TYPE_AFFAIRE = category.type;
    this.selectCategoryType = category.type;
    if (isQuickFilter) {
      this.filterByCategory(category);
    } else {
      this.initDataGridAfterKanban();
    }
    this.categorySelected = category;
    if (!switchFlag) {
      this.getSwitchValue(true, true);
    }
    this.choosenFilterNumber = 2;
    this.filterG = 'OBJECTIVES';
    this.categoryService.getListOfCategories(category.type, this.isArchivingMode)
      .subscribe((category) => {
        this.categoryList = category;
      });
    this.kanbanIsCheck = true;
  }

  updateStyle() {
    let minHeight: string;
    minHeight = this.related ? '0px' : '800px';
    return {
      'min-height': minHeight
    };

  }

  public restoreAction(id) {
    this.oppService.getJavaGenericService().getData('restore/dependency/'.concat(id)).subscribe(archiveDependency => {
      const dataToSendToPoPUp = {
        isArchiving: false,
        archiveDependency: archiveDependency,
        source: 'opportunity',
        sourceId: id,
        textHeader: this.translate.instant(OpportunityConstant.RESTART_OPPORTUNITY_TEXT)
      };
      this.showPopUp(dataToSendToPoPUp, CrmConstant.REACTIVATION_TITLE);
    });
  }

  public archiveAction(id) {
    this.oppService.getJavaGenericService().getData('archive/dependency/'.concat(id)).subscribe(archiveDependency => {

      const dataToSendToPoPUp = {
        isArchiving: true,
        archiveDependency: archiveDependency,
        source: 'opportunity',
        sourceId: id,
        textHeader: this.translate.instant(ContactConstants.ARCHIVE_OPPORTUNITY_TEXT)
      };
      this.showSidNav = false;
      this.showPopUp(dataToSendToPoPUp, CrmConstant.ARCHIVING_TITLE);
    });
  }

  refreshGridDataSource() {
    this.initGridDataSource(this.gridState.skip);
  }

  showPopUp(dataToSendToPoPUp, titre) {
    this.formModalDialogService.openDialog(titre, ArchivePopupComponent, this.viewRef, this.refreshGridDataSource.bind(this),
      dataToSendToPoPUp, false, SharedConstant.MODAL_DIALOG_SIZE_M);
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

  private initTypesList() {
    this.opportunityTypes = EnumValues.getNames(OpportunityType).map((type: any) => {
      return type = {enumValue: type, enumText: this.translate.instant(type)};
    });
  }

  private initOrganisationList() {
    this.getOrganisationList();
    this.filterOpportunitiesByType(OpportunityType.PROSPECT, 0);
    this.getIdsClientOrganizationRelatedToClientOpportunity();
    this.filterOpportunitiesByType(OpportunityType.CLIENT, 0);
    this.initGridDataSource(0);
  }

  filterByOrganizationType(type, page?) {
    this.selectedTypeFilter = type;
    let pageNumber = this.gridSettings.state.skip / NumberConstant.TEN;
    if (page) {
      pageNumber = page;
    }
    this.organisationList = [this.allOrganisation];
    this.selectedValue = this.allOrganisation;
    if (type.enumValue === OpportunityType.PROSPECT) {
      this.getOrganisationList();
      this.filterOpportunitiesByType(OpportunityType.PROSPECT, pageNumber);
    } else if (type.enumValue === OpportunityType.CLIENT) {
      this.getIdsClientOrganizationRelatedToClientOpportunity();
      this.filterOpportunitiesByType(OpportunityType.CLIENT, pageNumber);
    } else {
      this.initOrganisationList();
      this.initGridDataSource(pageNumber);
    }
  }
}
