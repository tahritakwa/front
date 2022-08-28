import {Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewEncapsulation} from '@angular/core';
import {NumberConstant} from "../../../constant/utility/number.constant";
import {DataSourceRequestState} from "@progress/kendo-data-query";
import {FormGroup} from "@angular/forms";
import {TranslateService} from "@ngx-translate/core";
import {DashboardConstant} from "../../../constant/dashboard/dashboard.constant";
import {ComponentsConstant} from "../../../constant/shared/components.constant";
import {MultiSelectComponent} from "@progress/kendo-angular-dropdowns";

@Component({
  selector: 'app-multiselect-filter',
  templateUrl: './multiselect-filter.component.html',
  styleUrls: ['./multiselect-filter.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MultiselectFilterComponent implements OnInit {

  @Input() dataList;
  @Input() clearSelectedFilters;
  public dropdownSettings = {};
  public ShowFilter = true;
  public isOpen = false;
  @Input() public listSelected = [];
  public limitSelection = NumberConstant.ONE;
  public gridState: DataSourceRequestState = {
    skip: 0,
    take: 10,

    // Initial filter descriptor
    filter: {
      logic: 'and',
      filters: []
    }
  };
  @Output() newItemSelectedEvent = new EventEmitter<any[]>();

  constructor() {
  }

  ngOnInit() {
  }

  onValueChange() {
    this.newItemSelectedEvent.emit(this.listSelected);
  }

  public tagMapper(tags: any[]): any[] {
    return tags.length < NumberConstant.TWO ? tags : [tags];
  }

  public handleToggleClick(multiselect: MultiSelectComponent): void {
    multiselect.focus();
    multiselect.toggle(!this.isOpen);
    this.isOpen = !this.isOpen;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.clearSelectedFilters) {
      this.listSelected = [];
    }
  }

}

