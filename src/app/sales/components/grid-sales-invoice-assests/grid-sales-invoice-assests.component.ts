import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DataStateChangeEvent, GridComponent } from '@progress/kendo-angular-grid';
import { GrowlService } from '../../../../COM/Growl/growl.service';
import { KeyboardConst } from '../../../constant/keyboard/keyboard.constant';
import { DocumentConstant } from '../../../constant/sales/document.constant';
import { WarehouseItemService } from '../../../inventory/services/warehouse-item/warehouse-item.service';
import { WarehouseService } from '../../../inventory/services/warehouse/warehouse.service';
import { DocumentEnumerator, documentStatusCode, InvoicingTypeEnumerator } from '../../../models/enumerators/document.enum';
import { DocumentLineUnitPrice } from '../../../models/sales/document-line-unit-price.model';
import { DocumentLine } from '../../../models/sales/document-line.model';
import { DocumentLinesWithPaging } from '../../../models/sales/document-lines-with-paging.model';
import { ItemPrice } from '../../../models/sales/item-price.model';
import { TiersService } from '../../../purchase/services/tiers/tiers.service';
import { DepotDropdownComponent } from '../../../shared/components/depot-dropdown/depot-dropdown.component';
import { GridGenericMethodsComponent } from '../../../shared/components/document/document-generic-method/generic-grid';
import { ItemDropdownComponent } from '../../../shared/components/item-dropdown/item-dropdown.component';
import { SwalWarring } from '../../../shared/components/swal/swal-popup';
import { DocumentFormService } from '../../../shared/services/document/document-grid.service';
import { ValidationService } from '../../../shared/services/validation/validation.service';
import { StarkPermissionsService, StarkRolesService } from '../../../stark-permissions/stark-permissions.module';
import { CrudGridService } from '../../services/document-line/crud-grid.service';
import { DocumentService } from '../../services/document/document.service';
import { SearchItemService } from '../../services/search-item/search-item.service';
import { ImportOrderDocumentLinesComponent } from '../import-order-document-lines/import-order-document-lines.component';
import { GridImportBsComponent } from '../../invoice/grid-import-bs/grid-import-bs.component';
import { MeasureUnitService } from '../../../shared/services/mesure-unit/measure-unit.service';
import { RoleConfigConstant } from '../../../Structure/_roleConfigConstant';
import { isBetweenKendoDropdowns } from '../../../shared/helpers/component.helper';
import { GridSettings } from '../../../shared/utils/grid-settings.interface';
import { ListDocumentService } from '../../../shared/services/document/list-document.service';
import { Filter, Operation, PredicateFormat } from '../../../shared/utils/predicate';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { CompanyService } from '../../../administration/services/company/company.service';
import { ReducedCompany } from '../../../models/administration/reduced-company.model';
import { ItemConstant } from '../../../constant/inventory/item.constant';
import { DocumentTaxsResume } from '../../../models/sales/document-Taxs-Resume.model';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { Item } from '../../../models/inventory/item.model';
import { ItemService } from '../../../inventory/services/item/item.service';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { Warehouse } from '../../../models/inventory/warehouse.model';
import { LocalStorageService } from '../../../login/Authentification/services/local-storage-service';
import { UserWarehouseService } from '../../../inventory/services/user-warehouse/user-warehouse.service';
import { ShelfDropdownComponent } from '../../../shared/components/shelf-dropdown/shelf-dropdown.component';

@Component({
  selector: 'app-grid-sales-invoice-assests',
  templateUrl: './grid-sales-invoice-assests.component.html',
  styleUrls: ['./grid-sales-invoice-assests.component.scss']
})
export class GridSalesInvoiceAssestsComponent extends GridGenericMethodsComponent implements OnInit, OnDestroy {

  /**document form group */
  @Input() itemForm: FormGroup;

  /**document type Invoice, Assets */
  @Input() documentType: string;

  /**the discount input should be Disebled in some documents  */
  @Input() DisebledDiscount: boolean;

  /**if document line is has quotation data  */
  @Input() isHasDevis: boolean;

  /**if document line are imported data  */
  @Input() isToImport: boolean;

  @Input() addNewLineInDevis: boolean;

  @Input() isEditedGrid: boolean;
  // format currency
  @Input() formatOption;

  // it serve to hide the import BC button in case of sales counter
  @Input() hideImportButton: boolean;

  // gridfilter as default is true
  @Input() gridFilter = true;

  // @Input() isSuperAdminRole = false;
  public FormatNumber = SharedConstant.NUMBER_FORMAT;

  @Input() updateValidDocumentRole: boolean;
  @Input() deleteReservedDocumentLineRole = false;
  /**showing search field */
  @Input() showSearch = true;
  @Input() documentTaxeResume: DocumentTaxsResume[];
  @ViewChild(GridComponent) public grid: GridComponent;
  @ViewChild(DepotDropdownComponent) childWerehouse;
  @ViewChild(ItemDropdownComponent) itemDropDown;
  @ViewChild(ImportOrderDocumentLinesComponent) importOrderDocumentLines;
  @ViewChild('addNewLineButton') addNewLineButtonEl;
  @ViewChild(GridImportBsComponent) importOtherDocumentLines;
  @Output() ShowLastItemInBL = new EventEmitter<any>();
  @Input() isFromSearchItem: boolean;
  @ViewChild('closebutton') closebutton;

  // sales counter input
  @Input() isForCounterSales = false;
  @Input() defaultWarehouse: Warehouse;
  @Input() idDefaultWarehouse: number;
  // to make a default warehouse selected in search
  @Input() hasDefaultWarehouse: boolean;
  // Counter sales input
  @Input() fromCounterSales: boolean;
  /**edited row number*/
  public editedRowIndex: number;

  /** item price for the selected item*/
  itemPrice: ItemPrice;
  /**the selected document line */
  documentLine: DocumentLine;
  /**define if document line have been edited  */
  isEdited: boolean;
  /**the label will be display in the warhouse column for selected item and warhouse*/
  warehouse: string;
  noImport: boolean;
  /** document Enumerator */
  public documentEnumerator: DocumentEnumerator = new DocumentEnumerator();
  public DocumentStatusCode = documentStatusCode;
  /** Define if the document of type sales or purchase */
  isSalesDocument: boolean;
  /** tiersAssociatedToItems will be changed if its a purchase document and the supplier has been selected */
  tiersAssociatedToItems: number[];
  private isEditedItem: boolean;
  public hideSearch = false;
  public articleReference = '';
  public showImportLines: boolean;
  public event;
  showOtherImport: boolean;
  importedFromOtherData: boolean;
  public deleteMultipleLinesRole: boolean;
  public deleteLineRole: boolean;
  public deleteDocumentLineRole: boolean;
  public gridSettings: GridSettings = this.documentListService.documentLineGridSettings;
  predicate: any;
  currentCompany: ReducedCompany;
  public haveImportDocSalesRole = false;
  public haveReservedLine = false;

