import { FormGroup, FormControl } from '@angular/forms';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PredicateFormat, Filter, Relation, Operation } from '../../../shared/utils/predicate';
import { ReducedDocument } from '../../../models/sales/reduced-document.model';
import { DropDownComponent } from '../../../shared/interfaces/drop-down-component.interface';
import { WarehouseConstant } from '../../../constant/inventory/warehouse.constant';
import { DocumentConstant } from '../../../constant/sales/document.constant';
import { DocumentService } from '../../../sales/services/document/document.service';
import { isNullOrUndefined } from 'util';


const COUNT = 'Count';
const GET_PREDICATE = 'getDataDropdownWithPredicate';
const DOCUMENT_FOR_CLAIMS = 'getBLDropdownForClaims';
@Component({
  selector: 'app-bl-dropdown',
  templateUrl: './bl-dropdown.component.html',
  styleUrls: ['./bl-dropdown.component.scss']
})
export class BLDropdownComponent implements OnInit, DropDownComponent {
  @Input() parent: FormGroup;
  @Input() FromComponent: boolean;
  @Input() disabled: boolean;
  @Input() allowCustom = true;
  @Input() SelectedValue: number;
  @Input() ExternalDataSource: Array<ReducedDocument>;
  @Input() DocumentName = DocumentConstant.ID_DOCUMENT;
  @Input() DropdownPlaceholder;
  public documentDataSource: ReducedDocument[];
  public documentExternalDataSource: ReducedDocument[];
  public documentFiltredDataSource: ReducedDocument[];
  public listOfAllDocumentDataSource: ReducedDocument[];
  predicate: PredicateFormat;
  @Output() Selected = new EventEmitter<boolean>();
  @Output() Focused = new EventEmitter<boolean>();
  Document: any[];
  DocumentSelected;
  constructor(private documentService: DocumentService) {
  }

  preparePredicate(IdDocument?: any[]) {
    this.predicate = new PredicateFormat();
    this.predicate.Filter = new Array<Filter>();
    this.predicate.Relation = new Array<Relation>();
  }
  ngOnInit() {
    this.initDataSource();
    this.DocumentSelected = this.SelectedValue;
  }
  get IdDocument(): FormControl {
    return this.parent.get(DocumentConstant.ID_DOCUMENT) as FormControl;
  }

  preparePredicateForDocument(IdItem?: number) {
    this.predicate = new PredicateFormat();
    this.predicate.Filter = new Array<Filter>();
    this.predicate.Filter.push(new Filter(WarehouseConstant.ID_ITEM, Operation.eq, IdItem));
    this.predicate.Filter.push(new Filter(WarehouseConstant.IS_WAREHOUSE, Operation.eq, true));
    this.predicate.Relation = new Array<Relation>();
    this.predicate.Relation.push.apply(this.predicate.Relation, [new Relation(WarehouseConstant.ID_WAREHOUSE_NAVIGATION)]);
  }

  public initDataSource(): void {
    this.documentDataSource = this.documentExternalDataSource;
      this.listOfAllDocumentDataSource = this.documentExternalDataSource;
      if (!isNullOrUndefined(this.documentDataSource)) {
        this.documentFiltredDataSource = this.documentDataSource.slice(0);
      }
  }
  
  handleFilter(value: string): void {
    this.documentFiltredDataSource = this.ExternalDataSource.filter((s) =>
      ( !isNullOrUndefined(s.Code) && s.Code.toLowerCase().includes(value.toLowerCase()))
      || ( !isNullOrUndefined(s.Reference) && s.Reference.toLowerCase().includes(value.toLowerCase()) )
      ||  ( !isNullOrUndefined(s.Name) && s.Name.toLowerCase().includes(value.toLowerCase())));
  }

  addNew(): void {
    throw new Error('Method not implemented.');
  }

  onSelect($event) {
    this.Selected.emit($event);
  }
  
  public onFocus(event): void {
    this.Focused.emit(event);
  }

  public initDataSource2(): void {
    this.preparePredicate();
    const api = DOCUMENT_FOR_CLAIMS;
    this.documentService.callPredicateData(this.predicate, api).subscribe(data => {
      this.documentDataSource = data;
      this.listOfAllDocumentDataSource = data;
      this.documentFiltredDataSource = this.documentDataSource.slice(0);
    });
  }

  handleFilter2(value: string): void {
    this.documentFiltredDataSource = this.documentDataSource.filter((s) =>
      s.Reference.toLowerCase().includes(value.toLowerCase())
      || s.Name.toLocaleLowerCase().includes(value.toLowerCase()));
  }

}
