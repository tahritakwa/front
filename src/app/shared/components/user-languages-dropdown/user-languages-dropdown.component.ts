import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Languages } from '../../../models/enumerators/languages.enum';
import { EnumValues } from 'enum-values/src/enumValues';

@Component({
  selector: 'app-user-languages-dropdown',
  templateUrl: './user-languages-dropdown.component.html',
  styleUrls: ['./user-languages-dropdown.component.scss']
})
export class UserLanguagesDropdownComponent implements OnInit {

  @Input() form: FormGroup;
  public languagesDataSource: any[] = [];
  @Output() SelectedLanguage = new EventEmitter<boolean>();
  constructor(public translate: TranslateService) {
    const languagesEnum = EnumValues.getNamesAndValues(Languages);
    languagesEnum.sort((a, b) => this.translate.instant(a.name.toUpperCase()).localeCompare(this.translate.instant(b.name.toUpperCase())));
    languagesEnum.forEach(elem => {
      elem.name = elem.name.toUpperCase();
      this.translate.get(elem.name.toUpperCase()).subscribe(trans => elem.name = trans);
      this.languagesDataSource.push(elem);
    });
  }

  ngOnInit() {
  }
  onSelect($event) {
      this.SelectedLanguage.emit($event);
  }


}
