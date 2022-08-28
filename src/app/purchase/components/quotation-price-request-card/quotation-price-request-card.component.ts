import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { TiersService } from '../../services/tiers/tiers.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Tiers } from '../../../models/achat/tiers.model';
import { DocumentService } from '../../../sales/services/document/document.service';
import { ObjectToSave } from '../../../models/shared/objectToSend';
import { Document } from '../../../models/sales/document.model';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { DocumentEnumerator, documentStatusCode } from '../../../models/enumerators/document.enum';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { ActivatedRoute } from '@angular/router';
import { SupplierDropdownComponent } from '../../../shared/components/supplier-dropdown/supplier-dropdown.component';
import { PurchaseBudgetPriceRequest } from '../../../models/sales/purchase-budget-price-request.model';
import { PriceRequestService } from '../../services/price-request/PriceRequestService';
import { PurchaseRequestConstant } from '../../../constant/purchase/purchase-request.constant';
import {
  GridPurchaseInvoiceAssestsBudgetComponent
} from '../grid-purchase-invoice-assests-budget/grid-purchase-invoice-assests-budget.component';
import { CurrencyService } from '../../../administration/services/currency/currency.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-quotation-price-request-card',
  templateUrl: './quotation-price-request-card.component.html',
  styleUrls: ['./quotation-price-request-card.component.scss']
})
export class QuotationPriceRequestCardComponent implements OnInit {

  @ViewChild(GridPurchaseInvoiceAssestsBudgetComponent) public grid;
  @ViewChild(SupplierDropdownComponent) public supplierDropdown;
  @Output() deleteDocument: EventEmitter<number> = new EventEmitter();
  @Output() saveDocument: EventEmitter<number> = new EventEmitter();
  public formGroup: FormGroup;
  // Boolean Attributs to show data
  public showDetails = true;
  public showGrid = false;
  public index: number;
  public supplier: Tiers = new Tiers();
  idPriceRequest: number;
  public dataToUpdate: Document;
  private odbjetcToSave: ObjectToSave = new ObjectToSave();
  public purchaseBudgetPriceRequest: PurchaseBudgetPriceRequest;
  public showAndUpdate = true;
  // The name of section depend of the state of bonus selection
  BonusIsSelected = false;
  formatDate = this.translate.instant(SharedConstant.DATE_FORMAT);
  public documentsLine;
  public listSupllier: Array<number> = [];
  public statusCode = documentStatusCode;
  public formatOption;
  constructor(private supplierService: TiersService, private fb: FormBuilder,
    private serviceDocument: DocumentService, private activatedRoute: ActivatedRoute,
    private servicePriceRequest: PriceRequestService, protected currencyService: CurrencyService, private translate: TranslateService) {
    this.activatedRoute.params.subscribe(params => {
      this.idPriceRequest = params[SharedConstant.ID_LOWERCASE] || 0;
    });
  }
  selectedSupplier(event) {
    const id = event.IdTiers ? event.IdTiers.value : event;
    this.supplierService.getTiersById(id).subscribe(x => {
      if (x) {
        this.formGroup.controls[PurchaseRequestConstant.ID_CURRENCY].setValue(x.IdCurrency);
        this.formatOption = x.FormatOption;
        this.supplier = x;
        this.getCompanyParams();
      }
    });
    if (this.formGroup.controls[PurchaseRequestConstant.ID_TIERS].value) {
      this.purchaseBudgetPriceRequest = new PurchaseBudgetPriceRequest(this.idPriceRequest,
        this.formGroup.controls[PurchaseRequestConstant.ID_TIERS].value);
      this.servicePriceRequest.getPurchaseBudgetPriceRequest(this.purchaseBudgetPriceRequest).subscribe(x => {
        x = x.objectData;
        this.formGroup.controls['Id'].setValue(x.Id);
        this.formGroup.controls['Code'].setValue(x.Code);

        this.grid.loadItems();
        this.formGroup.controls[PurchaseRequestConstant.ID_TIERS].disable();
      });
    }
  }
  public createBudgetFormGroup() {
    this.formGroup = this.fb.group({
      Id: [0],
      IdTiers: [null, Validators.required],
      DocumentDate: [new Date()],
      IdCurrency: [{ value: '', disabled: true }, Validators.required],
      IdDocumentStatus: [1],
      Code: [''],
      DocumentTypeCode: [DocumentEnumerator.PurchaseBudget],
      DocumentHtpriceWithCurrency: [NumberConstant.ZERO],
      DocumentTotalVatTaxesWithCurrency: [NumberConstant.ZERO],
      DocumentTtcpriceWithCurrency: [NumberConstant.ZERO],
      DocumentTotalDiscountWithCurrency: [NumberConstant.ZERO],
      DocumentOtherTaxesWithCurrency: [NumberConstant.ZERO],
      DocumentTotalExcVatTaxesWithCurrency: [NumberConstant.ZERO],
      DocumentPriceIncludeVatWithCurrency: [NumberConstant.ZERO]
    });
  }
  ngOnInit(): void {
    this.createBudgetFormGroup();
    if (this.dataToUpdate !== undefined) {
      this.formGroup.patchValue(this.dataToUpdate);
      this.formGroup.controls[PurchaseRequestConstant.ID_CURRENCY].setValue(this.dataToUpdate.IdUsedCurrency);
        this.getCurrency(this.formGroup.controls[PurchaseRequestConstant.ID_CURRENCY].value);
      this.documentsLine = {
        data : this.dataToUpdate.DocumentLine,
        total : this.dataToUpdate.DocumentLine.length
      };
      this.supplier = this.dataToUpdate.IdTiersNavigation;
      this.formGroup.controls[PurchaseRequestConstant.ID_TIERS].disable();
      this.supplierDropdown.selectedValue = this.formGroup.controls[PurchaseRequestConstant.ID_TIERS].value;
    }
    this.showDetails = false;
  }

  public getDevisList() {
    this.grid.loadItems();
  }
  public getCompanyParams() {
    this.grid.getCompanyParams();
  }
  deleteCard() {
    this.deleteDocument.emit(this.index);
  }

  saveDocumentAction(dataOfQuotation) {
    this.grid.isNew = false;
    this.saveDocument.emit(dataOfQuotation);
    this.documentsLine = {
      data: dataOfQuotation,
      total: dataOfQuotation.length
    };
  }

  loadDocumentLines() {
    this.grid.loadItems();
  }
  getCurrency(idCurrency){
  this.currencyService.getById(idCurrency).subscribe(currency => {
    var documentCurrency = currency.Precision;
    this.formatOption = {
      style: 'currency',
      currency: currency.Code,
      currencyDisplay: 'symbol',
      minimumFractionDigits: documentCurrency
    };
  });
}

}
