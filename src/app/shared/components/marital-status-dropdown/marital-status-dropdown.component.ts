import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { EnumValues } from 'enum-values';
import { MaritalStatusEnumerator } from '../../../models/enumerators/marital-status-enum';

@Component({
  selector: 'app-marital-status-dropdown',
  templateUrl: './marital-status-dropdown.component.html',
  styleUrls: ['./marital-status-dropdown.component.scss']
})
export class MaritalStatusDropdownComponent implements OnInit {

  @Input() form: FormGroup;
  maritalStatusEnumerator = EnumValues.getNamesAndValues(MaritalStatusEnumerator);
  maritalStatus: any;

  constructor(private translate: TranslateService) { }

  ngOnInit() {
    this.initMaritalStatusDataSource();
  }

  initMaritalStatusDataSource() {
    this.maritalStatus = [];
    this.maritalStatusEnumerator.sort((a,b)=>
     this.translate.instant(a.name.toUpperCase()).localeCompare(this.translate.instant(b.name.toUpperCase())));
    this.maritalStatusEnumerator.forEach(element => {
      const elem = element;
      elem.name = this.translate.instant(elem.name.toUpperCase());
      this.maritalStatus.push(elem);
    });

  }
}
