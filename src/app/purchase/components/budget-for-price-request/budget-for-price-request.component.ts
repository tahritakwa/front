import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { GridComponent, SelectableSettings, GridDataResult, PageChangeEvent, SelectAllCheckboxState } from '@progress/kendo-angular-grid';
import { ItemPricesResult, DocumentLine } from '../../../models/sales/document-line.model';
import { DocumentLineUnitPrice } from '../../../models/sales/document-line-unit-price.model';
import { DocumentService } from '../../../sales/services/document/document.service';
import { ItemDropdownComponent } from '../../../shared/components/item-dropdown/item-dropdown.component';
import { ItemPrice } from '../../../models/sales/item-price.model';
import { Warehouse } from '../../../models/inventory/warehouse.model';
import { DepotDropdownComponent } from '../../../shared/components/depot-dropdown/depot-dropdown.component';
import { ValidationService } from '../../../shared/services/validation/validation.service';
import { DocumentConstant } from '../../../constant/sales/document.constant';
import { DocumentLineForPriceRequest } from '../../../models/sales/document-line-price-request';
import { DocumentFormService } from '../../../shared/services/document/document-grid.service';
import { WarehouseService } from '../../../inventory/services/warehouse/warehouse.service';
import { WarehouseItemService } from '../../../inventory/services/warehouse-item/warehouse-item.service';
import { SupplierDropdownComponent } from '../../../shared/components/supplier-dropdown/supplier-dropdown.component';
import { DocumentLineWithSupplier } from '../../../models/purchase/document-line-with-supplier.model';
import { PriceRequestService } from '../../services/price-request/PriceRequestService';
import swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';
import { PurchaseRequestConstant } from '../../../constant/purchase/purchase-request.constant';
import { DocumentEnumerator } from '../../../models/enumerators/document.enum';
import { GrowlService } from '../../../../COM/Growl/growl.service';
import { Document } from '../../../models/sales/document.model';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { PermissionConstant } from '../../../Structure/permission-constant';

@Component({
  selector: 'app-budget-for-price-request',
  templateUrl: './budget-for-price-request.component.html',
  styleUrls: ['./budget-for-price-request.component.scss']
})
export class BudgetForPriceRequestComponent implements OnInit {

  /**document form group */
  @Input() documentForm: FormGroup;

  /**document type Invoice, Assets */
  @Input() documentType: string;

  @Input() id: number;

  /**documentUrl type Add, Edit, Show */
  @Input() isEditedGrid: boolean;
  public gridData: DocumentLine[] = new Array<DocumentLine>();
  public view: GridDataResult;
  @ViewChild(GridComponent) private grid: GridComponent;
  @ViewChild('multiselectItem') public itemDropDownMultiselect: ItemDropdownComponent;
  @ViewChild(ItemDropdownComponent) itemDropDown;
  @ViewChild('multiselectSupplier') public supplierDropDown: SupplierDropdownComponent;
  @Input() showUpdateOrderPermission: boolean = false;
  public gridFormGroup: FormGroup;
  filterFormGroup: FormGroup;
  isEdited: boolean;
  isEditedItem: boolean;
  isNew: boolean;
  editedRowIndex: number;
  dataItem: DocumentLineForPriceRequest;
  documentLine: DocumentLineForPriceRequest;
  public docLine: DocumentLineForPriceRequest;
  itemPrice: ItemPrice;
  /**docment line prices  */
  public itemPricesResult: ItemPricesResult;
  // document line total prices
  public docLinePrices: DocumentLineUnitPrice;
  public warehouseInstance: DepotDropdownComponent;
  public selectableSettings: SelectableSettings;
  public listSupplierToFilter: number[] = [];
  public listItemToFilter: number[] = [];
  public listQuotationToFilter: string[] = [];
  public mySelection: number[] = [];
  public selectAllState: SelectAllCheckboxState = 'unchecked';
  public pageSize = 5;
  public skip = 0;
  generatedList: DocumentLine[] = [];
  public currentDocuments: Document[];
  public listOfFiltredgridData: DocumentLine[] = new Array<DocumentLine>();
  @Output() generateBC: EventEmitter<any> = new EventEmitter();

