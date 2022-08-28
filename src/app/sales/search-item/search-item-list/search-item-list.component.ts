import { Component, OnInit, ViewContainerRef, HostListener } from '@angular/core';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { FormModalDialogService } from '../../../shared/services/dialog/form-modal-dialog/form-modal-dialog.service';
import { PredicateFormat, Operator } from '../../../shared/utils/predicate';
import { SearchItemService } from '../../services/search-item/search-item.service';
import { DataStateChangeEvent, PagerSettings } from '@progress/kendo-angular-grid';
import { GridSettings } from '../../../shared/utils/grid-settings.interface';
import { DataSourceRequestState } from '@progress/kendo-data-query';
import { ColumnSettings } from '../../../shared/utils/column-settings.interface';
import { TiersConstants } from '../../../constant/purchase/tiers.constant';
import { TranslateService } from '@ngx-translate/core';
import { KeyboardConst } from '../../../constant/keyboard/keyboard.constant';
import { FiltrePredicateModel } from '../../../models/shared/filtrePredicate.model';
import { FieldTypeConstant } from '../../../constant/shared/fieldType.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { isNotNullOrUndefinedAndNotEmptyValue } from '../../../stark-permissions/utils/utils';
import { CompanyService } from '../../../administration/services/company/company.service';
import { LocalStorageService } from '../../../login/Authentification/services/local-storage-service';

@Component({
  selector: 'app-search-item-list',
  templateUrl: './search-item-list.component.html',
  styleUrls: ['./search-item-list.component.scss']
})
export class SearchItemListComponent implements OnInit {

  private isModalOpen = false;
  public supplierName: string;
  public formatDate: string = this.translate.instant(SharedConstant.DATE_FORMAT) + ' , ' + 'h:mm a';
  public pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
  public filtreFieldsColumns = [];
  public filtreFieldsInputs = [];
  public predicateAdvancedSearch: PredicateFormat = new PredicateFormat();
  public companyCurrencyCode: string;

  public gridState: DataSourceRequestState = {
    skip: NumberConstant.ZERO,
    take: NumberConstant.TEN,
    filter: {
      logic: SharedConstant.LOGIC_AND,
      filters: []
    }
  };

  public columnsConfig: ColumnSettings[] = [
    {
      field: TiersConstants.DATE,
      title: TiersConstants.DATE,
      filterable: false,
      format: 'dd/MM/yyyy HH:mm',
      _width: NumberConstant.TWO_HUNDRED_FIFTY
    },
    {
      field: TiersConstants.TIERS_NAME,
      title: TiersConstants.CLIENT,
      filterable: false,
      _width: NumberConstant.TWO_HUNDRED_FIFTY
    },
    {
      field: TiersConstants.CASHIER_NAME,
      title: TiersConstants.USER,
      filterable: false,
      _width: NumberConstant.TWO_HUNDRED_FIFTY
    },
    {
      field: TiersConstants.SEARCH_ITEM_SUPPLIER_LIST,
      title: TiersConstants.SELECTED_TYPE,
      filterable: false,
      _width: NumberConstant.TWO_HUNDRED_FIFTY
    },
  ];

  // Grid settings
  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig
  };

  constructor(private translate: TranslateService, private searchItemService: SearchItemService, private companyService: CompanyService,
    private localStorageService: LocalStorageService) {
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event) {
    if (event.key === KeyboardConst.ESCAPE && this.isModalOpen) {
      this.onCloseSearchModal();
    }
  }
  ngOnInit() {
    this.predicateAdvancedSearch.page = NumberConstant.ZERO;
    this.predicateAdvancedSearch.pageSize = NumberConstant.TEN;
    this.predicateAdvancedSearch.Filter = [];
    this.companyCurrencyCode = this.localStorageService.getCurrencyCode();
    this.initTiersFiltreConfig();
    this.getDataSource();
  }

  public dataStateChange(state: DataStateChangeEvent): void {
    this.predicateAdvancedSearch.pageSize = state.take;
    this.predicateAdvancedSearch.page = state.skip;
    this.gridSettings.state = state;
    this.getDataSource();
  }

  getDataSource() {
    this.searchItemService.getSerachDetailPeerSupplier(this.predicateAdvancedSearch).subscribe(x => {
      this.gridSettings.gridData  = { data: x.listData, total: x.total };
    });
  }

  searchClicked() {
    this.predicateAdvancedSearch.page = NumberConstant.ZERO;
    this.gridSettings.state.skip = NumberConstant.ZERO;
    this.getDataSource();
  }


  onCloseSearchModal() {
    this.isModalOpen = false;
    this.searchItemService.idDocument = undefined;
    this.searchItemService.code = undefined;
    this.searchItemService.idSupplier = undefined;
    this.searchItemService.disableFields = true;
    this.searchItemService.isFromHandlerChange = false;
    this.searchItemService.supplierName = undefined;
    this.ngOnInit();
  }

  /**
   * load advancedSearch parameters config
   * @private
  */
  private initTiersFiltreConfig() {
    this.filtreFieldsColumns.push(new FiltrePredicateModel(TiersConstants.CLIENT, FieldTypeConstant.customerComponent,
      TiersConstants.ID_TIERS));
    this.filtreFieldsColumns.push(new FiltrePredicateModel(TiersConstants.DATE, FieldTypeConstant.DATE_TYPE, TiersConstants.SEARCH_DATE));
    this.filtreFieldsColumns.push(new FiltrePredicateModel(TiersConstants.USER, FieldTypeConstant.TEXT_TYPE,
       TiersConstants.CASHIER_NAME));
    this.filtreFieldsInputs.push(new FiltrePredicateModel(TiersConstants.SELECTED_TYPE, FieldTypeConstant.TEXT_TYPE,
      TiersConstants.SEARCH_ITEM_SUPPLIER_LIST));
  }

  /**
   * get array<Filtre> from advancedSearchComponenet
   * remove old filter property from the predicate filter list
   * case filtre type date between
   * @param filtre
  */
  getFiltrePredicate(filtre) {
  this.prepareSpecificFiltreFromAdvancedSearch(filtre);
  this.prepareFiltreFromAdvancedSearch(filtre);
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
    this.predicateAdvancedSearch.Filter = [];
    this.getDataSource();
  }
}
