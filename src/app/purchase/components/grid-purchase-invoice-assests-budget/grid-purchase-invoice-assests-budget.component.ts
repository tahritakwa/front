import {
  Component, OnInit, Input, ViewChild, ViewContainerRef, Output, EventEmitter,
  HostListener, Renderer2, OnDestroy, ElementRef
} from '@angular/core';
import { GridGenericMethodsComponent } from '../../../shared/components/document/document-generic-method/generic-grid';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { GridComponent, GridDataResult, DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { DepotDropdownComponent } from '../../../shared/components/depot-dropdown/depot-dropdown.component';
import { ItemDropdownComponent } from '../../../shared/components/item-dropdown/item-dropdown.component';
import {
  ImportOrderDocumentLinesComponent
} from '../../../sales/components/import-order-document-lines/import-order-document-lines.component';
import { DocumentLine } from '../../../models/sales/document-line.model';
import { ItemPrice } from '../../../models/sales/item-price.model';
import { DocumentEnumerator, documentStatusCode } from '../../../models/enumerators/document.enum';
import { ValidationService } from '../../../shared/services/validation/validation.service';
import { DocumentFormService } from '../../../shared/services/document/document-grid.service';
import { DocumentService } from '../../../sales/services/document/document.service';
import { ActivatedRoute, Router } from '@angular/router';
import { WarehouseService } from '../../../inventory/services/warehouse/warehouse.service';
import { WarehouseItemService } from '../../../inventory/services/warehouse-item/warehouse-item.service';
import { SwalWarring } from '../../../shared/components/swal/swal-popup';
import { Warehouse } from '../../../models/inventory/warehouse.model';
import { DocumentLineUnitPrice } from '../../../models/sales/document-line-unit-price.model';
import { CrudGridService } from '../../../sales/services/document-line/crud-grid.service';
import { CostPrice } from '../../../models/purchase/cost-price.model';
import { CompanyService } from '../../../administration/services/company/company.service';
import { Company } from '../../../models/administration/company.model';
import { GrowlService } from '../../../../COM/Growl/growl.service';
import { TranslateService } from '@ngx-translate/core';
import { DocumentLinesWithPaging } from '../../../models/sales/document-lines-with-paging.model';
import { Currency } from '../../../models/administration/currency.model';
import { ModalDialogInstanceService } from 'ngx-modal-dialog/src/modal-dialog-instance.service';
import { SearchItemService } from '../../../sales/services/search-item/search-item.service';
import { TiersService } from '../../services/tiers/tiers.service';
import { KeyboardConst } from '../../../constant/keyboard/keyboard.constant';
import { Filter, PredicateFormat, Operation, Operator } from '../../../shared/utils/predicate';
import { GridSettings } from '../../../shared/utils/grid-settings.interface';
import { ListDocumentService } from '../../../shared/services/document/list-document.service';
import { MeasureUnitService } from '../../../shared/services/mesure-unit/measure-unit.service';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { StarkPermissionsService, StarkRolesService } from '../../../stark-permissions/stark-permissions.module';
import { RoleConfigConstant } from '../../../Structure/_roleConfigConstant';
import { ReducedCompany } from '../../../models/administration/reduced-company.model';
import { DocumentTaxsResume } from '../../../models/sales/document-Taxs-Resume.model';
import { ItemConstant } from '../../../constant/inventory/item.constant';
import { MediaConstant } from '../../../constant/utility/Media.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { Item } from '../../../models/inventory/item.model';
import { ItemService } from '../../../inventory/services/item/item.service';
import { listener } from '@angular/core/src/render3/instructions';
import { isNullOrUndefined } from 'util';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { LocalStorageService } from '../../../login/Authentification/services/local-storage-service';
import { DocumentType } from '../../../models/sales/document-type.model';
import { UserWarehouseService } from '../../../inventory/services/user-warehouse/user-warehouse.service';
import { ShelfDropdownComponent } from '../../../shared/components/shelf-dropdown/shelf-dropdown.component';
import { DocumentConstant } from '../../../constant/sales/document.constant';
import { AccountsConstant } from '../../../constant/accounting/account.constant';

@Component({
  selector: 'app-grid-purchase-invoice-assests-budget',
  templateUrl: './grid-purchase-invoice-assests-budget.component.html',
  styleUrls: ['./grid-purchase-invoice-assests-budget.component.scss']
})

export class GridPurchaseInvoiceAssestsBudgetComponent extends GridGenericMethodsComponent implements OnInit, OnDestroy {

  public FormatNumber = SharedConstant.NUMBER_FORMAT;
  @ViewChild('DiscountPercentage') DiscountPercentage: ElementRef;
  @ViewChild('MovementQty') MovementQty: ElementRef;
  @ViewChild('HtUnitAmountWithCurrency') HtUnitAmountWithCurrency: ElementRef;
  @ViewChild('TaxeAmount') TaxeAmount: ElementRef;
  /**event emit to calculate cost price*/
  // @Output() CalculateCostPrice = new EventEmitter<boolean>();
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
  /**showing search field */
  @Input() showSearch = true;

  @Input() addNewLineInDevis: boolean;

  @Input() isEditedGrid: boolean;

  @Input() updateValidDocumentRole;
  @Input() showAndUpdate = true;
  // format currency
  @Input() formatOption;
  @Input() enableQty;
  @Input() documentsLine;
  @Input() documentTaxeResume: DocumentTaxsResume[];
  @Output() saveQuotationInPriceRequest: EventEmitter<any> = new EventEmitter<any>();
  @Output() isChangedDocumentLine: EventEmitter<any> = new EventEmitter<any>();
  @Output() saveDocumentLineQuotation: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild(GridComponent) public grid: GridComponent;
  @ViewChild(DepotDropdownComponent) childWerehouse;
  @ViewChild(ItemDropdownComponent) itemDropDown;
  @ViewChild(ImportOrderDocumentLinesComponent) importOrderDocumentLines;
  @ViewChild('closebutton') closebutton;
  @Output() reloadDataAfterReplace: EventEmitter<any> = new EventEmitter<any>();

  /**
    * Grid settingsproprety
    */
  public gridSettings: GridSettings = this.documentListService.documentLineGridSettings;
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
  documentEnumerator: DocumentEnumerator = new DocumentEnumerator();
  /** Define if the document of type sales or purchase */
  isSalesDocument: boolean;

  articleReference = '';

  public hideSearch = false;
  costPriceData: CostPrice;
  /** tiersAssociatedToItems will be changed if its a purchase document and the supplier has been selected */
  tiersAssociatedToItems: number[];
  public warehouseInstance: DepotDropdownComponent;
  private isEditedItem: boolean;


  predicate: PredicateFormat;
  filteredview: GridDataResult;
  public IsRemovedLine: boolean;
  public IsToOpenModal: boolean;
  public selectedRowOfReplaceItem;
  public dataOfSelectedRow;
  public filter: { // Initial filter descriptor
    logic: 'and',
    filters: Filter[]
  };
  public deleteMultipleLinesRole: boolean;
  public deleteLineRole: boolean;
  remplacementItemFormGroup: FormGroup;
  public notShowButton = false;
  currentCompany: ReducedCompany;
  public importDocumentPermission_PU = false;
  public updateDiscountRole = false;
  public updatePriceRole = false;
  public isFromDeleteLine = false;
  @Input() fromPriceRequest = false;
  public removeLine = false;
  hasAddItemPermission = false;
  public userEmail : string;
  public selectedIdWarehouse = NumberConstant.ZERO;
  public warehouseFormGroup : FormGroup;
  @ViewChild("depoDropdown") private depoDropdown: DepotDropdownComponent;
  @ViewChild("shelfDropdown") private shelfDropdown: ShelfDropdownComponent;
  public array : FormArray;
  @Input() hasDefaultWarehouse: boolean;

  constructor(protected service: CrudGridService, public validationService: ValidationService,
    public documentFormService: DocumentFormService, public documentService: DocumentService,
    public viewRef: ViewContainerRef, protected router: Router,
    protected activatedRouter: ActivatedRoute,
    protected warehouseService: WarehouseService, protected warehouseItemService: WarehouseItemService,
    protected formBuilder: FormBuilder, protected swalWarrings: SwalWarring, protected serviceComany: CompanyService, protected localStorageService: LocalStorageService,
    protected growlService: GrowlService, protected translateService: TranslateService, protected searchItemService: SearchItemService,
    protected renderer: Renderer2, protected tiersService: TiersService,
    protected fb: FormBuilder, protected modalService: ModalDialogInstanceService,
    public documentListService: ListDocumentService, protected measureUnitService: MeasureUnitService,
    protected permissionsService: StarkPermissionsService, protected rolesService: StarkRolesService, public itemService: ItemService,
    public authService: AuthService, protected userWarehouseService : UserWarehouseService) {
    super(service, validationService, documentFormService,
      documentService, viewRef, router, searchItemService, warehouseService, warehouseItemService,
      formBuilder, growlService, translateService, tiersService, swalWarrings, measureUnitService, serviceComany, localStorageService);
    this.warehouseInstance = new DepotDropdownComponent(this.warehouseService, this.warehouseItemService);
    this.warehouseInstance.initDataSource();
    this.isSalesDocument = false;
    this.userEmail = this.localStorageService.getEmail();
        this.userWarehouseService.getWarehouse(this.userEmail).subscribe(x => {
            this.defaultWarehouse = x.objectData;
            this.selectedIdWarehouse = x.objectData.Id;
            this.warehousePrevioisValue = x.objectData.Id
        });
  }

  @HostListener('keyup', ['$event'])
  keyEvent(event) {
    let selectedIndex: number;
    let OpenLineIndex: number;
    // get data from grid
    const dataGrid = this.grid.data as { data, total };
    if (dataGrid) {
      this.callNexTLine(dataGrid, event, selectedIndex, OpenLineIndex, false);
    }
    this.closeLine(event);
    if (event.key === KeyboardConst.F2) {
      this.openHistory();
    }
    // used to prevent saveCurrent to be executed many times when using "tab" key instaed of "enter"
    if (event.key === KeyboardConst.ENTER && document.activeElement.id !== 'btnSave') {
      this.saveCurrent();
    }
  }



  public ifCanYouMoveToNexLine(): boolean {
    return this.documentType !== DocumentEnumerator.PurchaseBudget || this.addNewLineInDevis !== true;
  }

  public ngOnInit(): void {
    this.buildStorageForm();
    this.hasAddItemPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.ADD_ITEM_STOCK);
    if (this.documentType === this.documentEnumerator.PurchaseFinalOrder) {
      this.importDocumentPermission_PU = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.IMPORT_ORDER_PURCHASE)
        && this.authService.hasAuthority(PermissionConstant.CommercialPermissions.LIST_ORDER_QUOTATION_PURCHASE);
    } else if (this.documentType === this.documentEnumerator.PurchaseDelivery) {
      this.importDocumentPermission_PU = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.IMPORT_FINAL_ORDER_PURCHASE)
        && this.authService.hasAuthority(PermissionConstant.CommercialPermissions.LIST_FINAL_ORDER_PURCHASE);
    } else if (this.documentType === this.documentEnumerator.PurchaseInvoices) {
      this.importDocumentPermission_PU = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.IMPORT_RECEIPT_PURCHASE)
        && this.authService.hasAuthority(PermissionConstant.CommercialPermissions.LIST_RECEIPT_PURCHASE);
    } else if (this.documentType === this.documentEnumerator.PurchaseAsset) {
      this.importDocumentPermission_PU = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.IMPORT_INVOICE_PURCHASE)
        && this.authService.hasAuthority(PermissionConstant.CommercialPermissions.LIST_INVOICE_PURCHASE);
    }
    this.selectionId = [];
    this.docClickSubscription = this.renderer.listen('document', 'click', this.onDocumentClick.bind(this));
    this.format = this.formatOption;
    this.isSalesDocument = false;

    this.gridSettings.state.skip = 0;
    this.gridSettings.state.filter.filters = [];
    this.gridSettings.gridData = {
      data: [],
      total: 0
    };
    this.LoadDeleteMultipleDocumentLinesRole();
    this.LoadDeleteDocumentLineRole();
    this.getCompanyParams();
    this.updateDiscountRole = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.UPDATE_PURCHASE_DISCOUNT);
    this.updatePriceRole = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.UPDATE_PURCHASE_PRICE);

  }




  /** Add new DocumentLine */
  public addDocumentLine({ sender, rowIndex, columnIndex, dataItem, isEdited }) {
    this.selectedIdWarehouse = this.defaultWarehouse.Id;
    if(this.documentType === DocumentEnumerator.PurchaseAsset){
      this.hasDefaultWarehouse = true;
    }
    if (this.itemForm.valid || this.itemForm.status === 'DISABLED') {
      if ((isEdited || (this.gridFormGroup && !this.gridFormGroup.valid)
        || this.isEdited) || !this.ShowAddBtn()
        || (this.documentService.documentHasExpense &&
          this.itemForm.controls['DocumentTypeCode'].value === DocumentEnumerator.PurchaseDelivery)) {
        return;
      } else {
        this.format = this.formatOption;
        this.openNewLine();
        this.editedRowIndex = rowIndex;
        this.dataItem = dataItem;
        this.gridObject = undefined;
      }
    } else {
      this.validationService.validateAllFormFields(this.itemForm);
    }
  }

  /* on click documentline grid cell */
  public documentLineClickHandler({ isEdited, dataItem, rowIndex }, SetedValue?: boolean, data?: any): void {
    if(this.documentService.documentHasExpense) {
      this.growlService.ErrorNotification(this.translateService.instant('EXISTING_EXPENSE_LIST'));
    }else if (!this.removeLine) {
      if ((((isEdited || (this.gridFormGroup && !this.gridFormGroup.valid) || this.isInEditingMode)) 
        || (this.isEditedGrid && (dataItem.IdDocumentLineStatus !== documentStatusCode.Provisional &&  dataItem.IdDocumentLineStatus !== documentStatusCode.DRAFT))) 
      || this.IsRemovedLine || this.IsToOpenModal || this.documentService.documentHasExpense) {
        this.IsRemovedLine = false;
        this.IsToOpenModal = false;
        this.dataOfSelectedRow = dataItem;
        this.documentLineClickHandlerSuperAdmin(isEdited, dataItem, rowIndex, SetedValue, data);
        return;
      } else {
        if (!this.isFromDeleteLine && this.showAndUpdate) {
          this.isAfterSave = false;
          this.format = this.formatOption;
          this.dataItem = dataItem;
          this.isEditedItem = false;
          this.createFormOnCellHandler({ isEdited, dataItem, rowIndex }, SetedValue, data);
          this.gridFormGroup.controls['IdItem'].disable();
          this.hideSearch = true;
          this.editedRowIndex = rowIndex;
          this.grid.editRow(rowIndex, this.gridFormGroup);
          this.gridObject = undefined;
        }
        this.isFromDeleteLine = false;
      }
      if (dataItem.Taxe) {
        if (dataItem.Taxe[0].IsCalculable) {
          this.gridFormGroup.controls['TaxeAmount'].disable();
        } else {
          this.gridFormGroup.controls['TaxeAmount'].enable();
        }
      }
    }
    this.removeLine = false;
  }
  public doCellInit = (dataItem, isEdited, rowIndex, SetedValue, data) => {
    this.isAfterSave = false;
    this.format = this.formatOption;
    this.dataItem = dataItem;
    this.isEditedItem = false;
    this.createFormOnCellHandler({ isEdited, dataItem, rowIndex }, SetedValue, data);
    this.gridFormGroup.controls['IdItem'].disable();
    this.hideSearch = true;
    this.editedRowIndex = rowIndex;
    this.grid.editRow(rowIndex, this.gridFormGroup);
    this.gridObject = undefined;
  }


  // used to focus and navigate between input in the grid
  elementFocusOut(inoutValue: string) {
    const inputElem = <HTMLInputElement>this[inoutValue].inputOne.nativeElement;
    if (inputElem) {
      inputElem.focus();
    }
  }
  discountPercentageArrowRigthPress() {
    if ((this.isDropDownExist() && document.getElementsByClassName('k-dropdown-wrap k-state-default')[2])) {
      const warehouse = document.getElementsByName('WarehouseName')[0].getElementsByClassName('k-input')[0] as any;
      warehouse.focus();
    }
  }
  /** DiscountPercentage key press end */


  public getCompanyParams() {
    this.serviceComany.getReducedDataOfCompany().toPromise().then(async (x: ReducedCompany) => {
      this.currentCompany = x;
      await new Promise(resolve => resolve(
        this.addTiersAssociated(x)
      ));
    });
  }

  private async addTiersAssociated(result) {
    this.tiersAssociatedToItems = new Array<number>();
    if (result.PurchaseAllowItemRelatedToSupplier && !isNullOrUndefined(this.itemForm)) {
      this.tiersAssociatedToItems.push(this.itemForm.controls['IdTiers'].value);
    }
  }

  createFormOnCellHandler({ isEdited, dataItem, rowIndex }, SetedValue?: boolean, data?: any) {
    this.isNew = false;
    this.isEdited = true;
    this.createFormGroup(dataItem);
    this.editedRowIndex = rowIndex;
  }

  /* * close grid edit cell */
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
    this.showImportLines = false;
    this.showItemControlMessage = false;
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
    }
  }

  ifSalesDocumentInSaveCurrent(data: DocumentLine) {
    if (this.gridFormGroup.controls['IdItem'] &&
      this.gridFormGroup.controls['IdItem'].value !== null) {
      const selectedWarehouse: Warehouse = this.warehouseInstance.getSelectedWarehouse();
      this.docLine = new DocumentLine(this.gridFormGroup.controls['IdItem'].value,
        this.gridFormGroup.getRawValue(), null, selectedWarehouse);
    }
    this.gridFormGroup.patchValue(this.docLine);
    this.showImportLines = true;
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
        const indexId = this.selectionId.findIndex(x => x === dataItem.Id);
        if (indexId > -1) {
          this.selectionId.splice(indexId);
        }
        dataItem.IsDeleted = true;
        this.IsRemovedLine = true;
        if (this.documentType === DocumentEnumerator.PurchaseDelivery) {
          this.service.costData = this.service.costData.filter(x => x.Id !== dataItem.Id);
        }
        if (dataItem.Id > 0) {
          this.saveCurrentLineinRealTime(dataItem, true);
        }
      }
    });
    this.closeLineOperation();

  }

  //#region  implemanting methods
  setItemService(): void {
    this.docLinePrices = new DocumentLineUnitPrice(this.itemForm.controls['IdCurrency'].value,
      this.documentType, this.gridFormGroup.getRawValue());
  }

  /**verify form validation before import documentLine */
  checkImportBL() {
    if (this.itemForm.valid || this.itemForm.status === SharedConstant.DISABLED) {
      this.noImport = true;
      if (this.importOrderDocumentLines) {
        this.importOrderDocumentLines.ngOnInit();
      }
    } else {
      this.validationService.validateAllFormFields(this.itemForm);
      this.noImport = false;
    }
  }

  saveCurrentLineWithDocument(data: DocumentLine, isRemoved: boolean) {
    const isNewObject = this.isNew;
    this.closeLineOperation();
    if (!isRemoved &&
      (this.documentType !== DocumentEnumerator.PurchaseDelivery && this.documentType !== DocumentEnumerator.PurchaseBudget)
      || this.addNewLineInDevis === true) {
      if (isNewObject) {
        this.openNewLine(true);
      }
    }
  }

  openNewLine(IsToRefreshItemDropDown?: boolean) {
    if (this.itemDropDown && IsToRefreshItemDropDown) {
      this.itemDropDown.clearValueOfSearch();
      this.itemDropDown.initDataSource();
    }
    if (this.itemForm.controls['DocumentTypeCode'].value
      !== DocumentEnumerator.PurchaseBudget || this.addNewLineInDevis) {
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
    }
    if (this.itemForm.controls['Id'].value <= 0) {
      this.saveDocumentAfterChoosingSupplier(true);
    }
  }

  /**
   * focusOnTiersSelect
   */
  public focusOnAddLineButton() {
    if (this.itemForm.valid) {
      if (((this.gridFormGroup && !this.gridFormGroup.valid) || this.isEdited)
        || this.isEditedGrid || this.documentService.documentHasExpense) {
        return;
      } else {
        this.format = this.formatOption;
        if (this.itemForm.controls['DocumentTypeCode'].value !== DocumentEnumerator.PurchaseDelivery) {
          this.openNewLine();
        }
        this.editedRowIndex = undefined;
        this.dataItem = undefined;
      }
    } else {
      this.validationService.validateAllFormFields(this.itemForm);
    }
  }

  public documentGridSetValues() {
    let documentType = this.itemForm.controls['DocumentTypeCode'].value;
    let idTier = this.itemForm.controls['IdTiers'].value;
    let documentLine = this.gridFormGroup.getRawValue();
    if (typeof (documentLine.IdItem) === 'number') {
      if (!this.currentCompany.AllowRelationSupplierItems && documentType != this.documentEnumerator.BE && documentType != this.documentEnumerator.BS) {
        if (idTier && documentLine && documentLine.IdItem) {
          this.documentService.isAnyRelationSupplierWithItem(idTier, documentLine.IdItem).subscribe(x => {
            if (x.objectData === false) {
              this.swalWarrings.CreateSwal(this.translateService.instant('NO_RELATION_BETWEEN_SUPPLIER_AND_ITEM')
                , null, this.translateService.instant('CREATE_RELATION')).then((result) => {
                  if (result.value) {
                    this.saveCurrentLineinRealTime();
                  }
                });
            } else {
              this.saveCurrentLineinRealTime();
            }
          });
        }
      } else {
        this.saveCurrentLineinRealTime();
      }
    } else {
      this.growlService.ErrorNotification(this.translateService.instant('ITEM_NON_SELECTED'));
    }
   
  }

  openButtonSearchInItemDropDown() {
    this.hideSearch = false;
    if (this.itemDropDown) {
      this.itemDropDown.activeKeyPress = true;
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
      this.closebutton.nativeElement.click();
    }
  }

  public opneNextLineWithKeyBoard() {
    if (this.ifCanYouMoveToNexLine() && this.gridObject) {
      this.documentLineClickHandler(this.gridObject);
    }
  }
  private loadItemsPicture(itemList: Item[]) {
    var itemsPicturesUrls = [];
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
        let dataPicture = itemsPictures.objectData.find(value => value.FulPath === item.UrlPicture);
        if (dataPicture) {
          this.view.data.filter(elt => elt.IdItem === item.Id)[NumberConstant.ZERO].image = `${SharedConstant.PICTURE_BASE}${dataPicture.Data}`;
        }
      }
    });
  }

  public loadItems(linesDeletedNumber?: number, loadWithoutSaveDocumentLine?: boolean): void {

    if (this.view && linesDeletedNumber && linesDeletedNumber >= 0 && this.view.data.length - linesDeletedNumber <= 0 &&
      this.gridSettings.state.skip > 0) {
      this.gridSettings.state.skip = this.gridSettings.state.skip - this.gridSettings.state.take;
    }
    this.grid.loading = true;
    const documentLinesWithPaging = new DocumentLinesWithPaging(this.itemForm.controls['Id'].value, this.gridSettings.state.take,
      this.gridSettings.state.skip, null, null, false, this.predicate);
    documentLinesWithPaging.RefDescription = this.articleReference;
    this.documentService.getDocumentLinesWithPaging(documentLinesWithPaging).subscribe((x: any) => {
      this.isContainsLines = x.isContainsLines;
      var itemList = x.data.map(elt => elt.IdItemNavigation);
      this.loadItemsPicture(itemList);
      this.view = {
        data: x.data,
        total: x.total
      };
      if (this.itemForm.controls['DocumentTypeCode'] && this.itemForm.controls['DocumentTypeCode'].value === DocumentEnumerator.PurchaseInvoices && this.view.total === 0) {
        this.itemForm.controls['ExchangeRate'].enable();
      }
      if (this.articleReference === '') {
        this.clearfilterfield();
      } else {
        this.filteritem();
      }
      this.getItemsOperation(loadWithoutSaveDocumentLine);
      this.grid.loading = false;

    });
  }

  getItemsOperation(loadWithoutSaveDocumentLine) {
    this.enableOrDisableTiers();
    this.saveQuotationInPriceRequest.emit(this.view.data);
    if (this.documentType === DocumentEnumerator.PurchaseOrder) {
      this.isChangedDocumentLine.emit();
    }
    if (this.documentType === DocumentEnumerator.PurchaseBudget && loadWithoutSaveDocumentLine) {
      this.closeEditor();
    }
    this.opneNextLineWithKeyBoard();
  }

  AssignValues(data: DocumentLine, loadWithoutSaveDocumentLine: boolean) {
    Object.assign(this.filteredview.data.find(({ Id }) => Id === data.Id), data);
    this.gridSettings.gridData = this.filteredview;
    this.getItemsOperation(loadWithoutSaveDocumentLine);
  }

  public onItemSearch() {
    this.skip = 0;
    this.filteritem();
  }

  filteritem() {
    const docLineToReference = new DocumentLinesWithPaging(this.itemForm.controls['Id'].value,
      this.pageSize, this.skip, null, null, false);
    if (this.articleReference !== undefined) {
      docLineToReference.RefDescription = this.articleReference.toUpperCase();
    } else {
      docLineToReference.RefDescription = '';
    }
    this.documentService.GetSearchDocumentLineResult(docLineToReference).subscribe(x => {
      this.filteredview = {
        data: x.data,
        total: x.total
      };
      this.gridSettings.gridData = this.filteredview;
    });
  }

  showaction(event?) {
    if (event.data === undefined) {
      this.clearfilterfield();
    }

  }

  public clearfilterfield() {
    this.articleReference = '';
    this.filteredview = this.view;
    this.gridSettings.gridData = this.filteredview;
  }

  /** show quantity details */
  openModalOfReplaceItem(IdItem, Description) {
    this.IsToOpenModal = true;
    this.createRemplacementItemFormGroup();
    this.remplacementItemFormGroup.controls['Description'].setValue(Description);
    this.selectedRowOfReplaceItem = true;

  }

  /**
    * create main form
    */
  private createRemplacementItemFormGroup(): void {
    this.remplacementItemFormGroup = this.fb.group({
      Id: [0],
      Code: ['', [Validators.required]],
      Description: ['', [Validators.required]]
    });
  }

  public saveRemplacementItem() {
    if (this.remplacementItemFormGroup.valid) {
      this.selectedRowOfReplaceItem = false;
      this.documentService.saveRemplacementItem(this.dataOfSelectedRow.IdItem,
        this.remplacementItemFormGroup.controls['Code'].value,
        this.remplacementItemFormGroup.controls['Description'].value, this.dataOfSelectedRow.Id).subscribe(() => {
          this.reloadDataAfterReplace.emit();
          if (this.fromPriceRequest) {
            this.loadItems();
          }
        });
    } else {
      this.validationService.validateAllFormFields(this.remplacementItemFormGroup);
    }

  }

  getselectedRowOfReplaceItem(): boolean {
    return this.selectedRowOfReplaceItem;
  }

  public dataStateChange(state: DataStateChangeEvent): void {
    this.gridSettings.state = state;
    this.skip = this.gridSettings.state.skip;
    this.predicate = new PredicateFormat();
    this.predicate.Filter = new Array<Filter>();
    if (this.gridSettings.state.filter.filters.length > 0) {
      this.gridSettings.state.filter.filters.forEach((element: any) => {
        const o = Operation[element.operator] as any;
        if (element.field !== 'RefItem' && element.field !== 'IdItem') {
          this.predicate.Filter.push(new Filter(element.field, o, element.value));
        } else if (element.field === 'IdItem') {
          this.predicate.Filter.push(new Filter('IdItemNavigation.Code', o, element.value));
        } else if (element.field === 'RefItem') {
          this.predicate.Filter.push(new Filter('Designation', o, element.value, false, true));
          this.predicate.Filter.push(new Filter('IdItemNavigation.Code', o, element.value, false, true));
          this.predicate.Operator = Operator.and;
        } else {
          this.predicate.Filter.push(new Filter(element.field, o, element.value));
        }
      });
    }
    this.loadItems();
  }

  ngOnDestroy(): void {
    this.destroy();
    this.filteredview = {
      data: [],
      total: 0
    };
    this.view = {
      data: [],
      total: 0
    };
    this.gridSettings.state.skip = 0;
    this.gridSettings.state.filter.filters = [];
    this.gridSettings.gridData = {
      data: [],
      total: 0
    };
  }

  setWarehouseIfSalesDocument() { }

  refreshDepotDropdownValues(idItem : number){
    if(this.documentType === DocumentEnumerator.PurchaseAsset){
      this.depoDropdown.warehouseDataSourceFiltred = [];
    this.depoDropdown.initDataSource();
    this.itemService.getById(idItem).subscribe(item => {
      let warehousesIds = item.ItemWarehouse.map(x => x.IdWarehouse);
      this.depoDropdown.warehouseDataSourceFiltred = this.depoDropdown.warehouseDataSourceFiltred.filter(depot => warehousesIds.includes(depot.Id));
    });
    }
  }
  public onCloseSearchFetchModal(data) { }
  public openHistory() { }
  public LoadDeleteMultipleDocumentLinesRole() {
    this.deleteMultipleLinesRole = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.DELETE_MULTIPLE_LINES_PURCHASE);
  }
  public LoadDeleteDocumentLineRole() {
    this.deleteLineRole = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.DELETE_LINE_PURCHASE);
  }
  public ShowAddBtn() {
    if ((this.itemForm.controls['IdDocumentStatus'].value === documentStatusCode.Valid && !this.updateValidDocumentRole)
      ||
      (this.itemForm.controls['IdDocumentStatus'].value !== documentStatusCode.Provisional &&
        this.itemForm.controls['IdDocumentStatus'].value !== documentStatusCode.Valid)
      || (this.itemForm.controls['DocumentTypeCode'].value !== DocumentEnumerator.PurchaseFinalOrder &&
        this.itemForm.controls['DocumentTypeCode'].value !== DocumentEnumerator.PurchaseOrder &&
        this.itemForm.controls['DocumentTypeCode'].value !== DocumentEnumerator.BE &&
        this.itemForm.controls['IdDocumentStatus'].value !== documentStatusCode.Provisional)) {
      return false;
    } else {
      return true;
    }
  }
  showTaxeAmount(dataItem): boolean {
    if (dataItem.Taxe && dataItem.Taxe.length > 0) {
      return !dataItem.Taxe[0].IsCalculable;
    }
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
    this.selectedIdItem = this.gridFormGroup.controls['IdItem'].value;
      if(this.documentType === DocumentEnumerator.PurchaseDelivery){
        this.documentService.checkReservedLines(this.itemForm.controls['Id'].value).subscribe(x => {
          if(x.objectData !== ""){
            var swalWarningMessage = `${this.translateService.instant(DocumentConstant.TEXT_BUTTON_SWAL_WARRING_RESERVED_LINES)}`
            var newMessage = swalWarningMessage.replace('BLCODE', x.objectData);
            this.swalWarrings.CreateSwal(newMessage, AccountsConstant.ARE_YOU_SURE).then((result) => {
                if (result.value) {
                  if($event){
                    this.warehousePrevioisValue = this.selectedIdWarehouse;
                      this.resetShelfDropDownValues();
                      this.selectedIdWarehouse = $event.newValue;
                      this.gridFormGroup.controls['IdStorage'].setValue('');
                      if(this.itemDropDown && this.itemDropDown.itemComponent && !this.itemDropDown.itemComponent.dataItem){
                        this.resetItemDropDownValues();
                      }
                    }
                }
                else {
                    this.warehouseFormGroup.controls['IdWarehouse'].setValue(this.warehousePrevioisValue);
                    this.gridFormGroup.controls['IdWarehouse'].setValue(this.warehousePrevioisValue);
                }
            })
        }
        else {
          if($event){
          this.resetShelfDropDownValues();
          this.warehousePrevioisValue = this.selectedIdWarehouse;
          this.selectedIdWarehouse = $event.newValue;
          this.gridFormGroup.controls['IdStorage'].setValue('');
          if(this.itemDropDown && this.itemDropDown.itemComponent && !this.itemDropDown.itemComponent.dataItem){
            this.resetItemDropDownValues();
          }
        }
        }
        });
      }
      else {
        if($event){
        this.resetShelfDropDownValues();
        this.warehousePrevioisValue = this.selectedIdWarehouse;
        this.selectedIdWarehouse = $event.newValue;
        this.gridFormGroup.controls['IdStorage'].setValue('');
        if(this.itemDropDown && this.itemDropDown.itemComponent && !this.itemDropDown.itemComponent.dataItem){
          this.resetItemDropDownValues();
        }
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
