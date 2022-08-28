import { Relation } from './../../../shared/utils/predicate';
import { Category } from './../../../models/immobilization/category.model';
import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import {GridSettings} from '../../../shared/utils/grid-settings.interface';
import {ColumnSettings} from '../../../shared/utils/column-settings.interface';
import {DataSourceRequestState, State} from '@progress/kendo-data-query';
import {Operator, PredicateFormat, OrderBy, OrderByDirection} from '../../../shared/utils/predicate';
import {TiersService} from '../../../purchase/services/tiers/tiers.service';
import {Router} from '@angular/router';
import {SwalWarring} from '../../../shared/components/swal/swal-popup';
import {ValidationService} from '../../../shared/services/validation/validation.service';
import {TiersConstants} from '../../../constant/purchase/tiers.constant';
import {PagerSettings} from '@progress/kendo-angular-grid';
import {Tiers} from '../../../models/achat/tiers.model';
import {SharedConstant} from '../../../constant/shared/shared.constant';
import {TranslateService} from '@ngx-translate/core';
import {FileService} from '../../../shared/services/file/file-service.service';
import {FileInfo} from '../../../models/shared/objectToSend';
import {NumberConstant} from '../../../constant/utility/number.constant';
import {TypeConstant} from '../../../constant/utility/Type.constant';
import {FiltrePredicateModel} from '../../../models/shared/filtrePredicate.model';
import {FieldTypeConstant} from '../../../constant/shared/fieldType.constant';
import { SearchTiersComponent } from '../../../shared/components/search-tiers/search-tiers.component';
import { MediaConstant } from '../../../constant/utility/Media.constant';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { PermissionConstant } from '../../../Structure/permission-constant';


@Component({
  selector: 'app-list-customer',
  templateUrl: './list-customer.component.html',
  styleUrls: ['./list-customer.component.scss']
})

export class ListCustomerComponent implements OnInit {
  private importFileCustomer: FileInfo;
  dataImported: boolean;
  importData: Array<Tiers>;
  importFormGroup: FormGroup;
  COUNTRY_FIELD = TiersConstants.COUNTRY_FIELD;
  CITY_FIELD = TiersConstants.CITY_FIELD;
  public filtreFieldsColumns = [];
  public filtreFieldsInputs = [];
  /**
   * advanced search predicate
   */
  public predicateAdvancedSearch: PredicateFormat;
  /**
   * quick search predicate
   */
  public predicateQuickSearch: PredicateFormat;
  /**
   * id type tiers predicate
   */
  public predicateIdTypeTiers: PredicateFormat;

  /**
   * predicate tiers list
   */
  public predicateTiers: PredicateFormat[] = [];
  /**
   * flag to identify the searchType
   * advanced search = 0 ,quick search = 1
   */
  public searchType = NumberConstant.ONE;

  /**
   * pager settings
   */
  pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
  /**
   * button Advanced Edit visibility
   */
  private btnEditVisible: boolean;

