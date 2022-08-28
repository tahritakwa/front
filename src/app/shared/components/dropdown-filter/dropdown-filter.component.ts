import { Component, OnInit, Input } from '@angular/core';
import { BaseFilterCellComponent, FilterService } from '@progress/kendo-angular-grid';
import { CompositeFilterDescriptor } from '@progress/kendo-data-query';

@Component({
  selector: 'app-dropdown-filter',
  templateUrl: './dropdown-filter.component.html',
  styleUrls: ['./dropdown-filter.component.scss']
})
export class DropdownFilterComponent extends BaseFilterCellComponent {

  public get selectedValue(): any {
      const filter = this.filterByField(this.valueField);
      return filter ? filter.value : null;
  }

  @Input() public filter: CompositeFilterDescriptor;
  @Input() public data: any[];
  @Input() public textField: string;
  @Input() public valueField: string;

  public get defaultItem(): any {
      return {
          [this.textField]: 'Select item...',
          [this.valueField]: null
      };
  }

  constructor(filterService: FilterService) {
      super(filterService);
  }

  public onChange(value: any): void {
      this.applyFilter(
          value === null ? // value of the default item
              this.removeFilter(this.valueField) : // remove the filter
              this.updateFilter({ // add a filter for the field with the value
                  field: this.valueField,
                  operator: 'eq',
                  value: value
              })
      ); // update the root filter
  }
}
