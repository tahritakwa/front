import {Component, OnInit, ViewChild} from '@angular/core';
import {GridSettings} from '../../../shared/utils/grid-settings.interface';
import {PagerSettings} from '@progress/kendo-angular-grid';
import {DataResult, DataSourceRequestState, State} from '@progress/kendo-data-query';
import {ColumnSettings} from '../../../shared/utils/column-settings.interface';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {Operator, PredicateFormat, OrderBy, OrderByDirection} from '../../../shared/utils/predicate';
import {TiersService} from '../../services/tiers/tiers.service';
import {unique, ValidationService} from '../../../shared/services/validation/validation.service';
import {SwalWarring} from '../../../shared/components/swal/swal-popup';
import {Tiers} from '../../../models/achat/tiers.model';
import {TiersConstants} from '../../../constant/purchase/tiers.constant';
import {SharedConstant} from '../../../constant/shared/shared.constant';
import {TranslateService} from '@ngx-translate/core';
import {FileService} from '../../../shared/services/file/file-service.service';
import {FileInfo} from '../../../models/shared/objectToSend';
import {NumberConstant} from '../../../constant/utility/number.constant';
import {FiltrePredicateModel} from '../../../models/shared/filtrePredicate.model';
import {FieldTypeConstant} from '../../../constant/shared/fieldType.constant';
import {isNotNullOrUndefinedAndNotEmptyValue} from '../../../stark-permissions/utils/utils';
import { SearchTiersComponent } from '../../../shared/components/search-tiers/search-tiers.component';
import { MediaConstant } from '../../../constant/utility/Media.constant';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { PermissionConstant } from '../../../Structure/permission-constant';

const EMPTY_STRING = '';

