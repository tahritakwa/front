import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ComboBoxComponent } from '@progress/kendo-angular-dropdowns';
import { SharedConstant } from '../../../../constant/shared/shared.constant';
import { DocumentType } from '../../../../models/sales/document-type.model';
import { DropDownComponent } from '../../../interfaces/drop-down-component.interface';
import { DocumentTypeService } from '../../../services/document/document-type.service';
import { OrderBy, OrderByDirection, PredicateFormat } from '../../../utils/predicate';

@Component({
  selector: 'app-document-type-dropdown',
  templateUrl: './document-type-dropdown.component.html',
  styleUrls: ['./document-type-dropdown.component.scss']
})
export class DocumentTypeDropdownComponent implements OnInit, DropDownComponent {
  @Input() allowCustom;
  @Input() form: FormGroup;
  @Input() selectedValue;
  @Output() selected = new EventEmitter<any>();
  @ViewChild('documentType') public documentTypeComboBox: ComboBoxComponent;
  public documentTypeDataSource: DocumentType[];
  constructor(private documentTypeService : DocumentTypeService) { }
 

 ngOnInit() {
    this.initDataSource();
  }


  public onSelect($event): void {
    this.selected.emit($event);
  }

  initDataSource(): void {
    this.documentTypeService.listdropdownWithPerdicate(this.preparePredicate()).subscribe((data: any) => {
      this.documentTypeDataSource = data.listData;
    });
  }
  preparePredicate(): PredicateFormat {
    const predicate = new PredicateFormat();
    predicate.OrderBy = new Array<OrderBy>();
    predicate.OrderBy.push(new OrderBy( SharedConstant.LABEL ,OrderByDirection.asc));
    return predicate;
  }


  /**
   * filter by name
   * @param value
   */
  /**
   * filter by code taxe and label
   * @param value
   */
  handleFilter(value: string): void {
    this.documentTypeDataSource = this.documentTypeDataSource.filter((s) =>
      s.Code.toLowerCase().includes(value.toLowerCase())
      || s.Description.toLowerCase().includes(value.toLowerCase()));
  }

  public openComboBox() {
    this.documentTypeComboBox.toggle(true);
  }
}