  public discountChanged = false;
  public updateDiscountRole = false;
  public updatePriceRole = false;
  @Input() updatePrice: boolean;
  public isFromDeleteLine = false;
  public showGrid = false;
  public importQuotationPermission_SA = false;
  public importOrderPermission_SA = false;
  public importDeliveryPermission_SA = false;
  public importInvoicePermission_SA = false;
  public importAssetPermission_SA = false;
  public listQuotationPermission_SA = false;
  public listOrderPermission_SA = false;
  public listDeliveryPermission_SA = false;
  public listInvoicePermission_SA = false;
  public listAssetPermission_SA = false;
  public removeLine = false;
  //public idWarehouse;
  @Input() idSalesPrice: number;
  @Input() isFromDepositOrder = false;
  @Input() isAdvancePayement = false;
  public userEmail : string;
  public selectedIdWarehouse = NumberConstant.ZERO;
  public warehouseFormGroup : FormGroup;
  @ViewChild("depoDropdown") private depoDropdown: DepotDropdownComponent;
  @ViewChild("shelfDropdown") private shelfDropdown: ShelfDropdownComponent;
  public array : FormArray;
  

  constructor(protected service: CrudGridService, public validationService: ValidationService,
    public documentFormService: DocumentFormService, protected documentService: DocumentService,
    public viewRef: ViewContainerRef, protected router: Router,
    protected warehouseService: WarehouseService, protected warehouseItemService: WarehouseItemService,
    protected formBuilder: FormBuilder, protected swalWarrings: SwalWarring, protected searchItemService: SearchItemService,
    protected growlService: GrowlService, protected translateService: TranslateService,
    public documentListService: ListDocumentService,
    protected tiersService: TiersService, protected serviceComany: CompanyService,
    protected permissionsService: StarkPermissionsService, private renderer: Renderer2, protected measureUnitService: MeasureUnitService, protected rolesService: StarkRolesService,
    public itemService: ItemService, public authService: AuthService, protected localStorageService: LocalStorageService, protected userWarehouseService : UserWarehouseService) {
    super(service, validationService, documentFormService,
      documentService, viewRef, router, searchItemService, warehouseService, warehouseItemService,
      formBuilder, growlService, translateService, tiersService, swalWarrings, measureUnitService, serviceComany, localStorageService);
    this.isSalesDocument = false;
    this.userEmail = this.localStorageService.getEmail();
        this.userWarehouseService.getWarehouse(this.userEmail).subscribe(x => {
            this.defaultWarehouse = x.objectData;
            this.selectedIdWarehouse = x.objectData.Id;
            this.warehousePrevioisValue = x.objectData.Id
        });
    

  }

  public addDocumentLine({ sender, rowIndex, columnIndex, dataItem, isEdited }) {
    this.selectedIdWarehouse = this.defaultWarehouse.Id;
    this.hasDefaultWarehouse = true;
    if (this.itemForm.valid || this.itemForm.status === 'DISABLED') {
      this.initAddLine(rowIndex, dataItem);
    } else {
      this.validationService.validateAllFormFields(this.itemForm);
    }
  }



  initAddLine(rowIndex, dataItem) {
    this.format = this.formatOption;
    this.openNewLine();
    this.editedRowIndex = rowIndex;
    this.dataItem = dataItem;
    this.isNew = true;
    this.gridObject = undefined;
  }

  @HostListener('keyup', ['$event'])
  keyEvent(event) {
    let selectedIndex: number;
    let OpenLineIndex: number;
    // get data from grid
    const dataGrid = this.grid.data as { data, total };
    // if (event.key === KeyboardConst.ENTER) {
    //   this.saveCurrent();
    // }
    if (dataGrid) {
      if (this.itemForm) {
        this.callNexTLine(dataGrid, event, selectedIndex, OpenLineIndex, false);
      }
    } else {
      if ((event.key === KeyboardConst.ARROW_DOWN || event.key === KeyboardConst.ARROW_UP) && this.gridFormGroup
        && !isBetweenKendoDropdowns(event)) {
        this.event = event;
        this.iskeyup = true;
        this.saveCurrent();
      }
    }
    this.closeLine(event);
  }

  public dataStateChange(state: DataStateChangeEvent): void {
    this.gridSettings.state = state;
    this.skip = this.gridSettings.state.skip;
    this.predicate = new PredicateFormat();
    this.predicate.Filter = new Array<Filter>();
    if (this.gridSettings.state.filter.filters.length > 0) {
      this.gridSettings.state.filter.filters.forEach((element: any) => {
        const o = Operation[element.operator] as any;
        if (element.field === 'IdWarehouse') {
          this.predicate.Filter.push(new Filter('IdWarehouseNavigation.WarehouseName', o, element.value));
        } else if (element.field === 'IdItem') {
          this.articleReference = element.value;
        } else if (element.field === 'HtUnitAmountWithCurrency') {
          this.predicate.Filter.push(new Filter('HtAmountWithCurrency', o, element.value));
        } else {
          this.predicate.Filter.push(new Filter(element.field, o, element.value));
        }
      });
    }
    if (this.gridSettings.state.filter.filters.length === 0) {
      this.articleReference = '';
    }
    this.loadItems();
  }

  public movementQtyFoucusOut() {
    this.saveLine = true;
    if (this.gridFormGroup && (this.gridFormGroup.controls['MovementQty'].value !== this.oldQty)) {
      this.recalculateDiscount = true;
      this.saveCurrent();
    } else {
      this.recalculateDiscount = false;
      this.saveCurrent();
    }
    if (this.discountValueChanged) {
      this.discountValueChanged = false;
      this.growlService.InfoNotification(this.translateService.instant('DISCOUNT_CHANGED'));
    }
  }

  htUnitAmountWithCurrencyFoucusOut() {
    if (document.getElementById('btnSave')) {
      if (document.getElementsByName('DiscountPercentage')) {
        const DiscountPercentage = document.getElementsByName('DiscountPercentage')[0] as any;
        if (DiscountPercentage && DiscountPercentage.disabled === false) {
          document.getElementsByName('DiscountPercentage')[0].focus();
        } else {
          this.discountPercentageFoucusOut();
        }
      } else {
        this.discountPercentageFoucusOut();
      }
    }
  }