  @Output() redirectToQuotationTab: EventEmitter<any> = new EventEmitter();
  public quotationDataSource: DocumentLine[] = new Array<DocumentLine>();
  public quotationFiltredDataSource: DocumentLine[] = new Array<DocumentLine>();
  public quotationSelected: any;
  public haveGenerateInvvoicePermission: boolean;

  constructor(private formBuilder: FormBuilder, public documentService: DocumentService, public validationService: ValidationService,
    public documentFormService: DocumentFormService, private warehouseService: WarehouseService,
    private warehouseItemService: WarehouseItemService, private priceRequestService: PriceRequestService,
    private translate: TranslateService, private growlService: GrowlService , public authService: AuthService) {
    this.warehouseInstance = new DepotDropdownComponent(this.warehouseService, this.warehouseItemService);
    this.warehouseInstance.initDataSource();
  }


  ngOnInit() {
    this.haveGenerateInvvoicePermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.GENERATE_INVOICE_PRICEREQUEST);
    this.loadItems();
  }
  public loadItems(): void {
    this.view = {
      data: this.gridData.slice(this.skip, this.skip + this.pageSize),
      total: this.gridData.length
    };
  }
  public pageChange(event: PageChangeEvent): void {
    this.skip = event.skip;
    this.filterList(this.skip);
  }

  public onSelectedKeysChange(e?) {
    const len = this.mySelection.length;
    let lenListInGrid = 0;
    if (this.listItemToFilter.length == 0 && this.listSupplierToFilter.length == 0 && this.listQuotationToFilter.length == 0) {
      lenListInGrid = this.gridData.map((item) => item.Id).length;
    } else {
      lenListInGrid = this.listOfFiltredgridData.map((item) => item.Id).length;
    }


    if (len === 0) {
      this.selectAllState = 'unchecked';
    } else if (len > 0 && len < lenListInGrid) {
      this.selectAllState = 'indeterminate';
    } else {
      this.selectAllState = 'checked';
      if (len == lenListInGrid) {
        let selectAllCheck: boolean = true;
        this.mySelection.forEach(y => {
          if (this.listOfFiltredgridData.map((item) => item.Id).indexOf(y) == -1)
            selectAllCheck = false;
        });
        if (selectAllCheck) {
          this.selectAllState = 'checked';
        }
        else {
          this.selectAllState = 'indeterminate';
        }
      } else {
        this.selectAllState = 'checked';
      }

    }
  }

  public onSelectAllChange(checkedState: SelectAllCheckboxState) {
    if (checkedState === 'checked') {
      if (this.listItemToFilter.length == 0 && this.listSupplierToFilter.length == 0 && this.listQuotationToFilter.length == 0) {
        this.mySelection = this.gridData.map((item) => item.Id);
      } else {
        this.mySelection = this.listOfFiltredgridData.map((item) => item.Id);
      }
      this.selectAllState = 'checked';
    } else {
      this.mySelection = [];
      this.selectAllState = 'unchecked';
    }
  }

  public createFormGroup(dataItem?: DocumentLineForPriceRequest): FormGroup {

    const form = this.formBuilder.group(new DocumentLineForPriceRequest(null, dataItem));
    this.gridFormGroup = new FormGroup(form.controls, { updateOn: 'blur' });
    if (dataItem) {
      this.gridFormGroup.addControl(PurchaseRequestConstant.ID_ITEM, new FormControl(dataItem.IdItem, { updateOn: 'change' }));
      this.gridFormGroup.addControl(PurchaseRequestConstant.ID_WAREHOUSE, new FormControl(dataItem.IdWarehouse, { updateOn: 'change' }));
    } else {
      this.gridFormGroup.addControl(PurchaseRequestConstant.ID_ITEM, new FormControl(0, { updateOn: 'change' }));
      this.gridFormGroup.addControl(PurchaseRequestConstant.ID_WAREHOUSE, new FormControl(0, { updateOn: 'change' }));
    }
    // disabled form controles

    this.setDisabled();
    this.setValidators();

    this.gridFormGroup.controls[PurchaseRequestConstant.DISCOUNT_PERCENTAGE].valueChanges.subscribe(value => {
      if (this.gridFormGroup && this.gridFormGroup.value.DiscountPercentage !== undefined &&
        (this.editedRowIndex !== undefined || this.isNew === true)
        && Number(this.gridFormGroup.value.DiscountPercentage) !== Number(value)) {
        this.SetDiscount();
      }
    });

    this.gridFormGroup.controls[PurchaseRequestConstant.HT_UNIT_AMOUNT_WITH_CURRECY].valueChanges.subscribe(value => {
      if (this.gridFormGroup && this.gridFormGroup.value.HtUnitAmountWithCurrency !== undefined &&
        (this.editedRowIndex !== undefined || this.isNew === true)
        && Number(this.gridFormGroup.value.HtUnitAmountWithCurrency) !== Number(value)) {
        this.SetDiscount();
      }
    });
    if (this.documentForm) {
      this.documentForm.controls['IdTiers'].disable();
    }
    return this.gridFormGroup;
  }
  /** Add new DocumentLine */
  public addDocumentLine({ sender, rowIndex, columnIndex, dataItem, isEdited }) {
    if (this.documentForm.valid) {
      if ((isEdited || (this.gridFormGroup && !this.gridFormGroup.valid) || this.isEdited) || this.isEditedGrid) {
        return;
      } else {
        this.isEditedItem = true;
        this.isNew = true;
        this.createFormGroup();
        this.grid.addRow(this.gridFormGroup);
        this.editedRowIndex = rowIndex;
        this.isEdited = true;
        this.dataItem = dataItem;
      }
    } else {
      this.validationService.validateAllFormFields(this.documentForm);
    }
  }

  /**setDisabledFormControle */
  private setDisabled() {
    this.gridFormGroup.disable();
    this.gridFormGroup.controls[PurchaseRequestConstant.MOUVEMENT_QTY].enable();
    if (this.documentType === DocumentEnumerator.PurchaseBudget) {
      this.gridFormGroup.controls[PurchaseRequestConstant.DISCOUNT_PERCENTAGE].enable();
      this.gridFormGroup.controls[PurchaseRequestConstant.HT_UNIT_AMOUNT_WITH_CURRECY].enable();
      this.gridFormGroup.controls[PurchaseRequestConstant.DISCOUNT_PERCENTAGE].enable();
      this.gridFormGroup.controls[PurchaseRequestConstant.ID_ITEM].enable();
    }
  }

  /* * Discount property lose focus */
  public SetDiscount() {
    if (this.gridFormGroup.valid) {
      this.setItemService();
      this.documentService.documentLineUnitPrices(this.docLinePrices).subscribe(data => {
        if (this.gridFormGroup) {
          this.gridFormGroup.patchValue(data);
          this.gridFormGroup.controls['HtAmountWithCurrency'].setValue(data.HtAmount);
        }
      });
    }
  }
  setItemService(): void {
    this.docLinePrices = new DocumentLineUnitPrice(this.documentForm.controls[PurchaseRequestConstant.ID_CURRENCY].value,
      'B-PU', this.gridFormGroup.getRawValue());
  }
  private setValidators() {
    this.gridFormGroup.controls[PurchaseRequestConstant.MOUVEMENT_QTY]
      .setValidators([Validators.minLength(1), Validators.min(0),
      Validators.max(NumberConstant.MAX_QUANTITY),
      Validators.pattern('[-+]?[0-9]*\.?[0-9]*')]);
    this.gridFormGroup.controls[PurchaseRequestConstant.DISCOUNT_PERCENTAGE]
      .setValidators([Validators.min(0),
      Validators.max(100),
      Validators.pattern('[-+]?[0-9]*\.?[0-9]*')]);
    this.gridFormGroup.controls[PurchaseRequestConstant.HT_AMOUNT_WITH_CURRECY]
      .setValidators([Validators.min(0),
      Validators.pattern('[-+]?[0-9]*\.?[0-9]*')]);
    this.gridFormGroup.controls[PurchaseRequestConstant.HT_UNIT_AMOUNT_WITH_CURRECY]
      .setValidators([Validators.min(0),
      Validators.pattern('[-+]?[0-9]*\.?[0-9]*')]);
  }
  /* on click documentline grid cell */
  public documentLineClickHandler({ isEdited, dataItem, rowIndex }, SetedValue?: boolean, data?: any): void {

    if ((((isEdited || (this.gridFormGroup && !this.gridFormGroup.valid) || this.isInEditingMode)) || this.isEditedGrid || dataItem.IdDocumentLineStatus == 2)) {
      return;
    } else {
      if (this.showUpdateOrderPermission) {
      this.dataItem = dataItem;
      this.isEditedItem = false;
      this.createFormOnCellHandler({ isEdited, dataItem, rowIndex }, SetedValue, data);
      this.editedRowIndex = rowIndex;
      this.grid.editRow(rowIndex, this.gridFormGroup);
      this.gridFormGroup.controls['IdItem'].disable();
    }
  }
  }
  /* verify if the grid is in editing mode  */
  public get isInEditingMode(): boolean {
    return this.editedRowIndex !== undefined || this.isNew;
  }
  createFormOnCellHandler({ isEdited, dataItem, rowIndex }, SetedValue?: boolean, data?: any) {
    this.isNew = false;
    this.isEdited = true;
    this.createFormGroup(dataItem);
    this.editedRowIndex = rowIndex;
  }

  /*
   * close grid edit cell
   */
  closeEditor(): void {
    if (this.itemDropDown) {
      this.itemDropDown.activeKeyPress = false;
    }
    this.grid.closeRow(this.editedRowIndex);
    this.isNew = false;
    this.editedRowIndex = undefined;
    this.gridFormGroup = undefined;
    this.isEdited = false;
    // this.hideSearch = false;

  }
  /* * call getItemPrice service */
  getItemPrices() {
    if (this.documentType === DocumentEnumerator.PurchaseBudget
      && this.documentForm.controls[PurchaseRequestConstant.ID_TIERS].value && this.isEditedItem) {
      this.isEdited = true;
      this.documentLine = new DocumentLineForPriceRequest(null, this.gridFormGroup.getRawValue());
      this.itemPrice = new ItemPrice(this.documentType, this.documentForm.controls[PurchaseRequestConstant.DOCUMENT_DATE].value,
        this.documentForm.controls[PurchaseRequestConstant.ID_TIERS].value, this.documentLine as DocumentLine);
      this.setItemPrices();
    }
  }
  /** get item prices after select an item and sets there values */
  public setItemPrices() {
    this.documentService.itemPrices(this.itemPrice).subscribe(data => {
      this.itemPricesResult = new ItemPricesResult(data, data.IdMeasureUnitNavigation, data.Designation);
      if (this.gridFormGroup) {
        this.gridFormGroup.patchValue(data);
        this.ifSalesDocumentInSaveCurrent();
      }
    });
  }
  public cancelHandler(): void {
    this.closeEditor();
  }

  ifSalesDocumentInSaveCurrent() {
    if (this.gridFormGroup.controls[PurchaseRequestConstant.ID_ITEM] &&
      this.gridFormGroup.controls[PurchaseRequestConstant.ID_ITEM].value !== null) {
      const centralWarehouse: Warehouse = this.warehouseInstance.getCentralWarehouse();
      this.docLine = new DocumentLineForPriceRequest(this.gridFormGroup.controls[PurchaseRequestConstant.ID_ITEM].value,
        this.gridFormGroup.getRawValue(), null, centralWarehouse);
    }
    this.gridFormGroup.patchValue(this.docLine);
  }

  /*
* remove the current documentLine from the current data source
*/
  public removeDocumentLine({ isEdited, dataItem, rowIndex, sender }) {
    this.gridData[rowIndex].IsDeleted = true;
    let listData = this.gridData.filter(x => x.IsDeleted === false);
    this.view = {
      data: listData.slice(this.skip, this.skip + this.pageSize),
      total: listData.length
    };
    this.closeEditor();
  }

  /**
  * Save current documentline
  **/
  public saveCurrent(): void {
    if (this.gridFormGroup.valid) {
      if (this.documentType === DocumentEnumerator.PurchaseBudget) {
        this.ifDocumentisSaved();
      } else {
        // update formgroup
        this.gridFormGroup.controls[PurchaseRequestConstant.HT_TOTALlINE_WITHCURRENCY].setValue(
          this.gridFormGroup.controls[PurchaseRequestConstant.HT_UNIT_AMOUNT_WITH_CURRECY].value *
          this.gridFormGroup.controls[PurchaseRequestConstant.MOUVEMENT_QTY].value);

        // update grid
        this.gridData[this.editedRowIndex].HtTotalLineWithCurrency =
          this.gridFormGroup.controls[PurchaseRequestConstant.HT_TOTALlINE_WITHCURRENCY].value;

        this.gridData[this.editedRowIndex].HtUnitAmountWithCurrency =
          this.gridFormGroup.controls[PurchaseRequestConstant.HT_UNIT_AMOUNT_WITH_CURRECY].value;

        this.gridData[this.editedRowIndex].MovementQty = this.gridFormGroup.controls[PurchaseRequestConstant.MOUVEMENT_QTY].value;
        this.gridData[this.editedRowIndex].IdItem = this.gridFormGroup.controls[PurchaseRequestConstant.ID_ITEM].value;
        const docs = this.currentDocuments.filter(x => x.Id == this.gridData[this.editedRowIndex].IdDocument);
        if (docs && docs.length > 0) {
          let docLineP = new ItemPrice(this.documentType, docs[0].DocumentDate,
            docs[0].IdTiers, this.gridData[this.editedRowIndex],
            docs[0].IdCurrency);
          const indexOfLine = this.editedRowIndex;
          const tiersNavigation = this.gridData[this.editedRowIndex].IdTiersNavigation;
          const codeDocument = this.gridData[this.editedRowIndex].CodeDocument;
          this.documentService.saveCurrentDocumentLine(docLineP).toPromise().then(data => {
            if (data) {
              this.gridData[indexOfLine] = data.objectData.DocumentLine[0];
              this.gridData[indexOfLine].IdTiersNavigation = tiersNavigation;
              this.gridData[indexOfLine].CodeDocument = codeDocument;
              this.loadItems();
            }
          });
        }
        this.closeEditor();
      }
    } else {
      this.validationService.validateAllFormFields(this.gridFormGroup);
    }
    if (this.documentForm !== undefined && this.documentForm.controls['IdTiers'] !== undefined) {
      this.documentForm.controls['IdTiers'].disable();
    }
  }
  public ifDocumentisSaved(): void {
    if (this.gridFormGroup.valid) {
      this.setItemService();
      this.documentService.documentLineUnitPrices(this.docLinePrices).subscribe(data => {
        let docLine: DocumentLineForPriceRequest;
        this.gridFormGroup.patchValue(data);
        docLine = new DocumentLineForPriceRequest(this.gridFormGroup.controls[DocumentConstant.ID_ITEM].value,
          this.gridFormGroup.getRawValue());
        this.itemPrice = new ItemPrice(this.documentType,
          this.documentForm.controls[PurchaseRequestConstant.DOCUMENT_DATE].value,
          this.documentForm.controls[PurchaseRequestConstant.ID_TIERS].value, docLine as DocumentLine);
        this.getDocumentLineValuesAndSetDataAfterCaluculateDocumentLine();
      });
    } else {
      this.validationService.validateAllFormFields(this.gridFormGroup);
    }
  }
  getDocumentLineValuesAndSetDataAfterCaluculateDocumentLine(): any {
    this.documentService.getDocumentLineValues(this.itemPrice).subscribe(data => {
      if (data) {
        if (this.isNew) {
          this.gridData.push(data);
        } else {
          this.gridData[this.editedRowIndex] = data;
        }
      }
      this.loadItems();
      this.closeEditor();
    });
  }

  /**Select item */
  public itemSelect($event) {
    this.documentFormService.itemSelect($event);
    if ($event && $event.itemForm.value.IdItem !== 0) {
      /**get item details */
      this.documentFormService.itemSelect($event);
      /**get item prices value from selected item */
      this.getItemPrices();
      /**label item to null if no item s selected */
    }
  }

  selectRow($event) {
    $event.selectedRows.forEach(selected => {
      this.generatedList.push(selected.dataItem);
    });
    if ($event.deselectedRows.length > 0) {
      let index = this.generatedList.indexOf($event.deselectedRows[0].dataItem);
      this.generatedList.splice(index, 1, $event.deselectedRows[0].dataItem);
    }
  }
  /**selection grid settings */
  public setSelectableSettings(): void {
    this.selectableSettings = {
      checkboxOnly: true,
      mode: 'multiple'
    };
  }
  public filterPeerSupplier(event) {
    this.listSupplierToFilter = event.selectedValueMultiSelect;
    this.filterList();
  }
  public filterPeerItem(event) {
    if (event) {
      this.listItemToFilter = event.itemSelected;
      this.filterList();
    }
  }

  public onSelectQuotation(event) {
    this.listQuotationToFilter = event.quotationSelected;
    this.filterList();
  }

  public filterList(skipPage?) {
    let listData;
    listData = this.gridData.filter(x => ((this.listItemToFilter.length > 0 ? this.listItemToFilter.includes(x.IdItem) : true)
      && (this.listSupplierToFilter.length ? this.listSupplierToFilter.includes(x.IdTiersNavigation.Id) : true) &&
      (this.listQuotationToFilter.length > 0 ? this.listQuotationToFilter.includes(x.CodeDocument) : true)));

    if (skipPage) {
      this.skip = skipPage;
    } else {
      this.skip = 0;
    }
    this.pageSize = 5;
    this.view = {
      data: listData.slice(this.skip, this.skip + this.pageSize),
      total: listData.length
    };
    this.listOfFiltredgridData = listData;
    this.onSelectedKeysChange();
  }

  public handleFilterQuotation(value: string): void {

    this.quotationFiltredDataSource = this.quotationDataSource.filter((s) =>
      s.CodeDocument.toLowerCase().includes(value.toLowerCase())
    );
  }

  redirectToQuotation(codeQuotation) {
    this.redirectToQuotationTab.emit(codeQuotation);
  }

  save() {
    let toSendData: Array<DocumentLineWithSupplier> = new Array<DocumentLineWithSupplier>();
    let listfterFilter = this.gridData.filter(x => this.mySelection.includes(x.Id));
    // some purchase budget are not saved
    if ((listfterFilter.filter(x => x.IdDocument === 0)).length > 0) {
      this.growlService.warningNotification(this.translate.instant(PurchaseRequestConstant.PURCHASE_BUDGET_NOT_SAVED));
    } else {
      listfterFilter.forEach(element => {
        element.IdDocumentNavigation = null;
        element.DocumentLineTaxe = null;
        element.UnitPriceFromQuotation = element.HtUnitAmountWithCurrency;
        let documentLineWithSupplier = new DocumentLineWithSupplier();
        documentLineWithSupplier.IdTiers = element.IdTiersNavigation.Id;
        documentLineWithSupplier.IdCurrency = element.IdTiersNavigation.IdCurrency;
        documentLineWithSupplier.IdDocumentAssocieted = element.IdDocument;
        documentLineWithSupplier.DocumentLine = new DocumentLine(null, element);
        documentLineWithSupplier.DocumentLine.IdDocument = 0;
        documentLineWithSupplier.IdPriceRequest = this.id;
        toSendData.push(documentLineWithSupplier);
      });
      toSendData.forEach(documentLine => {
        documentLine.DocumentLine.Id = 0;
      });
      this.priceRequestService.generatePurchaseOrderFromPriceRequest(toSendData).subscribe(x => {
        this.generateBC.emit(toSendData);
        this.filterList(this.skip);

        let message: string = this.translate.instant(PurchaseRequestConstant.SUCCESS_GENERATE_BCF);
        if(this.authService.hasAuthorities([PermissionConstant.CommercialPermissions.UPDATE_FINAL_ORDER_PURCHASE, PermissionConstant.CommercialPermissions.SHOW_FINAL_ORDER_PURCHASE])){
          x.forEach(element => {
            message = message.concat('<a target="_blank" rel="noopener noreferrer" href="/main/purchase/purchasefinalorder/edit/' +
              element.Id + '/1" > ' + element.Code + '</a>');
          });
        } else {
          x.forEach(element => {
          message = message.concat('<span> ' + element.Code + '</span>');
          });
        }
        swal.fire({
          icon: SharedConstant.SUCCESS,
          html: message,
        });
      });
    }
  }
}
