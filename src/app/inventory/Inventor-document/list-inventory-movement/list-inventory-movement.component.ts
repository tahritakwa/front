import {ChangeDetectorRef, Component, Input, OnInit, ViewChild} from '@angular/core';
import {StockDocumentsService} from '../../services/stock-documents/stock-documents.service';
import {Filter, Operation, Operator, OrderBy, OrderByDirection, PredicateFormat, Relation} from '../../../shared/utils/predicate';
import {DataSourceRequestState} from '@progress/kendo-data-query';
import {GridSettings} from '../../../shared/utils/grid-settings.interface';
import {ColumnSettings} from '../../../shared/utils/column-settings.interface';
import {SwalWarring} from '../../../shared/components/swal/swal-popup';
import {DataStateChangeEvent, PagerSettings, SelectAllCheckboxState} from '@progress/kendo-angular-grid';
import {Router} from '@angular/router';
import {StockDocumentConstant} from '../../../constant/inventory/stock-document.constant';
import {SharedConstant} from '../../../constant/shared/shared.constant';
import {TranslateService} from '@ngx-translate/core';
import {documentStatusCode} from '../../../models/enumerators/document.enum';
import {NumberConstant} from '../../../constant/utility/number.constant';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {Observable} from 'rxjs/Observable';
import {dateValueGT, dateValueLT} from '../../../shared/services/validation/validation.service';
import {MassPrintInventoryComponent} from '../mass-print-inventory/mass-print-inventory.component';
import {FileService} from '../../../shared/services/file/file-service.service';
import {FiltrePredicateModel} from '../../../models/shared/filtrePredicate.model';
import {FieldTypeConstant} from '../../../constant/shared/fieldType.constant';
import {isNullOrUndefined} from 'util';
import {isNotNullOrUndefinedAndNotEmptyValue} from '../../../stark-permissions/utils/utils';
import { GrowlService } from '../../../../COM/Growl/growl.service';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { PermissionConstant } from '../../../Structure/permission-constant';

const START_DATE = 'StartDate';
const END_DATE = 'EndDate';
const WAREHOUSE = 'IdWarehouseSource';
const STATUS = 'Status';

@Component({
  selector: 'app-list-inventory-movement',
  templateUrl: './list-inventory-movement.component.html',
  styleUrls: ['./list-inventory-movement.component.scss']
})

export class ListInventoryMovementComponent implements OnInit {
  /**
   * predicate Inventory list
   */
  public predicateInventory: PredicateFormat[] = [];

  public inventoryIdsSelected: number[] = [];
  // the list of all inventories Id
  public allInventoryIds: number[] = [];
  public showErrorMessage = false;

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
  public searchType = NumberConstant.ONE;

  @Input() statusList;
  public formatDateFilter = this.translate.instant(SharedConstant.FORMAT_DATE_PLACEHOLDER);
  public statusCode = documentStatusCode;
  formGroupFilter: FormGroup;
  private oldStartDateValue: Date;
  private oldEndDateValue: Date;
  public minEndDate: Date;
  public minStartDate: Date;
  public maxStartDate: Date;
  choosenFilter: string;
  choosenFilterNumber = NumberConstant.ZERO;
  //  // pager settings
  public pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;

  public WAREHOUSE = StockDocumentConstant.WAREHOUSE;
  public listInventory = StockDocumentConstant.LIST_INVENTORY;

  public inventory: string;
  public selectAllState: SelectAllCheckboxState = SharedConstant.UNCHECKED as SelectAllCheckboxState;

  public gridState: DataSourceRequestState = {
    skip: NumberConstant.ZERO,
    take: NumberConstant.TEN,
    filter: { // Initial filter descriptor
      logic: SharedConstant.LOGIC_AND,
      filters: []
    }
  };

