import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  QueryList,
  SimpleChanges,
  ViewChildren
} from '@angular/core';
import {NumberConstant} from "../../../constant/utility/number.constant";
import {TranslateService} from "@ngx-translate/core";
import {SharedConstant} from "../../../constant/shared/shared.constant";
import {DashboardConstant} from "../../../constant/dashboard/dashboard.constant";

@Component({
  selector: 'app-combobox-filter',
  templateUrl: './combobox-filter.component.html',
  styleUrls: ['./combobox-filter.component.scss']
})
export class ComboboxFilterComponent implements OnInit {

  @ViewChildren("combobox") filter: QueryList<ElementRef>;

  @Input() dataList: any[];
  @Input() clearFilter: boolean;
  @Output() SelectedItemEvent = new EventEmitter<string>();
  public data: any[];
  placeholder: string;
  constructor(private translate: TranslateService) {

  }

  ngOnInit() {
    this.placeholder = this.translate.instant(DashboardConstant.EMPLOYEE_NAME);
    if (this.dataList) {
      this.data = this.dataList.slice();
    }
  }

  onSelect(item: string) {
    if(item && this.dataList.filter((s) => s.toLowerCase() === item.toLowerCase()).length > NumberConstant.ZERO){
      this.SelectedItemEvent.emit(item);
    }
  }

  handleFilter(value) {
    if (value.length > NumberConstant.ZERO) {
      this.dataList = this.dataList.filter((s) => s.toLowerCase().indexOf(value.toLowerCase()) !== -1);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.clearFilter && !changes.clearFilter.isFirstChange() ) {
      // @ts-ignore
      this.filter.first._value = null
    }
    this.dataList = changes.dataList.currentValue;
  }
}
