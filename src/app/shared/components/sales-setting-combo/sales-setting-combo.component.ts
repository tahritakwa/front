import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { PredicateFormat } from '../../utils/predicate';
import { SalesSettingsService } from '../../../sales/services/sales-settings/sales-settings.service';
import { Subscription } from 'rxjs/Subscription';
import { DocumentConstant } from '../../../constant/sales/document.constant';
import { PurchaseSettingsService } from '../../../purchase/services/purchase-settings/purchase-settings.service';
import { DocumentEnumerator, DocumentTypesEnumerator } from '../../../models/enumerators/document.enum';
import { ReducedCompany } from '../../../models/administration/reduced-company.model';
import { TiersConstants } from '../../../constant/purchase/tiers.constant';


@Component({
  selector: 'app-sales-setting-combo',
  templateUrl: './sales-setting-combo.component.html',
  styleUrls: ['./sales-setting-combo.component.scss']
})
export class SalesSettingComboComponent implements OnInit {
  @Input() itemForm: FormGroup;
  @Input() formatOptions: any;
  @Input() type: string;
  @Input() isSalesDocumment: boolean = false;
  @Input() idCompanyCurrency: number;
  @Input() documentType : string;
  @Output() otherTaxeValueChange = new EventEmitter<boolean>();
  predicate: PredicateFormat;
  salesSettings: number;
  private dataSubscription: Subscription;
  @Input() companyDetails: ReducedCompany;
  constructor(private salesService: SalesSettingsService, private purchaseService: PurchaseSettingsService) { }

  ngOnInit() {
    this.itemForm.controls[DocumentConstant.DOCUMENT_OTHER_TAX_WITH_CURRENCY].setValue(0);
  }
  public getTaxeSetting(idDocumentCurrency) {
    if (idDocumentCurrency !== this.idCompanyCurrency) {
      this.itemForm.controls[DocumentConstant.DOCUMENT_OTHER_TAX_WITH_CURRENCY].setValue(0);
    }
    else {
        if (this.isSalesDocumment) {
          this.dataSubscription = this.salesService.list().subscribe(data => {
            this.itemForm.controls[DocumentConstant.DOCUMENT_OTHER_TAX_WITH_CURRENCY].setValue(Number(data[0].SaleOtherTaxes));
          });
        } else {
          this.dataSubscription = this.purchaseService.list().subscribe(data => {
            this.itemForm.controls[DocumentConstant.DOCUMENT_OTHER_TAX_WITH_CURRENCY].setValue(Number(data[0].PurchaseOtherTaxes));
          });
        }
    }
  }
  changeOtherTaxes($event): void {
    this.otherTaxeValueChange.emit($event);
  }
  tierSelected(data :any){
    if(data){
      if(this.documentType == DocumentEnumerator.SalesInvoices || this.documentType == DocumentEnumerator.PurchaseInvoices || this.documentType == DocumentEnumerator.SalesInvoiceAsset)
      {
        if (this.itemForm.controls[DocumentConstant.ID_DOCUMENT].value === 0 && data.selectedTiers && data.selectedTiers.IdTaxeGroupTiers == TiersConstants.NO_EXONORE){
          this.itemForm.controls[DocumentConstant.DOCUMENT_OTHER_TAX_WITH_CURRENCY].setValue(this.companyDetails.FiscalStamp);
        }
        else {
          this.itemForm.controls[DocumentConstant.DOCUMENT_OTHER_TAX_WITH_CURRENCY].setValue(0);
        }
      }
    }
  }
}
