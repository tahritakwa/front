import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-document-outstanding-type-dropdown',
  templateUrl: './document-outstanding-type-dropdown.component.html',
  styleUrls: ['./document-outstanding-type-dropdown.component.scss']
})
export class DocumentOutstandingTypeDropdownComponent implements OnInit {
  @Input() form: FormGroup;
  @Output() Selected = new EventEmitter<any>();
  typeDataSource = [];
  public outstandingDocumentTypeEnum = [
    {name: 'SALES_DELIVERY_FORM', value: 1 },
    {name: 'FINANCIAL_COMMITMENT', value: 2}
  ];
  // public outstandingDocumentTypeEnum = EnumValues.getNamesAndValues(OutstandingDocumentTypeEnumerator);
  constructor(public translate: TranslateService) {
  }
  ngOnInit() {
    const typeEnum = this.outstandingDocumentTypeEnum;
    typeEnum.forEach(elem => {
      this.translate.get(elem.name).subscribe(trans => elem.name = trans);
      this.typeDataSource.push(elem);
    });
  }
  onSelect($event) {
    this.Selected.emit($event);
  }
}
