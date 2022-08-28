import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { EnumValues } from 'enum-values';
import { SharedConstant } from '../../constant/shared/shared.constant';
import { CreditTypeEnumerator } from '../../models/enumerators/credit-type.enum';

@Component({
  selector: 'app-credit-type-dropdown',
  templateUrl: './credit-type-dropdown.component.html',
  styleUrls: ['./credit-type-dropdown.component.scss']
})
export class CreditTypeDropdownComponent implements OnInit {

  @Input() group;
  @Input() disabled;
  @Input() isFromAdvancedFiltren = false;
  @Output() Selected = new EventEmitter<any>();
  public creditTypeDataSource: any[] = [];

  constructor(public translate: TranslateService) {
  }


  ngOnInit() {
    this.initDataSource();
  }

  initDataSource(): void {
    const creditTypeEnum = EnumValues.getNamesAndValues(CreditTypeEnumerator);
    creditTypeEnum.sort((a, b) =>
      this.translate.instant(a.name.toUpperCase()).localeCompare(this.translate.instant(b.name.toUpperCase())));
    creditTypeEnum.forEach(elem => {
      elem.name = elem.name.toUpperCase();
      this.translate.get(elem.name.toUpperCase()).subscribe(trans => elem.name = trans);
      this.creditTypeDataSource.push(elem);
    });    
    if(this.isFromAdvancedFiltren) {
      this.creditTypeDataSource.push({name: this.translate.instant(SharedConstant.ALL_UPPER), value: 3});
    }
  }

  onSelect(event) {
    this.Selected.emit(event);
  }
}