  /**
   * Grid state
   */
  public gridState: DataSourceRequestState = {
    skip: 0,
    take: 20,
    filter: { // Initial filter descriptor
      logic: SharedConstant.LOGIC_AND,
      filters: []
    }
  };
  public importColumnsConfig: ColumnSettings[] = [
    {
      field: TiersConstants.CODE_TIERS,
      title: TiersConstants.CODE,
      filterable: false,
      _width: 60
    },
    {
      field: TiersConstants.NAME,
      title: this.translate.instant(TiersConstants.NAME_TITLE),
      filterable: false,
      _width: 90
    },
    {
      field: TiersConstants.MATRICULE_FISCALE,
      title: this.translate.instant(TiersConstants.TAX_REGISTRATION_NUMBER_TITLE),
      filterable: false,
      _width: 90
    },
    {
      field: TiersConstants.ID_CURRENCY,
      title: this.translate.instant(TiersConstants.CURRENCY),
      filterable: false,
      _width: 60
    },
    {
      field: TiersConstants.REGION,
      title: this.translate.instant(TiersConstants.REGION_TITLE),
      filterable: false,
      _width: 90
    },
    {
      field: TiersConstants.ADRESS,
      title: this.translate.instant(TiersConstants.ADRESS_TITLE),
      filterable: false,
      _width: 90
    },
    {
      field: TiersConstants.PAYMENT_DELAY,
      title: this.translate.instant(TiersConstants.PAYMENT_DELAY_TITLE),
      filterable: false,
      _width: 90
    },
    {
      field: TiersConstants.IS_CASH,
      title: this.translate.instant(TiersConstants.IS_CASH_TITLE),
      filterable: false,
      _width: 90
    },
    {
      field: TiersConstants.AUTHORIZED_AMOUNT_INVOICE,
      title: this.translate.instant(TiersConstants.AUTHORIZED_AMOUNT_INVOICE_TITLE),
      filterable: false,
      _width: 90
    },
    {
      field: TiersConstants.PROVISIONAL_AUTHORIZED_AMOUNT_DELIVERY,
      title: this.translate.instant(TiersConstants.PROVISIONAL_AUTHORIZED_AMOUNT_DELIVERY_TITLE),
      filterable: false,
      _width: 90
    },
    {
      field: TiersConstants.ID_DISCOUNT_GROUP,
      title: this.translate.instant(TiersConstants.DISCOUNT_GROUP_TITLE),
      filterable: false,
      _width: 90
    },
    {
      field: TiersConstants.ID_TAXE_GROUP,
      title: this.translate.instant(TiersConstants.TAXE_GROUP_TITLE),
      filterable: false,
      _width: 90
    },
    {
      field: TiersConstants.EMAIL,
      title: this.translate.instant(TiersConstants.EMAIL_TITLE),
      filterable: false,
      _width: 90
    },
    {
      field: TiersConstants.PHONE,
      title: this.translate.instant(TiersConstants.PHONE_TITLE),
      filterable: false,
      _width: 90
    },
    {
      field: TiersConstants.ID_TIER_CATEGORY,
      title: this.translate.instant(TiersConstants.TIER_CATEGORY_TTTLE),
      filterable: false,
      _width: 60
    }
  ];
public exportColumnsConfig: ColumnSettings[] = [
    {
      field: TiersConstants.CODE_TIERS,
      title: TiersConstants.CODE,
      filterable: true,
      _width: 60
    },
    {
      field: TiersConstants.NAME,
      title: this.translate.instant(TiersConstants.NAME_TITLE),
      filterable: true,
      _width: 90
    },
    {
      field: TiersConstants.MATRICULE_FISCALE,
      title: this.translate.instant(TiersConstants.TAX_REGISTRATION_NUMBER_TITLE),
      filterable: false,
      _width: 90
    },
    {
      field: TiersConstants.ID_CURRENCY_NAVIGATION_CODE,
      title: this.translate.instant(TiersConstants.CURRENCY),
      filterable: true,
      _width: 60
    },
    {
      field: TiersConstants.REGION,
      title: this.translate.instant(TiersConstants.REGION_TITLE),
      filterable: true,
      _width: 90
    },
    {
      field: TiersConstants.ADRESS,
      title: this.translate.instant(TiersConstants.ADRESS_TITLE),
      filterable: false,
      _width: 90
    },
    {
      field: TiersConstants.PAYMENT_DELAY,
      title: this.translate.instant(TiersConstants.PAYMENT_DELAY_TITLE),
      filterable: false,
      _width: 90
    },
    {
      field: TiersConstants.IS_CASH,
      title: this.translate.instant(TiersConstants.IS_CASH_TITLE),
      filterable: false,
      _width: 90
    },
    {
      field: TiersConstants.AUTHORIZED_AMOUNT_INVOICE,
      title: this.translate.instant(TiersConstants.AUTHORIZED_AMOUNT_INVOICE_TITLE),
      filterable: false,
      _width: 90
    },
    {
      field: TiersConstants.PROVISIONAL_AUTHORIZED_AMOUNT_DELIVERY,
      title: this.translate.instant(TiersConstants.PROVISIONAL_AUTHORIZED_AMOUNT_DELIVERY_TITLE),
      filterable: false,
      _width: 90
    },
    {
      field: TiersConstants.ID_TAXEGROUP_TIERS_NAVIGATION_LABEL,
      title: this.translate.instant(TiersConstants.TAXEGROUP_TITLE),
      filterable: true,
      _width: 90
    },
    {
      field: TiersConstants.TIER_CATEGORY_NAVIGATION_CODE,
      title: this.translate.instant(TiersConstants.TIER_CATEGORY_TTTLE),
      filterable: true,
      _width: 60
    }
  ];

