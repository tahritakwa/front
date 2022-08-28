import { Resource } from './ressource.model';

export class Entityhistory extends Resource {
  entityId: number;
  entityType: string;
  action: string;
  entityValue: string;
  lastModifiedBy: string;
  modifiedDate: any;
  modification: string;
  entityIdentifier: string;
}
