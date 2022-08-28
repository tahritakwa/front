import {  DataResult, DataSourceRequestState } from '@progress/kendo-data-query';
import { ColumnSettings } from './column-settings.interface';

export interface GridSettings {
  columnsConfig?: ColumnSettings[];
  state: DataSourceRequestState;
  gridData?: DataResult;
}
