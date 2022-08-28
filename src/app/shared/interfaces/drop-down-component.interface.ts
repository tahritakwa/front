/**
 * interface containes methodes to implement when creating new dropdown component
 *
 * */
export interface DropDownComponent {
  /**
   * get dropdwon data source
   * */
  initDataSource(paging?: boolean): void;
  /**
   * filter data source
   * @param value
   */
  handleFilter(value: string): void;
  /**
   * add new item to dropdown
   * */
 

}
