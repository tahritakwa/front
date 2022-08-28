import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {RecruitmentPriority} from '../../../models/enumerators/recruitment-priority.enum';
import {EnumValues} from 'enum-values';
import {TranslateService} from '@ngx-translate/core';
import { ComboBoxComponent } from '@progress/kendo-angular-dropdowns';

@Component({
  selector: 'app-priority-dropdwon',
  templateUrl: './priority-dropdwon.component.html',
  styleUrls: ['./priority-dropdwon.component.scss']
})
export class PriorityDropdwonComponent implements OnInit {

  @Input() group;
  @Input() allowCustom;
  @Input() disabled: boolean;
  @Output() Selected: EventEmitter<any> = new EventEmitter();
  @ViewChild(ComboBoxComponent) public priorityDropdownComponent: ComboBoxComponent;
  public priorityDataSource: any;
  public priorityFilterDataSource: any;
  public name;
  priorityEnumValues = EnumValues.getNamesAndValues(RecruitmentPriority);

  constructor(public translateService: TranslateService) {
  }

  ngOnInit() {
    this.initDataSource();
  }

  initDataSource(): void {
    this.priorityDataSource = [];
    this.priorityEnumValues.forEach(element => {
      const elem = element;
      elem.name = this.translateService.instant(elem.name.toUpperCase());
      this.priorityDataSource.push(elem);
    });
  }

  /**
   * filter by code and label
   * @param value
   */
  handleFilter(value: string): void {
  }

  public onValueChanged(event): void {
    this.Selected.emit(event);
  }
}
