import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {SharedConstant} from '../../../constant/shared/shared.constant';
import {DataSourceRequestState} from '@progress/kendo-data-query';
import {NumberConstant} from '../../../constant/utility/number.constant';
import {GridSettings} from '../../../shared/utils/grid-settings.interface';
import {PageChangeEvent} from '@progress/kendo-angular-grid';

@Component({
  selector: 'app-pager-crm',
  templateUrl: './pager-crm.component.html',
  styleUrls: ['./pager-crm.component.scss']
})
export class PagerCrmComponent implements OnChanges {

  @Input() dataSource;
  @Output() pageChangeEvent = new EventEmitter<any>();
  @Output() stateChangeEvent = new EventEmitter<any>();
  private currentPage: number = NumberConstant.ONE;
  private pageSize: number = NumberConstant.TEN;
  pagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;

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
    this.currentPage = (event.skip / event.take) + NumberConstant.ONE;
    this.pageSize = event.take;
    this.pageChangeEvent.emit(this.currentPage);
  }

  dataStateChange(state) {
    this.gridSettings.state = state;
    this.stateChangeEvent.emit(state);
  }

  private checkIsFirstChange(changes: SimpleChanges) {
    if (changes.dataSource.isFirstChange()) {
      this.dataStateChange(this.gridState);
    }
  }
}