  openNewLine(IsToRefreshItemDropDown?: boolean) {
    if (this.itemDropDown && IsToRefreshItemDropDown) {
      this.itemDropDown.clearValueOfSearch();
      this.itemDropDown.initDataSource();
    }
    this.isAfterSave = false;
    this.isEditedItem = true;
    this.isNew = true;
    this.createFormGroup();
    if(this.shelfDropdown){
      this.shelfDropdown.initShelfAndStorageDropdown();
    }
    this.grid.addRow(this.gridFormGroup);
    this.gridFormGroup.controls['IdWarehouse'].setValue(this.defaultWarehouse.Id);
    this.isEdited = true;
    this.openButtonSearchInItemDropDown();
    if (this.itemForm.controls['Id'].value <= 0) {
      this.saveDocumentAfterChoosingSupplier(true);
    }
  }

  openButtonSearchInItemDropDown() {
    this.hideSearch = false;
    if (this.itemDropDown) {
      this.itemDropDown.activeKeyPress = true;
    }
  }

  public doCellInit = (dataItem, isEdited, rowIndex, SetedValue, data) => {
    this.isAfterSave = false;
    this.format = this.formatOption;
    this.dataItem = dataItem;
    this.isEditedItem = false;
    this.createFormOnCellHandler({ isEdited, dataItem, rowIndex }, SetedValue, data);
    this.gridFormGroup.controls['IdItem'].disable();
    this.hideSearch = true;
    if ((dataItem && dataItem.IdDocumentNavigation && dataItem.IdDocumentNavigation.InoicingType && dataItem.IdDocumentNavigation.InoicingType == InvoicingTypeEnumerator.advance_Payment) ||
      (this.document && this.document.InoicingType && this.document.InoicingType == InvoicingTypeEnumerator.advance_Payment)) {
      this.gridFormGroup.controls['MovementQty'].disable();
      this.gridFormGroup.controls['DiscountPercentage'].disable();
    }
    this.editedRowIndex = rowIndex;
    this.grid.editRow(rowIndex, this.gridFormGroup);
    this.gridObject = undefined;
    if (this.childWerehouse) {
      this.childWerehouse.warehouseFiltredDataSource = [];
      this.childWerehouse.ChangeVagetItemValue(dataItem.IdItem);
    }
    this.getLastBLPriceForItem();
  };

  public getLastBLPriceForItem() {
    if (this.itemForm.controls['DocumentTypeCode'].value === DocumentEnumerator.SalesDelivery) {
      this.documentService.getLastBLPriceForItem(this.gridFormGroup.controls['IdItem'].value,
        this.itemForm.controls['IdTiers'].value).subscribe(x => {
          this.ShowLastItemInBL.emit(x);
        });
    }
  }

  public documentLineClickHandler({ isEdited, dataItem, rowIndex }, SetedValue?: boolean, data?: any): void {
    if (this.itemForm.controls['IsForPos'] && this.itemForm.controls['IsForPos'].value && !this.fromCounterSales) {
      return;
    }
    if (this.isFromDepositOrder) {
      return;
    }
    if(dataItem && dataItem.IdItemNavigation && dataItem.IdItemNavigation.Code == "Remise" && dataItem.IdItemNavigation.Description == "Remise"){
      return;
    }
    if (!this.removeLine && ((this.documentType == this.documentEnumerator.SalesOrder && this.currentDocument && this.currentDocument.IsBToB == false) ||
      this.documentType != this.documentEnumerator.SalesOrder) && (this.documentType != this.documentEnumerator.SalesInvoices ||
        (this.documentType == this.documentEnumerator.SalesInvoices && dataItem.IdDocumentLineStatus != this.DocumentStatusCode.Valid))) {
      this.oldQty = dataItem.MovementQty;
      this.oldDiscountValue = dataItem.DiscountPercentage;
      this.movementQtyFocusOut = true;
      if ((((isEdited || (this.gridFormGroup && !this.gridFormGroup.valid) || this.isInEditingMode || this.isEdited))
        || this.isEditedGrid) || this.IsRemovedLine) {
        // if is super admin or draft invoice
        this.documentLineClickHandlerSuperAdmin(isEdited, dataItem, rowIndex, SetedValue, data);
      } else {
        if (!this.isFromDeleteLine) {
          this.doCellInit(dataItem, isEdited, rowIndex, SetedValue, data);
        }
        this.isFromDeleteLine = false;
        if (this.childWerehouse) {
          this.childWerehouse.warehouseFiltredDataSource = [];
          this.childWerehouse.ChangeVagetItemValue(dataItem.IdItem);
        }
      }
      if (dataItem.Taxe && this.gridFormGroup) {
        if (dataItem.Taxe[0].IsCalculable) {
          this.gridFormGroup.controls['TaxeAmount'].disable();
        } else {
          this.gridFormGroup.controls['TaxeAmount'].enable();
        }
      }
    }
    this.removeLine = false;
  }

  createFormOnCellHandler({ isEdited, dataItem, rowIndex }, SetedValue?: boolean, data?: any) {
    this.isNew = false;
    this.isEdited = true;
    isEdited = true;
    this.createFormGroup(dataItem);
    this.editedRowIndex = rowIndex;
    if (this.itemForm.controls['DocumentTypeCode'].value === this.documentEnumerator.SalesDelivery) {
      this.NewAvailbleQuantity = dataItem.AvailableQuantity;
    }
  }

  /*
   ** close grid edit cell
   */
  closeEditor(): void {
    if (this.itemDropDown) {
      this.itemDropDown.activeKeyPress = false;
    }
    this.grid.closeRow(this.editedRowIndex);

    this.editedRowIndex = undefined;
    this.gridFormGroup = undefined;
    this.warehouse = undefined;
    this.isEdited = false;
    this.hideSearch = true;
    this.NewAvailbleQuantity = 0;
    this.ShowLastItemInBL.emit();
    this.showImportLines = false;
  }

  // inilize imported data
  checkImpotedData() {
    if (this.importOrderDocumentLines) {
      this.importOrderDocumentLines.ngOnInit();
    }
  }

  /* verify if the grid is in editing mode  */
  public get isInEditingMode(): boolean {
    return this.editedRowIndex !== undefined || this.isNew;
  }

  /* * call getItemPrice service */
  getItemPrices() {
    if (this.itemForm.controls['IdTiers'].value && this.isEditedItem) {
      this.isEdited = true;
      this.documentLine = new DocumentLine(null, this.gridFormGroup.getRawValue());
      this.gridFormGroup.controls['IdWarehouse'].setValue(this.defaultWarehouse.Id);
      this.itemPrice = new ItemPrice(this.documentType, this.itemForm.controls['DocumentDate'].value,
        this.itemForm.controls['IdTiers'].value, this.documentLine, this.itemForm.controls['IdCurrency'].value);
      this.setItemPrices();
      this.getLastBLPriceForItem();
      this.oldQty = this.gridFormGroup.controls['MovementQty'].value;
    }
  }

