import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {EnumValues} from 'enum-values';
import {ComboBoxComponent} from '@progress/kendo-angular-dropdowns';
import {DayOfWeek} from '../../../models/enumerators/day-of-week.enum';

const DAY_OF_WEEK_COMBOBOX = 'dayOfWeekComboBox';

@Component({
  selector: 'app-dayofweek-dropdown',
  templateUrl: './dayofweek-dropdown.component.html',
  styleUrls: ['./dayofweek-dropdown.component.scss']
})
export class DayofweekDropdownComponent implements OnInit {
  @Input() group;
  @Input() controlName;
  public dayOfWorkDataSource: any[] = [];
  @ViewChild(DAY_OF_WEEK_COMBOBOX) public dayOfWeekComboBox: ComboBoxComponent;
  public dayOfWeekDataSource: any[] = [];

  constructor(public translate: TranslateService) {
  }

  ngOnInit() {
    this.initDataSource();
  }

  initDataSource(): void {
    const dayOfWeekEnum = EnumValues.getNamesAndValues(DayOfWeek);
    dayOfWeekEnum.forEach(elem => {
      elem.name = elem.name.toUpperCase();
      this.translate.get(elem.name.toUpperCase()).subscribe(trans => elem.name = trans);
      this.dayOfWeekDataSource.push(elem);
    });
  }

  public openComboBox() {
    this.dayOfWeekComboBox.toggle(true);
  }
}
