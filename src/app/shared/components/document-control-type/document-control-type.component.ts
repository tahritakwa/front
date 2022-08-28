import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { EnumValues } from 'enum-values';
import { TranslateService } from '@ngx-translate/core';
import { documentStatusCodeToSearch, DocumentEnumerator, DocumentTypesEnumerator } from '../../../models/enumerators/document.enum';
import { DocumentService } from '../../../sales/services/document/document.service';

@Component({
  selector: 'app-document-control-type',
  templateUrl: './document-control-type.component.html',
  styleUrls: ['./document-control-type.component.scss']
})

export class DocumentControlTypeComponent implements OnInit {
  @Output() Selected = new EventEmitter<boolean>();
  @Input() typeList;
  @Input() form: FormGroup;
  public DocumentControlTypeDataSource: any[] = [];
  public documentControlTypeList: any [] = [];
  public selectedValue;
  public name;
  public administrationDocumentStatusEnumValues = EnumValues.getNamesAndValues(documentStatusCodeToSearch);
  public value: any = [];

  constructor(public translate: TranslateService, public documentService: DocumentService) {
  }

  ngOnInit() {
    this.initDataSource();
  }



  initDocTypeList()
  {
    this.documentControlTypeList = [
      { name: 'SUPPLIER_ASSET', id: DocumentTypesEnumerator.SUPPLIER_ASSET, value: DocumentTypesEnumerator.SUPPLIER_ASSET},
      { name: 'CUSTOMER_ASSET', id: DocumentTypesEnumerator.CUSTOMER_ASSET, value: DocumentTypesEnumerator.CUSTOMER_ASSET},
      { name: 'BE', id: DocumentTypesEnumerator.BE, value: DocumentTypesEnumerator.BE},
      { name: 'PURCHASE_QUOTATION', id: DocumentTypesEnumerator.PURCHASE_QUOTATION, value: DocumentTypesEnumerator.PURCHASE_QUOTATION},
      { name: 'BS', id: DocumentTypesEnumerator.BS, value: DocumentTypesEnumerator.BS},
      { name: 'RECEIPT', id: DocumentTypesEnumerator.RECEIPT, value: DocumentTypesEnumerator.RECEIPT},
      { name: 'DELIVERY_FORM', id: DocumentTypesEnumerator.DELIVERY_FORM, value: DocumentTypesEnumerator.DELIVERY_FORM},
      { name: 'FINAL_ORDER', id: DocumentTypesEnumerator.PURCHASE_FINAL_ORDER, value: DocumentTypesEnumerator.PURCHASE_FINAL_ORDER},
      { name: 'PURCHASE_INVOICE', id: DocumentTypesEnumerator.PURCHASE_INVOICE, value: DocumentTypesEnumerator.PURCHASE_INVOICE},
      { name: 'SALES_INVOICE', id: DocumentTypesEnumerator.SALES_INVOICE, value: DocumentTypesEnumerator.SALES_INVOICE},
      { name: 'PURCHASE_ORDER', id: DocumentTypesEnumerator.PURCHASE_ORDER, value: DocumentTypesEnumerator.PURCHASE_ORDER},
      { name: 'SALES_ORDER', id: DocumentTypesEnumerator.SALES_ORDER, value: DocumentTypesEnumerator.SALES_ORDER},
      { name: 'SALES_QUOTATION', id: DocumentTypesEnumerator.SALES_QUOTATION, value: DocumentTypesEnumerator.SALES_QUOTATION},
      //{ name: 'PURCHASE_REQUEST', id: DocumentTypesEnumerator.PURCHASE_REQUEST, value: DocumentTypesEnumerator.PURCHASE_REQUEST},
      //{ name: 'PURCHASE_TERMBILLING_INVOICE', id: DocumentTypesEnumerator.PURCHASE_TERMBILLING_INVOICE, value: DocumentTypesEnumerator.PURCHASE_TERMBILLING_INVOICE},
      //{ name: 'SALES_TERMBILLING_INVOICE', id: DocumentTypesEnumerator.SALES_TERMBILLING_INVOICE, value: DocumentTypesEnumerator.SALES_TERMBILLING_INVOICE},
      //{ name: 'PURCHASE_ASSET_INVOICE', id: DocumentTypesEnumerator.PURCHASE_ASSET_INVOICE, value: DocumentTypesEnumerator.PURCHASE_ASSET_INVOICE},
      { name: 'ALL_ASSETS_FINACIAL', id: DocumentTypesEnumerator.ALL_ASSETS_FINACIAL, value: DocumentTypesEnumerator.ALL_ASSETS_FINACIAL},
      { name: 'SALES_ASSET_INVOICE', id: DocumentTypesEnumerator.SALES_ASSET_INVOICE, value: DocumentTypesEnumerator.SALES_ASSET_INVOICE}
      //{ name: 'PURCHASE_CASH_INVOICE', id: DocumentTypesEnumerator.PURCHASE_CASH_INVOICE, value: DocumentTypesEnumerator.PURCHASE_CASH_INVOICE},
      //{ name: 'SALES_CASH_INVOICE', id: DocumentTypesEnumerator.SALES_CASH_INVOICE, value: DocumentTypesEnumerator.SALES_CASH_INVOICE}
    ];
    
    return this.documentControlTypeList;
  }

  initDataSource(): void {
    const statusEnum = this.initDocTypeList();

    statusEnum.forEach(elem => {
      this.pushItemInList(elem);
    });
  }

  public pushItemInList(elem) {
    elem.name = elem.name.toUpperCase();
    this.translate.get(elem.name.toUpperCase()).subscribe(trans => elem.name = trans);
    this.DocumentControlTypeDataSource.push(elem);
  }

  onSelect($event) {
    this.Selected.emit($event);
    this.value = $event;
  }

  public isItemSelected(itemValue: string): boolean {
    return this.value.some(item => item === itemValue);
  }
  /**
   * filter by name
   * @param value
   */
  handleFilter(value: string) {
    this.DocumentControlTypeDataSource = this.documentControlTypeList.filter((s) =>
      s.name.toLowerCase().includes(value.toLowerCase())
    );
  }
  
}