  getItemPercentageAndUnitPrice() {
    if (this.IdTiers.value) {
      this.isEdited = true;
      this.documentLine = new DocumentLine(null, this.gridFormGroup.getRawValue());
      if (this.documentLine.IdItem) {
        this.itemPrice = new ItemPrice(this.documentType, this.DocumentDate.value,
          this.IdTiers.value, this.documentLine, this.IdCurrency.value);
        this.setItemPercentageAndUnitPrice();
        this.getLastBLPriceForItem();
      } else {
        this.growlService.ErrorNotification(this.translateService.instant(ItemConstant.MISSING_ITEM));
      }
    }
  }

  get IdTiers(): FormControl {
    return <FormControl>this.itemForm.controls['IdTiers'];
  }

  get DocumentDate(): FormControl {
    return <FormControl>this.itemForm.controls['DocumentDate'];
  }

  get IdCurrency(): FormControl {
    return <FormControl>this.itemForm.controls['IdCurrency'];
  }

  ifSalesDocumentInSaveCurrent(data: DocumentLine) {
    if (!data.IdItemNavigation.IdNatureNavigation.IsStockManaged) {
      this.gridFormGroup.controls['IdWarehouse'].disable();
    } else {
      this.gridFormGroup.controls['IdWarehouse'].enable();
    }
    this.docLine = new DocumentLine(this.gridFormGroup.controls['IdItem'].value, this.gridFormGroup.getRawValue());
    this.gridFormGroup.patchValue(this.docLine);
    if (this.documentType === DocumentEnumerator.SalesAsset && data && !data.IdDocumentLineAssociated) {
      this.showImportLines = true;
    }
  }

  /**
   * check if the document line row can be editedor not
   */
  public getIfRowCanBeEdited(): boolean {
    return ((this.gridFormGroup && !this.gridFormGroup.valid) || this.isEdited) || this.isEditedGrid;
  }

  /*
  * remove the current documentLine from the current data source
  */
  public removeDocumentLine({ isEdited, dataItem, rowIndex, sender }) {
    this.removeLine = true;
    this.swalWarrings.CreateSwal(ItemConstant.ITEM_DELETE_TEXT_MESSAGE, ItemConstant.ITEM_DELETE_TITLE_MESSAGE).then((result) => {
      this.isFromDeleteLine = true;
      if (result.value) {
        if (dataItem && dataItem.IdDocumentNavigation && dataItem.IdDocumentNavigation.DocumentTypeCode == this.documentEnumerator.SalesInvoices) {
          var lines = [];
          lines.push(dataItem.Id);
          this.documentService.CheckInvoiceLinesToDelete(dataItem.IdDocument, lines).subscribe(res => {
            if (res) {
              if ((res.DocToAsk == null || res.DocToAsk.length == 0) && res.DeletedLines && res.DeletedLines.length == 1) {
                const indexId = this.selectionId.findIndex(x => x === dataItem.Id);
                if (indexId > -1) {
                  this.selectionId.splice(indexId);
                }
                this.IsRemovedLine = true;
                if (!this.itemForm.controls['hasSalesInvoices'] ||
                  (this.itemForm.controls['hasSalesInvoices'] && !this.itemForm.controls['hasSalesInvoices'].value)) {
                  dataItem.IsDeleted = true;
                  this.service.saveData(dataItem, false, 'data');
                  this.service.data = this.service.data.filter(x => x.IsDeleted === false);
                  res.Document.DocumentDate = new Date(res.Document.DocumentDate);
                  res.Document.DocumentInvoicingDate = new Date(res.Document.DocumentInvoicingDate);
                  this.itemForm.patchValue(res.Document);
                  this.getData(  res.Document.DocumentLine[0], false,  this.IsRemovedLine);
                if (this.documentTaxeResume) {
                  this.documentTaxeResume.splice(0,)
                  res.Document.DocumentTaxsResume.forEach(element => {
                    this.documentTaxeResume.push(element);
                  });
                }
                } else {
                  this.growlService.ErrorNotification(this.translateService.instant(DocumentConstant.EXIST_SALES_INVOICE_LINE_ERROR));
                }
                /**close editor */
                this.closeLineOperation();
              }else if ((res.DeletedLines == null || res.DeletedLines.length == 0) && res.DocToAsk && res.DocToAsk.length > 0){
                let swalWarningMessage = `${this.translateService.instant("ALL_EXISTED_LINES_WILL_BE_DELETED")}`;
                if(res.DocToAsk.length == 1){
                  swalWarningMessage = swalWarningMessage.replace('{code}', res.DocToAsk[0]);
                }else{
                  var code = res.DocToAsk[0];
                  for (let i = 1; i < res.DocToAsk.length; i++) {
                    code = code + ', ' + res.DocToAsk[i];
                  }
                  swalWarningMessage = swalWarningMessage.replace('{code}', code);
                }
                this.swalWarrings.CreateSwal(swalWarningMessage, ItemConstant.ITEM_DELETE_TITLE_MESSAGE).then((r) => {
                  if(r.value){
                    this.documentService.deleteAll(res.LinesToAsk, this.itemForm.controls['Id'].value).subscribe(x => {
                      x.DocumentDate = new Date(x.DocumentDate);
                      x.DocumentInvoicingDate = new Date(x.DocumentInvoicingDate);
                      this.itemForm.patchValue(x);
                      this.loadItems(this.selectionId.length);
                      this.selectionId = [];
                      this.documentTaxeResume.splice(0,)
                      x.DocumentTaxsResume.forEach(element => {
                        this.documentTaxeResume.push(element);
                      });
            
                    });
                  }
                });
              }

            }

          });
        } else {
          const indexId = this.selectionId.findIndex(x => x === dataItem.Id);
          if (indexId > -1) {
            this.selectionId.splice(indexId);
          }
          this.IsRemovedLine = true;
          if (!this.itemForm.controls['hasSalesInvoices'] ||
            (this.itemForm.controls['hasSalesInvoices'] && !this.itemForm.controls['hasSalesInvoices'].value)) {
            dataItem.IsDeleted = true;
            this.service.saveData(dataItem, false, 'data');
            this.service.data = this.service.data.filter(x => x.IsDeleted === false);
            this.saveCurrentLineinRealTime(dataItem, true);
          } else {
            this.growlService.ErrorNotification(this.translateService.instant(DocumentConstant.EXIST_SALES_INVOICE_LINE_ERROR));
          }
          /**close editor */
          this.closeLineOperation();
        }
      }
    });
  }

