import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DataStateChangeEvent, GridComponent, PagerSettings} from '@progress/kendo-angular-grid';
import {SharedConstant} from '../../constant/shared/shared.constant';
import {DocumentService} from '../../sales/services/document/document.service';
import {ValidationService} from '../../shared/services/validation/validation.service';
import {IntlService} from '@progress/kendo-angular-intl';
import {DocumentConstant} from '../../constant/sales/document.constant';
import {process, State} from '@progress/kendo-data-query';
import {ColumnSettings} from '../../shared/utils/column-settings.interface';
import {GridSettings} from '../../shared/utils/grid-settings.interface';
import {Filter, Operation, Operator, PredicateFormat} from '../../shared/utils/predicate';
import {DatePipe} from '@angular/common';
import {PurchaseBalanceConstant} from '../../constant/purchase/purchase-balance.constant';
import {NumberConstant} from '../../constant/utility/number.constant';
import {FiltrePredicateModel} from '../../models/shared/filtrePredicate.model';
import {FieldTypeConstant} from '../../constant/shared/fieldType.constant';
import {TiersConstants} from '../../constant/purchase/tiers.constant';
import { isNotNullOrUndefinedAndNotEmptyValue } from '../../stark-permissions/utils/utils';
import { StockDocumentConstant } from '../../constant/inventory/stock-document.constant';
import { AdvancedSearchComponent } from '../../shared/components/advanced-search/advanced-search.component';
import { TranslateService } from '@ngx-translate/core';
import { SharedAccountingConstant } from '../../constant/accounting/sharedAccounting.constant';
import { SwalWarring } from '../../shared/components/swal/swal-popup';
import { AuthService } from '../../login/Authentification/services/auth.service';
import { PermissionConstant } from '../../Structure/permission-constant';
const SHOW = '/show/';

@Component({
  selector: 'app-purchase-balance',
  templateUrl: './purchase-balance.component.html',
  styleUrls: ['./purchase-balance.component.scss']
})
export class PurchaseBalanceComponent implements OnInit {
  public FormatNumber = SharedConstant.NUMBER_FORMAT;

  public gridState: State = {
    skip: NumberConstant.ZERO,
    take: NumberConstant.TEN,
    // Initial filter descriptor
    filter: {
      logic: 'and',
      filters: []
    }
  };

