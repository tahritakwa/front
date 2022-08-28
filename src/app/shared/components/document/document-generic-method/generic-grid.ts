import { ViewContainerRef, Output, EventEmitter, ViewChild, Input } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { DocumentLineUnitPrice } from '../../../../models/sales/document-line-unit-price.model';
import { ItemPricesResult, DocumentLine } from '../../../../models/sales/document-line.model';
import { ItemPrice } from '../../../../models/sales/item-price.model';
import { ReduisDocument } from '../../../../models/sales/reduis-document.model';
import { DocumentTotalPrices } from '../../../../models/sales/document-total-prices.model';
import { ValidationService, digitsAfterComma, strictSup, minQuantity, maxQuantity, isNumericWithPrecision } from '../../../services/validation/validation.service';
import { DocumentFormService } from '../../../services/document/document-grid.service';
import { DocumentService } from '../../../../sales/services/document/document.service';
import { WarehouseService } from '../../../../inventory/services/warehouse/warehouse.service';
import { WarehouseItemService } from '../../../../inventory/services/warehouse-item/warehouse-item.service';
import { DocumentConstant } from '../../../../constant/sales/document.constant';
import { Document } from '../../../../models/sales/document.model';
import { DocumentEnumerator, documentStatusCode, DocumentTypesEnumerator, InvoicingTypeEnumerator } from '../../../../models/enumerators/document.enum';
import { CrudGridService } from '../../../../sales/services/document-line/crud-grid.service';
import { PageChangeEvent, GridDataResult, SelectableSettings } from '@progress/kendo-angular-grid';
import { ImportDocuments } from '../../../../models/sales/import-documents.model';
import { GrowlService } from '../../../../../COM/Growl/growl.service';
import { TranslateService } from '@ngx-translate/core';
import { KeyboardConst } from '../../../../constant/keyboard/keyboard.constant';
export const matches = (el, selector) => (el.matches || el.msMatchesSelector).call(el, selector);
import { SearchItemService } from '../../../../sales/services/search-item/search-item.service';
import { TiersService } from '../../../../purchase/services/tiers/tiers.service';
import { SwalWarring } from '../../swal/swal-popup';
import { MeasureUnitService } from '../../../services/mesure-unit/measure-unit.service';
import { isBetweenKendoDropdowns } from '../../../helpers/component.helper';
import { SharedConstant } from '../../../../constant/shared/shared.constant';
import { NumberConstant } from '../../../../constant/utility/number.constant';
import { Currency } from '../../../../models/administration/currency.model';
import { CompanyService } from '../../../../administration/services/company/company.service';
import { ReducedCurrency } from '../../../../models/administration/reduced-currency.model';
import { isNullOrEmptyString } from '@progress/kendo-angular-grid/dist/es2015/utils';
import { LocalStorageService } from '../../../../login/Authentification/services/local-storage-service';
import { Warehouse } from '../../../../models/inventory/warehouse.model';

export abstract class GridGenericMethodsComponent {
  public companycurrency: ReducedCurrency;
  public isContainsLines: boolean;
  //#region  attributes
  /**dcument line FormGroup  */
  public gridFormGroup: FormGroup;
  public pageSize = 50;
  public skip = 0;
  // document line total prices
  public docLinePrices: DocumentLineUnitPrice;

  /**docment line prices  */
  public itemPricesResult: ItemPricesResult;

