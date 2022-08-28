import { Component, ViewChild, Input, OnInit } from '@angular/core';
import {
  GridSalesInvoiceAssestsComponent
} from '../../../sales/components/grid-sales-invoice-assests/grid-sales-invoice-assests.component';
import { GridImportBlComponent } from '../grid-import-bl/grid-import-bl.component';
import { Document } from '../../../models/sales/document.model';
import { DocumentLine } from '../../../models/sales/document-line.model';
import { DocumentLinesWithPaging } from '../../../models/sales/document-lines-with-paging.model';
import { DocumentTaxsResume } from '../../../models/sales/document-Taxs-Resume.model';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { NumberConstant } from '../../../constant/utility/number.constant';

@Component({
  selector: 'app-grid-bs',
  templateUrl: './grid-bs.component.html',
  styleUrls: ['./grid-bs.component.scss']
})
export class GridBsComponent extends GridSalesInvoiceAssestsComponent implements OnInit {
  @Input() updateValidDocumentRole: boolean;
  @Input() hasAddLignePermission: boolean;
  @Input() documentTaxeResume: DocumentTaxsResume[];
  @Input() tierType;
  ShowImportButtonBS: boolean = true;
  ShowAddButtonBS: boolean = true;
  disableButtonImport: boolean;
  @ViewChild(GridImportBlComponent) importBlDocumentLines;
  public selectedLineBlList: DocumentLine[] = [];
  public idsSelectedBls: number[] = [];
  public updatePricePermission = false ;
  public updateDiscountPermission = false ;
  public deleteLinePermission = false ;
  public deleteMultipleLinePermission = false ;
  public importDeliveryPermission = false ;

