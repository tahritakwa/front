import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ComboBoxComponent} from '@progress/kendo-angular-dropdowns';
import {NumberConstant} from '../../../constant/utility/number.constant';
import {TranslateService} from '@ngx-translate/core';
import {SharedConstant} from '../../../constant/shared/shared.constant';

@Component({
  selector: 'app-boolean-filter-drop-down',
  templateUrl: './boolean-filter-drop-down.component.html',
  styleUrls: ['./boolean-filter-drop-down.component.scss']
})
export class BooleanFilterDropDownComponent implements OnInit {
  @ViewChild(ComboBoxComponent) public booleanFilter: ComboBoxComponent;
  @Input() label;
  @Input() group;
  @Output() selectedValue = new EventEmitter<boolean>();
  public values = [];
  public valueBooleanFilter;
  public nameLabelTrue;
  public nameLabelFalse;
  public nameLabelAll;

  constructor(private translate: TranslateService) {
  }

  onSelect($event) {
    this.valueBooleanFilter = this.values.filter(booleanItem => booleanItem.value === $event)[NumberConstant.ZERO];
    this.selectedValue.emit($event);
  }

  ngOnInit() {
    this.values = [
      {
        value: null,
        name: this.getNnameLabelAll(),
      },
      {
        value: true,
        name: this.getNameLabelTrue()
      },
      {
        value: false,
        name: this.getNameLabelFalse()
      }];
    this.valueBooleanFilter = this.values[NumberConstant.ZERO];
  }

  getNameLabelTrue(): string {
    return this.translate.instant(SharedConstant.IS).concat(' ', this.translate.instant(this.label));
  }

  getNameLabelFalse(): string {
    return this.translate.instant(SharedConstant.IS_NOT).concat(' ', this.translate.instant(this.label));
  }

  getNnameLabelAll(): string {
    return this.translate.instant(SharedConstant.ALL_STATUS);
  }
}
