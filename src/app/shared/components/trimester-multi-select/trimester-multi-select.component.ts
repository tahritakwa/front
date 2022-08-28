import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Trimester } from '../../../models/enumerators/trimester.enum';
import { EnumValues } from 'enum-values';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-trimester-multi-select',
  templateUrl: './trimester-multi-select.component.html',
  styleUrls: ['./trimester-multi-select.component.scss']
})
export class TrimesterMultiSelectComponent implements OnInit {

  trimesterEnumValues = EnumValues.getNamesAndValues(Trimester);
  trimesters: any;
  selectedTrimesters = [];
  @Output() selected = new EventEmitter<any>();

  constructor(public translate: TranslateService) { }

  ngOnInit() {
    this.trimesters = [];
    this.trimesterEnumValues.forEach(element => {
      const elem = element;
      elem.name = this.translate.instant(elem.name.toUpperCase());
      this.trimesters.push(elem);
    });
  }

  public onSelect(): void {
    this.selected.emit(this.selectedTrimesters);
  }
}
