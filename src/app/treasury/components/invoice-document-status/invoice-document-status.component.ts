import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { EnumValues } from 'enum-values';
import { documentStatusCode } from '../../../models/enumerators/document.enum';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-invoice-document-status',
  templateUrl: './invoice-document-status.component.html',
  styleUrls: ['./invoice-document-status.component.scss']
})
export class InvoiceDocumentStatusComponent implements OnInit {
  @Output() Selected = new EventEmitter<boolean>();
  public statusDataSource: any[] = [];
  constructor(public translate: TranslateService) { }

  ngOnInit() {
    this.initDataSource();
  }
  initDataSource() {
    const stateEnum = EnumValues.getNamesAndValues(documentStatusCode);
    stateEnum.forEach(elem => {
      if (elem.value === documentStatusCode.Valid || elem.value === documentStatusCode.PartiallySatisfied) {
        elem.name = elem.name.toUpperCase();
        this.translate.get(elem.name.toUpperCase()).subscribe(trans => elem.name = trans);
        this.statusDataSource.push(elem);
      }
    });
  }
  onSelect($event) {
    this.Selected.emit($event);
  }
}
