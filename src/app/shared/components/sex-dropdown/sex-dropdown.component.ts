import {Component, Input, OnInit} from '@angular/core';
import {EnumValues} from 'enum-values';
import {DropDownComponent} from '../../../shared/interfaces/drop-down-component.interface';
import {TranslateService} from '@ngx-translate/core';
import { Gender } from '../../../models/enumerators/gender.enum';

@Component({
  selector: 'app-sex-dropdown',
  templateUrl: './sex-dropdown.component.html',
  styleUrls: ['./sex-dropdown.component.scss']
})
export class SexDropdownComponent implements OnInit, DropDownComponent {
  @Input() group;
  @Input() allowCustom;
  @Input() undetermined: boolean;
  @Input() disabled;

  public genderDataSource: any[] = [];
  public name;

  constructor(public translate: TranslateService) {
  }

  ngOnInit() {
    this.initDataSource();
  }

  initDataSource(): void {
    let genderEnum = EnumValues.getNamesAndValues(Gender);
    if (!this.undetermined) {
      genderEnum = genderEnum.filter(x => x.value !== Gender.MaleOrFemale);
    }
    genderEnum.sort((a, b) => this.translate.instant(a.name.toUpperCase()).localeCompare(this.translate.instant(b.name.toUpperCase())));
    genderEnum.forEach(elem => {
      elem.name = elem.name.toUpperCase();
      this.translate.get(elem.name.toUpperCase()).subscribe(trans => elem.name = trans);
      this.genderDataSource.push(elem);
    });
  }

  handleFilter(value: string): void {
    throw new Error('Method not implemented.');
  }

  addNew(): void {
    throw new Error('Method not implemented.');
  }
}