  public columnsConfig: ColumnSettings[] = [
    {
      field: PurchaseBalanceConstant.REFERENCE_FIELD,
      title: PurchaseBalanceConstant.REFERENCE_TITLE,
      filterable: false,
      width: NumberConstant.ONE_HUNDRED_FIFTY
    },
    {
      field: PurchaseBalanceConstant.DESCRIPTION_FIELD,
      title: PurchaseBalanceConstant.DESCRIPTION_TITLE,
      filterable: false,
      width: NumberConstant.ONE_HUNDRED_FIFTY
    },
    {
      field: PurchaseBalanceConstant.QTY_BALANCE_FIELD,
      title: PurchaseBalanceConstant.QTY_BALANCE_TITLE,
      filterable: false,
      format: this.FormatNumber,
      width: NumberConstant.ONE_HUNDRED
    },
    {
      field: PurchaseBalanceConstant.QTY_STOCK_FIELD,
      title: PurchaseBalanceConstant.QTY_STOCK_TITLE,
      filterable: false,
      format: this.FormatNumber,
      width: NumberConstant.ONE_HUNDRED
    },
    {
      field: PurchaseBalanceConstant.PU_PURCHASE_FIELD,
      title: PurchaseBalanceConstant.PU_PURCHASE_TITLE,
      filterable: false,
      width: NumberConstant.ONE_HUNDRED_TWENTY
    },
    {
      field: PurchaseBalanceConstant.TOTAL_PUPURCHASE_FIELD,
      title: PurchaseBalanceConstant.TOTAL_PUPURCHASE_TITLE,
      filterable: false,
      width: NumberConstant.ONE_HUNDRED_TWENTY
    },
    {
      field: PurchaseBalanceConstant.CODE_ORDER_DOCUMENT_FIELD,
      title: PurchaseBalanceConstant.CODE_ORDER_DOCUMENT_TITLE,
      filterable: false,
      width: NumberConstant.ONE_HUNDRED_FIFTY
    },
    {
      field: PurchaseBalanceConstant.DATE_ORDER_DOCUMENT_FIELD,
      title: PurchaseBalanceConstant.DATE_ORDER_DOCUMENT_TITLE,
      filterable: false,
      format: this.translate.instant(SharedConstant.DATE_FORMAT),
      width: NumberConstant.ONE_HUNDRED_THIRTY
    },
    {
      field: PurchaseBalanceConstant.DATE_DISPO_FIELD,
      title: PurchaseBalanceConstant.DATE_DISPO_TITLE,
      filterable: false,
      format: this.translate.instant(SharedConstant.DATE_FORMAT),
      width: NumberConstant.ONE_HUNDRED_THIRTY
    }
  ];
  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig,
  };
  public pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
  formGroup: FormGroup;
  isFromRemove = false;
  isFromLink = false;
  private editedRowIndex: number;
  @ViewChild(GridComponent) private grid: GridComponent;
  public format: any;
  formatPurchaseOptions: any;
  public predicate: PredicateFormat[];
  public gridData: any[] = [];
  dateOrderDocumentValueFilter;
  DateDispoDocumentValueFilter;
  minDate: Date;
  public filtreFieldsColumns = [];
  public filtreFieldsInputs = [];
  public purchaseBalanceSearchedValue: any;
  @ViewChild(AdvancedSearchComponent) private advancedSearch: AdvancedSearchComponent;
  /**
   * advanced search predicate
   */
  public defaultPredicate: PredicateFormat;
  public predicateAdvancedSearch: PredicateFormat;
  public predicateQuickSearch: PredicateFormat;
  public updateBalancePermission = false;
  /**
   *
   * @param formBuilder
   * @param balanceService
   * @param validationService
   * @param intl
   * @param datepipe
   */
  constructor(private formBuilder: FormBuilder, private balanceService: DocumentService,
    private validationService: ValidationService, public intl: IntlService,
    public datepipe: DatePipe,private translate: TranslateService,
    private swalWarrings: SwalWarring, public authService: AuthService) { }

  ngOnInit() {
    this.updateBalancePermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.SHOW_UPDATE_BALANCE_PURCHASE);
    this.minDate = new Date();
    this.format = this.translate.instant(SharedConstant.DATE_FORMAT);
    this.initPurchaseBalanceFiltreConfig();
    this.defaultPredicate = PredicateFormat.preparePurchaseBalancePredicate();
    this.predicateAdvancedSearch = PredicateFormat.prepareEmptyPredicate();
    this.predicateQuickSearch = PredicateFormat.prepareEmptyPredicate();
    this.predicate = [];
    this.advancedSearch.isBtnSearchDisabled = true;

  }

  initPurchaseBalanceFiltreConfig() {
    this.filtreFieldsColumns.push(new FiltrePredicateModel(TiersConstants.SUPPLIER, FieldTypeConstant.supplierComponent, StockDocumentConstant.DOCUMENT_NAVIGATION_TIERS));
    //this.filtreFieldsColumns.push(new FiltrePredicateModel(DocumentConstant.DOCUMENT_TYPE_CODE_TITLE, FieldTypeConstant.documentTypeDropdownComponent, StockDocumentConstant.DOCUMENT_NAVIGATION_TYPE_CODE));
    this.filtreFieldsColumns.push(new FiltrePredicateModel(PurchaseBalanceConstant.REFERENCE_TITLE, FieldTypeConstant.TEXT_TYPE, PurchaseBalanceConstant.REF_ITEM));
    this.filtreFieldsColumns.push(new FiltrePredicateModel(PurchaseBalanceConstant.CODE_ORDER_DOCUMENT_TITLE, FieldTypeConstant.TEXT_TYPE, PurchaseBalanceConstant.DOCUMENT_CODE));
    this.filtreFieldsInputs.push(new FiltrePredicateModel(PurchaseBalanceConstant.DESCRIPTION_TITLE, FieldTypeConstant.TEXT_TYPE, PurchaseBalanceConstant.DESCRIPTION_FIELD));
    this.filtreFieldsInputs.push(new FiltrePredicateModel(PurchaseBalanceConstant.QTY_BALANCE_ADVANCED_SEARCH_TITLE, FieldTypeConstant.numerictexbox_type, PurchaseBalanceConstant.QTY_BALANCE_FIELD));
    this.filtreFieldsInputs.push(new FiltrePredicateModel(PurchaseBalanceConstant.QTY_STOCK_TITLE, FieldTypeConstant.numerictexbox_type, PurchaseBalanceConstant.ITEM_AVAILABLE_QUUANTITY));
    this.filtreFieldsInputs.push(new FiltrePredicateModel(PurchaseBalanceConstant.PU_PURCHASE_ADVANCED_SEARCH_TITLE, FieldTypeConstant.numerictexbox_type, PurchaseBalanceConstant.PU_PURCHASE_VALUE));
    this.filtreFieldsInputs.push(new FiltrePredicateModel(PurchaseBalanceConstant.DATE_ORDER_DOCUMENT_TITLE, FieldTypeConstant.DATE_TYPE, PurchaseBalanceConstant.DATE_DOCUMENT_ORDER));
  }



  private createAddFormGrid(dataItem): void {
    this.formGroup = this.formBuilder.group({
      IdLine: [dataItem.IdLine],
      DateDispo: [dataItem.DateDispo ? new Date(new Date(dataItem.DateDispo).toDateString()) : null]
    });
  }

  public dataStateChange(state: DataStateChangeEvent): void {
    if (state && state.sort && (!state.sort[NumberConstant.ZERO] || (state.sort[NumberConstant.ZERO] && !state.sort[NumberConstant.ZERO].dir))) {
      state.sort = [];
    }
    this.gridSettings.state = state;
    this.gridSettings.gridData = process(this.gridData, state);
    this.onChangeValueDateFilter(true);
  }

  onChangeValueDateFilter(isFromStateChange?: boolean) {
    if (!isFromStateChange) {
      this.gridSettings.gridData = process(this.gridData, this.gridSettings.state);
    }
    if (this.dateOrderDocumentValueFilter) {
      let filtredData = this.gridSettings.gridData.data.filter(x => (this.dateOrderDocumentValueFilter ? this.datepipe.transform(new Date(x.DateOrderDocument), this.format) ==
        this.datepipe.transform(new Date(this.dateOrderDocumentValueFilter), this.format) : true) &&
        (this.DateDispoDocumentValueFilter ? this.datepipe.transform(new Date(x.DateDispoDocumentValueFilter), this.format) ==
          this.datepipe.transform(new Date(this.DateDispoDocumentValueFilter), this.format) : true));

      if (filtredData) {
        this.gridSettings.gridData = {
          data: filtredData,
          total: filtredData.length

        };
      }
    }
  }

  searchBalance(isQuickSearch?) {
      this.setPredicateFiltre(isQuickSearch);
      var idTier = this.defaultPredicate.Filter.filter(value => value.prop == StockDocumentConstant.DOCUMENT_NAVIGATION_TIERS).map(x=> x.value)[0];
      this.balanceService.getBalancedList(idTier,this.predicate[NumberConstant.ZERO]).subscribe(res => {
        this.gridData = res;
        this.gridSettings.gridData = {
          data: res,
          total: res.length
        };
        this.dataStateChange(<DataStateChangeEvent>this.gridSettings.state);
        if(res.length == NumberConstant.ZERO){
          const swalWarningMessage = `${this.translate.instant(SharedAccountingConstant.NO_RECORDS_FOUND)}`;
          this.swalWarrings.CreateSwal(swalWarningMessage,'INFO', "OK", null, true);
        }
      });

  }


  /*
 * on click documentline cell
 */
  public lineClickHandler({isEdited, dataItem, rowIndex}): void {
    if (this.updateBalancePermission) {
    if (isEdited || (this.formGroup && !this.formGroup.valid) || this.isInEditingMode || this.isFromRemove || this.isFromLink) {
      this.isFromRemove = false;
      this.isFromLink = false;
      return;
    }
    this.createAddFormGrid(dataItem);

    this.editedRowIndex = rowIndex;
    this.grid.editRow(rowIndex, this.formGroup);
  }
  }
  /*
* verify if the grid is in editing mode
*/
  public get isInEditingMode(): boolean {
    return this.editedRowIndex !== undefined;
  }

  private closeEditor() {
    this.grid.closeRow(this.editedRowIndex);
    this.editedRowIndex = undefined;
    this.formGroup = undefined;
  }


  /*
  *cancel changes
  */
  public cancelHandler(): void {
    this.closeEditor();
  }

  /*
* remove the current documentLine from the current data source
*/
  public removeLine({isEdited, dataItem, rowIndex}) {
    const swalWarningMessage = `${this.translate.instant(PurchaseBalanceConstant.ARE_YOU_SURE_TO_DELETE_PURCHASE_BALANCE)}`;
    return this.swalWarrings.CreateSwal(swalWarningMessage,PurchaseBalanceConstant.ARE_YOU_SURE,
      SharedConstant.YES, SharedConstant.NO).then((result) => {
        if (result.value) {
    this.isFromRemove = true;
    if(!this.predicate[0]){
      this.predicate[0] = new PredicateFormat();
      this.predicate[0].Filter = new Array<Filter>();
    }
    this.predicate[0].Filter.push(new Filter("idDocument",Operation.eq,dataItem.IdLine));
    this.balanceService.cancelBalancedDocLine(dataItem.IdLine).subscribe(res => {
      this.gridData = res;
      this.gridSettings.gridData = {
        data: res,
        total: res.length
      };
      this.predicate[0].Filter.splice(this.predicate[0].Filter.findIndex(x=>x.prop === "idDocument"),1);
      this.dataStateChange(<DataStateChangeEvent>this.gridSettings.state);
    });
  }
      });
    }
  public saveCurrent() {
    const data = {
      'IdLine': this.formGroup.controls['IdLine'].value,
      'DateDispo': this.formGroup.controls['DateDispo'].value
    };
    this.closeEditor();
    this.balanceService.savelBalancedDocLine(data).subscribe(res => {
      this.gridData = res;
      this.gridSettings.gridData = {
        data: res,
        total: res.length
      };
      this.dataStateChange(<DataStateChangeEvent>this.gridSettings.state);
    });
  }

  showDocument(document) {
    this.isFromLink = true;
    let url = DocumentConstant.PURCHASE_ORDER_URL.concat(SHOW).concat(document.IdDocument).concat('/').concat(document.StatusDocument);
    window.open(url, '_blank');


  }

  getFiltrePredicate(filters: Filter) {
    this.prepareSpecificFiltreFromAdvancedSearch(filters);
    this.prepareFiltreFromAdvancedSearch(filters);

  }

  resetClickEvent() {
    this.predicateAdvancedSearch = PredicateFormat.prepareEmptyPredicate();
    this.predicateQuickSearch = PredicateFormat.prepareEmptyPredicate();
    this.defaultPredicate = PredicateFormat.preparePurchaseBalancePredicate();
    this.advancedSearch.isBtnSearchDisabled = true;
    this.gridData = [];
    this.gridSettings.gridData = {
      data: [],
      total: NumberConstant.ZERO
    };
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
   * @param filtre
   * @private
   */
  private prepareFiltreFromAdvancedSearch(filtreFromAdvSearch) {
    this.predicateAdvancedSearch.Filter = this.predicateAdvancedSearch.Filter.filter(value => value.prop !== filtreFromAdvSearch.prop);
    this.defaultPredicate.Filter = this.defaultPredicate.Filter.filter(value => value.prop !== filtreFromAdvSearch.prop);
    if (filtreFromAdvSearch.isDateFiltreBetween) {
      this.prepareDatesFiltres(filtreFromAdvSearch);
    } else if (filtreFromAdvSearch.operation && isNotNullOrUndefinedAndNotEmptyValue(filtreFromAdvSearch.value) && !filtreFromAdvSearch.SpecificFiltre) {
      filtreFromAdvSearch.prop === StockDocumentConstant.DOCUMENT_NAVIGATION_TIERS || StockDocumentConstant.DOCUMENT_NAVIGATION_TYPE_CODE ? this.defaultPredicate.Filter.push(filtreFromAdvSearch)
      : this.predicateAdvancedSearch.Filter.push(filtreFromAdvSearch);
    }
    if (this.defaultPredicate.Filter.find(x => x.prop === StockDocumentConstant.DOCUMENT_NAVIGATION_TIERS) == null /*||
    this.defaultPredicate.Filter.find(x => x.prop === StockDocumentConstant.DOCUMENT_NAVIGATION_TYPE_CODE) == null*/){
        this.advancedSearch.isBtnSearchDisabled = true;
      } else {
         this.advancedSearch.isBtnSearchDisabled = false;
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

  private setPredicateFiltre(isQuickSearch) {
    this.predicate = [];
    this.predicate.push(this.defaultPredicate);
    if (isQuickSearch) {
      this.predicateQuickSearch.Operator = Operator.or;
      this.predicateQuickSearch.page = this.gridSettings.state.skip;
      this.predicateQuickSearch.pageSize = this.gridSettings.state.take;
      this.predicate.push(this.predicateQuickSearch);
    } else {
      this.predicateAdvancedSearch.Operator = Operator.and;
      this.gridSettings.state.filter.logic = SharedConstant.LOGIC_AND;
      this.predicateAdvancedSearch.page = this.gridSettings.state.skip;
      this.predicateAdvancedSearch.pageSize = this.gridSettings.state.take;
      this.predicate.push(this.predicateAdvancedSearch);
    }
    if (this.predicate[NumberConstant.ONE].Filter.length > NumberConstant.ZERO){
      this.predicate[NumberConstant.ZERO].Filter.push(this.predicate[NumberConstant.ONE].Filter[NumberConstant.ZERO]);
      this.predicate[NumberConstant.ZERO].Filter.push(this.predicate[NumberConstant.ONE].Filter[NumberConstant.ONE]);
    }
  }

  filtere() {
    this.predicateQuickSearch = PredicateFormat.prepareEmptyPredicate();
    this.predicateQuickSearch.Filter.push(new Filter(PurchaseBalanceConstant.REFERENCE_FIELD, Operation.contains, this.purchaseBalanceSearchedValue, false, true));
    this.predicateQuickSearch.Filter.push(new Filter(PurchaseBalanceConstant.DESCRIPTION_FIELD, Operation.contains, this.purchaseBalanceSearchedValue, false, true));
    this.predicateQuickSearch.Filter.push(new Filter(PurchaseBalanceConstant.QTY_BALANCE_FIELD, Operation.contains, this.purchaseBalanceSearchedValue, false, true));
    this.predicateQuickSearch.Filter.push(new Filter(PurchaseBalanceConstant.QTY_STOCK_FIELD, Operation.contains, this.purchaseBalanceSearchedValue, false, true));
    this.predicateQuickSearch.Filter.push(new Filter(PurchaseBalanceConstant.PU_PURCHASE_FIELD, Operation.contains, this.purchaseBalanceSearchedValue, false, true));
    this.predicateQuickSearch.Filter.push(new Filter(PurchaseBalanceConstant.TOTAL_PUPURCHASE_FIELD, Operation.contains, this.purchaseBalanceSearchedValue, false, true));
    this.predicateQuickSearch.Filter.push(new Filter(PurchaseBalanceConstant.CODE_ORDER_DOCUMENT_FIELD, Operation.contains, this.purchaseBalanceSearchedValue, false, true));
    this.predicateQuickSearch.Filter.push(new Filter(PurchaseBalanceConstant.DATE_ORDER_DOCUMENT_FIELD, Operation.contains, this.purchaseBalanceSearchedValue, false, true));
    this.searchBalance(true);

  }
}
