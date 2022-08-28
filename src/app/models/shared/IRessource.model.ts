export interface IResource {
  Id: number;
  parentId?: number;
  CanEdit?: boolean;
  CanDelete?: boolean;
  CanShow?: boolean;
  CanValidate?: boolean;
  CanPrint?: boolean;
}