  public columnsConfig: ColumnSettings[] = [
    {
      field: TiersConstants.CODE_TIERS,
      title: TiersConstants.CODE,
      tooltip: TiersConstants.CODE,
      filterable: true,
      _width: 60
    },
    {
      field: TiersConstants.NAME,
      title: this.translate.instant(TiersConstants.CLIENT),
      tooltip: TiersConstants.CLIENT,
      filterable: true,
      _width: 200
    },
    {
      field: TiersConstants.EMAIL,
      title: this.translate.instant(TiersConstants.EMAIL),
      filterable: false,
      _width: 150
    },
    {
      field: TiersConstants.CITY_FIELD,
      title: this.translate.instant(TiersConstants.CITY_TTTLE),
      tooltip: TiersConstants.CITY_TTTLE,
      filterable: true,
      _width: 110
    },
    {
      field: TiersConstants.COUNTRY_FIELD,
      title: this.translate.instant(TiersConstants.COUNTRY_TTTLE),
      tooltip: TiersConstants.COUNTRY_TTTLE,
      filterable: true,
      _width: 110
    },
    {
      field: TiersConstants.ID_CURRENCY_NAVIGATION_CODE,
      title: this.translate.instant(TiersConstants.CURRENCY),
      tooltip: TiersConstants.CURRENCY,
      filterable: true,
      _width: 100
    },
    {
      field: TiersConstants.ID_TAXEGROUP_TIERS_NAVIGATION_LABEL,
      title: this.translate.instant(TiersConstants.TAXEGROUP_TITLE),
      tooltip: TiersConstants.TAXEGROUP_TITLE,
      filterable: true,
      _width: 120
    },
    {
      field: TiersConstants.PHONE_NAVIGATION,
      title: this.translate.instant(TiersConstants.PHONE_TITLE),
      tooltip: this.translate.instant(TiersConstants.PHONE_TITLE),
      filterable: false,
      _width: 100
    },
    {
      field: TiersConstants.MATRICULE_FISCALE,
      title: this.translate.instant(TiersConstants.TAX_REGISTRATION_NUMBER_TITLE),
      filterable: false,
      _width: 90
    },
    {
      field: TiersConstants.TIER_CATEGORY_NAVIGATION_CODE,
      title: this.translate.instant(TiersConstants.BILLING_METHOD),
      tooltip: TiersConstants.BILLING_METHOD,
      filterable: true,
      _width: 130
    }
  ];
  // Grid settings
  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig
  };
  public exportGridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.exportColumnsConfig
  };
  // message event
  // Edited Row index
  private editedRowIndex: number;
  // Grid quick add
  public formGroup: FormGroup;
  @ViewChild(SearchTiersComponent) searchTiersComponent: SearchTiersComponent;
  // Currency dropdown dataSource
  public currencyDataSource;
  isCardView = false;
  totalCards = NumberConstant.NINE;
  public state: State = {
    skip: NumberConstant.ZERO,
    take: NumberConstant.TEN,
    // Initial filter descriptor
    filter: {
      logic: SharedConstant.LOGIC_AND,
      filters: []
    }
  };
  totalCustomers = NumberConstant.ZERO;
  data = [];
  // tiers type
  public tiersType = TiersConstants.CUSTOMER_TYPE;

  public hasAddPermission = false;
  public hasShowPermission = false;
  public hasUpdatePermission = false;


  constructor(
    public tiersService: TiersService,
    protected router: Router,
    protected swalWarrings: SwalWarring,
    protected fb: FormBuilder,
    protected translate: TranslateService,
    protected validationService: ValidationService,
    protected fileServiceService: FileService,
    public authService: AuthService) {
    this.predicateAdvancedSearch = PredicateFormat.prepareTiersPredicate(TiersConstants.CUSTOMER_TYPE);
    this.predicateQuickSearch = PredicateFormat.prepareTiersPredicate(TiersConstants.CUSTOMER_TYPE);
    this.predicateIdTypeTiers = PredicateFormat.prepareIdTypeTiersPredicate(TiersConstants.CUSTOMER_TYPE);
    this.btnEditVisible = true;
  }

  /**
   * ng init
   */
  ngOnInit() {
    this.predicateIdTypeTiers.OrderBy = new Array<OrderBy>();
    this.predicateIdTypeTiers.OrderBy.push.apply(this.predicateIdTypeTiers.OrderBy,
        [new OrderBy(TiersConstants.ID, OrderByDirection.desc)]);
    this.predicateTiers.push(this.predicateIdTypeTiers);
    this.predicateIdTypeTiers.Relation.push.apply(this.predicateIdTypeTiers.Relation,
      [new Relation(TiersConstants.ID_TIER_CATEGORY_NAVIGATION)]);

    this.initCustomersFiltreConfig();
    this.initGridDataSource(true);
    this.hasAddPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.ADD_CUSTOMER);
    this.hasShowPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.SHOW_CUSTOMER);
    this.hasUpdatePermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.UPDATE_CUSTOMER);

  }

  /**
   * load advancedSearch parameters config
   * @private
   */
  private initCustomersFiltreConfig() {
    this.filtreFieldsColumns.push(new FiltrePredicateModel(TiersConstants.CODE, FieldTypeConstant.TEXT_TYPE, TiersConstants.CODE_TIERS));
    this.filtreFieldsColumns.push(new FiltrePredicateModel(TiersConstants.NAME_TITLE, FieldTypeConstant.TEXT_TYPE, TiersConstants.NAME));
    this.filtreFieldsColumns.push(new FiltrePredicateModel(TiersConstants.COUNTRY_TTTLE, FieldTypeConstant.COUNTRY_COMPONENT_DROPDOWN,
      TiersConstants.COUNTRY_NAVIGATION_ID));
    this.filtreFieldsColumns.push(new FiltrePredicateModel(TiersConstants.TIER_CATEGORY_TTTLE, FieldTypeConstant.CATEGORY_COMPONENT_DROPDOWN,
      TiersConstants.TIER_CATEGORY_NAVIGATION_ID));

    this.filtreFieldsInputs.push(new FiltrePredicateModel(TiersConstants.CITY_TTTLE, FieldTypeConstant.CITY_DROPDOWN_COMPONENT,
      TiersConstants.CITY_FIELD, true, SharedConstant.SHARED, TiersConstants.ADDRESSES_MODEL, TiersConstants.ID_TIERS,
        TiersConstants.CITY_NAVIGATION_ID));
    this.filtreFieldsInputs.push(new FiltrePredicateModel(TiersConstants.TAXE_GROUP_TITLE, FieldTypeConstant.TAXE_GROUP_TIERS_DROPDOWN,
      TiersConstants.ID_TAXE_GROUP));
    this.filtreFieldsInputs.push(new FiltrePredicateModel(TiersConstants.CURRENCY, FieldTypeConstant.CURRENCY_DROPDOWN_COMPONENT,
      TiersConstants.ID_CURRENCY_NAVIGATION_ID));
  }

  initGridDataSource(isQuickSearch?) {
    this.tiersService.reloadServerSideDataWithListPredicate(this.isCardView ? this.state : this.gridSettings.state, this.predicateTiers,
      SharedConstant.GET_DATA_WITH_SPECIFIC_FILTER).subscribe(data => {
      this.totalCustomers = data.total;
     this.prepareList(data);
    });
  }

  /**
   * Data changed listener
   * @param state
   */
  public dataStateChange(state): void {
    this.predicateTiers = [];
    this.predicateTiers.push(this.predicateIdTypeTiers);
    if (this.searchType === NumberConstant.ONE) {
      this.gridState.filter.logic = SharedConstant.LOGIC_OR;
      this.gridSettings.state.filter.logic = SharedConstant.LOGIC_OR;
      this.predicateQuickSearch.Operator = Operator.or;
      this.predicateTiers.push(this.predicateQuickSearch);
    } else {
      this.gridState.filter.logic = SharedConstant.LOGIC_AND;
      this.gridSettings.state.filter.logic = SharedConstant.LOGIC_AND;
      this.predicateAdvancedSearch.Operator = Operator.and;
      this.predicateTiers.push(this.predicateAdvancedSearch);
    }
    if (!state.sort[NumberConstant.ZERO] || (state.sort[NumberConstant.ZERO] && !state.sort[NumberConstant.ZERO].dir)) {
      state.sort = [];
    }
    this.gridSettings.state = state;
    this.initGridDataSource(true);
  }

  /**
   * Quick add
   * @param param0
   */
  public addHandler({sender}) {
    this.closeEditor(sender);

    this.formGroup = this.fb.group({
      CodeTiers: [{value: '', disabled: true}],
      Name: ['', Validators.required],
      Region: [''],
      IdCurrency: [undefined, Validators.required],
      IdTaxeGroupTiers: [undefined, Validators.required],
      IdTierCategory: [undefined, Validators.required],
      Contact: [new Array<any>()],
      IdTypeTiers: [TiersConstants.CUSTOMER_TYPE]
    });

    sender.addRow(this.formGroup);
    this.btnEditVisible = false;
  }

  /**
   * Quick edit
   * @param param0
   */
  public editHandler({sender, rowIndex, dataItem}) {
    this.closeEditor(sender);

    this.formGroup = this.fb.group({
      Id: [dataItem.Id],
      CodeTiers: [{value: dataItem.CodeTiers, disabled: true}],
      Name: [dataItem.Name, Validators.required],
      Region: [dataItem.Region, Validators.required],
      IdCurrency: [dataItem.IdCurrency, Validators.required],
      IdTaxeGroupTiers: [dataItem.IdTaxeGroupTiers, Validators.required],
      IdTierCategory: [dataItem.IdTierCategory, Validators.required],
      IdTypeTiers: [TiersConstants.CUSTOMER_TYPE]
    });

    this.editedRowIndex = rowIndex;

    sender.editRow(rowIndex, this.formGroup);
    this.btnEditVisible = false;
  }

  /**
   * Cancel
   * @param param0
   */
  public cancelHandler({sender, rowIndex}) {
    this.closeEditor(sender, rowIndex);
    this.btnEditVisible = true;
  }

  /**
   * Save handler
   * @param param0
   */
  public saveHandler({sender, rowIndex, formGroup, isNew}) {
    if ((formGroup as FormGroup).valid) {
      const item: Tiers = (formGroup as FormGroup).getRawValue();
      item.Contact = new Array();

      this.tiersService.saveTiers(item, isNew).subscribe(() => {
        this.initGridDataSource();
      });

      sender.closeRow(rowIndex);
      this.btnEditVisible = true;
    } else {
      this.validationService.validateAllFormFields(formGroup as FormGroup);
    }
  }

  /**
   * Remove handler
   * @param param0
   */
  public removeHandler({dataItem}) {
    this.swalWarrings.CreateSwal().then((result) => {
      if (result.value) {
        this.tiersService.removeTiers(dataItem).subscribe(() => {
          this.initGridDataSource();
        });
      }
    });
  }

  /**
   * Close editor
   * @param grid
   * @param rowIndex
   */
  private closeEditor(grid, rowIndex = this.editedRowIndex) {
    if (rowIndex !== undefined) {
      grid.closeRow(rowIndex);
      this.editedRowIndex = undefined;
      this.formGroup = undefined;
    }
  }

  /**
   * edit click row event
   * @param dataItem
   */
  public goToAdvancedEdit(dataItem) {
    this.router.navigateByUrl(TiersConstants.CUSTOMER_ADVANCED_EDIT_URL.concat(dataItem.Id));
  }

  public receiveData(event) {
    if(event.predicate.Filter[NumberConstant.ZERO].value === ""){
      this.predicateQuickSearch = PredicateFormat.prepareTiersPredicate(TiersConstants.CUSTOMER_TYPE);
    }
    else {
    this.predicateQuickSearch = event.predicate;
    }
    this.searchType = NumberConstant.ONE;
    this.predicateTiers = [];
    this.predicateIdTypeTiers.OrderBy = new Array<OrderBy>();
    this.predicateIdTypeTiers.OrderBy.push.apply(this.predicateIdTypeTiers.OrderBy,
        [new OrderBy(TiersConstants.ID, OrderByDirection.desc)]);
    this.predicateTiers.push(this.predicateIdTypeTiers);
    this.predicateTiers.push(this.mergefilters());
    this.gridSettings.state.skip = NumberConstant.ZERO;
    this.initGridDataSource(true);
  }

  public createEmptyImportCustomerFormGroup() {
    this.importFormGroup = this.fb.group({
      CodeTiers: [{value: '', disabled: true}],
      Name: ['', [Validators.required, Validators.minLength(TiersConstants.NAME_MIN_LENGTH)]],
      MatriculeFiscale: [''],
      IdCurrency: new FormControl(undefined, [Validators.required]),
      Region: [''],
      Adress: [''],
      PaymentDelay: ['', [
        Validators.pattern('^[0-9]*$'),
        Validators.min(NumberConstant.ZERO),
        Validators.max(NumberConstant.YEAR_DAYS)
      ]],
      IsCash: [false],
      AuthorizedAmountInvoice: [undefined, Validators.min(NumberConstant.ZERO)],
      ProvisionalAuthorizedAmountDelivery: ['', Validators.min(NumberConstant.ZERO)],
      IdDiscountGroupTiers: [''],
      IdTaxeGroupTiers: new FormControl('', [Validators.required]),
      IdTierCategory: new FormControl('', [Validators.required]),
      IdTypeTiers: ['', Validators.required],
      Email: ['', Validators.email],
      Phone: ['']
    });
  }

  public incomingFile(event) {
    this.createEmptyImportCustomerFormGroup();
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e: any) => {
        this.importFileCustomer = FileInfo.generateFileInfoFromFile(file, reader);
        this.tiersService.uploadCustomer(this.importFileCustomer).subscribe((res: Array<Tiers>) => {
          this.dataImported = true;
          this.importData = res;
        });
      };
    }
  }

  onClosePopupImport() {
    this.dataImported = false;
  }

  public saveImportedData(myData: Array<Tiers>) {
    this.tiersService.saveImportedData(myData).subscribe(res => {
      this.dataImported = false;
      this.initGridDataSource();
    });
  }

  public downLoadFile(event) {
    this.tiersService.downloadCustomerExcelTemplate().subscribe(
      res => {
        this.fileServiceService.downLoadFile(res);
      });
  }

  changeViewToCard() {
    this.isCardView = true;
  }

  changeViewToList() {
    this.isCardView = false;
  }

  pictureTierSrc(dataItem) {
    if (dataItem.PictureFileInfo) {
      return SharedConstant.PICTURE_BASE + dataItem.PictureFileInfo.Data;
    }
  }

  public goToProfile(dataItem) {
    this.router.navigateByUrl(TiersConstants.CUSTOMER_PROFILE_URL + dataItem.Id, {queryParams: dataItem, skipLocationChange: false});
  }

  /**
   * get array<Filtre> from advancedSearchComponenet
   * remove old filter property from the predicate filter list
   * case filtre type date between
   * @param filtre
   */
  getFiltrePredicate(filtre) {
    this.searchType = NumberConstant.ZERO;
    this.predicateTiers = []
    this.predicateTiers.push(this.predicateIdTypeTiers);
    this.prepareSpecificFiltreFromAdvancedSearch(filtre);
    this.prepareFiltreFromAdvancedSearch(filtre);
    this.predicateTiers.push(this.mergefilters());
  }

  mergefilters() {
    let predicate = new PredicateFormat();
     if (this.predicateAdvancedSearch) {
       this.cloneAdvancedSearchPredicate(predicate);
     }
    if (this.predicateQuickSearch.Filter.length !== NumberConstant.ZERO) {
      predicate.Filter = predicate.Filter.concat(this.predicateQuickSearch.Filter);
    }
    return (predicate);
  }

  public cloneAdvancedSearchPredicate(targetPredicate: PredicateFormat){
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
  private prepareSpecificFiltreFromAdvancedSearch(filtre) {
    this.predicateAdvancedSearch.SpecFilter = this.predicateAdvancedSearch.SpecFilter.filter(value => value.Prop !== filtre.SpecificFiltre.Prop);
    if (filtre.SpecificFiltre && !filtre.SpecificFiltreToDelete) {
      this.predicateAdvancedSearch.SpecFilter.push(filtre.SpecificFiltre);
    }
  }

  /**
   * case filtre date between : we don't remove the old filtre date value
   * @param filtre
   * @private
   */
  private prepareFiltreFromAdvancedSearch(filtre) {
    if (filtre.type === TypeConstant.date) {
      this.predicateAdvancedSearch.Filter = this.predicateAdvancedSearch.Filter.filter(value => value.prop === filtre.prop && value.operation !== filtre.operation);
    } else {
      this.predicateAdvancedSearch.Filter = this.predicateAdvancedSearch.Filter.filter(value => value.prop !== filtre.prop);
    }
    if (filtre.operation && filtre.value && !filtre.SpecificFiltre) {
      this.predicateAdvancedSearch.Filter.push(filtre);
    }
  }

  /**
   * identify the predicate operator AND|OR
   * @param operator
   */
  getOperatorPredicate(operator: Operator) {
    this.predicateAdvancedSearch.Operator = operator;
  }

  /**
   * Reset dataGrid
   */
  resetClickEvent() {
    this.predicateAdvancedSearch = PredicateFormat.prepareTiersPredicate(TiersConstants.CUSTOMER_TYPE);
    this.predicateTiers = [];
    this.searchTiersComponent.tiersString = SharedConstant.EMPTY;
    this.predicateIdTypeTiers.OrderBy = new Array<OrderBy>();
    this.predicateIdTypeTiers.OrderBy.push.apply(this.predicateIdTypeTiers.OrderBy,
        [new OrderBy(TiersConstants.ID, OrderByDirection.desc)]);
    this.predicateTiers.push(this.predicateIdTypeTiers);
    this.predicateTiers.push(this.mergefilters());
    this.predicateTiers[NumberConstant.ONE].Filter = [];
    this.initGridDataSource(true);
  }

  private setPredicateFiltre(isQuickSearch) {
    this.predicateTiers = [];
    this.predicateIdTypeTiers.OrderBy = new Array<OrderBy>();
    this.predicateIdTypeTiers.OrderBy.push.apply(this.predicateIdTypeTiers.OrderBy,
        [new OrderBy(TiersConstants.ID, OrderByDirection.desc)]);
    this.predicateTiers.push(this.predicateIdTypeTiers);
    if (isQuickSearch) {
      this.state.filter.logic = SharedConstant.LOGIC_OR;
      this.gridSettings.state.filter.logic = SharedConstant.LOGIC_OR;
      this.predicateTiers.push(this.predicateQuickSearch);
    } else {
      this.predicateAdvancedSearch.Operator = Operator.and;
      this.state.filter.logic = SharedConstant.LOGIC_AND;
      this.gridSettings.state.filter.logic = SharedConstant.LOGIC_AND;
      this.predicateTiers.push(this.predicateAdvancedSearch);
    }
  }
  /**
   * get pictures
   */
   prepareList(result) {
    // get first picture
    if (result) {
      const data = result.data;
      this.loadTiersPicture(data);
      data.forEach(tier => {
        tier.image = MediaConstant.PLACEHOLDER_PICTURE;
      });
    }
    this.gridSettings.gridData = result;
  }

  private loadTiersPicture(tiersList: Tiers[]) {
    var tiersPicturesUrls = [];
    tiersList.forEach((tiers: Tiers) => {
      tiersPicturesUrls.push(tiers.UrlPicture);
    });
    if (tiersPicturesUrls.length > NumberConstant.ZERO) {
      this.tiersService.getPictures(tiersPicturesUrls, false).subscribe(tiersPictures => {
        this.fillTiersPictures(tiersList, tiersPictures);
      });
    }
  }
  private fillTiersPictures(tiersList, tiersPictures) {
    tiersList.map((tiers: Tiers) => {
      if (tiers.UrlPicture) {
        let dataPicture = tiersPictures.objectData.find(value => value.FulPath === tiers.UrlPicture);
        if (dataPicture) {
          tiers.image = `${SharedConstant.PICTURE_BASE}${dataPicture.Data}`;
        }
      }
    });
  }
}