  //#region  imlimanting methods
  setItemService(): void {
    this.docLinePrices = new DocumentLineUnitPrice(this.itemForm.controls['IdCurrency'].value,
      this.documentType, this.gridFormGroup.getRawValue());
  }

  /**verify form validation before import documentLine */
  checkImportBL() {
    if (this.itemForm.valid || this.itemForm.disabled) {

      this.noImport = true;
      if (!this.importedFromOtherData) {
        if (this.importOrderDocumentLines) {
          this.importOrderDocumentLines.ngOnInit();
        }
        this.opentab();
      } else {
        this.openOtherImport();
      }
    } else {
      this.validationService.validateAllFormFields(this.itemForm);
      this.noImport = false;
    }
  }

  setWarehouseIfSalesDocument(idItem? : number) {
    this.depoDropdown.warehouseDataSourceFiltred = [];
    this.depoDropdown.initDataSource();
    this.itemService.getById(idItem).subscribe(item => {
      let warehousesIds = item.ItemWarehouse.map(x => x.IdWarehouse);
      this.depoDropdown.warehouseDataSourceFiltred = this.depoDropdown.warehouseDataSourceFiltred.filter(depot => warehousesIds.includes(depot.Id));
    });
  }

  refreshDepotDropdownValues(idItem : number){
    if(this.depoDropdown){
      this.depoDropdown.warehouseDataSourceFiltred = [];
      this.depoDropdown.initDataSource();
      this.itemService.getById(idItem).subscribe(item => {
        let warehousesIds = item.ItemWarehouse.map(x => x.IdWarehouse);
        this.depoDropdown.warehouseDataSourceFiltred = this.depoDropdown.warehouseDataSourceFiltred.filter(depot => warehousesIds.includes(depot.Id));
      });
    }
  }

  saveCurrentLineWithDocument(data: DocumentLine, isRemoved: boolean) {
    // if (!this.iskeyup) {
    this.closeEditor();
    if (!isRemoved && this.isNew) {
      this.isNew = false;
      this.openNewLine(true);
    } else {
      this.isNew = false;
    }
    // }
  }

  showaction(event?) {
    if (event.data === undefined) {
      this.clearfilterfield();
    }

  }

  documentGridSetValues() {
    if (this.isGridValuesAreValid()) {
      if (typeof (this.gridFormGroup.controls['IdItem'].value) === 'number') {

        this.itemPrice = new ItemPrice(this.documentType,
          this.itemForm.controls['DocumentDate'].value, this.itemForm.controls['IdTiers'].value,
          this.gridFormGroup.getRawValue(), this.itemForm.controls['IdCurrency'].value);
        if (this.itemPrice.DocumentType === DocumentEnumerator.SalesDelivery) {
          this.itemPrice.DocumentLineViewModel.IsValidReservationFromProvisionalStock = false;
          if (this.itemPrice && this.itemPrice.DocumentLineViewModel && this.itemPrice.DocumentLineViewModel.HtUnitAmount != null && this.itemPrice.DocumentLineViewModel.HtUnitAmount.toString().length == 0) {
            this.itemPrice.DocumentLineViewModel.HtUnitAmount = 0;
          }
          if (this.itemPrice && this.itemPrice.DocumentLineViewModel && this.itemPrice.DocumentLineViewModel.HtAmountWithCurrency != null && this.itemPrice.DocumentLineViewModel.HtAmountWithCurrency.toString().length == 0) {
            this.itemPrice.DocumentLineViewModel.HtAmountWithCurrency = 0;
          }
          if (this.itemPrice && this.itemPrice.DocumentLineViewModel && this.itemPrice.DocumentLineViewModel.HtUnitAmountWithCurrency != null && this.itemPrice.DocumentLineViewModel.HtUnitAmountWithCurrency.toString().length == 0) {
            this.itemPrice.DocumentLineViewModel.HtUnitAmountWithCurrency = 0;
          }

          // Begin checkRealAndProvisionalStock
          this.documentService.checkRealAndProvisionalStock(this.itemPrice).subscribe(isAvailableOnlyInProvisionalStock => {

            // check if there is only provisional stock
            if (isAvailableOnlyInProvisionalStock) {
              if (this.itemForm.controls[DocumentConstant.ID_DOCUMENT_STATUS].value === 1) {
                // check if the user want to use provisional stock (to reserve quantity)
                this.swalWarrings.CreateSwal(DocumentConstant.DO_YOU_WANT_TO_RESERVE_QUANTITY_FROM_INCOMING_ORDERS,
                  DocumentConstant.ORDER_IN_PROGRESS_BUT_NO_REAL_STOCK_AVAILABLE,
                  DocumentConstant.YES,
                  DocumentConstant.NO).then((result) => {
                    if (result.value) {
                      this.itemPrice.DocumentLineViewModel.IsValidReservationFromProvisionalStock = true;
                    }
                    this.saveCurrentLineinRealTime();
                  });
              } else {
                this.saveCurrentLineinRealTime();
              }
            } else {
              if (Number(this.gridFormGroup.controls['HtUnitAmountWithCurrency'].value) > 0) {
                this.saveCurrentLineinRealTime();
              } else {
                this.growlService.warningNotification(this.translateService.instant(DocumentConstant.FORMAT_PRICE_ERROR));
              }
            }
          });
        } else {
          this.saveCurrentLineinRealTime();
        }
      } else {
        this.growlService.ErrorNotification(this.translateService.instant('ITEM_NON_SELECTED'));
      }

    }
  }

  getDocumentLineValuesAndSetDataAfterCaluculateDocumentLine() {
    this.documentService.getDocumentLineValues(this.itemPrice).subscribe(data => {
      if (data) {
        this.saveCurrentLineinRealTime(data);
      }
    });
  }

