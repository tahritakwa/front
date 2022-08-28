export class EquivalentItem {
  IdItem: number;
  Skip: number;
  PageSize: number;
  ListOfExisting: Array<number>;
  ValueToFind: string;
  /**
   *constructor
   */
  constructor(idItem: number,
    skip: number,
    pageSize: number, listOfExisting: Array<number>, valueToFind: string = undefined) {
    this.IdItem = idItem;
    this.Skip = skip;
    this.PageSize = pageSize;
    this.ListOfExisting = listOfExisting; 
    this.ValueToFind = valueToFind;
  }
  
}
