import { Component, OnInit, ComponentRef } from '@angular/core';
import { IModalDialog, IModalDialogOptions } from 'ngx-modal-dialog';
import { NegotitateQty } from '../../../models/purchase/negotitate-qty.model';
import { NegotitateQtyService } from '../../services/negotitate-qty/negotitate-qty.service';
import { PredicateFormat, Filter, Operation, Relation } from '../../../shared/utils/predicate';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DocumentLine } from '../../../models/sales/document-line.model';
import { ValidationService, digitsAfterComma, isNumeric, strictSup } from '../../../shared/services/validation/validation.service';
import { documentStatusCode } from '../../../models/enumerators/document.enum';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { PermissionConstant } from '../../../Structure/permission-constant';
@Component({
  selector: 'app-negotitate-qty',
  templateUrl: './negotitate-qty.component.html',
  styleUrls: ['./negotitate-qty.component.scss']
})
export class NegotitateQtyComponent implements IModalDialog, OnInit {

  documentLineDetails: DocumentLine;
  predicate: PredicateFormat;
  itemForm: FormGroup;
  isFinal: boolean;
  updatePurchaseOrderQuotation: boolean;
  // refreshQuotations = false;
  public statusCode = documentStatusCode;
  public formatOption : any;
  constructor(private negotitateQtyService: NegotitateQtyService, private formBuilder: FormBuilder,
    private validationService: ValidationService, private authService: AuthService) { }

  dialogInit(reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
    this.documentLineDetails = options.data.dataItem;
    if(options.data.formatOption){
      this.formatOption = options.data.formatOption;
    }
    
  }


  ngOnInit(): void {
    this.updatePurchaseOrderQuotation = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.UPDATE_ORDER_QUOTATION_PURCHASE);
    this.createAddForm();
    this.initDataSource();
    this.SetQtyValidators();
  }


  createAddForm() {
    this.itemForm = this.formBuilder.group(new NegotitateQty(this.documentLineDetails));
    this.itemForm.controls['Qty'].setValidators([Validators.min(this.documentLineDetails.MovementQty),
    Validators.max(NumberConstant.MAX_QUANTITY), Validators.required]);
    this.itemForm.controls['Price'].setValidators([strictSup(0), Validators.required]);
    this.itemForm.controls['QteSupplier'].setValidators([Validators.min(this.itemForm.controls['Qty'].value),
    Validators.max(NumberConstant.MAX_QUANTITY), Validators.required]);
    this.itemForm.controls['PriceSupplier'].setValidators([strictSup(0), Validators.required]);
  }

  initDataSource() {
    this.preparePredicate();
    this.negotitateQtyService.readPredicateData(this.predicate).subscribe(x => {
      if (this.documentLineDetails.IdDocumentLineStatus === this.statusCode.Provisional && this.updatePurchaseOrderQuotation) {
        this.itemForm.enable();
        if (x.length > 0) {
          this.itemForm.patchValue(x[0]);
          this.itemForm.controls['Qty'].disable();
          this.itemForm.controls['Price'].disable();
          this.isFinal = this.itemForm.controls['IsAccepted'].value || this.itemForm.controls['IsRejected'].value;
        } if (x.length === 0 || this.isFinal) {
          this.itemForm.controls['QteSupplier'].disable();
          this.itemForm.controls['PriceSupplier'].disable();
        }
      } else {
        this.itemForm.disable();
      }
    });
  }

  preparePredicate() {
    this.predicate = new PredicateFormat();
    this.predicate.Filter = new Array<Filter>();
    this.predicate.Relation = new Array<Relation>();
    this.predicate.Relation.push.apply(this.predicate.Relation, [new Relation('IdUserNavigation')]);
    this.predicate.Filter.push(
      new Filter('IdDocumentLine', Operation.eq, this.documentLineDetails.Id)
    );
  }

  saveNegotiation() {
    if (this.itemForm.valid) {
      this.negotitateQtyService.addNegotiationOption(this.itemForm.getRawValue()).subscribe(x => {
        this.negotitateQtyService.loadGridLinesAfterSavePrices(this.documentLineDetails.IdDocument);
        // this.refreshQuotations = true;
        // this.negotitateQtyService.show(this.refreshQuotations);
      });
    } else {
      this.validationService.validateAllFormFields(this.itemForm);
    }
  }

  acceptOrRejectPrice(isAccepted: boolean) {
    if (this.itemForm.valid) {
      this.itemForm.controls['IsAccepted'].setValue(isAccepted);
      this.itemForm.controls['IsRejected'].setValue(!isAccepted);
      this.negotitateQtyService.acceptOrRejectPrice(this.itemForm.getRawValue()).subscribe(x => {
        this.initDataSource();
        this.negotitateQtyService.loadGridLinesAfterSavePrices(this.documentLineDetails.IdDocument);
      });
    } else {
      this.validationService.validateAllFormFields(this.itemForm);
    }
  }
  SetQtyValidators() {
    if (this.documentLineDetails && this.documentLineDetails.IdMeasureUnitNavigation.IsDecomposable ) {
      this.itemForm.controls['Qty'].setValidators([ this.itemForm.controls['Qty'].validator,
      digitsAfterComma(this.documentLineDetails.IdMeasureUnitNavigation.DigitsAfterComma)]);
      this.itemForm.controls['QteSupplier'].setValidators([this.itemForm.controls['QteSupplier'].validator,
      digitsAfterComma(this.documentLineDetails.IdMeasureUnitNavigation.DigitsAfterComma)]);
    } else {
      this.itemForm.controls['Qty'].setValidators([ this.itemForm.controls['Qty'].validator,
      isNumeric()]);
      this.itemForm.controls['QteSupplier'].setValidators([this.itemForm.controls['QteSupplier'].validator,
      isNumeric()]);
    }
    if(this.documentLineDetails && this.documentLineDetails.IdDocumentNavigation && this.documentLineDetails.IdDocumentNavigation.IdTiersNavigation &&
      this.documentLineDetails.IdDocumentNavigation.IdTiersNavigation.FormatOption){
        this.itemForm.controls['Price'].setValidators([ this.itemForm.controls['Price'].validator,
      digitsAfterComma(this.documentLineDetails.IdDocumentNavigation.IdTiersNavigation.FormatOption.minimumFractionDigits)]);
      this.itemForm.controls['PriceSupplier'].setValidators([ this.itemForm.controls['PriceSupplier'].validator,
      digitsAfterComma(this.documentLineDetails.IdDocumentNavigation.IdTiersNavigation.FormatOption.minimumFractionDigits)]);
      }
  }

}
