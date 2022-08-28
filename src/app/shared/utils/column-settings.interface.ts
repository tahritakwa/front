export interface ColumnSettings {
  field: string;
  title?: string;
  tooltip?: string;
  filter?: 'string' | 'numeric' | 'date' | 'boolean';
  format?: string;
  width?: number;
  _width?: number;
  filterable: boolean;
  orderIndex?: number;
  hidden?: boolean;
  editable?: boolean;
  locked?: boolean;
  isnumeric?: boolean;
}
