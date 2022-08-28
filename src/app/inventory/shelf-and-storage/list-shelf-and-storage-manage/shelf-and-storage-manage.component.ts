import {Component, OnInit, ViewChild} from '@angular/core';
import {StockDocumentsService} from '../../services/stock-documents/stock-documents.service';
import {Filter, Operation, Operator, OrderBy, OrderByDirection, PredicateFormat, Relation} from '../../../shared/utils/predicate';
import {DataSourceRequestState} from '@progress/kendo-data-query';
import {GridSettings} from '../../../shared/utils/grid-settings.interface';
import {ColumnSettings} from '../../../shared/utils/column-settings.interface';
import {SwalWarring} from '../../../shared/components/swal/swal-popup';
import {DataStateChangeEvent, PagerSettings} from '@progress/kendo-angular-grid';
import {Router} from '@angular/router';
import {StockDocumentConstant} from '../../../constant/inventory/stock-document.constant';
import {SharedConstant} from '../../../constant/shared/shared.constant';
import {TranslateService} from '@ngx-translate/core';
import {DocumentEnumerator} from '../../../models/enumerators/document.enum';
import {NumberConstant} from '../../../constant/utility/number.constant';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {FiltrePredicateModel} from '../../../models/shared/filtrePredicate.model';
import {FieldTypeConstant} from '../../../constant/shared/fieldType.constant';
import {isNullOrUndefined} from 'util';
import {isNotNullOrUndefinedAndNotEmptyValue} from '../../../stark-permissions/utils/utils';
import { SearchShelfAndStorageComponent } from '../search-shelf-and-storage/search-shelf-and-storage.component';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { PermissionConstant } from '../../../Structure/permission-constant';


const TRANSFERT_MOVEMENT_EDIT_SHELF_STORAGE = 'main/inventory/ShelfAndStorage/advancedEdit/';

@Component({
  selector: 'app-shelf-and-storage-manage',
  templateUrl: './shelf-and-storage-manage.component.html',
  styleUrls: ['./shelf-and-storage-manage.component.scss']
})
export class ShelfAndStorageManageComponent implements OnInit {
  public formGroupFilter: FormGroup;
  public minEndDate: Date;
  public minStartDate: Date;
  public maxStartDate: Date;
  totalData;
  transferMovment: string;
  public filtreFieldsColumns = [];
  public filtreFieldsInputs = [];
  // Predicates tranfserMvt list
  public predicateDocumentType: PredicateFormat;
  public predicateAdvancedSearch: PredicateFormat;
  public predicateQuickSearch: PredicateFormat;
  public predicate: PredicateFormat[] = [];
  // pager settings
  public pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
  @ViewChild(SearchShelfAndStorageComponent) searchShelfAndStorageComponent: SearchShelfAndStorageComponent;
  /**
   * Grid state
   */
  public gridState: DataSourceRequestState = {
    skip: 0,
    take: 10,
    filter: { // Initial filter descriptor
      logic: 'and',
      filters: []
    }
  };