  public ngOnInit(): void {
    this.updatePricePermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.UPDATE_STOCK_CORRECTION_PRICE);
    this.updateDiscountPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.UPDATE_STOCK_CORRECTION_DISCOUNT);
    this.deleteLinePermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.DELETE_LINE_STOCK_CORRECTION);
    this.deleteMultipleLinePermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.DELETE_MULTIPLE_LINES_STOCK_CORRECTION);
    this.importDeliveryPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.IMPORT_DELIVERY_EXIT_VOUCHERS) ;

    super.ngOnInit();
  }
  checkImportBL() {

    if (this.itemForm.valid) {
      this.noImport = true;
      if (this.importBlDocumentLines) {
        this.importBlDocumentLines.ngOnInit();
      }
    } else {
      this.validationService.validateAllFormFields(this.itemForm);
      this.noImport = false;
    }
  }

  importLineBl(dataToImport) {
    this.selectedLineBlList = dataToImport;
    if (this.selectedLineBlList && this.selectedLineBlList.length > 0) {
      if (this.itemForm.controls['Id'].value <= 0) {
        let document: Document = this.itemForm.getRawValue();
        document.IdUsedCurrency = this.itemForm.controls['IdCurrency'].value;
        document.Code = '';
        this.documentService.saveCurrentDocument(document).subscribe(x => {
          this.itemForm.controls['Id'].setValue(x.Id);
          this.itemForm.controls['Code'].setValue(x.Code);
          this.itemForm.controls['IdDocumentStatus'].setValue(this.DocumentStatusCode.Provisional);
          this.itemForm.controls['IdTiers'].disable();
          this.importOperation();
        });
      } else {
        this.importOperation();
      }
    }

  }
  initAddLine(rowIndex, dataItem) {
    super.initAddLine(rowIndex, dataItem);
  }
  importOperation() {
    let importedLine = this.selectedLineBlList.map(({ MovementQty, Id }) => ({ MovementQty, Id }));
    this.documentService.updateDocumentBSAfterImport(this.itemForm.controls['Id'].value, importedLine).subscribe(x => {
      this.recalculateBsAndBl();
    });
    this.service.DataToImport = new Array();
    this.service.otherData = new Array();

  }

  public saveCurrentLineinRealTime(dataItem?: DocumentLine, isRemoved?: boolean) {
    let itemPrice = this.prepareItemPrices(dataItem);
    itemPrice.DocumentLineViewModel.IdDocument = this.itemForm.controls['Id'].value;
    this.documentService.saveCurrentBSDocumentLine(itemPrice).toPromise().then(x => {
      if (x) {
        this.saveCurrentLineWithDocument(x.objectData, isRemoved);
        this.recalculateBsAndBl();
      } else {
        this.isAfterSave = false;
      }
      this.documentTaxeResume.splice(0,);
    x.objectData.IdDocumentNavigation.DocumentTaxsResume.forEach(element => {
      this.documentTaxeResume.push(element);
    });
    });
  }

  public loadItems(): void {
    const documentLinesWithPaging = new DocumentLinesWithPaging(this.itemForm.controls['Id'].value, this.pageSize, this.skip,
      null, null, true);
    documentLinesWithPaging.RefDescription = this.articleReference;
    this.documentService.getDocumentLinesWithPaging(documentLinesWithPaging).subscribe((x :any) => {
      this.isContainsLines=x.isContainsLines;
      this.view = {
        data: x.data,
        total: x.total
      };
      if (this.articleReference === '') {
        this.clearfilterfield();
      } else {
        this.filteritem();
      }
      if (this.view.total === 0) {
        this.ShowAddButtonBS = true;
        this.ShowImportButtonBS = true;
        this.itemForm.controls['IdTiers'].enable();
      } else {
        if (this.view.data[0].IdDocumentAssociated) {
          this.ShowAddButtonBS = false;
          this.ShowImportButtonBS = true;
        } else if (!this.view.data[0].IdDocumentAssociated) {
          this.ShowAddButtonBS = true;
          this.ShowImportButtonBS = false;
        }
        this.itemForm.controls['IdTiers'].disable();
      }
      this.opneNextLineWithKeyBoard();
    });
  }

  public setDisabled() {
    this.gridFormGroup.disable();
    this.gridFormGroup.controls['MovementQty'].enable();
    this.gridFormGroup.controls['DiscountPercentage'].enable();
    this.gridFormGroup.controls['IdItem'].enable();
    this.gridFormGroup.controls['IdWarehouse'].enable();
    if (this.gridFormGroup.controls['IdWarehouse'].value === 0) {
      this.gridFormGroup.controls['IdWarehouse'].setValue(null);
      this.gridFormGroup.controls['IdWarehouseNavigation'].setValue(null);
    }
    if (this.updateValidDocumentRole || !this.isSalesDocument) {
      this.gridFormGroup.controls['HtUnitAmountWithCurrency'].enable();
    }
  }

  recalculateBsAndBl() {
    this.documentService.updateDocumentInRealTime(this.itemForm.controls['Id'].value).toPromise().then(y => {
      y.objectData.DocumentDate = new Date(y.objectData.DocumentDate);
      if (y.objectData.IsAllLinesAreAdded === false) {
        this.growlService.ErrorNotification(this.translateService.instant('SOME_ITEMS_ARE_NOT_AVAILABLE_IN_STOCK'));
      }
      this.documentTaxeResume.splice(0,);
      y.objectData.DocumentTaxsResume.forEach(element => {
      this.documentTaxeResume.push(element);
    });
      this.itemForm.patchValue(y.objectData);
      this.loadItems();
    });
  }

  getIdsBls() {
    const distinctBl = this.selectedLineBlList.filter(
      (thing, i, arr) => arr.findIndex(t => t.IdDocument === thing.IdDocument) === i
    );
    this.idsSelectedBls = distinctBl.map(item => item.IdDocument);
  }

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

  public documentLineClickHandler({ isEdited, dataItem, rowIndex }, SetedValue?: boolean, data?: any): void {
    if (!dataItem.InverseIdDocumentLineAssociatedNavigation || dataItem.InverseIdDocumentLineAssociatedNavigation.length ==NumberConstant.ZERO) {
      super.documentLineClickHandler({ isEdited, dataItem, rowIndex }, SetedValue, data);
    }
  }
}
