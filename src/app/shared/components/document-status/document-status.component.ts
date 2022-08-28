import {Component, OnInit, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { EnumValues } from 'enum-values';
import { TranslateService } from '@ngx-translate/core';
import { documentStatusCodeToSearch, DocumentEnumerator } from '../../../models/enumerators/document.enum';
import { DocumentService } from '../../../sales/services/document/document.service';
import {ComboBoxComponent} from '@progress/kendo-angular-dropdowns';
import { RowFilterModule } from '@progress/kendo-angular-grid';

@Component({
  selector: 'app-document-status',
  templateUrl: './document-status.component.html',
  styleUrls: ['./document-status.component.scss']
})
export class DocumentStatusComponent implements OnInit {
  @Output() Selected = new EventEmitter<boolean>();
  @Input() statusList;
  @Input() form: FormGroup;
  @Input() documentType;
  @Input() isMovementDoc ;
  @Input() isControlDoc ;
  public statusDataSource: any[] = [];
  public selectedValue;
  public name;
  public administrationDocumentStatusEnumValues = EnumValues.getNamesAndValues(documentStatusCodeToSearch);
  @ViewChild(ComboBoxComponent) documentStatusComboBoxComonent: ComboBoxComponent;

  constructor(public translate: TranslateService, public documentService: DocumentService) {
  }

  ngOnInit() {
    this.initDataSource();
  }

  initDataSource(): void {
    const statusEnum = this.administrationDocumentStatusEnumValues;
    statusEnum.forEach(elem => {
      if (elem.value === documentStatusCodeToSearch.DRAFT) {
        if (this.documentType === DocumentEnumerator.SalesOrder || this.documentType === DocumentEnumerator.SalesInvoices || this.documentType === undefined) {
          this.pushItemInList(elem);
        }
      } else if(elem.value === documentStatusCodeToSearch.Refused){
        if(this.documentType === DocumentEnumerator.SalesOrder){
          this.pushItemInList(elem);
        }
      }
       else if (elem.value === documentStatusCodeToSearch.ECOMMERCE) {
        if (this.documentType === DocumentEnumerator.SalesDelivery) {
          this.pushItemInList(elem);
        }
      } else if ((elem.value === documentStatusCodeToSearch.Transferred || elem.value === documentStatusCodeToSearch.Received) &&
       this.isMovementDoc==true) {
          this.pushItemInList(elem);
      } else if (elem.value === documentStatusCodeToSearch.Balanced  ) {
        if(!this.isMovementDoc==true && this.documentType != DocumentEnumerator.SalesInvoices
          && this.documentType != DocumentEnumerator.PurchaseInvoices)
           this.pushItemInList(elem);
       }
        else {
        if (elem.value !== documentStatusCodeToSearch.TOTALLY_DELIVERED &&
          elem.value !== documentStatusCodeToSearch.PARTIALLY_DELIVERED &&
          elem.value !== documentStatusCodeToSearch.Transferred &&
          elem.value !== documentStatusCodeToSearch.Received  ) {
          //if (elem.value == documentStatusCodeToSearch.Provisional && this.documentType === DocumentEnumerator.SalesDelivery) {
          //  this.selectedValue = elem;
          //  this.onSelect(this.selectedValue.value);
          //}
          this.pushItemInList(elem);
        } else {
          if (((this.documentType === DocumentEnumerator.SalesInvoices || this.documentType === DocumentEnumerator.PurchaseInvoices) && (elem.value !== documentStatusCodeToSearch.Transferred &&
            elem.value !== documentStatusCodeToSearch.Received))
            || ((this.documentType === DocumentEnumerator.PurchaseFinalOrder || this.documentType === DocumentEnumerator.PurchaseOrder
              || this.documentType === DocumentEnumerator.SalesOrder|| this.documentType === DocumentEnumerator.SalesQuotations ||
              this.documentType === DocumentEnumerator.SalesDelivery)
              && elem.value === documentStatusCodeToSearch.PARTIALLY_DELIVERED)) {
              this.pushItemInList(elem);

          }
          if (this.documentType === DocumentEnumerator.SalesInvoiceAsset && elem.value == documentStatusCodeToSearch.TOTALLY_DELIVERED) {
            this.pushItemInList(elem);

           }
          if (this.isControlDoc ){
            this.pushItemInList(elem);
          }
        }
      }
    });
    //sort enum
    this.statusDataSource.sort((a,b)=> a.name.localeCompare(b.name));
  }
  onSelect($event) {
    this.Selected.emit($event);
  }
  public pushItemInList(elem) {
    elem.name = elem.name.toUpperCase();
    // change label names from balanced to totaly deliver
    if (elem.name === 'BALANCED') {
      if ((this.documentType === DocumentEnumerator.SalesOrder
        || this.documentType === DocumentEnumerator.PurchaseFinalOrder)) {
        elem.name = 'TOTALLY_DELIVERED';
      } else if ((this.documentType === DocumentEnumerator.SalesDelivery
        || this.documentType === DocumentEnumerator.PurchaseDelivery || this.documentType === DocumentEnumerator.BS)) {
        elem.name = 'CHARGED';
      } else if (this.documentType === DocumentEnumerator.SalesQuotations) {
        elem.name = 'ODREDER';
      } else if (this.documentType === DocumentEnumerator.PurchaseOrder) {
        elem.name = 'TOTALLY_ORDRED';
      } else if (this.documentType === DocumentEnumerator.SalesInvoices || this.documentType === DocumentEnumerator.PurchaseInvoices) {
        elem.name = 'CANCEL';
      }
    } else if (elem.name === 'TOTALLY_DELIVERED') {
      elem.name = 'TOTALLY_PAID';
    } else if (elem.name === 'PARTIALLY_DELIVERED') {
      if (this.documentType === DocumentEnumerator.PurchaseOrder || this.documentType === DocumentEnumerator.SalesQuotations) {
        elem.name = 'PARTIALLY_ORDRED';
      }else if(this.documentType === DocumentEnumerator.PurchaseInvoices || this.documentType === DocumentEnumerator.SalesInvoices){
        elem.name = 'PARTIALLY_PAID';
      } else if(this.documentType === DocumentEnumerator.SalesDelivery){
        elem.name = 'PARTIALLY_CHARGED'
      } else if (this.documentType !== DocumentEnumerator.PurchaseFinalOrder || DocumentEnumerator.SalesOrder) {
        elem.name = 'PARTIALLY_DELIVERED';
      }
    }
    if (elem.name === 'DRAFT' && this.documentType === DocumentEnumerator.SalesOrder) {
      elem.name = 'DRAFT_B2B';
    }
    if(elem.name === 'REFUSED'){
      elem.name = 'CANCELED'
    }
    if (this.isControlDoc && elem.name === 'TRANSFERRED'){
        elem.name='CHARGED'
    }
    if (this.isControlDoc && elem.name === 'RECEIVED'){
      elem.name='TOTALLY_ORDRED'
  }
    this.translate.get(elem.name.toUpperCase()).subscribe(trans => elem.name = trans);
    this.statusDataSource.push(elem);
  }
}
