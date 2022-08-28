import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { StockDocumentsService } from '../../../services/stock-documents/stock-documents.service';
import { Filter, Operation, OperationTypeDate, Operator, OrderBy, OrderByDirection, PredicateFormat, Relation } from '../../../../shared/utils/predicate';
import { DataSourceRequestState } from '@progress/kendo-data-query';
import { GridSettings } from '../../../../shared/utils/grid-settings.interface';
import { ColumnSettings } from '../../../../shared/utils/column-settings.interface';
import { SwalWarring } from '../../../../shared/components/swal/swal-popup';
import { DataStateChangeEvent, PagerSettings } from '@progress/kendo-angular-grid';
import { Router } from '@angular/router';
import { StockDocumentConstant } from '../../../../constant/inventory/stock-document.constant';
import { SharedConstant } from '../../../../constant/shared/shared.constant';
import { TranslateService } from '@ngx-translate/core';
import { DocumentEnumerator, documentStatusCode } from '../../../../models/enumerators/document.enum';
import { NumberConstant } from '../../../../constant/utility/number.constant';
import { ReportingInUrlComponent } from '../../../../shared/components/reports/reporting-in-url/reporting-in-url.component';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { dateValueGT, dateValueLT } from '../../../../shared/services/validation/validation.service';
import { FiltrePredicateModel } from '../../../../models/shared/filtrePredicate.model';
import { FieldTypeConstant } from '../../../../constant/shared/fieldType.constant';
import { Observable } from 'rxjs/Observable';
import { isNullOrUndefined } from 'util';
import { isNotNullOrUndefinedAndNotEmptyValue } from '../../../../stark-permissions/utils/utils';
import { WarehouseConstant } from '../../../../constant/inventory/warehouse.constant';
import { AuthService } from '../../../../login/Authentification/services/auth.service';
import { PermissionConstant } from '../../../../Structure/permission-constant';
import { InventoryDocument } from '../../../../models/inventory/inventory-document.model';

const TRANSFERTMOVEMENT_EDIT_URL = 'main/inventory/transfertMovement/advancedEdit/';

@Component({
  selector: 'app-list-transfer-movement',
  templateUrl: './list-transfer-movement.component.html',
  styleUrls: ['./list-transfer-movement.component.scss']
})
export class ListTransferMovementComponent implements OnInit {
  public formatDateFilter = this.translate.instant(SharedConstant.FORMAT_DATE_PLACEHOLDER);
  @Input() statusList;
  @Input() isModalHtml: boolean;
  @Input() idItem;
  public statusCode = documentStatusCode;

  @ViewChild(ReportingInUrlComponent) report;
  choosenFilter: string;
  choosenFilterNumber = NumberConstant.ZERO;
  formGroupFilter: FormGroup;
  private oldStartDateValue: Date;
  private oldEndDateValue: Date;
  public minEndDate: Date;
  public minStartDate: Date;
  public maxStartDate: Date;
  totalData;
  transferMovment: string;
  public filtreFieldsColumns = [];
  public filtreFieldsInputs = [];
  // Predicates proprety
  public predicateAdvancedSearch: PredicateFormat;
  public predicateQuickSearch: PredicateFormat;
  /**
   * predicate tranfserMvt list
   */
  public predicateTransferMvnt: PredicateFormat[] = [];
  // pager settings
  public pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
  /**
   * permissions
   */
  public hasShowPermission: boolean;
  public hasDeletePermission: boolean;
  public hasAddPermission: boolean;
  public hasUpdatePermission: boolean;
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
  public columnsModalConfig: ColumnSettings[] = [
    {
      field: StockDocumentConstant.ID_STOCK_DOCUMENT_NAVIGATION_CODE,
      title: StockDocumentConstant.CODE_TITLE,
      filterable: true
    },
    {
      field: StockDocumentConstant.ID_STOCK_DOCUMENT_NAVIGATION_DOCUMENTDATE,
      title: StockDocumentConstant.DATE_TITLE,
      filterable: false,
      format: this.translate.instant(SharedConstant.DATE_FORMAT),
      _width: 150
    },
    {
      field: StockDocumentConstant.ID_STOCK_DOCUMENT_NAVIGATION_WAREHOUSENAME_SOURCE,
      title: StockDocumentConstant.ID_WAREHOUSE_SOURCE_TITLE,
      filterable: false,
    },
    {
      field: StockDocumentConstant.ID_STOCK_DOCUMENT_NAVIGATION_WAREHOUSENAME_DESTINATION,
      title: StockDocumentConstant.ID_WAREHOUSE_DESTINATION_TITLE,
      filterable: false,
    },
    {
      field: StockDocumentConstant.ID_ITEM_NAVIGATION_ACTUALQUANTITY_FIELD,
      title: StockDocumentConstant.QUANTITY_TITLE,
      filterable: true,
    },
    {
      field: StockDocumentConstant.ID_STOCK_DOCUMENT_NAVIGATION_ID_DOCUMENT_STATUS,
      title: StockDocumentConstant.ID_DOCUMENT_STATUS_TITLE,
      filterable: true,
    }
  ];
  public columnsConfig: ColumnSettings[] = [
    {
      field: StockDocumentConstant.CODE_FIELD,
      title: StockDocumentConstant.CODE_TITLE,
      filterable: true
    },
    {
      field: StockDocumentConstant.DATE_FIELD,
      title: StockDocumentConstant.DATE_TITLE,
      filterable: false,
      format: this.translate.instant(SharedConstant.DATE_FORMAT),
      _width: 150
    },
    {
      field: StockDocumentConstant.ID_WAREHOUSE_SOURCE_FIELD,
      title: StockDocumentConstant.ID_WAREHOUSE_SOURCE_TITLE,
      filterable: false,
    },
    {
      field: StockDocumentConstant.ID_WAREHOUSE_DESTINATION_FIELD,
      title: StockDocumentConstant.ID_WAREHOUSE_DESTINATION_TITLE,
      filterable: false,
    },
    {
      field: StockDocumentConstant.ID_DOCUMENT_STATUS_FIELD,
      title: StockDocumentConstant.ID_DOCUMENT_STATUS_TITLE,
      filterable: true,
    }
  ];