@Component({
  selector: 'app-list-supplier',
  templateUrl: './list-supplier.component.html',
  styleUrls: ['./list-supplier.component.scss']
})
export class ListSupplierComponent implements OnInit {
  public filtreFieldsColumns = [];
  public filtreFieldsInputs = [];
  private importFileSupplier: FileInfo;
  dataImported: boolean;
  importData: Array<Tiers>;
  importFormGroup: FormGroup;
  // pager settings
  pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
  @ViewChild(SearchTiersComponent) searchTiersComponent: SearchTiersComponent;

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
  public haveAddPermission = false;
  public haveShowPermission = false;
  public haveUpdatePermission = false;
  public  haveDeletePermission = false;
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
      field: TiersConstants.DELEVERY_DELAY,
      title: this.translate.instant(TiersConstants.DELEVERY_DELAY_TITLE),
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
      field: TiersConstants.ACTIVITY_SECTOR,
      title: this.translate.instant(TiersConstants.ACTIVITY_SECTOR_TITLE),
      filterable: false,
      _width: 90
    }
  ];

  public exportColumnsConfig: ColumnSettings[] = [
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
      field: TiersConstants.ID_CURRENCY_NAVIGATION_CODE,
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
      field: TiersConstants.DELEVERY_DELAY,
      title: this.translate.instant(TiersConstants.DELEVERY_DELAY_TITLE),
      filterable: false,
      _width: 90
    },
    {
      field: TiersConstants.ID_DISCOUNT_GROUP_NAVIGATION_LABEL,
      title: this.translate.instant(TiersConstants.DISCOUNT_GROUP_TITLE),
      filterable: false,
      _width: 90
    },
    {
      field: TiersConstants.ID_TAXEGROUP_TIERS_NAVIGATION_LABEL,
      title: this.translate.instant(TiersConstants.TAXEGROUP_TITLE),
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
    }
  ];
  /**
   * Grid columns
   */

  public columnsConfig: ColumnSettings[] = [
    {
      field: TiersConstants.CODE_TIERS,
      title: TiersConstants.CODE,
      filterable: false,
      _width: 60
    },
    {
      field: TiersConstants.NAME,
      title: TiersConstants.SUPPLIER,
      filterable: false,
      _width: 240
    },
    {
      field: TiersConstants.EMAIL,
      title: this.translate.instant(TiersConstants.EMAIL),
      filterable: false,
      _width: 250
    },
    {
      field: TiersConstants.CITY_FIELD,
      title: this.translate.instant(TiersConstants.CITY_TTTLE),
      filterable: false,
      _width: 150
    },
    {
      field: TiersConstants.COUNTRY_FIELD,
      title: this.translate.instant(TiersConstants.COUNTRY_TTTLE),
      filterable: false,
      _width: 150
    },
    {
      field: TiersConstants.ID_CURRENCY_NAVIGATION_CODE,
      title: this.translate.instant(TiersConstants.CURRENCY),
      filterable: false,
      _width: 100
    },
    {
      field: TiersConstants.ID_TAXEGROUP_TIERS_NAVIGATION_LABEL,
      title: this.translate.instant(TiersConstants.TAXEGROUP_TITLE),
      filterable: false,
      _width: 120
    },
    {
      field: TiersConstants.PHONE_NAVIGATION,
      title: this.translate.instant(TiersConstants.PHONE_TITLE),
      _width: 200,
      filterable: true,
    },
    {
      field: TiersConstants.MATRICULE_FISCALE,
      title: this.translate.instant(TiersConstants.TAX_REGISTRATION_NUMBER_TITLE),
      filterable: true,
      _width: 90
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
  // Currency dropdown dataSource
  public currencyDataSource;
  /**
   *
   * @param tiersService
   * @param routes
   */
  isCardView = false;
  totalCards = NumberConstant.ZERO;
  public state: State = {
    skip: NumberConstant.ZERO,
    take: NumberConstant.NINE,
    // Initial filter descriptor
    filter: {
      logic: SharedConstant.LOGIC_AND,
      filters: []
    }
  };
  totalSuppliers = NumberConstant.ZERO;
  tiers_type = TiersConstants.SUPPLIER_TYPE;

  constructor(public tiersService: TiersService,
              protected router: Router,
              protected swalWarrings: SwalWarring,
              protected fb: FormBuilder,
              protected translate: TranslateService,
              protected validationService: ValidationService,
              protected fileServiceService: FileService, public authService: AuthService) {
    this.totalCards = this.totalSuppliers;
    this.predicateAdvancedSearch = PredicateFormat.prepareTiersPredicate(TiersConstants.SUPPLIER_TYPE);
    this.predicateQuickSearch = PredicateFormat.prepareTiersPredicate(TiersConstants.SUPPLIER_TYPE);
    this.predicateIdTypeTiers = PredicateFormat.prepareIdTypeTiersPredicate(TiersConstants.SUPPLIER_TYPE);
  }

  /**
   * ng init
   */
  ngOnInit() {
    this.haveAddPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.ADD_SUPPLIER);
    this.haveShowPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.SHOW_SUPPLIER);
    this.haveUpdatePermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.UPDATE_SUPPLIER);
    this.haveDeletePermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.DELETE_SUPPLIER);
    this.predicateIdTypeTiers.OrderBy = new Array<OrderBy>();
    this.predicateIdTypeTiers.OrderBy.push.apply(this.predicateIdTypeTiers.OrderBy,
        [new OrderBy(TiersConstants.ID, OrderByDirection.desc)]);
    this.predicateTiers.push(this.predicateIdTypeTiers);
    this.initTiersFiltreConfig();
    this.initGridDataSource(true);
  }

  /**
   * load advancedSearch parameters config
   * @private
   */
  private initTiersFiltreConfig() {
    this.filtreFieldsColumns.push(new FiltrePredicateModel(TiersConstants.CODE, FieldTypeConstant.TEXT_TYPE, TiersConstants.CODE_TIERS));
    this.filtreFieldsColumns.push(new FiltrePredicateModel(TiersConstants.NAME_TITLE, FieldTypeConstant.TEXT_TYPE, TiersConstants.NAME));
    this.filtreFieldsColumns.push(new FiltrePredicateModel(TiersConstants.COUNTRY_TTTLE, FieldTypeConstant.COUNTRY_COMPONENT_DROPDOWN,
      TiersConstants.COUNTRY_FIELD, true, SharedConstant.SHARED, TiersConstants.ADDRESSES_MODEL, TiersConstants.ID_TIERS,
      TiersConstants.COUNTRY_NAVIGATION_ID));
    this.filtreFieldsInputs.push(new FiltrePredicateModel(TiersConstants.CITY_TTTLE, FieldTypeConstant.CITY_DROPDOWN_COMPONENT,
       TiersConstants.CITY_FIELD, true, SharedConstant.SHARED, TiersConstants.ADDRESSES_MODEL, TiersConstants.ID_TIERS,
        TiersConstants.CITY_NAVIGATION_ID));
    this.filtreFieldsInputs.push(new FiltrePredicateModel(TiersConstants.TAXE_GROUP_TITLE, FieldTypeConstant.TAXE_GROUP_TIERS_DROPDOWN,
       TiersConstants.ID_TAXEGROUP_TIERS_NAVIGATION_ID));
    this.filtreFieldsInputs.push(new FiltrePredicateModel(TiersConstants.CURRENCY, FieldTypeConstant.CURRENCY_DROPDOWN_COMPONENT,
      TiersConstants.ID_CURRENCY_NAVIGATION_ID));
  }

  initGridDataSource(isQuickSearch?) {
    this.tiersService.reloadServerSideDataWithListPredicate(this.isCardView ? this.state : this.gridSettings.state, this.predicateTiers,
      SharedConstant.GET_DATA_WITH_SPECIFIC_FILTER).subscribe(data => {
      this.mapPhoneNavigationNumber(data);
      this.totalSuppliers = data.total;
      this.prepareList(data);
    });
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
   * map phoneNavigation number to empty in case number equals 0
   * @param data
   * @private
   */
  private mapPhoneNavigationNumber(data: DataResult) {
    data.data = data.data.map((tiers: Tiers) => {
      const IdPhoneNavigation = tiers.IdPhoneNavigation;
      if (IdPhoneNavigation !== null && IdPhoneNavigation.Number === NumberConstant.ZERO) {
        IdPhoneNavigation.Number = '';
      }
      return tiers;
    });
  }

  /**
   * Data changed listener
   * @param state
   */
  public dataStateChange(state): void {
    const isQuickSearch = this.searchType === NumberConstant.ONE;
    this.predicateTiers = [];
    this.predicateTiers.push(this.predicateIdTypeTiers);
    if (!state.sort[NumberConstant.ZERO] || (state.sort[NumberConstant.ZERO] && !state.sort[NumberConstant.ZERO].dir)) {
      state.sort = [];
    }
    this.gridSettings.state = state;
    this.state = state;
    this.initGridDataSource(isQuickSearch);
  }

  /**
   * edit click row event
   * @param dataItem
   */
  public goToAdvancedEdit(dataItem) {
    this.router.navigateByUrl(TiersConstants.SUPPLIER_ADVANCED_EDIT_URL + dataItem.Id, {queryParams: dataItem, skipLocationChange: false});
  }

  public goToProfile(dataItem) {
    this.router.navigateByUrl(TiersConstants.SUPPLIER_PROFILE_URL + dataItem.Id, {queryParams: dataItem, skipLocationChange: false});
  }

  public receiveData(event: any) {
    if(event.predicate.Filter[NumberConstant.ZERO].value === ""){
      this.predicateQuickSearch = PredicateFormat.prepareTiersPredicate(TiersConstants.SUPPLIER_TYPE);
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

  public createEmptyImportSupplierFormGroup() {
    this.importFormGroup = this.fb.group({
      CodeTiers: [{value: '', disabled: true}],
      Name: ['', [Validators.required, Validators.minLength(TiersConstants.NAME_MIN_LENGTH)]],
      MatriculeFiscale: [''],
      IdCurrency: ['', [Validators.required]],
      Region: [''],
      Adress: [''],
      DeleveryDelay: ['', [
        Validators.min(NumberConstant.ZERO),
        Validators.max(NumberConstant.YEAR_DAYS)
      ]],
      IdDiscountGroupTiers: [''],
      IdTaxeGroupTiers: ['', Validators.required],
      IdTypeTiers: ['', Validators.required],
      Email: ['',Validators.pattern(SharedConstant.MAIL_PATTERN)],
      Phone: [NumberConstant.ZERO],
      ActivitySector: ['', Validators.required]
    });
  }

  public incomingFile(event) {
    this.createEmptyImportSupplierFormGroup();
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e: any) => {
        this.importFileSupplier = FileInfo.generateFileInfoFromFile(file, reader);
        this.tiersService.uploadSupplier(this.importFileSupplier).subscribe((res: Array<Tiers>) => {
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
      this.initGridDataSource(true);
    });
  }

  public downLoadFile(event) {
    this.tiersService.downloadSupplierExcelTemplate().subscribe(
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

  paginate(event) {
    this.gridSettings.state.skip = event.skip;
    this.gridSettings.state.take = event.take;
    this.dataStateChange(this.gridSettings.state);
  }

  pictureTierSrc(dataItem) {
    if (dataItem.PictureFileInfo) {
      return 'data:image/png;base64,' + dataItem.PictureFileInfo.Data;
    }
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
    if (filtre.SpecificFiltre && !filtre.SpecificFiltreToDelete) {
      this.predicateAdvancedSearch.SpecFilter = this.predicateAdvancedSearch.SpecFilter.filter(value => value.Prop
        !== filtre.SpecificFiltre.Prop);
      this.predicateAdvancedSearch.SpecFilter.push(filtre.SpecificFiltre);
    } else if (filtre.SpecificFiltreToDelete) {
      this.predicateAdvancedSearch.SpecFilter = this.predicateAdvancedSearch.SpecFilter.filter(value => value.Prop
        !== filtre.SpecificFiltre.Prop);
    }
  }

  /**
   * case filtre date between : we don't remove the old filtre date value
   * @param filtreFromAdvSearch
   * @private
   */
  private prepareFiltreFromAdvancedSearch(filtreFromAdvSearch) {
    this.predicateAdvancedSearch.Filter = this.predicateAdvancedSearch.Filter.filter(value => value.prop !== filtreFromAdvSearch.prop);
    if (filtreFromAdvSearch.isDateFiltreBetween) {
      this.predicateAdvancedSearch.Filter.push(filtreFromAdvSearch.filtres[NumberConstant.ZERO]);
      this.predicateAdvancedSearch.Filter.push(filtreFromAdvSearch.filtres[NumberConstant.ONE]);
    } else if (filtreFromAdvSearch.operation &&  isNotNullOrUndefinedAndNotEmptyValue(filtreFromAdvSearch.value)
       && !filtreFromAdvSearch.SpecificFiltre) {
      this.predicateAdvancedSearch.Filter.push(filtreFromAdvSearch);
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
    this.predicateAdvancedSearch = PredicateFormat.prepareTiersPredicate(TiersConstants.SUPPLIER_TYPE);
    this.predicateTiers[NumberConstant.ONE].Filter = [];
    this.predicateTiers = [];
    this.predicateQuickSearch.Filter = [];
    this.searchTiersComponent.tiersString = SharedConstant.EMPTY;
    this.predicateIdTypeTiers.OrderBy = new Array<OrderBy>();
    this.predicateIdTypeTiers.OrderBy.push.apply(this.predicateIdTypeTiers.OrderBy,
        [new OrderBy(TiersConstants.ID, OrderByDirection.desc)]);
    this.predicateTiers.push(this.predicateIdTypeTiers);
    this.predicateTiers.push(this.mergefilters());
    this.initGridDataSource(true);
  }

  getCountriesForTooltip(countries) {
    let countriesTooltip = EMPTY_STRING;
    if (isNotNullOrUndefinedAndNotEmptyValue(countries) && countries.length > 0) {
      countries.forEach(country => {
        if (isNotNullOrUndefinedAndNotEmptyValue(country.IdCountryNavigation)) {
          countriesTooltip += `${country.IdCountryNavigation.NameFr}<br>`;
        }
      });
      return countriesTooltip;
    }
  }

  getCitiesForTooltip(cities) {
    let citiesTooltip = EMPTY_STRING;
    if (isNotNullOrUndefinedAndNotEmptyValue(cities) && cities.length > 0) {
      cities.forEach(city => {
        if (isNotNullOrUndefinedAndNotEmptyValue(city.IdCityNavigation)) {
          citiesTooltip += `${city.IdCityNavigation.Label}<br>`;
        }
      });
      return citiesTooltip;
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
