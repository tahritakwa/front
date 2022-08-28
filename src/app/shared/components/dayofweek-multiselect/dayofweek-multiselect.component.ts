import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FormGroup } from '@angular/forms';
import { EnumValues } from 'enum-values';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { DayOfWeek } from '../../../models/enumerators/day-of-week.enum';

@Component({
  selector: 'app-dayofweek-multiselect',
  templateUrl: './dayofweek-multiselect.component.html',
  styleUrls: ['./dayofweek-multiselect.component.scss']
})
export class DayofweekMultiselectComponent implements OnInit {

  @Output() Selected = new EventEmitter<boolean>();
  @Input() allowCustom;
  @Input() form: FormGroup;
  public dayofweekDataSource: any[] = [];
  public dayofweekFiltredDataSource: any[] = [];
  public selectedValueMultiSelect = [];

  constructor(public translate: TranslateService) { }

  ngOnInit() {
    this.initDataSource();
  }

  initDataSource(): void {
    const dayOfWeekEnum = EnumValues.getNamesAndValues(DayOfWeek);
    dayOfWeekEnum.forEach(elem => {
      elem.name = elem.name.toUpperCase();
      this.translate.get(elem.name.toUpperCase()).subscribe(trans => elem.name = trans);
      this.dayofweekDataSource.push(elem);
    });
    this.dayofweekFiltredDataSource = this.dayofweekDataSource.slice(NumberConstant.ZERO);
  }

  handleFilter(value: string): void {
    this.dayofweekFiltredDataSource = this.dayofweekDataSource.filter((s) =>
      s.Name.toLowerCase().includes(value.toLowerCase()));
  }

  public onSelect($event): void {
    this.Selected.emit($event);
  }
}