  public excelColumnsConfig: ColumnSettings[] = [
    {
      field: StockDocumentConstant.CODE_FIELD,
      title: StockDocumentConstant.CODE_TITLE,
      filterable: true
    },
    {
      field: StockDocumentConstant.DATE_FIELD,
      title: StockDocumentConstant.DATE_TITLE,
      filterable: false,
      format: this.translate.instant(SharedConstant.DATE_FORMAT),
      _width: 150
    },
    {
      field: StockDocumentConstant.ID_WAREHOUSE_SOURCE_FIELD,
      title: StockDocumentConstant.ID_WAREHOUSE_SOURCE_TITLE,
      filterable: false,
    },
    {
      field: StockDocumentConstant.ID_WAREHOUSE_DESTINATION_FIELD,
      title: StockDocumentConstant.ID_WAREHOUSE_DESTINATION_TITLE,
      filterable: false,
    },
    {
      field: StockDocumentConstant.ID_DOCUMENT_STATUS_NAVIGATION_TRM_LABEL_FIELD,
      title: StockDocumentConstant.ID_DOCUMENT_STATUS_TITLE,
      filterable: true,
    }
  ];

  // Grid settings
  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig
  };
  public excelGridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.excelColumnsConfig
  };
  constructor(public stockDocumentsService: StockDocumentsService, private swalWarrings: SwalWarring,
    private router: Router, public translate: TranslateService, private fb: FormBuilder, private cdRef: ChangeDetectorRef, private authService: AuthService) {
    let predicateAdv = this.preparePredicate(NumberConstant.ZERO);
    let predicateQuick = this.preparePredicate(NumberConstant.ZERO);
    this.predicateAdvancedSearch = predicateAdv;
    this.predicateQuickSearch = predicateQuick;
  }

  /**
   * Data changed listener
   * @param state
   */
  public dataStateChange(state: DataStateChangeEvent): void {
    if (!state.sort[NumberConstant.ZERO] || (state.sort[NumberConstant.ZERO] && !state.sort[NumberConstant.ZERO].dir)) {
      state.sort = [];
    }
    this.gridSettings.state = state;
    this.loadItems(this.gridSettings);
  }

  /**
   * Init grid with data from the datasource
   */
  initGridDataSource(isQuickSearch?, startDate?, endDate?, warehouseSource?, status?, warehouseDestination?) {
    if (this.isModalHtml) {    
      this.stockDocumentsService.getStockDocumentLineByIdItem(this.gridSettings.state, this.prepareModalPredicate(startDate,endDate))
        .subscribe(data => {
          this.gridSettings.gridData = data;
        });

    } else {
      this.stockDocumentsService.getInventoryMovementList(this.gridSettings.state, this.predicateTransferMvnt[NumberConstant.ZERO],
        startDate, endDate, warehouseSource, status, warehouseDestination)
        .subscribe(data => {
          this.totalData = data.data;
          this.gridSettings.gridData = data;
        });
    }

  }

  prepareModalPredicate(startDate,endDate) {
    const myPredicate = new PredicateFormat();
      myPredicate.Filter = new Array<Filter>();
      myPredicate.Filter.push(new Filter(StockDocumentConstant.ID_ITEM, Operation.eq, this.idItem));
      myPredicate.Relation = new Array<Relation>();
      myPredicate.Relation.push(new Relation(StockDocumentConstant.ID_STOCK_DOCUMENT_NAVIGATION));
      myPredicate.Relation.push(new Relation(StockDocumentConstant.ID_STOCK_DOCUMENT_NAVIGATION_ID_WAREHOUSE_SOURCE_NAVIGATION));
      myPredicate.Relation.push(new Relation(StockDocumentConstant.ID_STOCK_DOCUMENT_NAVIGATION_ID_WAREHOUSE_DESTINATION_NAVIGATION));
      if(startDate){
        myPredicate.Filter.push(new Filter(StockDocumentConstant.ID_STOCK_DOCUMENT_NAVIGATION_DOCUMENTDATE, Operation.gte, startDate));
      }
      if(endDate){
        myPredicate.Filter.push(new Filter(StockDocumentConstant.ID_STOCK_DOCUMENT_NAVIGATION_DOCUMENTDATE, Operation.lte, endDate));
      }
      myPredicate.OrderBy = new Array<OrderBy>();
      myPredicate.OrderBy.push.apply(myPredicate.OrderBy, [new OrderBy(StockDocumentConstant.ID, OrderByDirection.desc)]);
      return myPredicate;
  }

  loadItems(gridSettings?) {
    if (gridSettings) {
      this.gridSettings.state = gridSettings.state;
      this.setDataSourceWithSpecificDates();
    }
  }

  private setPredicateFiltre(isQuickSearch) {
    this.predicateTransferMvnt = [];
    if (isQuickSearch) {
      this.predicateTransferMvnt.push(this.predicateQuickSearch);
    } else {
      this.predicateAdvancedSearch.Operator = Operator.and;
      this.gridState.filter.logic = SharedConstant.LOGIC_AND;
      this.gridSettings.state.filter.logic = SharedConstant.LOGIC_AND;
      this.predicateTransferMvnt.push(this.predicateAdvancedSearch);
    }
  }

  /**
   * Prepare predicate
   * @param status
   */
  public preparePredicate(status: number) {
    const myPredicate = new PredicateFormat();
    myPredicate.Filter = new Array<Filter>();
    // Set default filter to all transfert movement
    this.choosenFilter = this.translate.instant(StockDocumentConstant.ALL_TRANSFERT_MOVEMENT);
    if (status !== 0) {
      this.choosenFilter = this.translate.instant(documentStatusCode[status].toUpperCase());
      myPredicate.Filter.push(new Filter(StockDocumentConstant.ID_DOCUMENT_STATUS_FIELD, Operation.eq, status));
    }
    this.choosenFilterNumber = status;
    // Add filter by type of stock document (TM)
    myPredicate.Filter.push(new Filter(StockDocumentConstant.TYPE_STOCK_DOCUMENT, Operation.eq, StockDocumentConstant.TM));
    myPredicate.Relation = new Array<Relation>();
    // Add relation idDocumentStatus
    myPredicate.Relation.push(new Relation(StockDocumentConstant.ID_DOCUMENT_STATUS_NAVIGATION));
    // Add relation IdWarehouseSourceNavigation
    myPredicate.Relation.push(new Relation(StockDocumentConstant.ID_WAREHOUSE_SOURCE_NAVIGATION));
    // Add relation IdWarehouseDestinationNavigation
    myPredicate.Relation.push(new Relation(StockDocumentConstant.ID_WAREHOUSE_DESTINATION_NAVIGATION));
    myPredicate.OrderBy = new Array<OrderBy>();
    // Add order by DocumentDate
    myPredicate.OrderBy.push.apply(myPredicate.OrderBy, [new OrderBy(StockDocumentConstant.ID, OrderByDirection.desc)]);
    myPredicate.IsDefaultPredicate = false;
    return myPredicate;
  }

  /**
   * onChange Status Transfert Movement
   * */
  public onChangeStatusTransfertMovement(status: number) {
    // Prepare predicate
    this.preparePredicate(status);
    // Init grid data source
    this.initGridDataSource(true);
  }

  searchClick() {
    this.gridSettings.state.skip = NumberConstant.ZERO;
    this.initGridDataSource(false);
  }


  ngOnInit() {
    this.hasShowPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.SHOW_TRANSFER_MOVEMENT);
    this.hasAddPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.ADD_TRANSFER_MOVEMENT);
    this.hasUpdatePermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.UPDATE_TRANSFER_MOVEMENT)
    if (this.isModalHtml) {
      this.gridSettings.columnsConfig = this.columnsModalConfig;
    } else {
      this.createForm();
      this.initTransferMovmentFiltreConfig();
      this.predicateTransferMvnt.push(this.preparePredicate(NumberConstant.ZERO));
    }
    // Init grid data source
    this.gridSettings.state.skip = NumberConstant.ZERO;
    this.initGridDataSource(true);
  }

  private initTransferMovmentFiltreConfig() {
    this.filtreFieldsColumns.push(new FiltrePredicateModel(StockDocumentConstant.ID_WAREHOUSE_SOURCE_TITLE,
      FieldTypeConstant.warehouseTypeDropdownComponent, StockDocumentConstant.ID_WAREHOUSE_SOURCE_ID_FIELD));
    this.filtreFieldsColumns.push(new FiltrePredicateModel(StockDocumentConstant.ID_WAREHOUSE_DESTINATION_TITLE,
      FieldTypeConstant.warehouseTypeDropdownComponent, StockDocumentConstant.ID_WAREHOUSE_DESTINATION_ID_FIELD));
    this.filtreFieldsColumns.push(new FiltrePredicateModel(StockDocumentConstant.ID_DOCUMENT_STATUS_TITLE,
      FieldTypeConstant.documentStatusComponent, StockDocumentConstant.ID_DOCUMENT_STATUS_FIELD,
      true, SharedConstant.EMPTY, SharedConstant.EMPTY, SharedConstant.EMPTY, SharedConstant.EMPTY, DocumentEnumerator.StockTransfert));
    this.filtreFieldsInputs.push(new FiltrePredicateModel(StockDocumentConstant.DATE_TITLE,
      FieldTypeConstant.DATE_TYPE, StockDocumentConstant.DATE_FIELD));
    this.filtreFieldsInputs.push(new FiltrePredicateModel(StockDocumentConstant.CODE_TITLE,
      FieldTypeConstant.TEXT_TYPE, StockDocumentConstant.CODE_FIELD));


  }

  resetClickEvent() {
    this.predicateAdvancedSearch = this.preparePredicate(NumberConstant.ZERO);
    this.predicateTransferMvnt = [];
    this.transferMovment = SharedConstant.EMPTY;
    this.predicateTransferMvnt.push(this.mergefilters());
    this.predicateTransferMvnt[NumberConstant.ZERO].Filter =
      this.predicateTransferMvnt[NumberConstant.ZERO].Filter.filter(x => x.prop === StockDocumentConstant.TYPE_STOCK_DOCUMENT);
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
      IdWarehouseDestination: new FormControl(undefined)
    });

    this.addDependentDateControls(this.formGroupFilter);
  }

  private addDependentDateControls(currentformGroup: FormGroup) {
    this.setStartDateControl(currentformGroup);
    this.setEndDateControl(currentformGroup);
    currentformGroup.get(SharedConstant.START_DATE).valueChanges.subscribe(() => {
      if (currentformGroup.get(SharedConstant.END_DATE).hasError('dateValueGT')) {
        currentformGroup.get(SharedConstant.END_DATE).setErrors(null);
      }
    });
    currentformGroup.get(SharedConstant.END_DATE).valueChanges.subscribe(() => {
      if (currentformGroup.get(SharedConstant.START_DATE).hasError('dateValueLT')) {
        currentformGroup.get(SharedConstant.START_DATE).setErrors(null);
      }
    });

  }

  private setStartDateControl(currentformGroup: FormGroup) {
    const oEndDate = new Observable<Date>(observer => observer.next(currentformGroup.get(SharedConstant.END_DATE).value));
    currentformGroup.setControl(SharedConstant.START_DATE, this.fb.control(currentformGroup.value.startDate,
      [dateValueLT(oEndDate)]));
  }

  private setEndDateControl(currentformGroup: FormGroup) {
    const oStartDate = new Observable<Date>(observer => observer.next(currentformGroup.get(SharedConstant.START_DATE).value));
    currentformGroup.setControl(SharedConstant.END_DATE, this.fb.control(currentformGroup.value.endDate,
      [dateValueGT(oStartDate)]));
  }

  changeStartDate() {
    if (this.formGroupFilter.get(SharedConstant.START_DATE).value !== this.oldStartDateValue) {
      this.oldStartDateValue = this.formGroupFilter.get(SharedConstant.START_DATE).value;
      if (!this.oldStartDateValue) {
        this.minEndDate = undefined;
      } else {
        this.minEndDate = this.oldStartDateValue;
      }
      this.cdRef.detectChanges();
    }
  }

  changeEndDate() {
    if (this.formGroupFilter.get(SharedConstant.END_DATE).value !== this.oldEndDateValue) {
      this.oldEndDateValue = this.formGroupFilter.get(SharedConstant.END_DATE).value;

      if (!this.oldEndDateValue) {
        this.maxStartDate = undefined;
      } else {
        this.maxStartDate = this.oldEndDateValue;
      }
      this.cdRef.detectChanges();
    }
  }

  setDataSourceWithSpecificDates() {
    const startDate: Date = this.formGroupFilter.get(SharedConstant.START_DATE).value;
    const endDate: Date = this.formGroupFilter.get(SharedConstant.END_DATE).value;
    const warehouseSource = this.formGroupFilter.get(WarehouseConstant.ID_WAREHOUSE_SOURCE).value;
    const warehouseDestination = this.formGroupFilter.get(WarehouseConstant.ID_WAREHOUSE_DESTINATION).value;
    const statusMvt = this.formGroupFilter.get(WarehouseConstant.STATUS).value;
    let startDateToSend: Date;
    let endDateToSend: Date;
    if (startDate) {
      startDateToSend = new Date(Date.UTC(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()));
    }
    if (endDate) {
      endDateToSend = new Date(Date.UTC(endDate.getFullYear(), endDate.getMonth(), endDate.getDate()));
    }
    if (startDateToSend || endDateToSend || warehouseSource || warehouseDestination || statusMvt) {
      this.initGridDataSource(startDateToSend, endDateToSend, warehouseSource, statusMvt, warehouseDestination);
    } else {
      this.initGridDataSource(false);
    }
  }

  warehouseSourceSelect($event) {
    if ($event.combobox) {
      if ($event.combobox.dataItem) {
        this.formGroupFilter.controls['IdWarehouseSource'].setValue($event.combobox.dataItem.Id);
      }
    } else {
      this.formGroupFilter.controls['IdWarehouseSource'].setValue('');
    }
  }

  warehouseDestinationSelect($event) {
    if ($event.combobox) {
      if ($event.combobox.dataItem) {
        this.formGroupFilter.controls['IdWarehouseDestination'].setValue($event.combobox.dataItem.Id);
      }
    } else {
      this.formGroupFilter.controls['IdWarehouseDestination'].setValue('');
    }
  }

  recieveDefaultStatus($event) {
    this.formGroupFilter.controls['Status'].setValue($event);
  }

  public filter() {
    this.predicateQuickSearch = this.preparePredicate(NumberConstant.ZERO);
    if (this.transferMovment !== "") {
      this.predicateQuickSearch.Filter.push(new Filter(StockDocumentConstant.CODE_FIELD, Operation.contains, this.transferMovment, false, true));
      this.predicateQuickSearch.Filter.push(new Filter(StockDocumentConstant.ID_WAREHOUSE_SOURCE_FIELD, Operation.contains, this.transferMovment, false, true));
      this.predicateQuickSearch.Filter.push(new Filter(StockDocumentConstant.ID_WAREHOUSE_DESTINATION_FIELD, Operation.contains, this.transferMovment, false, true));
    }
    this.predicateTransferMvnt = [];
    this.predicateTransferMvnt.push(this.mergefilters());
    this.gridSettings.state.skip = NumberConstant.ZERO;
    this.initGridDataSource(true);
  }

  public goToAdvancedEdit(dataItem) {
    this.router.navigateByUrl(TRANSFERTMOVEMENT_EDIT_URL + dataItem.Id, { queryParams: dataItem, skipLocationChange: true });
  }

  /**
   * get array<Filtre> from advancedSearchComponenet
   * remove old filter property from the predicate filter list
   * case filtre type date between
   * @param filtre
   */
  getFiltrePredicate(filtre) {
    this.predicateTransferMvnt = [];
    this.prepareSpecificFiltreFromAdvancedSearch(filtre);
    this.prepareFiltreFromAdvancedSearch(filtre);
    this.predicateTransferMvnt.push(this.mergefilters());
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

  private prepareSpecificFiltreFromAdvancedSearch(filtre) {
    if (this.predicateAdvancedSearch.SpecFilter && filtre.SpecificFiltre && !filtre.SpecificFiltreToDelete) {
      this.predicateAdvancedSearch.SpecFilter = this.predicateAdvancedSearch.SpecFilter.filter(value => value.Prop !== filtre.SpecificFiltre.Prop);
      this.predicateAdvancedSearch.SpecFilter.push(filtre.SpecificFiltre);
    } else if (this.predicateAdvancedSearch.SpecFilter && filtre.SpecificFiltreToDelete) {
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
}
