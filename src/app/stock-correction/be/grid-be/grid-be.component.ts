import { Component, OnInit, Input } from '@angular/core';
import {
  GridPurchaseInvoiceAssestsBudgetComponent
} from '../../../purchase/components/grid-purchase-invoice-assests-budget/grid-purchase-invoice-assests-budget.component';
import { DocumentLinesWithPaging } from '../../../models/sales/document-lines-with-paging.model';
import { DocumentTaxsResume } from '../../../models/sales/document-Taxs-Resume.model';
import { PermissionConstant } from '../../../Structure/permission-constant';
@Component({
  selector: 'app-grid-be',
  templateUrl: './grid-be.component.html',
  styleUrls: ['./grid-be.component.scss']
})
export class GridBeComponent extends GridPurchaseInvoiceAssestsBudgetComponent implements OnInit {
  @Input() updateValidDocumentRole: boolean;
  @Input() hasAddLignePermission: boolean;
  @Input() documentTaxeResume: DocumentTaxsResume[];
  @Input() tierType;
  public updatePricePermission = false ;
  public updateDiscountPermission = false ;
  public deleteLinePermission = false ;
  public deleteMultipleLinePermission = false ;
  public ngOnInit(): void {
    this.updatePricePermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.UPDATE_STOCK_CORRECTION_PRICE);
    this.updateDiscountPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.UPDATE_STOCK_CORRECTION_DISCOUNT);
    this.deleteLinePermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.DELETE_LINE_STOCK_CORRECTION);
    this.deleteMultipleLinePermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.DELETE_MULTIPLE_LINES_STOCK_CORRECTION);

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


  /**qty key press start*/
  public movementQtyFoucusOut() {
    const mvq = document.getElementsByName('HtUnitAmountWithCurrency')[0] as any;
    if (mvq) {
      mvq.select();
      mvq.focus();
    }
  }
  /**qty key press end*/

  /**htUnitAmountWithCurrencyFoucusOut key press start*/
  htUnitAmountWithCurrencyArrowLeftPress() {
    const MovementQty = document.getElementsByName('MovementQty')[0] as any;
    if (MovementQty) {
      if (MovementQty && MovementQty.disabled === false) {
        this.selectMvtQty();
      }
    }
  }

  htUnitAmountWithCurrencyArrowRigthPress() {
    const DiscountPercentage = document.getElementsByName('DiscountPercentage')[0] as any;
    if (DiscountPercentage && DiscountPercentage.disabled === false) {
      DiscountPercentage.focus();
      DiscountPercentage.select();
    }
  }
  /**htUnitAmountWithCurrencyFoucusOut key press end*/



  /**DiscountPercentage key press start*/
  discountPercentageArrowLeftPress() {
    this.movementQtyFoucusOut();
  }
  public loadItems(linesDeletedNumber?: number ,loadWithoutSaveDocumentLine?: boolean): void {
    this.grid.loading = true;
    const documentLinesWithPaging = new DocumentLinesWithPaging(this.itemForm.controls['Id'].value, this.pageSize,
      this.skip, null, null, false, this.predicate);
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
      this.getItemsOperation(loadWithoutSaveDocumentLine);
      this.grid.loading = false;
    });
  }

}
