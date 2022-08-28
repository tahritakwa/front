import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { documentStatusCode, DocumentEnumerator } from '../../../../models/enumerators/document.enum';

@Component({
  selector: 'app-document-header',
  templateUrl: './document-header.component.html',
  styleUrls: ['./document-header.component.scss']
})
export class DocumentHeaderComponent implements OnInit {
  @Input() documentForm: FormGroup;
  public statusCode = documentStatusCode;

  documentEnumerator: DocumentEnumerator = new DocumentEnumerator();
  constructor() { }

  ngOnInit() {

  }
  public displayOnlyBalanced(): boolean {
    if ((this.documentForm.controls["DocumentTypeCode"].value
      === this.documentEnumerator.PurchaseDelivery || this.documentForm.controls["DocumentTypeCode"].value === this.documentEnumerator.SalesDelivery ||
      this.documentForm.controls["DocumentTypeCode"].value === this.documentEnumerator.BS || this.documentForm.controls["DocumentTypeCode"].value === this.documentEnumerator.SalesQuotations
      || this.documentForm.controls["DocumentTypeCode"].value === this.documentEnumerator.SalesOrder
      || this.documentForm.controls["DocumentTypeCode"].value === this.documentEnumerator.PurchaseFinalOrder || this.documentForm.controls["DocumentTypeCode"].value === this.documentEnumerator.PurchaseOrder)) {
      return false;
    } else {
      return true;
    }
  }
}
