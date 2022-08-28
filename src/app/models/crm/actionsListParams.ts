export class ActionsListParams {
  pageNumber: number;
  pageSize: number;
  searchValue: string;
  filterType: any;
  filterValue: any;
  commercialConcernedId: number;
  contactConcernedId: number;
  isArchived: boolean;
  sort: any;
  constructor(pageNumber?: number, pageSize?: number, searchValue?: string, isArchived?: boolean, filterType?: any, filterValue?: any, commercialId?: number,
  contactConcernedId?: number, sort?: any) {
    this.pageNumber = pageNumber;
    this.pageSize = pageSize;
    this.searchValue = searchValue;
    this.isArchived = isArchived;
    this.filterType = filterType;
    this.filterValue = filterValue;
    this.commercialConcernedId = commercialId;
    this.contactConcernedId = contactConcernedId;
    this.sort = sort;
  }

}