  @ViewChild('closebutton') closebutton;
  @ViewChild(MassPrintInventoryComponent) MassPrintInventory;

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
      filter: 'date',
      _width: NumberConstant.ONE_HUNDRED_FIFTY
    },
    {
      field: StockDocumentConstant.ID_WAREHOUSE_SOURCE_FIELD,
      title: StockDocumentConstant.ID_WAREHOUSE_SOURCE_TITLE,
      filterable: false,
      _width: NumberConstant.ONE_HUNDRED_FIFTY
    },
    {
      field: StockDocumentConstant.SHELF_FIELD,
      title: StockDocumentConstant.SHELF_TITLE,
      filterable: true,
      _width: NumberConstant.ONE_HUNDRED_FIFTY
    },
    {
      field: StockDocumentConstant.ID_TIERS_FIELD,
      title: StockDocumentConstant.ID_TIERS_TITLE,
      filterable: true,
      _width: NumberConstant.ONE_HUNDRED_FIFTY
    },
    {
      field: StockDocumentConstant.ID_DOCUMENT_STATUS_FIELD,
      title: StockDocumentConstant.ID_DOCUMENT_STATUS_TITLE,
      filterable: false,
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
      filter: 'date',
      _width: NumberConstant.ONE_HUNDRED_FIFTY
    },
    {
      field: StockDocumentConstant.ID_WAREHOUSE_SOURCE_FIELD,
      title: StockDocumentConstant.ID_WAREHOUSE_SOURCE_TITLE,
      filterable: false,
      _width: NumberConstant.ONE_HUNDRED_FIFTY
    },
    {
      field: StockDocumentConstant.SHELF_FIELD,
      title: StockDocumentConstant.SHELF_TITLE,
      filterable: true,
      _width: NumberConstant.ONE_HUNDRED_FIFTY
    },
    {
      field: StockDocumentConstant.ID_TIERS_FIELD,
      title: StockDocumentConstant.ID_TIERS_TITLE,
      filterable: true,
      _width: NumberConstant.ONE_HUNDRED_FIFTY
    },
    {
      field: "DocumentStatus",
      title: StockDocumentConstant.ID_DOCUMENT_STATUS_TITLE,
      filterable: false,
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
  Massprint = false;
  haveProvisonalDoc: boolean;
  /**
   * permissions
   */
   public hasShowPermission: boolean;
   public hasAddPermission: boolean;
   public hasDeletePermission: boolean;
   public hasPrintPermission: boolean;
   public hasUpdatePermission: boolean;

  constructor(public stockDocumentsService: StockDocumentsService, private swalWarrings: SwalWarring,
              private router: Router, public translate: TranslateService, private fb: FormBuilder, private fileServiceService: FileService,
              private cdRef: ChangeDetectorRef, private growlService: GrowlService, private authService: AuthService) {
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
    const isQuickSearch = this.searchType === NumberConstant.ONE;
    if (!state.sort[NumberConstant.ZERO] || (state.sort[NumberConstant.ZERO] && !state.sort[NumberConstant.ZERO].dir)) {
      state.sort = [];
    }
    this.gridSettings.state = state;
    this.setDataSourceWithSpecificDates();
  }

  /**
   * Remove handler
   * @param param0
   */
  public removeHandler(dataItem) {
    this.swalWarrings.CreateSwal(StockDocumentConstant.INVENTORY_DELETE_TEXT_MESSAGE,
      StockDocumentConstant.INVENTORY_DELETE_TITLE_MESSAGE).then((result) => {
      if (result.value) {
        this.stockDocumentsService.remove(dataItem).subscribe(() => {
          this.initGridDataSource(true);
        });
      }
    });
  }

  /**
   *  Go to edit form
   * @param id
   */
  public goToAdvancedEdit(id: number) {
    if(this.hasShowPermission || this.hasUpdatePermission){
      this.router.navigateByUrl(StockDocumentConstant.URI_INVENTORY_EDIT.concat(id.toString()));
    }
  }

  initGridDataSource(isQuickSearch: boolean, startDate?, endDate?, warehouse?, status?) {
    this.stockDocumentsService.getInventoryMovementList(this.gridSettings.state, this.predicateInventory[NumberConstant.ZERO],
      startDate, endDate, warehouse, status)
      .subscribe(data => {
        this.gridSettings.gridData = data;
        if (this.gridSettings.gridData.data.find(x => x.IdDocumentStatus == documentStatusCode.Provisional)) {
          this.haveProvisonalDoc = true;
        } else {
          this.haveProvisonalDoc = false;
        }
      });
  }

  /**
   * Prepare predicate
   * @param status
   */
  public preparePredicate(status: number): PredicateFormat {
    const myPredicate = new PredicateFormat();
    myPredicate.Filter = new Array<Filter>();
    // Set default filter to all transfert movement
    this.choosenFilter = this.translate.instant(StockDocumentConstant.ALL_Inventory);
    if (status !== 0) {
      this.choosenFilter = this.translate.instant(documentStatusCode[status].toUpperCase());
      myPredicate.Filter.push(new Filter(StockDocumentConstant.ID_DOCUMENT_STATUS_FIELD, Operation.eq, status));
    }
    this.choosenFilterNumber = status;
    // Add filter by type of stock document (TM)
    myPredicate.Filter.push(new Filter(StockDocumentConstant.TYPE_STOCK_DOCUMENT, Operation.eq, StockDocumentConstant.Inventory));
    myPredicate.Filter.push(new Filter(StockDocumentConstant.IS_DELETED, Operation.eq, NumberConstant.ZERO));
    myPredicate.Relation = new Array<Relation>();
    // Add relation idDocumentStatus
    myPredicate.Relation.push(new Relation(StockDocumentConstant.ID_DOCUMENT_STATUS_NAVIGATION));
    myPredicate.Relation.push(new Relation(StockDocumentConstant.ID_WAREHOUSE_SOURCE_NAVIGATION));
    myPredicate.Relation.push(new Relation(StockDocumentConstant.ID_TIERS_NAVIGATION));
    myPredicate.OrderBy = new Array<OrderBy>();
    // Add order by DocumentDate
    myPredicate.OrderBy.push.apply(myPredicate.OrderBy, [new OrderBy(StockDocumentConstant.DATE_FIELD, OrderByDirection.desc)]);
    myPredicate.OrderBy.push.apply(myPredicate.OrderBy, [new OrderBy('Code', OrderByDirection.desc)]);

    return myPredicate;

  }

  //  /**
  // * onChange Status Inventory
  // * */
  ngOnInit() {
    this.hasShowPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.SHOW_INVENTORY_MOVEMENT);
    this.hasAddPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.ADD_INVENTORY_MOVEMENT);
    this.hasDeletePermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.DELETE_INVENTORY_MOVEMENT);
    this.hasPrintPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.PRINT_INVENTORY_MOVEMENT);
    this.hasUpdatePermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.UPDATE_INVENTORY_MOVEMENT);
    this.initTiersFiltreConfig();
    this.createForm();
    this.gridSettings.state.skip = 0;
    this.gridSettings.state.filter.filters = [];
    this.gridSettings.state.sort = [];
    this.gridSettings.gridData = {
      data: [],
      total: 0
    };
    this.predicateInventory.push(this.preparePredicate(NumberConstant.ZERO));
    this.initGridDataSource(true);
  }

  private createForm(): void {
    this.formGroupFilter = this.fb.group({
      StartDate: new FormControl(''),
      EndDate: new FormControl(''),
      IdWarehouseSource: new FormControl(undefined),
      Status: new FormControl(undefined)
    });

    this.addDependentDateControls(this.formGroupFilter);
  }


  private addDependentDateControls(currentformGroup: FormGroup) {
    this.setStartDateControl(currentformGroup);
    this.setEndDateControl(currentformGroup);
    currentformGroup.get(START_DATE).valueChanges.subscribe(() => {
      if (currentformGroup.get(END_DATE).hasError('dateValueGT')) {
        currentformGroup.get(END_DATE).setErrors(null);
      }
    });
    currentformGroup.get(END_DATE).valueChanges.subscribe(() => {
      if (currentformGroup.get(START_DATE).hasError('dateValueLT')) {
        currentformGroup.get(START_DATE).setErrors(null);
      }
    });

  }

  private setStartDateControl(currentformGroup: FormGroup) {
    const oEndDate = new Observable<Date>(observer => observer.next(currentformGroup.get(END_DATE).value));
    currentformGroup.setControl(START_DATE, this.fb.control(currentformGroup.value.startDate,
      [dateValueLT(oEndDate)]));
  }

  private setEndDateControl(currentformGroup: FormGroup) {
    const oStartDate = new Observable<Date>(observer => observer.next(currentformGroup.get(START_DATE).value));
    currentformGroup.setControl(END_DATE, this.fb.control(currentformGroup.value.endDate,
      [dateValueGT(oStartDate)]));
  }

  changeStartDate() {
    if (this.formGroupFilter.get(START_DATE).value !== this.oldStartDateValue) {
      this.oldStartDateValue = this.formGroupFilter.get(START_DATE).value;
      if (!this.oldStartDateValue) {
        this.minEndDate = undefined;
      } else {
        this.minEndDate = this.oldStartDateValue;
      }
      this.cdRef.detectChanges();
    }
  }

  changeEndDate() {
    if (this.formGroupFilter.get(END_DATE).value !== this.oldEndDateValue) {
      this.oldEndDateValue = this.formGroupFilter.get(END_DATE).value;

      if (!this.oldEndDateValue) {
        this.maxStartDate = undefined;
      } else {
        this.maxStartDate = this.oldEndDateValue;
      }
      this.cdRef.detectChanges();
    }
  }

  setDataSourceWithSpecificDates() {
    let startDate: Date = this.formGroupFilter.get(START_DATE).value;
    let endDate: Date = this.formGroupFilter.get(END_DATE).value;
    let warehouse = this.formGroupFilter.get(WAREHOUSE).value;
    let status = this.formGroupFilter.get(STATUS).value;
    let startDateToSend: Date;
    let endDateToSend: Date;
    if (startDate) {
      startDateToSend = new Date(Date.UTC(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()));
    }
    if (endDate) {
      endDateToSend = new Date(Date.UTC(endDate.getFullYear(), endDate.getMonth(), endDate.getDate()));
    }
    if (startDateToSend || endDateToSend || warehouse || status) {
      this.initGridDataSource(true, startDateToSend, endDateToSend, warehouse, status);
    } else {
      this.initGridDataSource(true);
    }
  }

  warehouseSelect($event) {
    if ($event.combobox) {
      if ($event.combobox.dataItem) {
        this.formGroupFilter.controls['IdWarehouseSource'].setValue($event.combobox.dataItem.Id);
      }
    } else {
      this.formGroupFilter.controls['IdWarehouseSource'].setValue('');
    }
  }

  recieveDefaultStatus($event) {
    this.formGroupFilter.controls['Status'].setValue($event);
  }

  openMassPrint() {
    this.Massprint = true;
    this.onJasperPrintClick();
  }

  closeMassPrint() {
    this.closebutton.nativeElement.click();
    this.stockDocumentsService.MassPrintInventoryDocs(this.MassPrintInventory.mySelection).subscribe(data => {
    });
    this.Massprint = false;
  }


  public onJasperPrintClick() {
    const selectedInventoriesIds = this.inventoryIdsSelected;
    if (selectedInventoriesIds.length !== NumberConstant.ZERO) {
      const params = {
        report_documentId: selectedInventoriesIds.join(';')
      };
      const documentName = 'inventoryMultiple';
      const dataToSend = {
        'Id': 0,
        'reportName': 'inventory_loss_gain_multiple',
        'documentName': documentName,
        'reportFormatName': 'pdf',
        'printCopies': 1,
        'PrintType': -1,
        'reportparameters': params
      };
      this.stockDocumentsService.downloadJasperReport(dataToSend).subscribe(
        res => {
          this.fileServiceService.downLoadFile(res.objectData);
        });
      this.Massprint = false;
    } else {
      this.growlService.warningNotification(this.translate.instant(StockDocumentConstant.NO_INVENTORY_SELLECTED_ALERT_INFO));
    }
  }

  public filter() {
    this.searchType = NumberConstant.ONE;
    this.predicateQuickSearch = this.preparePredicate(NumberConstant.ZERO);
    if(this.inventory !== ""){
    this.predicateQuickSearch.Filter.push(new Filter(StockDocumentConstant.CODE_FIELD, Operation.contains, this.inventory, false, true));
    this.predicateQuickSearch.Filter.push(new Filter(StockDocumentConstant.ID_WAREHOUSE_SOURCE_FIELD, Operation.contains, this.inventory, false, true));
    this.predicateQuickSearch.Filter.push(new Filter(StockDocumentConstant.SHELF_FIELD, Operation.contains, this.inventory, false, true));
    this.predicateQuickSearch.Filter.push(new Filter(StockDocumentConstant.ID_TIERS_FIELD, Operation.contains, this.inventory, false, true));
    }
    this.predicateInventory = [];
    this.predicateInventory.push(this.mergefilters());
    this.gridSettings.state.skip = NumberConstant.ZERO;
    this.initGridDataSource(true);
  }

  /**
   * check the state of the select all checkbox in the kendo grid
   */
  public onSelectedKeysChange(e) {
    const selectionLength = this.inventoryIdsSelected.length;
    selectionLength === NumberConstant.ZERO ? this.showErrorMessage = true : this.showErrorMessage = false;
    if (selectionLength === NumberConstant.ZERO) {
      this.selectAllState = SharedConstant.UNCHECKED as SelectAllCheckboxState;
    } else if (selectionLength > NumberConstant.ZERO && selectionLength < this.allInventoryIds.length) {
      this.selectAllState = SharedConstant.INDETERMINATE as SelectAllCheckboxState;
    } else {
      this.selectAllState = SharedConstant.CHECKED as SelectAllCheckboxState;
    }
  }
  /**
   * this method aims to select all elements of the grid or deselect it
   */
  public onSelectAllChange(checkedState: SelectAllCheckboxState) {

    if (checkedState === SharedConstant.CHECKED as SelectAllCheckboxState) {
      this.inventoryIdsSelected = this.inventoryIdsSelected.concat(this.inventoryIdsSelected.filter((e) => !this.inventoryIdsSelected.includes(e)));;
      this.selectAllState = SharedConstant.CHECKED as SelectAllCheckboxState;
    } else {
      this.inventoryIdsSelected = this.inventoryIdsSelected.filter((e) => !this.inventoryIdsSelected.includes(e));
      this.selectAllState = SharedConstant.UNCHECKED as SelectAllCheckboxState;
    }
  }

  /**
   * load advancedSearch parameters config
   * @private
   */
  private initTiersFiltreConfig() {
    this.filtreFieldsColumns.push(new FiltrePredicateModel(StockDocumentConstant.WAREHOUSE, FieldTypeConstant.warehouseTypeDropdownComponent, StockDocumentConstant.ID_WAREHOUSE_SOURCE_ID_FIELD));
    this.filtreFieldsColumns.push(new FiltrePredicateModel(StockDocumentConstant.ID_DOCUMENT_STATUS_TITLE, FieldTypeConstant.documentStatusComponent,
      StockDocumentConstant.ID_DOCUMENT_STATUS_FIELD));
    this.filtreFieldsColumns.push(new FiltrePredicateModel(StockDocumentConstant.DATE_TITLE, FieldTypeConstant.DATE_TYPE, StockDocumentConstant.DATE_FIELD));
    this.filtreFieldsInputs.push(new FiltrePredicateModel(StockDocumentConstant.ID_TIERS_TITLE, FieldTypeConstant.supplierComponent, StockDocumentConstant.ID_TIERS_ID_FIELD));
  }

  /**
   * Reset dataGrid
   */
  resetClickEvent() {
    this.predicateAdvancedSearch = this.preparePredicate(NumberConstant.ZERO);
    this.predicateInventory[NumberConstant.ZERO].Filter = [];
    this.predicateQuickSearch.Filter = [];
    this.predicateInventory = [];
    this.inventory = SharedConstant.EMPTY;
    this.predicateInventory.push(this.mergefilters());
    this.initGridDataSource(true);
  }

  /**
   * identify the predicate operator AND|OR
   * @param operator
   */
  getOperatorPredicate(operator: Operator) {
    this.predicateAdvancedSearch.Operator = operator;
  }

  /**
   * get array<Filtre> from advancedSearchComponenet
   * remove old filter property from the predicate filter list
   * case filtre type date between
   * @param filtre
   */
  getFiltrePredicate(filtre) {
    this.searchType = NumberConstant.ZERO;
    this.predicateInventory = [];
    this.prepareSpecificFiltreFromAdvancedSearch(filtre);
    this.prepareFiltreFromAdvancedSearch(filtre);
    this.predicateInventory.push(this.mergefilters());
  }

  mergefilters() {
    let predicate = new PredicateFormat();
    predicate.Filter = new Array<Filter>();
     if (this.predicateAdvancedSearch.Filter) {
       this.cloneAdvancedSearchPredicate(predicate);
     }
    if (this.predicateQuickSearch.Filter.length > 2) {
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

  private setPredicateFiltre(isQuickSearch) {
    this.predicateInventory = [];
    if (isQuickSearch) {
      this.predicateInventory.push(this.predicateQuickSearch);
    } else {
      this.predicateAdvancedSearch.Operator = Operator.and;
      this.gridState.filter.logic = SharedConstant.LOGIC_AND;
      this.gridSettings.state.filter.logic = SharedConstant.LOGIC_AND;
      this.predicateInventory.push(this.predicateAdvancedSearch);
    }
  }


  searchClick() {
    this.gridSettings.state.skip = NumberConstant.ZERO;
    this.initGridDataSource(false);
  }
}