  /** item price for the selected item*/
  public itemPrice: ItemPrice;
  /**used to calculate docment total prices */
  public reduisDocument: ReduisDocument;
  /**document  total prices */
  public documentTotalPrices: DocumentTotalPrices;
  public docLine: DocumentLine;
  public noImport: boolean;
  public itemForm: FormGroup;
  public isNew: boolean;
  public dataItem: DocumentLine;
  /**edited row number*/
  public editedRowIndex: number;
  public view: GridDataResult;
  public format;
  public abstract documentType;
  public addNewDevis: boolean;
  public NewAvailbleQuantity: number;
  public isAfterSave: boolean;
  //public isSuperAdminRole;
  @Input() updateValidDocumentRole;
  public filteredView: GridDataResult;
  public disableButtonImport = true;
  public disableButtonImportOther = true;
  public gridObject;
  public iskeyup: boolean;
  @Output() reloadSignal = new EventEmitter<any>();
  public isSalesDocument: boolean;
  public docClickSubscription: any;
  public showImportLines: boolean;
  public genericDiscount: number;
  public selectionId: number[] = [];
  public isFromSearchItemInterfce: boolean;
  public selectableSettings: SelectableSettings = {
    checkboxOnly: true,
    mode: 'multiple'
  };
  @ViewChild('container', { read: ViewContainerRef })
  public containerRef: ViewContainerRef;
  public savedDocAfterChoosingSupplier: boolean = false;
  public IsRemovedLine: boolean;
  @Input() showImportbtnInInvoiceWhenDraftState: boolean;
  @Input() fromDevisInterface = false;
  public recalculateDiscount = false;
  public oldQty;
  public movementQtyFocusOut = true;
  public showDiscountSwal = false;
  public saveLine = false;
  public discountValueChanged = false;
  public oldDiscountValue;
  public formatFoSalesOptions;
  public documentTaxeResume: any[];
  public idDocument: any;
  public showItemControlMessage: boolean;
  public document;
  @Input() defaultWarehouse: Warehouse;
  @Input() currentDocument;
  public warehousePrevioisValue : number;
  public selectedIdItem : number;
  public importDiscountLines = false;
  public haveDiscountLine :any[] =[];
  //#endregion
  constructor(protected service: CrudGridService, public validationService: ValidationService,
    public documentFormService: DocumentFormService, protected documentService: DocumentService,
    public viewRef: ViewContainerRef, protected router: Router, protected searchItemService: SearchItemService,
    protected warehouseService: WarehouseService, protected warehouseItemService: WarehouseItemService,
    protected formBuilder: FormBuilder, protected growlService: GrowlService, protected translateService: TranslateService,
    protected tiersService: TiersService, protected swalWarrings: SwalWarring, protected measureUnitService: MeasureUnitService,
    protected serviceComany: CompanyService, protected localStorageService: LocalStorageService) {
    this.searchItemService.destroySearchModal.subscribe(x => {
      this.updateDocumentAfterCloseModal(x);
    });
    this.searchItemService.loadItems.subscribe(x => {
      this.getDocumentLinesOperation(x);
    });
    this.getSelectedCurrency();
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
  discountPercentageFoucusOut(savebtn?: boolean) {
    if ((this.isDropDownExist() && document.getElementsByClassName('k-dropdown-wrap k-state-default')[2]) && !savebtn) {
      const warehouse = document.getElementsByName('WarehouseName')[0].getElementsByClassName('k-input')[0] as any;
      warehouse.focus();
    } else {
      this.saveCurrent();
    }
  }
  public createFormGroup(dataItem?: DocumentLine): FormGroup {
    this.gridFormGroup = this.formBuilder.group(new DocumentLine(null, dataItem));
    this.gridFormGroup.controls['IdDocument'].setValue(this.itemForm.controls['Id'].value);
    this.gridFormGroup.addControl('StockMovement', new FormControl(dataItem !== undefined ? dataItem.StockMovement : null));
    // disabled form controles
    this.setDisabled();
    this.setValidators();
    this.gridFormGroup.controls['MovementQty'].valueChanges.subscribe(value => {
      if (this.gridFormGroup && this.gridFormGroup.value.MovementQty !== undefined && this.editedRowIndex !== undefined
        && Number(this.gridFormGroup.value.MovementQty) !== Number(value)) {
        this.setRemaining(dataItem);
      }
    });
    if (!this.isNew) {
      this.gridFormGroup.controls['RefItem'].setValidators([Validators.required]);
    }
    this.gridFormGroup.controls['RefItem'].setValue(dataItem !== undefined ? dataItem.Designation : null);

    return this.gridFormGroup;
  }

  public selectMvtQty() {
    const mvq = document.getElementsByName('MovementQty')[0] as any;
    if (mvq) {
      mvq.value = 1;
      this.gridFormGroup.controls['MovementQty'].setValue(mvq.value);
      mvq.select();
      mvq.focus();
    }
  }
  public documentLineClickHandlerSuperAdmin(isEdited, dataItem, rowIndex, SetedValue?: boolean, data?: any): void {
    if (!this.isInEditingMode && !this.IsRemovedLine) {
      if (this.checkHaveUpdateRoles() || this.showImportbtnInInvoiceWhenDraftState) {
        this.doCellInit(dataItem, isEdited, rowIndex, SetedValue, data);
      }
    } else { this.IsRemovedLine = false; return; }
  }
  doCellInit = (dataItem, isEdited, rowIndex, SetedValue, data) => {
  }

  checkHaveUpdateRoles() {
    return this.updateValidDocumentRole && this.itemForm.controls[DocumentConstant.ID_DOCUMENT_STATUS].value === 2;
  }

  IsProvisonal() {
    return this.itemForm.controls[DocumentConstant.ID_DOCUMENT_STATUS].value === 1;
  }


  public updateDocumentAfterCloseModal(idDoc) {
    if (!idDoc)
      idDoc = this.idDocument;
    this.getDocumentLinesOperation(idDoc);
    if (!this.isFromSearchItemInterfce && this.isAbleToGetDocLines(false, idDoc)) {
      this.searchItemService.isInDocument = false;
    }
  }
  isAbleToGetDocLines(fromsearchItemInterface: boolean, idDoc: number): boolean {
    return this.itemForm && this.itemForm.controls['Id'].value === idDoc && fromsearchItemInterface &&
      !this.searchItemService.serviceHasEmitData;
  }
  getDocumentLinesOperation(idDoc) {
    if (this.isAbleToGetDocLines(true, idDoc)) {
      this.searchItemService.serviceHasEmitData = true;
      this.cancelHandler();
      this.loadItems();
      this.documentService.getDocumentInRealTime(this.itemForm.controls['Id'].value).toPromise().then(y => {
        this.documentService.documentTtcPrice = y.objectData.DocumentTtcpriceWithCurrency;
        y.objectData.DocumentDate = new Date(y.objectData.DocumentDate);
        y.objectData.DocumentInvoicingDate = new Date(y.objectData.DocumentInvoicingDate);
        this.itemForm.patchValue(y.objectData);
        this.documentTaxeResume.splice(0,)
        y.objectData.DocumentTaxsResume.forEach(element => {
          this.documentTaxeResume.push(element);
        });

      });
    }
  }
  public closeLine(event) {
    if (event.key === KeyboardConst.ESCAPE) {
      if (!this.showImportLines && (this.documentType != DocumentEnumerator.PurchaseAsset
        && this.documentType != DocumentEnumerator.SalesAsset)) {
        this.closeLineOperation();
      } else {
        // in assets --> modal of import item from invoice should be closed with ESCAPE btn
        this.showImportLines = false;
      }
    }
  }

  public isDropDownExist(): boolean {
    const WarehouseName = document.getElementsByName('WarehouseName')[0] as any;
    if (WarehouseName) {
      return true;
    } else { return false; }
  }
  private setValidators() {
    if (this.gridFormGroup.controls['IdMeasureUnit'].value > 0) {
      this.setDigitsComma(this.gridFormGroup.controls['IdMeasureUnit'].value);
    } else {
      this.setQtyValidateor();
    }
    const pattern = this.format === undefined ? 3 : this.format.minimumFractionDigits;
    this.gridFormGroup.controls['IdItem'].setValidators(Validators.required);
    this.gridFormGroup.controls['DiscountPercentage']
      .setValidators([Validators.min(0),
      Validators.max(100),
      digitsAfterComma(2)]);
    this.gridFormGroup.controls['HtUnitAmountWithCurrency']
      .setValidators([Validators.min(0),
      Validators.maxLength(19),
      Validators.pattern('[-+]?[0-9]*\.?[0-9]{0,' + pattern + '}')]);
  }

  /**get availble quantity after select warhouse */
  getAvailableQuantity() {
    this.documentService.getAvailbleQuantity(this.gridFormGroup.getRawValue().IdItem,
      this.gridFormGroup.getRawValue().IdWarehouse).subscribe(res => {
        if (this.gridFormGroup) {
          this.gridFormGroup.controls['AvailableQuantity'].setValue(res.objectData);
          this.NewAvailbleQuantity = res.objectData;
        }
      });
  }
  /**setDisabledFormControle */
  public setDisabled() {
    this.gridFormGroup.disable();
    if (this.documentType !== DocumentEnumerator.PurchaseBudget) {
      this.gridFormGroup.controls['MovementQty'].enable();
    }

    this.gridFormGroup.controls['DiscountPercentage'].enable();
    this.gridFormGroup.controls['IdItem'].enable();
    this.gridFormGroup.controls['IdWarehouse'].enable();
    this.gridFormGroup.controls['IdMeasureUnit'].enable();
    this.gridFormGroup.controls['IdMeasureUnitNavigation'].enable();
    this.gridFormGroup.controls['RefItem'].enable();
    this.gridFormGroup.controls['IdStorage'].enable();
    if (this.gridFormGroup.controls['IdWarehouse'].value === 0) {
      this.gridFormGroup.controls['IdWarehouse'].setValue(null);
      this.gridFormGroup.controls['IdWarehouseNavigation'].setValue(null);
    }
    if (this.itemForm.controls['DocumentTypeCode'].value !== DocumentEnumerator.PurchaseOrder
      && this.itemForm.controls['DocumentTypeCode'].value !== DocumentEnumerator.PurchaseFinalOrder) {
      this.gridFormGroup.controls['HtAmountWithCurrency'].enable();
    }
    if (this.updateValidDocumentRole || !this.isSalesDocument ||
      (this.isSalesDocument &&
        this.itemForm.controls['DocumentTypeCode'].value === DocumentEnumerator.SalesInvoices &&
        this.itemForm.controls['InoicingType'].value === InvoicingTypeEnumerator.Other) ||
      (this.itemForm.controls['isRestaurn'] && this.itemForm.controls['isRestaurn'].value)) {
      this.gridFormGroup.controls['HtUnitAmountWithCurrency'].enable();
    }
  }

  public seDocumentLineValuesAfterChangeDiscountPercentageOrHtUnitAmount(data) {
    if (this.gridFormGroup) {
      this.gridFormGroup.patchValue(data);
      this.gridFormGroup.controls['HtAmountWithCurrency'].setValue(data.HtAmount);
      this.saveOrUpdateDocument();
    }
  }
  public isGridValuesAreValid(): boolean {
    this.gridFormGroup.controls['MovementQty'].setValue(
      this.gridFormGroup.controls['MovementQty'].value.toString().replace(',', '.'));
    if (this.gridFormGroup.controls['HtUnitAmountWithCurrency'].value) {
      this.gridFormGroup.controls['HtUnitAmountWithCurrency'].
        setValue(this.gridFormGroup.controls['HtUnitAmountWithCurrency'].value.toString().replace(',', '.'));
    }
    if (this.documentType !== DocumentEnumerator.PurchaseOrder && (isNaN(Number(this.gridFormGroup.controls['MovementQty'].value))
      || (Number(this.gridFormGroup.controls['MovementQty'].value) === 0))) {
      this.growlService.warningNotification(this.translateService.instant(DocumentConstant.FORMAT_QUANTITY_ERROR));
      return false;
    } else {
      if (Number(this.gridFormGroup.controls['HtUnitAmountWithCurrency'].value <= 0) && this.isSalesDocument && !this.updateValidDocumentRole) {
        this.growlService.warningNotification(this.translateService.instant(DocumentConstant.FORMAT_PRICE_ERROR));
        return false;
      } else {
        if (isNaN(Number(this.gridFormGroup.controls['HtUnitAmountWithCurrency'].value))) {
          this.growlService.warningNotification(this.translateService.instant(DocumentConstant.FORMAT_PRICE_ERROR));
        }
        else if ((Number(this.gridFormGroup.controls['HtUnitAmountWithCurrency'].value > 0)) || ((this.documentType === DocumentEnumerator.PurchaseFinalOrder)
          || (this.isSalesDocument && !this.updateValidDocumentRole) || (this.documentType === DocumentEnumerator.SalesDelivery)
          || (this.addNewDevis === true && this.documentType === DocumentEnumerator.PurchaseBudget) || this.documentType === DocumentEnumerator.PurchaseInvoices ||
          this.documentType === DocumentEnumerator.PurchaseOrder)) {
          return true;
        } else {
          this.growlService.warningNotification(this.translateService.instant(DocumentConstant.FORMAT_PRICE_ERROR));
          return false;
        }
      }
    }
  }
  /**Select item */
  public itemSelect($event) {
      if ($event && $event.itemForm && $event.itemForm.controls['IdItem'].value > 0 &&
      typeof $event.itemForm.controls['IdItem'].value !== 'string') {
        if(this.warehousePrevioisValue == $event.itemForm.controls['IdWarehouse'].value || this.selectedIdItem == null){
          this.getItemPrices();
        }
        this.refreshDepotDropdownValues($event.itemForm.controls['IdItem'].value);
        this.oldQty = NumberConstant.ONE;
        this.movementQtyFocusOut = true;
      
    }
  }
  /**item key press start*/
  movementItemFoucusOut() {
    if (document.getElementsByName('MovementQty')) {
      const HtUnitAmountWithCurrency = document.getElementsByName('MovementQty')[0] as any;
      if (HtUnitAmountWithCurrency && HtUnitAmountWithCurrency.disabled === false) {
        this.selectMvtQty();
      } else {
        this.movementQtyFoucusOut();
      }
    } else {
      this.movementQtyFoucusOut();
    }
  }
  /**item key press start*/
  /** get item prices after select an item and sets there values */
  public setItemPrices() {
    this.documentService.itemPrices(this.itemPrice).subscribe(data => {
      this.itemPricesResult = new ItemPricesResult(data, data.IdMeasureUnitNavigation, data.Designation);
      if (this.gridFormGroup) {
        data.IdWarehouseNavigation = this.defaultWarehouse;
        this.gridFormGroup.controls['IdWarehouse'].setValue(data.IdWarehouse)
        this.gridFormGroup.patchValue(data);
        this.gridFormGroup.controls['MovementQty'].setValue(0);
        this.gridFormGroup.controls['IdMeasureUnit'].setValue(data.IdMeasureUnit);
        this.oldDiscountValue = data.DiscountPercentage;
        this.setDigitsComma(this.gridFormGroup.controls['IdMeasureUnit'].value);
        if (!data.IdItemNavigation.IdNatureNavigation.IsStockManaged) {
          this.gridFormGroup.controls['IdWarehouse'].disable();
        }
        this.ifSalesDocumentInSaveCurrent(data);
        if (data.Taxe.length > 0 && data.Taxe[0].IsCalculable) {
          this.gridFormGroup.controls['TaxeAmount'].disable();
        } else {
          this.gridFormGroup.controls['TaxeAmount'].enable();
        }
      }
      if (this.gridFormGroup && this.gridFormGroup.controls && this.gridFormGroup.controls['IdMeasureUnit']) {
        this.setDigitsComma(this.gridFormGroup.controls['IdMeasureUnit'].value);
      }
      this.NewAvailbleQuantity = data.AvailableQuantity;
      this.movementItemFoucusOut();
    });
  }

  setItemPercentageAndUnitPrice() {
    if (this.gridFormGroup.valid) {
      this.documentService.itemPrices(this.itemPrice).subscribe(data => {
        this.itemPricesResult = new ItemPricesResult(data, data.IdMeasureUnitNavigation, data.Designation);
        if (this.gridFormGroup) {
          let movmentQty = this.gridFormGroup.controls['MovementQty'].value;
          this.gridFormGroup.patchValue(data);
          this.gridFormGroup.controls['MovementQty'].setValue(movmentQty);
          this.gridFormGroup.controls['IdMeasureUnit'].setValue(data.IdMeasureUnit);
          this.setDigitsComma(this.gridFormGroup.controls['IdMeasureUnit'].value);
          if (!data.IdItemNavigation.IdNatureNavigation.IsStockManaged) {
            this.gridFormGroup.controls['IdWarehouse'].disable();
          }
          this.ifSalesDocumentInSaveCurrent(data);
        }
        this.setDigitsComma(this.gridFormGroup.controls['IdMeasureUnit'].value);
        this.NewAvailbleQuantity = data.AvailableQuantity;
      });
    }
  }

  /*
* Get itemWarehouse
*/
  public warehouseSelect($event) {
    this.documentFormService.warehouseSelect($event);
    if (this.gridFormGroup.getRawValue().IdItem && this.gridFormGroup.getRawValue().IdWarehouse) {
      this.isAfterSave = false;
      this.documentService.getShelfAndStorageOfItemInWarehouse(this.gridFormGroup.getRawValue().IdItem,
        this.gridFormGroup.getRawValue().IdWarehouse).subscribe(data => {
          this.gridFormGroup.controls[DocumentConstant.SHELF_AND_STORAGE].setValue(data.objectData);
        });
      this.getAvailableQuantity();
    } else {
      this.gridFormGroup.controls[DocumentConstant.SHELF_AND_STORAGE].setValue('');
    }
  }
  /**
 * Save current documentline
 **/
  public saveCurrent() {
    this.saveLine = true;
    this.showItemControlMessage = true;
    if (this.gridFormGroup && this.gridFormGroup.valid) {
      if (this.isGridValuesAreValid()) {
        this.isAfterSave = true;
        if (isNullOrEmptyString(this.gridFormGroup.controls['TaxeAmount'].value)) {
          this.gridFormGroup.controls['TaxeAmount'].setValue(0);
        }
        if (isNullOrEmptyString(this.gridFormGroup.controls['DiscountPercentage'].value)) {
          this.gridFormGroup.controls['DiscountPercentage'].setValue(0);
        }
        this.documentGridSetValues();
      }
    } else {
      if (this.gridFormGroup) {
        this.validationService.validateAllFormFields(this.gridFormGroup);
      }
    }
  }

  /**Save the imported documentLine */
  public saveImportedLine() {
    if (this.service && ((this.service.otherData && this.service.otherData.length > 0) || (this.service.DataToImport && this.service.DataToImport.length > 0))) {
      if(this.service.otherData.length > 0){
      this.haveDiscountLine = this.service.otherData.filter(x=> x.HaveDiscountLineInDocument != null && x.HaveDiscountLineInDocument)
      if(this.haveDiscountLine && this.haveDiscountLine.length > 0){
        this.swalWarrings.CreateSwal(
              `${this.translateService.instant('IMPORT_DISCOUNT_LINES_ATTACHED')}`,
              `${this.translateService.instant('IMPORT_DISCOUNT_LINES')}`,
            )
            .then((result) => {
              if (result.value) {
                this.importDiscountLines = true;
              }else{
                this.importDiscountLines = false;
              }
              this.importProcess();
            });
      }else{
        this.importProcess();
      }
    }
      else{
        this.importProcess();
      }
    }
  }
  public importProcess(){
    if (this.itemForm.controls['Id'].value <= 0) {
      const document: Document = this.itemForm.getRawValue();
      document.IdUsedCurrency = this.itemForm.controls['IdCurrency'].value;
      document.Code = '';
      this.documentService.saveCurrentDocument(document).subscribe(x => {
        this.itemForm.controls['Id'].setValue(x.Id);
        this.itemForm.controls['Code'].setValue(x.Code);
        this.itemForm.controls['IdDocumentStatus'].setValue(documentStatusCode.Provisional);
        this.itemForm.controls['IdTiers'].disable();
        this.setModalDetails(x);
        this.importOperation();
      });
    } else {
      this.importOperation();
    }
  }
  public importOperation() {
    const importDocuments = new ImportDocuments();
    importDocuments.DocumentTypeCode = this.itemForm.controls['DocumentTypeCode'].value;
    importDocuments.IdsDocuments = this.service.DataToImport;
    importDocuments.IdCurrentDocument = this.itemForm.controls['Id'].value;
    importDocuments.IsRestaurn = this.itemForm.controls['IsRestaurn'] ? this.itemForm.controls['IsRestaurn'].value : false;
    this.service.otherData.forEach(element => {
      importDocuments.IdsDocumentLines.push(element.Id);
    });
    if(this.service.otherData && this.service.otherData.length > 0 && this.importDiscountLines && this.haveDiscountLine && this.haveDiscountLine.length > 0 ){
      var listDoc = this.haveDiscountLine.map(x=> x.IdDocument);
      importDocuments.IdsDocumentWithDiscountLine = listDoc;
    }
    this.documentService.updateDocumentAfterImport(importDocuments).subscribe(x => {
      this.manegeDocumentAfterImportResuslt(x);
      if (this.searchItemService && this.searchItemService.searchItemDocumentType == undefined && x && x.objectData && x.objectData.DocumentTypeCode) {
        this.searchItemService.searchItemDocumentType = x.objectData.DocumentTypeCode;
      }
    });
    this.service.DataToImport = new Array();
    this.service.otherData = new Array();
  }

  public manegeDocumentAfterImportResuslt(result: any) {
    result.objectData.DocumentDate = new Date(result.objectData.DocumentDate);
    result.objectData.DocumentInvoicingDate = new Date(result.objectData.DocumentInvoicingDate);
    if (result.objectData.IsAllLinesAreAdded === false) {
      this.growlService.ErrorNotification(this.translateService.instant('SOME_ITEMS_ARE_NOT_AVAILABLE_IN_STOCK'));
    }
    this.itemForm.patchValue(result.objectData);
    this.documentTaxeResume.splice(0,);
    result.objectData.DocumentTaxsResume.forEach(element => {
      this.documentTaxeResume.push(element);
    });
    this.loadItems();
  }

  public setValues(result) {
    if (result.value) {
      this.itemPrice.DocumentLineViewModel.IsValidReservationFromProvisionalStock = true;
    } else {
      this.itemPrice.DocumentLineViewModel.IsValidReservationFromProvisionalStock = false;
    }
  }
  /* * remove the current documentLine from the current data source */
  public removeDocumentLine({ dataItem }) {
    if (this.documentType === DocumentEnumerator.SalesDelivery && this.itemForm.controls['hasSalesInvoices'].value) {
      this.growlService.ErrorNotification(this.translateService.instant(DocumentConstant.EXIST_SALES_INVOICE_LINE_ERROR));
    } else {
      this.createFormGroup(dataItem);
      this.gridFormGroup.controls[DocumentConstant.IS_DELETED].setValue(true);
      this.service.saveData(this.gridFormGroup.getRawValue(), false, 'data');
    }
    this.closeLineOperation();
  }

  /**verify form validation before import documentLine */
  checkImportBL() {
    if (this.itemForm.valid) {
      this.noImport = true;
      this.checkImpotedData();
    } else {
      this.validationService.validateAllFormFields(this.itemForm);
      this.noImport = false;
    }
  }

  /*cancel changes*/
  public cancelHandler(): void {
    if ((this.showImportLines && (this.documentType != DocumentEnumerator.PurchaseAsset
      && this.documentType != DocumentEnumerator.SalesAsset)) || (!this.showImportLines)) {
      this.closeLineOperation();
      this.enableOrDisableTiers();
      this.ShowLastItemInBLOperations();
    }
    else {
      this.showImportLines = false;
    }
  }
  public closeLineOperation() {
    this.closeEditor();
    this.isNew = false;

  }

  enableOrDisableTiers() {
    if (!this.fromDevisInterface) {
      if (this.itemForm && this.itemForm.controls['IdTiers']) {
        // if the document is in serach item interface the tiers must be disabled
        if (this.itemForm.controls['isFromSearch'] && this.itemForm.controls['isFromSearch'].value) {
          this.itemForm.controls['IdTiers'].disable();
        } else {
          if ((!this.view || !this.view.total || this.view.total === 0) && !this.isContainsLines) {
            this.itemForm.controls['IdTiers'].enable();
          } else {
            this.itemForm.controls['IdTiers'].disable();
          }
        }

      }
    }
  }


  callNexTLine(dataGrid, event, selectedIndex, OpenLineIndex, isBl: boolean) {
    const indexValue = event.path[4].rowIndex !== undefined ? 4 : (event.path[5].rowIndex !== undefined ? 5 : 6);
    if (event.path[indexValue] && this.editedRowIndex >= 0 && !isBetweenKendoDropdowns(event)) {
      if (event.key === KeyboardConst.ARROW_DOWN &&
        event.path[indexValue].rowIndex < dataGrid.data.length - 1) {

        // get next index
        selectedIndex = event.path[indexValue].rowIndex + 1;
        OpenLineIndex = this.editedRowIndex + 1;

        this.moveToNexLine(selectedIndex, dataGrid, OpenLineIndex, isBl);
      } else if (event.key === KeyboardConst.ARROW_UP && event.path[indexValue].rowIndex > 0) {

        // get previous index
        selectedIndex = event.path[indexValue].rowIndex - 1;
        OpenLineIndex = this.editedRowIndex - 1;
        this.moveToNexLine(selectedIndex, dataGrid, OpenLineIndex, isBl);

        // if it is the first or last line at the grid
      } else if ((event.key === KeyboardConst.ARROW_DOWN || event.key === KeyboardConst.ARROW_UP) && !isBl) {
        this.saveCurrent();
      }
    }
  }

  moveToNexLine(selectedIndex: number, dataGrid: any, OpenLineIndex: number, isBl: boolean) {
    this.gridObject = { isEdited: false, dataItem: dataGrid.data[selectedIndex], rowIndex: OpenLineIndex };
    if (!isBl) {
      this.saveCurrent();
    }
  }
  public saveCurrentLineinRealTime(dataItem?: DocumentLine, isRemoved?: boolean) {
    let itemPrice = this.prepareItemPrices(dataItem);
    if(itemPrice.DocumentLineViewModel.IdStorage == NumberConstant.ZERO){
      itemPrice.DocumentLineViewModel.IdStorage = null;
    }
    itemPrice.DocumentLineViewModel.IdDocument = this.itemForm.controls['Id'].value;
    if (this.documentType === DocumentEnumerator.SalesDelivery && this.itemForm.controls['hasSalesInvoices'].value) {
      this.growlService.ErrorNotification(this.translateService.instant(DocumentConstant.EXIST_SALES_INVOICE_LINE_ERROR));
      this.cancelHandler();
    } else {
      if (this.documentType === DocumentEnumerator.SalesInvoices &&
        this.itemForm.controls['InoicingType'].value === InvoicingTypeEnumerator.Other) {
        itemPrice.InoicingType = InvoicingTypeEnumerator.Other;
      }
      itemPrice.DocumentLineViewModel.IdDocumentLineStatus = this.itemForm.controls['IdDocumentStatus'].value;
      if (this.gridFormGroup) {
        itemPrice.DocumentLineViewModel.Designation = this.gridFormGroup.controls['RefItem'].value;
      }
      if (typeof itemPrice.DocumentLineViewModel.IdItem == 'string') {
        this.cancelHandler();
      } else {
        this.documentService.saveCurrentDocumentLine(itemPrice, this.recalculateDiscount).toPromise().then(x => {
          if (x) {
            if (x.AmountInLetter === '-') {
              this.growlService.ErrorNotification(this.translateService.instant('CANTCONVERTMONTANT'));
            }
            this.documentService.documentTtcPrice = x.DocumentTtcpriceWithCurrency;
            this.isContainsLines = x.DocumentLine.filter(y => !y.IsDeleted).length > NumberConstant.ZERO ? true : false;
            this.saveCurrentLineWithDocument(x.DocumentLine, isRemoved);
            this.document = x;
            // don't need to update document amounts if it is purchase baudget
            if (this.documentType === DocumentEnumerator.PurchaseBudget) {
              this.getData(x.DocumentLine[0], true, isRemoved);
            } else {
              //this.documentService.updateDocumentInRealTime(this.itemForm.controls['Id'].value).toPromise().then(y => {
              x.DocumentDate = new Date(x.DocumentDate);
              x.DocumentInvoicingDate = new Date(x.DocumentInvoicingDate);
              this.itemForm.patchValue(x);
              this.getData(x.DocumentLine[0], false, isRemoved);

            }
            if (this.documentTaxeResume) {
              this.documentTaxeResume.splice(0,)
              x.DocumentTaxsResume.forEach(element => {
                this.documentTaxeResume.push(element);
              });
            }
          } else {
            this.isAfterSave = false;
          }
          this.saveLine = false;
        });
      }
      this.recalculateDiscount = false;
      this.discountValueChanged = false;
    }
  }
  abstract AssignValues(data: DocumentLine, loadWithoutSaveDocumentLine: boolean);
  getData(data: DocumentLine, loadWithoutSaveDocumentLine: boolean, isRemoved: boolean) {
    if (this.isNew || this.itemForm.controls['DocumentTypeCode'].value === DocumentEnumerator.SalesDelivery || isRemoved) {
      if (isRemoved) {
        this.loadItems(1, loadWithoutSaveDocumentLine);
      } else {
        this.loadItems(null, loadWithoutSaveDocumentLine);
      }
    } else {
      this.AssignValues(data, loadWithoutSaveDocumentLine);
    }
  }

  prepareItemPrices(dataItem): ItemPrice {
    let itemPrice;
    if (!dataItem) {
      let dataGrid = this.gridFormGroup.getRawValue();
      if (this.itemPrice) {
        dataGrid.IsValidReservationFromProvisionalStock = this.itemPrice.DocumentLineViewModel.IsValidReservationFromProvisionalStock;
      }
      itemPrice = new ItemPrice(this.itemForm.controls['DocumentTypeCode'].value, this.itemForm.controls['DocumentDate'].value,
        this.itemForm.controls['IdTiers'].value, dataGrid, this.itemForm.controls['IdCurrency'].value,
        (this.itemForm.controls['DocumentTypeCode'].value ===
          DocumentEnumerator.SalesDelivery) ? this.itemForm.controls['hasSalesInvoices'].value : false,
        this.itemForm.controls['IsRestaurn'] ? this.itemForm.controls['IsRestaurn'].value : false);
    } else {
      itemPrice = new ItemPrice(this.itemForm.controls['DocumentTypeCode'].value, this.itemForm.controls['DocumentDate'].value,
        this.itemForm.controls['IdTiers'].value, dataItem, this.itemForm.controls['IdCurrency'].value,
        (this.itemForm.controls['DocumentTypeCode'].value ===
          DocumentEnumerator.SalesDelivery) ? this.itemForm.controls['hasSalesInvoices'].value : false,
        this.itemForm.controls['IsRestaurn'] ? this.itemForm.controls['IsRestaurn'].value : false);
    }

    return itemPrice;
  }
  /**
 * Set Remaining Quantity when quantity is updated
 * @param dataItem
 */
  setRemaining(dataItem) {
    if (this.itemForm.controls['DocumentTypeCode'].value === DocumentEnumerator.PurchaseDelivery
      && this.gridFormGroup.controls['MovementQty'].valid) {
      const remaining = ((+dataItem.RemainingQuantity) + (+dataItem.MovementQty)) -
        (+this.gridFormGroup.controls['MovementQty'].value);
      this.gridFormGroup.controls['RemainingQuantity'].setValue(remaining);
    }
  }

  public pageChange(event: PageChangeEvent): void {
    this.skip = event.skip;
    this.loadItems();
  }


  public setDocumentCodeAndIdAfterSave(data) {
    this.itemForm.controls['Id'].setValue(data.Id);
    this.itemForm.controls['Code'].setValue(data.Code);
    this.itemForm.controls['IdDocumentStatus'].setValue(documentStatusCode.Provisional);
  }
  public saveDocument(document: Document, isFirstCallToSaveDocument?: boolean) {
    document.IdUsedCurrency = this.itemForm.controls['IdCurrency'].value;
    document.Code = '';
    this.documentService.saveCurrentDocument(document).subscribe(x => {
      this.setDocumentCodeAndIdAfterSave(x);
      if (isFirstCallToSaveDocument !== true) {
        this.documentGridSetValues();
        // for search Item modal
        this.searchItemService.idDocument = x.Id;
        this.searchItemService.code = x.Code;
      } else {
        // for search Item modal
        this.documentService.getDocumentWithDocumentLine(x.Id).subscribe((data: Document) => {
          this.currentDocument = data
          if (this.itemForm.controls['DocumentTypeCode'] && (this.itemForm.controls['DocumentTypeCode'].value == DocumentEnumerator.PurchaseDelivery
            || this.itemForm.controls['DocumentTypeCode'].value == DocumentEnumerator.PurchaseInvoices) && data.ExchangeRate && data.ExchangeRate > 0) {
            this.itemForm.controls['ExchangeRate'].setValue(data.ExchangeRate);
          }
          this.setModalDetails(data);
        });
      }
    });
  }

  public setModalDetails(data) {
    this.idDocument = data.Id;
    this.searchItemService.idDocument = data.Id;
    this.searchItemService.code = data.Code;
    if (data.IdTiersNavigation) {
      this.searchItemService.idSupplier = data.IdTiersNavigation.Id;
      this.searchItemService.typeSupplier = data.IdTiersNavigation.IdTypeTiers;
      this.searchItemService.supplierName = data.IdTiersNavigation.Name;
    } else {
      this.tiersService.getById(this.itemForm.controls['IdTiers'].value).subscribe(x => {
        this.searchItemService.idSupplier = x.Id;
        this.searchItemService.typeSupplier = x.IdTypeTiers;
        this.searchItemService.supplierName = x.Name;
      });
    }
    this.searchItemService.disableFields = false;
    this.searchItemService.searchItemDocumentType = data.DocumentTypeCode;
    this.searchItemService.isFromSearchItem_supplierInetrface = false;
    if (this.itemForm.controls['DocumentOtherTaxesWithCurrency']) {

      this.itemForm.controls['DocumentOtherTaxesWithCurrency'].setValue(data.DocumentOtherTaxesWithCurrency);
    }
  }
  getSelectedCurrency() {
    this.formatFoSalesOptions = {
      style: 'currency',
      currency: this.localStorageService.getCurrencyCode(),
      currencyDisplay: 'symbol',
      minimumFractionDigits: this.localStorageService.getCurrencyPrecision()
    };
  }
  public saveDocumentAfterChoosingSupplier(isFirstCallToSaveDocument?: boolean) {
    if (this.itemForm && this.itemForm.controls['IdCurrency'].value != this.localStorageService.getCurrencyId()) {
      if (this.itemForm.controls['DocumentOtherTaxesWithCurrency']) {
        this.itemForm.controls['DocumentOtherTaxesWithCurrency'].setValue(0);
      }
    }
    const document: Document = this.itemForm.getRawValue();
    if (document.Id == NumberConstant.ZERO && this.itemForm.controls['FilesInfos']) {
      document.FilesInfos = this.itemForm.controls['FilesInfos'].value;
    }
    this.saveDocument(document, isFirstCallToSaveDocument);
    this.itemForm.controls['IdTiers'].disable();
    this.savedDocAfterChoosingSupplier = true;
  }
  public saveOrUpdateDocument() {
    if (this.itemForm.controls['Id'].value === 0) {
      this.saveDocumentAfterChoosingSupplier();
    } else {
      this.documentGridSetValues();
    }
  }

  public disableImportButton($event) {
    this.disableButtonImport = $event;
  }
  public disableImportOtherButton($event) {
    this.disableButtonImportOther = $event;
  }
  public onDocumentClick(e: any): void {
    if (!matches(e.target,
      'tbody *, .k-grid-toolbar .k-button, .k-grid-add-command, .k-link, .input-checkbox100, .label-checkbox100, .k-button.k-button-icon')
      && (e.target.parentElement && !matches(e.target.parentElement,
        '.k-grid-add-command, .k-animation-container, .k-animation-container-show, k-popup k-list-container k-reset'))
      && (e.composedPath().filter(x => x.tagName === 'MODAL-DIALOG').length === 0 &&
        e.composedPath().filter(x => x.className === 'modal').length === 0)
      && !e.target.className.includes('swal') && (this.documentType != DocumentEnumerator.PurchaseAsset
        && this.documentType != DocumentEnumerator.SalesAsset)) {
      this.cancelHandler();
    }
  }

  public destroy() {
    this.itemForm = undefined;
    this.searchItemService.closeModalAction(true);
  }

  public applyDiscountForAllDocumentLines() {
    if (this.itemForm.controls['Id'].value && this.itemForm.controls['Id'].value > 0) {

      if (this.genericDiscount > 100 || this.genericDiscount < 0) {
        this.growlService.warningNotification(this.translateService.instant('DISCOUNT_ERROR'));
      } else {
        this.documentService.applyDiscountForAllDocumentLines(this.genericDiscount, this.itemForm.controls['Id'].value)
          .subscribe((x: Document) => {
            x.DocumentDate = new Date(x.DocumentDate);
            x.DocumentInvoicingDate = new Date(x.DocumentInvoicingDate);
            this.itemForm.patchValue(x);
            this.loadItems();
            this.documentTaxeResume.splice(0,);
            x.DocumentTaxsResume.forEach(element => {
              this.documentTaxeResume.push(element);
            });
          });
      }
    }
  }
  public showDiscountForAll(): boolean {
    return (this.itemForm.controls['IdDocumentStatus'].value === documentStatusCode.Provisional ||
      (this.itemForm.controls['IdDocumentStatus'].value === documentStatusCode.DRAFT &&
        (!this.itemForm.controls['IsBToB'] || (this.itemForm.controls['IsBToB'] && !this.itemForm.controls['IsBToB'].value)))) ||
      ((this.updateValidDocumentRole && this.itemForm.controls['IdDocumentStatus'].value === documentStatusCode.Valid) &&
        (this.itemForm.controls['DocumentTypeCode'].value === DocumentEnumerator.SalesDelivery ||
          this.itemForm.controls['DocumentTypeCode'].value === DocumentEnumerator.BS ||
          this.itemForm.controls['DocumentTypeCode'].value === DocumentEnumerator.BE));
  }

  public deleteAll() {
    const Text = this.selectionId.length > 1 ? this.translateService.instant(SharedConstant.TEXT_SWAL_DELETE_ALL) : null;
    this.swalWarrings.CreateSwal(Text).then((result) => {
      if (result.value) {
        if (this.itemForm.controls['DocumentTypeCode'].value == DocumentEnumerator.SalesInvoices) {
          this.documentService.CheckInvoiceLinesToDelete(this.itemForm.controls['Id'].value, this.selectionId).subscribe(res => {
            if (res) {
              if ((res.DocToAsk == null || res.DocToAsk.length == 0)) {
                res.Document.DocumentDate = new Date(res.Document.DocumentDate);
                res.Document.DocumentInvoicingDate = new Date(res.Document.DocumentInvoicingDate);
                this.itemForm.patchValue(res.Document);
                this.loadItems(this.selectionId.length);
                this.selectionId = [];
                this.documentTaxeResume.splice(0,)
                res.Document.DocumentTaxsResume.forEach(element => {
                  this.documentTaxeResume.push(element);
                });
              } else if (res.DocToAsk && res.DocToAsk.length > 0) {
                let swalWarningMessage = `${this.translateService.instant("ALL_EXISTED_LINES_WILL_BE_DELETED")}`;
                if (res.DocToAsk.length == 1) {
                  swalWarningMessage = swalWarningMessage.replace('{code}', res.DocToAsk[0]);
                } else {
                  var code = res.DocToAsk[0];
                  for (let i = 1; i < res.DocToAsk.length; i++) {
                    code = code + ', ' + res.DocToAsk[i];
                  }
                  swalWarningMessage = swalWarningMessage.replace('{code}', code);
                }
                this.swalWarrings.CreateSwal(swalWarningMessage, "ITEM_SUPPRESSION").then((r) => {
                  if (r.value) {
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
                  } else if (res.DeletedLines && res.DeletedLines.length > 0) {
                    res.Document.DocumentDate = new Date(res.Document.DocumentDate);
                    res.Document.DocumentInvoicingDate = new Date(res.Document.DocumentInvoicingDate);
                    this.itemForm.patchValue(res.Document);
                    this.loadItems(this.selectionId.length);
                    this.selectionId = [];
                    this.documentTaxeResume.splice(0,)
                    res.Document.DocumentTaxsResume.forEach(element => {
                      this.documentTaxeResume.push(element);
                    });
                  }
                });
              }
            }
            });
            } else {
              if(this.itemForm.controls['DocumentTypeCode'].value == DocumentEnumerator.SalesDelivery && this.itemForm && 
              this.itemForm.controls['hasSalesInvoices'] && this.itemForm.controls['hasSalesInvoices'].value){
                this.growlService.ErrorNotification(this.translateService.instant(DocumentConstant.EXIST_SALES_INVOICE_LINE_ERROR));
              }else{
              this.documentService.deleteAll(this.selectionId, this.itemForm.controls['Id'].value).subscribe(x => {
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
            }
          }
          });
        }

  public showDeletBtn(): boolean {
    const index = this.selectionId.indexOf(undefined, 0);
    if (index > -1) {
      this.selectionId.splice(index, 1);
    }
    return ((this.selectionId.length > 0) && (this.showDiscountForAll()));
  }

  // validators of the control MovementQty
  public setQtyValidateor() {
    const maxValueMVq = (this.itemForm.controls['DocumentTypeCode'].value !== DocumentEnumerator.BS && this.itemForm.controls['DocumentTypeCode'].value !== DocumentEnumerator.PurchaseOrder) && this.gridFormGroup.controls['IdDocumentLineAssociated'] !== undefined
      && this.gridFormGroup.controls['IdDocumentLineAssociated'].value > 0 ?
      this.gridFormGroup.controls['RemainingQuantity'].value + this.gridFormGroup.controls['MovementQty'].value : NumberConstant.MAX_QUANTITY;
    this.gridFormGroup.controls['MovementQty']
      .setValidators([strictSup(0), isNumericWithPrecision(),
      maxQuantity(NumberConstant.NINETY_NINE_THOUSAND_NINE_HUNDRED_NINETY_NINE),
      digitsAfterComma(NumberConstant.FOUR)]);
  }
  // [Validators] The number of digits after comme of the control 'MovementQty'
  setDigitsComma(idMeasureUnit: number) {
    const maxValueMVq = (this.itemForm.controls['DocumentTypeCode'].value !== DocumentEnumerator.BS && this.itemForm.controls['DocumentTypeCode'].value !== DocumentEnumerator.PurchaseOrder) && this.gridFormGroup.controls['IdDocumentLineAssociated'] !== undefined
      && this.gridFormGroup.controls['IdDocumentLineAssociated'].value > 0 ?
      this.gridFormGroup.controls['RemainingQuantity'].value + this.gridFormGroup.controls['MovementQty'].value : NumberConstant.MAX_QUANTITY;
    this.measureUnitService.getById(idMeasureUnit).subscribe(data => {
      if (this.gridFormGroup) {
        if (data && data.IsDecomposable && data.DigitsAfterComma) {
          this.gridFormGroup.controls['MovementQty'].setValidators([strictSup(0),
          Validators.max(maxValueMVq),
          digitsAfterComma(data.DigitsAfterComma)]);
        } else {
          this.gridFormGroup.controls['MovementQty'].setValidators([minQuantity(NumberConstant.ONE),
          maxQuantity(NumberConstant.MAX_QUANTITY),
          Validators.pattern('^[0-9-]*')]);
        }
      }
    });
  }

  public ShowLastItemInBLOperations() { }
  abstract loadItems(linesDeletedNumber?: number, loadWithoutSaveDocumentLine?: boolean);
  public opneNextLineWithKeyBoard() { }
  public ifCanYouMoveToNexLine(): boolean { return false; }
  abstract setItemService(): void;
  abstract setWarehouseIfSalesDocument(idItem ? : number);
  abstract refreshDepotDropdownValues(idItem : number);
  abstract getItemPrices();
  abstract addDocumentLine($event: any);
  abstract ifSalesDocumentInSaveCurrent(data: DocumentLine);
  abstract closeEditor();
  abstract checkImpotedData();
  abstract saveCurrentLineWithDocument(data, isRemoved);
  abstract documentGridSetValues();
  abstract get isInEditingMode();
  abstract createFormOnCellHandler({ isEdited, dataItem, rowIndex }, SetedValue?: boolean, data?: any);
  public movementQtyFoucusOut() { };
}
