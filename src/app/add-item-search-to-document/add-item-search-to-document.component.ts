import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { SearchItemService } from '../sales/services/search-item/search-item.service';
import { Document } from '../models/sales/document.model';
import { DocumentService } from '../sales/services/document/document.service';
import { PredicateFormat, Filter, Operation } from '../shared/utils/predicate';
import { ItemConstant } from '../constant/inventory/item.constant';
import { DocumentConstant } from '../constant/sales/document.constant';
import { documentStatusCode, DocumentEnumerator } from '../models/enumerators/document.enum';
import { SearchItemToGenerateDoc } from '../models/sales/search-item-to-generate-document';
import { SwalWarring } from '../shared/components/swal/swal-popup';
@Component({
  selector: 'app-add-item-search-to-document',
  templateUrl: './add-item-search-to-document.component.html',
  styleUrls: ['./add-item-search-to-document.component.scss']
})
export class AddItemSearchToDocumentComponent implements OnInit, OnDestroy {

  @Input() IdItemSelected: number;
  @Input() idDocument: number;
  @Input() documentType: string;
  @Input() qty: number;
  @Input() IdWarehouse: number;
  isTypeSelected: boolean;
  selectedType: string;
  isFromExsitingDocument: boolean;
  selectExistingDocument: boolean;
  isSelected = true;
  docuemntDataSource: Document[];
  doc: Document;
  docuemntFilterDataSource: Document[];
  predicate: PredicateFormat = new PredicateFormat();
  @ViewChild('searchItemRef') searchItemRef: ElementRef;
  constructor(private searchItemService: SearchItemService,
    private documentService: DocumentService, private swalWarrings: SwalWarring) {

  }


  ngOnInit() {
    this.searchItemService.isFromHandlerChange = false;
    this.searchItemService.idDocument = undefined;
    this.searchItemService.code = undefined;
    this.searchItemService.url = undefined;
    this.setDocumentType(this.documentType);
  }

  ngOnDestroy() {
    this.searchItemService.isFromHandlerChange = false;
  }

  public setDocumentType(documentType: string) {
    this.isTypeSelected = true;
    this.selectedType = documentType;
    if (!(this.isSelected)) {
      this.getExising(true);
    }
  }

  public getExising(changeDataSource?: boolean) {
    this.predicate = new PredicateFormat();
    if (!changeDataSource) {
      this.selectExistingDocument = !this.selectExistingDocument;
    }
    if (this.selectExistingDocument) {
      this.predicate.Filter = new Array<Filter>();
      this.predicate.Filter.push(
        new Filter(ItemConstant.ID_TIERS, Operation.eq, this.searchItemService.idSupplier)
      );
      this.predicate.Filter.push(
        new Filter(DocumentConstant.DOCUMENT_TYPE_CODE, Operation.eq, this.selectedType)
      );
      this.predicate.Filter.push(
        new Filter(DocumentConstant.ID_DOCUMENT_STATUS, Operation.eq, documentStatusCode.Provisional)
      );
      this.documentService.listdropdownWithPerdicate(this.predicate).subscribe((x: any) => {
        this.docuemntDataSource = x.listData;
        this.docuemntFilterDataSource = this.docuemntDataSource;
      });
    } else {
      this.docuemntDataSource = [];
      this.docuemntFilterDataSource = [];
      this.doc = undefined;
      this.idDocument = undefined;
    }
  }
  public generateDocument() {
    if (this.idDocument) {
      this.searchItemService.idDocument = this.idDocument;
    }
    this.searchItemService.isMoadlBtnFocus = false;
    if (this.selectedType === DocumentEnumerator.SalesQuotations) {
      this.searchItemService.url = DocumentConstant.SALES_QUOTATION_URL;
    } else {
      this.searchItemService.url = DocumentConstant.SALES_DELIVERY_URL;
    }
    this.searchItemService.addDocument(this.IdItemSelected, this.qty,
      this.IdWarehouse, this.selectedType);
  }

  handleFilter(value: string): void {
    this.docuemntFilterDataSource = this.docuemntDataSource.filter((s) =>
      s.Code.toLowerCase().includes(value.toLowerCase())
      || s.Code.toLocaleLowerCase().includes(value.toLowerCase()));
  }

  /**
  * on change
  * @param $event
  */
  handleChange($event): void {
    this.searchItemService.isFromHandlerChange = true;
    this.doc = this.docuemntFilterDataSource.find(x => x.Id === $event);
    if (this.doc) {
      this.idDocument = this.doc.Id;
    }
    this.docuemntFilterDataSource = this.docuemntDataSource.slice(0);
    this.isFromExsitingDocument = true;
  }
}
