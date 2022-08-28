import { Resource } from '../shared/ressource.model';

export class Module extends Resource {
    IdModule: string;
    ModuleName: string;
    IdModuleParent: string;
    Class: string;
    Rank: number;
    InMenuList: boolean;
    DefaultRoute: string;
    Functionality: any;
    IdModuleParentNavigation: Module;
    InverseIdModuleParentNavigation: any;
}