  public loadItems(linesDeletedNumber?: number): void {
    if (this.view && linesDeletedNumber && linesDeletedNumber >= 0 && this.view.data.length - linesDeletedNumber <= 0 &&
      this.gridSettings.state.skip > 0) {
      this.gridSettings.state.skip = this.gridSettings.state.skip - this.gridSettings.state.take;
      this.skip = this.gridSettings.state.skip;
    }
    this.grid.loading = true;
    if (this.documentType === this.documentEnumerator.SalesDelivery) {
      this.haveReservedLine = this.itemForm.controls['haveReservedLines'].value;
    }
    if (this.itemForm.controls['DocumentTypeCode'].value === this.documentEnumerator.SalesInvoices &&
      this.itemForm.controls['InoicingType'].value === InvoicingTypeEnumerator.Other) {
      this.importedFromOtherData = true;
    }
    const documentLinesWithPaging = new DocumentLinesWithPaging(this.itemForm.controls['Id'].value, this.pageSize, this.skip,
      null, null, true, this.predicate);
    documentLinesWithPaging.RefDescription = this.articleReference;
    this.documentService.getDocumentLinesWithPaging(documentLinesWithPaging).subscribe((x: any) => {
      this.isContainsLines = x.isContainsLines;
      const itemList = x.data.map(elt => elt.IdItemNavigation);
      this.loadItemsPicture(itemList);
      this.view = {
        data: x.data,
        total: x.total
      };
      if (this.articleReference === '') {
        this.clearfilterfield();
      } else {
        this.filteritem();
      }
      this.getItemsOperation();
      if (this.documentType === DocumentEnumerator.SalesDelivery) {
        this.documentService.getDocumentAvailibilityStockReserved(this.itemForm.controls['Id'].value).subscribe(y => {
          this.itemForm.controls[DocumentConstant.IS_ALL_LINES_ARE_AVAILABLE].setValue(y.objectData);
        });
      }
      this.grid.loading = false;
    });
  }

  AssignValues(data: DocumentLine, loadWithoutSaveDocumentLine: boolean) {
    Object.assign(this.filteredView.data.find(({ Id }) => Id === data.Id), data);
    this.getItemsOperation();
  }

  public opneNextLineWithKeyBoard() {
    let selectedIndex: number;
    let OpenLineIndex: number;
    if (this.iskeyup && (this.itemForm.controls['DocumentTypeCode'].value === this.documentEnumerator.SalesDelivery ||
      this.itemForm.controls['DocumentTypeCode'].value === this.documentEnumerator.BS)) {
      this.callNexTLine(this.view as { data, total }, this.event, selectedIndex, OpenLineIndex, true);
      this.iskeyup = false;
      this.saveCurrentLineWithDocument(null, this.IsRemovedLine);
      if (this.gridObject) {
        this.documentLineClickHandler(this.gridObject);
      }
    } else {
      if (this.gridObject) {
        this.documentLineClickHandler(this.gridObject);
      }
    }

  }

  getItemsOperation() {
    if (this.itemForm) {
      this.enableOrDisableTiers();
      this.opneNextLineWithKeyBoard();
    }
  }

  pressKeybordEnter(event) {
    if (event.charCode === 13) {
      this.filteritem();
    }
  }

  onItemSearch() {
    this.filteritem();
  }

  filteritem() {
    const docLineToReference = new DocumentLinesWithPaging(this.itemForm.controls['Id'].value, this.pageSize, this.skip, null, null, true);
    if (this.articleReference !== undefined) {
      docLineToReference.RefDescription = this.articleReference.toUpperCase();
    } else {
      docLineToReference.RefDescription = '';
    }
    this.documentService.GetSearchDocumentLineResult(docLineToReference).subscribe(x => {
      this.filteredView = {
        data: x.data,
        total: x.total
      };
    });
  }

  clearfilterfield() {
    this.articleReference = '';
    this.filteredView = this.view;
  }

  checkclickFromCloseButton = () => {
    const isClosing = this.isNew === false &&
      this.editedRowIndex === undefined &&
      this.gridFormGroup === undefined &&
      this.warehouse === undefined &&
      this.isEdited === false &&
      this.hideSearch === true &&
      this.NewAvailbleQuantity === 0 &&
      this.IsRemovedLine === true;
    return isClosing;
  }

  /**
   * focusOnTiersSelect
   */
  public focusOnAddLineButton() {
    if (this.itemForm.valid) {
      if (((this.gridFormGroup && !this.gridFormGroup.valid) || this.isEdited) || this.isEditedGrid) {
        return;
      } else {
        this.format = this.formatOption;
        this.openNewLine();
        this.editedRowIndex = undefined;
        this.dataItem = undefined;
      }
    } else {
      this.validationService.validateAllFormFields(this.itemForm);
    }
  }


  /* verify if the grid is in editing mode  */
  public get salesDocumentStatus(): any {
    return this.itemForm.controls[DocumentConstant.ID_DOCUMENT_STATUS].value;
  }

  /* verify if the grid is in editing mode and can remove lines  */
  public checkLinesAreRemovable(dataItem?: any): any {
    if (this.itemForm.controls['IsForPos'] && this.itemForm.controls['IsForPos'].value && !this.fromCounterSales) {
      return false;
    }
    if (this.isFromDepositOrder || this.isAdvancePayement) {
      return false;
    }
    if (this.itemForm.controls['IdDocumentStatus'].value === this.DocumentStatusCode.PartiallySatisfied || this.itemForm.controls['IdDocumentStatus'].value === this.DocumentStatusCode.TotallySatisfied) {
      return false;
    }
    if (this.itemForm.controls['IsBToB'] &&
      this.itemForm.controls['IsBToB'].value && this.itemForm.controls['IdDocumentStatus'].value === this.DocumentStatusCode.DRAFT) {
      return false;
    }
    if (this.documentType == this.documentEnumerator.SalesInvoices && this.salesDocumentStatus == this.DocumentStatusCode.Valid) {
      return false;
    }
    if (this.salesDocumentStatus !== this.DocumentStatusCode.Balanced) {
      return dataItem.IsValidReservationFromProvisionalStock ? this.deleteDocumentLineRole : true;
    } else {
      return false;
    }
  }

  /* verify if the grid is in editing mode and can remove lines  */
  public get checkLinesRemovable(): any {
    return this.salesDocumentStatus !== this.DocumentStatusCode.Balanced;
  }

  /**
   * showAddButtonForSuperAdmin
   */
  public get showAddButtonForSuperAdmin() {
    return this.updateValidDocumentRole && !this.isInEditingMode &&
      (this.documentType === this.documentEnumerator.SalesDelivery || this.documentType === this.documentEnumerator.SalesQuotations
        || this.documentType === this.documentEnumerator.SalesOrder || this.documentType === this.documentEnumerator.SalesAsset
        || this.documentType === this.documentEnumerator.BS)
      && this.salesDocumentStatus === this.DocumentStatusCode.Valid;
  }

  public get showAddButton() {
    return !this.isEditedGrid && !this.isInEditingMode && (this.documentType !== this.documentEnumerator.PurchaseBudget
      || this.addNewLineInDevis) && this.salesDocumentStatus !== this.DocumentStatusCode.Valid;
  }

