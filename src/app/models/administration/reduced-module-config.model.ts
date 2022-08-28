import { Resource } from '../shared/ressource.model';

export class ReducedModuleConfig extends Resource {
  IdRoleConfig: number;
  IdModule: string;
  IdModuleNavigation: any;
  IsActive: boolean;
  IsVisible: boolean;
  IsIndeterminate: boolean;
  IsToCheckModule: boolean;
  IsToDisable: boolean;
}