  public columnsConfig: ColumnSettings[] = [
    {
      field: StockDocumentConstant.CODE_FIELD,
      title: StockDocumentConstant.CODE_TITLE,
      filterable: true,
      _width: NumberConstant.ONE_HUNDRED_FIFTY
    },
    {
      field: StockDocumentConstant.DATE_FIELD,
      title: StockDocumentConstant.DATE_TITLE,
      filterable: false,
      format: this.translate.instant(SharedConstant.DATE_FORMAT),
      _width: NumberConstant.ONE_HUNDRED_FIFTY
    },
    {
      field: StockDocumentConstant.ID_WAREHOUSE_SOURCE_FIELD,
      title: StockDocumentConstant.ID_WAREHOUSE_SOURCE_TITLE,
      filterable: false,
      _width: NumberConstant.ONE_HUNDRED_FIFTY
    },
    {
      field: StockDocumentConstant.SHELF_AND_STORAGE_SOURCE_FIELD,
      title: StockDocumentConstant.SHELF_AND_STORAGE_SOURCE_TITLE,
      filterable: false,
      _width: NumberConstant.ONE_HUNDRED_FIFTY
    },
    {
      field: StockDocumentConstant.SHELF_AND_STORAGE_DESTINATION_FIELD,
      title: StockDocumentConstant.SHELF_AND_STORAGE_DESTINATION_TITLE,
      filterable: true,
      _width: NumberConstant.ONE_HUNDRED_FIFTY
    },
    {
      field: StockDocumentConstant.TRANSFERT_TYPE,
      title: StockDocumentConstant.TYPE_TITLE,
      filterable: false,
      _width: NumberConstant.ONE_HUNDRED_FIFTY
    },
    {
      field: StockDocumentConstant.ID_DOCUMENT_STATUS_FIELD,
      title: StockDocumentConstant.ID_DOCUMENT_STATUS_TITLE,
      filterable: true,
      _width: NumberConstant.ONE_HUNDRED_FIFTY
    }
  ];
  public excelColumnsConfig: ColumnSettings[] = [
    {
      field: StockDocumentConstant.CODE_FIELD,
      title: StockDocumentConstant.CODE_TITLE,
      filterable: true,
      _width: NumberConstant.ONE_HUNDRED_FIFTY
    },
    {
      field: StockDocumentConstant.DATE_FIELD,
      title: StockDocumentConstant.DATE_TITLE,
      filterable: false,
      format: this.translate.instant(SharedConstant.DATE_FORMAT),
      _width: NumberConstant.ONE_HUNDRED_FIFTY
    },
    {
      field: StockDocumentConstant.ID_WAREHOUSE_SOURCE_FIELD,
      title: StockDocumentConstant.ID_WAREHOUSE_SOURCE_TITLE,
      filterable: false,
      _width: NumberConstant.ONE_HUNDRED_FIFTY
    },
    {
      field: StockDocumentConstant.SHELF_AND_STORAGE_SOURCE,
      title: StockDocumentConstant.SHELF_AND_STORAGE_SOURCE_TITLE,
      filterable: false,
      _width: NumberConstant.ONE_HUNDRED_FIFTY
    },
    {
      field: StockDocumentConstant.SHELF_AND_STORAGE_DESTINATION,
      title: StockDocumentConstant.SHELF_AND_STORAGE_DESTINATION_TITLE,
      filterable: true,
      _width: NumberConstant.ONE_HUNDRED_FIFTY
    },
    {
      field: 'TransferType',
      title: StockDocumentConstant.TYPE_TITLE,
      filterable: false,
      _width: NumberConstant.ONE_HUNDRED_FIFTY
    },
    {
      field: StockDocumentConstant.DOCUMENT_STATUS,
      title: StockDocumentConstant.ID_DOCUMENT_STATUS_TITLE,
      filterable: true,
      _width: NumberConstant.ONE_HUNDRED_FIFTY
    }
  ];
  // Grid settings
  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig
  };
  public excelGridSettings: GridSettings = {
    state : this.gridState,
    columnsConfig: this.excelColumnsConfig
  };
  /**
   * flag to identify the searchType
   * advanced search = 0 ,quick search = 1
   */
  public searchType = NumberConstant.ONE;
  /**
   * permissions
   */
   public hasShowPermission: boolean;
   public hasDeletePermission: boolean;
   public hasAddPermission: boolean;
   public hasUpdatePermission: boolean;

  /**
   *
   * @param stockDocumentsService
   * @param swalWarrings
   * @param router
   * @param translate
   * @param fb
   */
  constructor(public stockDocumentsService: StockDocumentsService, private swalWarrings: SwalWarring,
              private router: Router, public translate: TranslateService, private fb: FormBuilder, private authService: AuthService) {
    this.predicateDocumentType = this.prepareDefaultPredicate();
    let predicateAdv = this.preparePredicate();
    let predicateQuick = this.preparePredicate();
    this.predicateAdvancedSearch = predicateAdv;
    this.predicateQuickSearch = predicateQuick;
  }

  /**
   * Data changed listener
   * @param state
   */
  public dataStateChange(state: DataStateChangeEvent): void {
    const isQuickSearch = this.searchType === NumberConstant.ONE;
    if (!state.sort[NumberConstant.ZERO] || (state.sort[NumberConstant.ZERO] && !state.sort[NumberConstant.ZERO].dir)) {
      state.sort = [];
    }
    this.gridSettings.state = state;
    this.loadItems(this.gridSettings);
  }

  /**
   * Init grid with data from the datasource
   */
  initGridDataSource(isQuickSearch) {
    this.stockDocumentsService.reloadServerSideDataWithListPredicate(this.gridSettings.state,
      this.predicate, SharedConstant.GET_DATA_WITH_SPECIFIC_FILTER)
      .subscribe(data => {
        this.totalData = data.data;
        this.gridSettings.gridData = data;
      });
  }

  loadItems(gridSettings?) {
    if (gridSettings) {
      this.gridSettings.state = gridSettings.state;
      this.initGridDataSource(true);
    }
  }

  private setPredicateFiltre(isQuickSearch) {
    this.predicate = [];
    this.predicate.push(this.predicateDocumentType);
    if (isQuickSearch) {
      this.predicate.push(this.predicateQuickSearch);
    } else {
      this.predicateAdvancedSearch.Operator = Operator.and;
      this.gridState.filter.logic = SharedConstant.LOGIC_AND;
      this.gridSettings.state.filter.logic = SharedConstant.LOGIC_AND;
      this.predicate.push(this.predicateAdvancedSearch);
    }
  }

  /**
   * Prepare defaultpredicate
   */
  public prepareDefaultPredicate() {
    const myPredicate = new PredicateFormat();
    myPredicate.Filter = new Array<Filter>();
    myPredicate.Filter.push(new Filter(StockDocumentConstant.TYPE_STOCK_DOCUMENT, Operation.eq, StockDocumentConstant.TShSt));
    this.preparePredicateRelationsAndOrder(myPredicate);
    myPredicate.IsDefaultPredicate = true;
    return myPredicate;
  }

  private preparePredicateRelationsAndOrder(myPredicate: PredicateFormat) {
    myPredicate.Relation = new Array<Relation>();
    // Add relation idDocumentStatus
    myPredicate.Relation.push(new Relation(StockDocumentConstant.ID_DOCUMENT_STATUS_NAVIGATION));
    // Add relation IdWarehouseSourceNavigation
    myPredicate.Relation.push(new Relation(StockDocumentConstant.ID_WAREHOUSE_SOURCE_NAVIGATION));
    // Add relation IdShelfSourceNavigation
    myPredicate.Relation.push(new Relation(StockDocumentConstant.ID_STORAGE_SOURCE_NAVIGATION));
    // Add relation IdShelfDestinationNavigation
    myPredicate.Relation.push(new Relation(StockDocumentConstant.ID_STORAGE_DESTINATION_NAVIGATION));
    myPredicate.OrderBy = new Array<OrderBy>();
    // Add order by DocumentDate
    myPredicate.OrderBy.push.apply(myPredicate.OrderBy, [new OrderBy(StockDocumentConstant.ID, OrderByDirection.desc)]);
  }

  /**
   * Prepare predicate
   */
  public preparePredicate() {
    const myPredicate = new PredicateFormat();
    myPredicate.Filter = new Array<Filter>();
    this.preparePredicateRelationsAndOrder(myPredicate);
    return myPredicate;
  }
  private prepareInitialPredicate() {
    const predicate = this.preparePredicate();
    this.predicate.push(predicate);
    let predicateAdv = this.preparePredicate();
    let predicateQuick = this.preparePredicate();
    this.predicateAdvancedSearch = predicateAdv;
    this.predicateQuickSearch = predicateQuick;
  }
  searchClick() {
    this.gridSettings.state.skip = NumberConstant.ZERO;
    this.initGridDataSource(false);
  }

  public receiveData(searchPredicate) {
    if(searchPredicate.Filter[NumberConstant.ZERO].value === ""){
      this.predicateQuickSearch = this.preparePredicate();
    }
    else {
      this.predicateQuickSearch = searchPredicate;
    }
    this.searchType = NumberConstant.ONE;
    this.predicate = [];
    this.predicate.push(this.predicateDocumentType);
    this.predicate.push(this.mergefilters());
    this.gridSettings.state.skip = NumberConstant.ZERO;
    this.initGridDataSource(true);
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

  private initShelfsAndStoragesTransferMovmentFiltreConfig() {
    this.filtreFieldsColumns.push(new FiltrePredicateModel(StockDocumentConstant.ID_WAREHOUSE_SOURCE_TITLE,
      FieldTypeConstant.warehouseTypeDropdownComponent, StockDocumentConstant.ID_WAREHOUSE_SOURCE_ID_FIELD));
    this.filtreFieldsColumns.push(new FiltrePredicateModel(StockDocumentConstant.SHELF_AND_STORAGE_SOURCE_TITLE,
      FieldTypeConstant.storageSourceDropdownComponent, StockDocumentConstant.ID_STORAGE_SOURCE_FIELD));
    this.filtreFieldsColumns.push(new FiltrePredicateModel(StockDocumentConstant.SHELF_AND_STORAGE_DESTINATION_TITLE,
      FieldTypeConstant.storageDestinationDropdownComponent, StockDocumentConstant.ID_STORAGE_DESTINATION_FIELD));
    this.filtreFieldsInputs.push(new FiltrePredicateModel(StockDocumentConstant.ID_DOCUMENT_STATUS_TITLE,
      FieldTypeConstant.documentStatusComponent, StockDocumentConstant.ID_DOCUMENT_STATUS_FIELD, true, SharedConstant.EMPTY, SharedConstant.EMPTY,
      SharedConstant.EMPTY, SharedConstant.EMPTY, SharedConstant.EMPTY,
      DocumentEnumerator.StockTransfert));
    this.filtreFieldsInputs.push(new FiltrePredicateModel(StockDocumentConstant.DATE_TITLE,
      FieldTypeConstant.DATE_TYPE, StockDocumentConstant.DATE_FIELD));
    this.filtreFieldsInputs.push(new FiltrePredicateModel(StockDocumentConstant.CODE_TITLE,
      FieldTypeConstant.TEXT_TYPE, StockDocumentConstant.CODE_FIELD));


  }

  /**
   * Reset dataGrid
   */
  resetClickEvent() {
    this.predicateAdvancedSearch = new PredicateFormat();
    this.predicateQuickSearch.Filter = [];
    this.predicateAdvancedSearch  = this.preparePredicate();
    this.predicate = [];
    this.searchShelfAndStorageComponent.searchValue = SharedConstant.EMPTY;
    this.predicate.push(this.predicateDocumentType);
    this.predicateAdvancedSearch = this.preparePredicate();
    this.predicate.push(this.mergefilters());
    this.initGridDataSource(true);
  }

  getOperatorPredicate(operator: Operator) {
    this.predicateAdvancedSearch.Operator = operator;
  }

  private createForm(): void {
    this.formGroupFilter = this.fb.group({
      Status: new FormControl(''),
      StartDate: new FormControl(''),
      EndDate: new FormControl(''),
      IdWarehouseSource: new FormControl(undefined),
      IdShelfSource: new FormControl(undefined),
      IdShelfDestination: new FormControl(undefined)
    });
  }


  public goToAdvancedEdit(dataItem) {
    this.router.navigateByUrl(TRANSFERT_MOVEMENT_EDIT_SHELF_STORAGE + dataItem.Id, {queryParams: dataItem, skipLocationChange: true});
  }

  /**
   * get array<Filtre> from advancedSearchComponenet
   * remove old filter property from the predicate filter list
   * case filtre type date between
   * @param filtre
   */
  getFiltrePredicate(filtre) {
    this.searchType = NumberConstant.ZERO;
    this.predicate = []
    this.predicate.push(this.predicateDocumentType);
    this.prepareSpecificFiltreFromAdvancedSearch(filtre);
    this.prepareFiltreFromAdvancedSearch(filtre);
    this.predicate.push(this.mergefilters());
  }

  private prepareSpecificFiltreFromAdvancedSearch(filtre) {
    if (filtre.SpecificFiltre && !filtre.SpecificFiltreToDelete) {
      this.predicateAdvancedSearch.SpecFilter = this.predicateAdvancedSearch.SpecFilter.filter(value => value.Prop !== filtre.SpecificFiltre.Prop);
      this.predicateAdvancedSearch.SpecFilter.push(filtre.SpecificFiltre);
    } else if (filtre.SpecificFiltreToDelete) {
      this.predicateAdvancedSearch.SpecFilter = this.predicateAdvancedSearch.SpecFilter.filter(value => value.Prop !== filtre.SpecificFiltre.Prop);
    }
  }

  /**
   * case filtre date between : we don't remove the old filtre date value
   * @private
   * @param filtreFromAdvSearch
   */
  private prepareFiltreFromAdvancedSearch(filtreFromAdvSearch) {
    this.predicateAdvancedSearch.Filter = this.predicateAdvancedSearch.Filter.filter(value => value.prop !== filtreFromAdvSearch.prop);
    if (filtreFromAdvSearch.isDateFiltreBetween) {
      this.prepareDatesFiltres(filtreFromAdvSearch);
    } else if (filtreFromAdvSearch.operation && !isNullOrUndefined(filtreFromAdvSearch.value) && !filtreFromAdvSearch.SpecificFiltre) {
      this.predicateAdvancedSearch.Filter.push(filtreFromAdvSearch);
    }
  }

  private prepareDatesFiltres(filtreFromAdvSearch) {
    if (isNotNullOrUndefinedAndNotEmptyValue(filtreFromAdvSearch.filtres[NumberConstant.ZERO].value)) {
      this.predicateAdvancedSearch.Filter.push(filtreFromAdvSearch.filtres[NumberConstant.ZERO]);
    }
    if (isNotNullOrUndefinedAndNotEmptyValue(filtreFromAdvSearch.filtres[NumberConstant.ONE].value)) {
      this.predicateAdvancedSearch.Filter.push(filtreFromAdvSearch.filtres[NumberConstant.ONE]);
    }
  }

  ngOnInit() {
    this.hasShowPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.SHOW_SHELFS_AND_STORAGES);
    this.hasDeletePermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.DELETE_SHELFS_AND_STORAGES);
    this.hasAddPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.ADD_SHELFS_AND_STORAGES);
    this.hasUpdatePermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.UPDATE_SHELFS_AND_STORAGES);
    this.createForm();
    this.initShelfsAndStoragesTransferMovmentFiltreConfig();
    this.prepareInitialPredicate();
    // Init grid data source
    this.gridSettings.state.skip = NumberConstant.ZERO;
    this.predicate.push(this.predicateDocumentType);
    this.initGridDataSource(true);
  }
  /**
   * Remove handler
   * @param param0
   */
   public removeHandler(dataItem) {
    this.swalWarrings.CreateSwal(StockDocumentConstant.STOCK_MVMNT_DELETE_TEXT_MESSAGE, StockDocumentConstant.STOCK_MVMNT_DELETE_TITLE_MESSAGE).then((result) => {
      if (result.value) {
        this.stockDocumentsService.remove(dataItem).subscribe(() => {
          this.initGridDataSource(true);
        });
      }
    });
  }
}