  ngOnInit(): void {
    this.buildStorageForm();
    this.isFromSearchItemInterfce = this.isFromSearchItem;
    this.isSalesDocument = true;
    this.docClickSubscription = this.renderer.listen('document', 'click', this.onDocumentClick.bind(this));
    this.selectionId = [];
    this.LoadDeleteMultipleDocumentLinesRole();
    this.LoadDeleteDocumentLineRole();
    this.getCompanyParams();
    this.updateDiscountRole = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.UPDATE_SALES_DISCOUNT);
    this.updatePriceRole = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.UPDATE_SALES_PRICE);
    // Import permissions
    this.importQuotationPermission_SA = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.IMPORT_QUOTATION_SALES);
    this.importOrderPermission_SA = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.IMPORT_ORDER_SALES);
    this.importDeliveryPermission_SA = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.IMPORT_DELIVERY_SALES);
    this.importInvoicePermission_SA = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.IMPORT_INVOICE_SALES);
    this.importAssetPermission_SA = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.IMPORT_ASSET_SALES);
    // List permissions
    this.listQuotationPermission_SA = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.LIST_QUOTATION_SALES);
    this.listOrderPermission_SA = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.LIST_ORDER_SALES);
    this.listDeliveryPermission_SA = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.LIST_DELIVERY_SALES);
    this.listInvoicePermission_SA = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.LIST_INVOICE_SALES);
    this.listAssetPermission_SA = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.LIST_ASSET_SALES);
  }

  public ShowLastItemInBLOperations() {
    this.ShowLastItemInBL.emit();
  }

  ngOnDestroy(): void {
    this.destroy();
  }

  openImport() {
    this.showOtherImport = false;
  }

  openOtherImport() {
    this.showOtherImport = true;
    if (this.importOtherDocumentLines) {
      this.importOtherDocumentLines.initGrid();
    } else {
      this.showGrid = true;
    }
  }

  /** This method is overridden */
  public manegeDocumentAfterImportResuslt(result: any) {
    if (result.objectData.IfLinesAreAlreadyImported === true && result.objectData.AlreadyImportedDocumentsCodes) {
      this.noImport = true;
      const errorMessage = this.translateService.instant(SharedConstant.ALREADY_IMPORTED_DOCUMENT)
        .replace('{'.concat('AlreadyImportedDocumentsCodes').concat('}'), result.objectData.AlreadyImportedDocumentsCodes);
      this.growlService.warningNotification(errorMessage);
      if (this.importOrderDocumentLines) {
        this.importOrderDocumentLines.ngOnInit();
      }
    } else {
      super.manegeDocumentAfterImportResuslt(result);
      this.noImport = false;
      if (this.closebutton) {
        this.closebutton.nativeElement.click();
      }
    }
  }

  /**Save the imported documentLine */
  public saveImportedOtherLine() {
    this.importedFromOtherData = true;
    if (this.importOtherDocumentLines && this.importOtherDocumentLines.selectedLineBsList) {
      if (this.itemForm.controls['Id'].value <= 0) {
        const document = this.itemForm.getRawValue();
        document.IdUsedCurrency = this.itemForm.controls['IdCurrency'].value;
        document.Code = '';
        this.documentService.saveCurrentDocument(document).subscribe(x => {
          this.itemForm.controls['Id'].setValue(x.Id);
          this.itemForm.controls['Code'].setValue(x.Code);
          this.itemForm.controls['IdDocumentStatus'].setValue(documentStatusCode.Provisional);
          this.itemForm.controls['IdTiers'].disable();
          super.setModalDetails(x);
          this.importOtherOperation(this.importOtherDocumentLines.selectedLineBsList);
        });
      } else {
        this.importOtherOperation(this.importOtherDocumentLines.selectedLineBsList);
      }
    }
  }

  public importOtherOperation(dataToImport) {
    const itemPrice = new ItemPrice(this.itemForm.controls['DocumentTypeCode'].value, this.itemForm.controls['DocumentDate'].value,
      this.itemForm.controls['IdTiers'].value, undefined, this.itemForm.controls['IdCurrency'].value,
      (this.itemForm.controls['DocumentTypeCode'].value ===
        DocumentEnumerator.SalesDelivery) ? this.itemForm.controls['hasSalesInvoices'].value : false, this.itemForm.controls['Id'].value,
      this.itemForm.controls['IdDocumentStatus'].value, dataToImport, InvoicingTypeEnumerator.Other);
    this.documentService.importLineToInvoiced(itemPrice).toPromise().then(x => {
      x.DocumentDate = new Date(x.DocumentDate);
      this.itemForm.patchValue(x);
      this.loadItems();
      this.documentTaxeResume.splice(0,);
      x.DocumentTaxsResume.forEach(element => {
        this.documentTaxeResume.push(element);
      });
    });

  }

  opentab() {
    const importBl = document.getElementById('home1');
    if (importBl) {
      importBl.className = 'tab-pane active show';
    }


    const importBlNav = document.getElementById('home1Nav');
    if (importBlNav) {
      importBlNav.className = 'nav-link active show';
      importBlNav['aria-selected'] = true;
    }

    const importOther = document.getElementById('home2');
    if (importOther) {
      importOther.className = 'tab-pane';
    }

    const importOtherNav = document.getElementById('home2Nav');
    if (importOtherNav) {
      importOtherNav.className = 'nav-link';
      importOtherNav['aria-selected'] = false;
    }
    this.openImport();
  }

  initImportOtherData() {
    if (this.importedFromOtherData) {
      const importOther = document.getElementById('home2');
      if (importOther) {
        importOther.className = 'tab-pane active show';
      }

      const importOtherNav = document.getElementById('home2Nav');
      if (importOtherNav) {
        importOtherNav.className = 'nav-link active show';
        importOtherNav['aria-selected'] = true;
      }
    }
  }

  public LoadDeleteMultipleDocumentLinesRole() {
    this.deleteMultipleLinesRole = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.DELETE_MULTIPLE_LINES_SALES);
  }

  public LoadDeleteDocumentLineRole() {
    this.deleteDocumentLineRole = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.DELETE_LINE_SALES);
  }

  public ShowAddBtn() {
    if (this.itemForm.controls['DocumentTypeCode'].value === DocumentEnumerator.SalesInvoices &&
      this.itemForm.controls['IdDocumentStatus'].value !== documentStatusCode.Provisional) {
      return false;
    } else if ((this.itemForm.controls['IdDocumentStatus'].value === documentStatusCode.Valid && !this.updateValidDocumentRole)
      ||
      (this.itemForm.controls['IdDocumentStatus'].value !== documentStatusCode.Provisional &&
        this.itemForm.controls['IdDocumentStatus'].value !== documentStatusCode.Valid)) {
      return false;
    } else if (this.itemForm.controls['IdDocumentStatus'].value === documentStatusCode.Valid && this.itemForm.controls['IsBToB'] && this.itemForm.controls['IsBToB'].value === true) {
      return false;
    } else if (this.itemForm.controls['IsForPos'] && this.itemForm.controls['IsForPos'].value && !this.fromCounterSales) {
      return false;
    }
    else {
      return true;
    }
  }
  public getCompanyParams() {
    this.serviceComany.getReducedDataOfCompany().subscribe((x: ReducedCompany) => {
      this.currentCompany = x;
    });
  }
  public setDiscount() {
    if (!this.saveLine && this.gridFormGroup) {
      let itemPrice;
      let documentLine;
      this.movementQtyFocusOut = true;
      documentLine = new DocumentLine(null, this.gridFormGroup.getRawValue());
      if (documentLine.MovementQty > 0) {
        itemPrice = new ItemPrice(this.documentType, this.itemForm.controls['DocumentDate'].value,
          this.itemForm.controls['IdTiers'].value, documentLine, this.itemForm.controls['IdCurrency'].value);
        if (this.movementQtyFocusOut) {
          if (this.gridFormGroup.controls['MovementQty'].value != this.oldQty && this.discountValueChanged) {
            this.swalWarrings.CreateSwal(`${this.translateService.instant('DISCOUNT')}`,
              `${this.translateService.instant('CALCULATE_DISCOUNT')}`,
              `${this.translateService.instant('YES')}`, `${this.translateService.instant('NO')}`).then((result) => {
                if (result.value) {
                  this.recalculateDiscount = false;
                  this.discountValueChanged = false;
                  if (itemPrice && itemPrice.DocumentLineViewModel && itemPrice.DocumentLineViewModel.IdItem &&
                    typeof (itemPrice.DocumentLineViewModel.IdItem) === 'number') {
                    this.documentService.getDiscountValue(itemPrice).subscribe(data => {
                      this.gridFormGroup.patchValue(data);
                      this.oldQty = this.gridFormGroup.controls['MovementQty'].value;
                    });
                  }
                } else {
                  this.recalculateDiscount = false;
                  this.discountValueChanged = false;
                  this.oldQty = this.gridFormGroup.controls['MovementQty'].value;
                }
              });
          } else if (this.gridFormGroup.controls['MovementQty'].value !== this.oldQty && !this.discountValueChanged) {
            this.recalculateDiscount = false;
            if (this.documentType && (this.documentType !== this.documentEnumerator.SalesInvoiceAsset ||
              (this.documentType === this.documentEnumerator.SalesInvoiceAsset && this.itemForm
                && this.itemForm.controls['isRestaurn'] && !this.itemForm.controls['isRestaurn'].value))) {
              if (itemPrice && itemPrice.DocumentLineViewModel && itemPrice.DocumentLineViewModel.IdItem &&
                typeof (itemPrice.DocumentLineViewModel.IdItem) === 'number') {
                this.documentService.getDiscountValue(itemPrice).subscribe(data => {
                  if (this.gridFormGroup) {
                    this.gridFormGroup.patchValue(data);
                  }
                });
              }
            }
            if (this.gridFormGroup) {
              this.oldQty = this.gridFormGroup.controls['MovementQty'].value;
            }
          } else {
            this.recalculateDiscount = false;
          }
        }
        this.recalculateDiscount = false;
        if (this.gridFormGroup) {
          this.oldQty = this.gridFormGroup.controls['MovementQty'].value;
        }
      }
    }
    this.movementQtyFocusOut = false;
  }

  public setQtys() {
    if (this.oldQty !== this.gridFormGroup.controls['MovementQty'].value) {
      this.recalculateDiscount = true;
    } else {
      this.recalculateDiscount = false;
    }
  }

  public discountChangeValue() {
    if (this.gridFormGroup.controls['DiscountPercentage'].value !== this.oldDiscountValue) {
      this.discountValueChanged = true;
    } else {
      this.discountValueChanged = false;
    }
  }

  showTaxeAmount(dataItem): boolean {
    if (dataItem.Taxe && dataItem.Taxe.length > 0) {
      return !dataItem.Taxe[0].IsCalculable;
    }
  }

  private loadItemsPicture(itemList: Item[]) {
    const itemsPicturesUrls = [];
    itemList.forEach((item: Item) => {
      itemsPicturesUrls.push(item.UrlPicture);
    });
    if (itemsPicturesUrls.length > NumberConstant.ZERO) {
      this.itemService.getPictures(itemsPicturesUrls, false).subscribe(itemsPictures => {
        this.fillItemsPictures(itemList, itemsPictures);
      });
    }
  }

  private fillItemsPictures(itemList, itemsPictures) {
    itemList.map((item: Item) => {
      if (item.UrlPicture) {
        const dataPicture = itemsPictures.objectData.find(value => value.FulPath === item.UrlPicture);
        if (dataPicture) {
          this.view.data.filter(elt => elt.IdItem === item.Id)[NumberConstant.ZERO].image =
            `${SharedConstant.PICTURE_BASE}${dataPicture.Data}`;
        }
      }
    });
  }
  buildStorageForm(documentLine? : any): FormGroup {
    this.warehouseFormGroup = this.formBuilder.group({
      Id: [0],
      IdWarehouse: [{ value: this.selectedIdWarehouse, disabled: false }],
      Shelf: [{ value: '', disabled: false }],
      IdStorage: [{ value: documentLine ? documentLine.IdStorage : '' , disabled: false }],
      IsDeleted: [false]
    });
    return this.warehouseFormGroup;
  }

  

get IdStorage(): FormControl {
    return <FormControl>this.warehouseFormGroup.get("IdStorage");
  }

  public onWarehouseSelect($event){
    if($event){
      this.selectedIdItem = this.gridFormGroup.controls['IdItem'].value;
      this.resetShelfDropDownValues();
      this.warehousePrevioisValue = this.selectedIdWarehouse;
      this.selectedIdWarehouse = $event.newValue;
      this.gridFormGroup.controls['IdWarehouse'].setValue($event.newValue);
      this.gridFormGroup.controls['IdStorage'].setValue('');
      if(!this.itemDropDown.itemComponent.dataItem){
        this.resetItemDropDownValues();
      }
    }
  }

  private resetShelfDropDownValues() {
    if (this.shelfDropdown) {
      this.shelfDropdown.listShelfsAndStorages = [];
      this.shelfDropdown.shelfComboBoxComponent.reset();
    }
  }

  private resetItemDropDownValues(){
    if(this.itemDropDown){
      this.itemDropDown.itemFiltredDataSource = [];
      this.itemDropDown.itemComponent.reset();
    }
  }

  public SelectShelf($event){
    this.gridFormGroup.controls['IdStorage'].setValue($event);
  }


}
