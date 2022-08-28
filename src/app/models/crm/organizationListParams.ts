export class OrganizationListParams {
  pageNumber: number;
  pageSize: number;
  searchValue: string;
  filterType: any;
  filterValue: any;
  isArchived: boolean;

  constructor(pageNumber?: number, pageSize?: number, searchValue?: string, filterType?: any, filterValue?: any, isArchived?: boolean
  ) {
    this.pageNumber = pageNumber;
    this.pageSize = pageSize;
    this.searchValue = searchValue;
    this.filterType = filterType;
    this.filterValue = filterValue;
    this.isArchived = isArchived;
  }
}
