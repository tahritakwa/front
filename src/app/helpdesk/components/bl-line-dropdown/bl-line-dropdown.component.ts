import { FormGroup, FormControl } from '@angular/forms';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PredicateFormat, Filter, Relation, Operation } from '../../../shared/utils/predicate';
import { Document } from '../../../models/sales/document.model';
import { DropDownComponent } from '../../../shared/interfaces/drop-down-component.interface';
import { WarehouseConstant } from '../../../constant/inventory/warehouse.constant';
import { DocumentConstant } from '../../../constant/sales/document.constant';
import { isNullOrUndefined } from 'util';
import { ReducedDocumentLine } from '../../../models/sales/reduced-document-line.model';


@Component({
  selector: 'app-bl-line-dropdown',
  templateUrl: './bl-line-dropdown.component.html',
  styleUrls: ['./bl-line-dropdown.component.scss']
})
export class BLLineDropdownComponent implements OnInit, DropDownComponent {
  @Input() parent: FormGroup;
  @Input() FromComponent: boolean;
  @Input() disabled: boolean;
  @Input() allowCustom = true;
  @Input() SelectedValue: number;
  @Input() ExternalDataSource: Array<ReducedDocumentLine>;
  //RefDesignation
  @Input() DocumentLineName = DocumentConstant.ID_DOCUMENT;
  public documentLineDataSource: ReducedDocumentLine[];
  public documentLineExternalDataSource: ReducedDocumentLine[];
  public documentLineFiltredDataSource: ReducedDocumentLine[];
  public listOfAllDocumentLineDataSource: ReducedDocumentLine[];
  predicate: PredicateFormat;
  @Output() Selected = new EventEmitter<boolean>();
  @Output() Focused = new EventEmitter<boolean>();
  Document: any[];
  
  DocumentLineSeleted;
  constructor() {
  }

  preparePredicate() {
    
    this.predicate = new PredicateFormat();
    this.predicate.Filter = new Array<Filter>();
    
    this.predicate.Relation = new Array<Relation>();
  }
  ngOnInit() {
    this.initDataSource();
    this.DocumentLineSeleted = this.SelectedValue;
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
    this.documentLineDataSource = this.documentLineExternalDataSource;
      this.listOfAllDocumentLineDataSource = this.documentLineExternalDataSource;
      if (!isNullOrUndefined(this.documentLineDataSource)) {
        this.documentLineFiltredDataSource = this.documentLineDataSource.slice(0);
      }
  }
  
  handleFilter(value: string): void {
    this.documentLineFiltredDataSource = this.ExternalDataSource.filter((s) =>
    ( !isNullOrUndefined(s.CodeDocumentLine) && s.CodeDocumentLine.toLowerCase().includes(value.toLowerCase()))
    || ( !isNullOrUndefined(s.RefDesignation) && s.RefDesignation.toLowerCase().includes(value.toLowerCase()))
    || ( !isNullOrUndefined(s.Designation) && s.Designation.toLowerCase().includes(value.toLowerCase()))
     );
  }

  addNew(): void {
    throw new Error('Method not implemented.');
  }

  public onSelect($event) {
    this.Selected.emit($event);
  }

  public onFocus(event): void {
    this.Focused.emit(event);
  }



}
