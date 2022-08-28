import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { DataSourceRequestState } from '@progress/kendo-data-query';
import { GridSettings } from '../../utils/grid-settings.interface';
import { PageChangeEvent } from '@progress/kendo-angular-grid';
import {isNotNullOrUndefinedAndNotEmptyValue} from '../../../stark-permissions/utils/utils';

@Component({
  selector: 'app-kendo-pager',
  templateUrl: './kendo-pager.component.html',
  styleUrls: ['./kendo-pager.component.scss']
})
export class KendoPagerComponent implements OnChanges {
  @Input() dataSource;
  @Output() pageChangeEvent = new EventEmitter<any>();
  @Output() stateChangeEvent = new EventEmitter<any>();
  @Input() pagerSettingsInput;
  pagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
  public pageSizes: any = this.pagerSettings.pageSizes;

  public gridState: DataSourceRequestState = {
    skip: NumberConstant.ZERO,
    take: NumberConstant.TEN,

    // Initial filter descriptor
    filter: {
      logic: 'and',
      filters: []
    }
  };
  public gridSettings: GridSettings = {
    state: this.gridState
  };

  ngOnChanges(changes: SimpleChanges) {
    if (changes.dataSource.currentValue !== undefined) {
      this.gridSettings = changes.dataSource.currentValue;
      this.stateChange(changes);
    }
    if (isNotNullOrUndefinedAndNotEmptyValue(changes.pagerSettingsInput) && changes.pagerSettingsInput.currentValue !== undefined) {
      this.pagerSettings = changes.pagerSettingsInput.currentValue;
      this.stateChange(changes);
    }
  }

  private stateChange(changes: SimpleChanges) {
    if (this.isDataAndTotalChanged(changes)) {
      this.gridState.skip = 0;
      this.dataStateChange(this.gridState);
    }
  }

  /**
   *
   * @param changes
   * compare current value and previous value to change grid state
   */
  private isDataAndTotalChanged(changes: SimpleChanges) {
    return changes.dataSource.previousValue !== undefined &&
      changes.dataSource.currentValue.gridData.data !== changes.dataSource.previousValue.gridData.data &&
      changes.dataSource.currentValue.gridData.total !== changes.dataSource.previousValue.gridData.total;
  }

  onPageChange(event: PageChangeEvent) {
    this.pageChangeEvent.emit(event);
  }

  dataStateChange(state) {
    this.gridSettings.state = state;
    this.stateChangeEvent.emit(state);
  }
}
