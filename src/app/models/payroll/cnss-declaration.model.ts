import { Resource } from '../shared/ressource.model';
import { Cnss } from './cnss.model';
import { CnssDeclarationSession } from './cnss-declaration-session.model';
import { Trimester } from '../enumerators/trimester.enum';

export class CnssDeclaration extends Resource {
    Code: string;
    Title: string;
    Trimester: Trimester;
    Year: number;
    CreationDate: Date;
    IdCnss: number;
    IdCnssNavigation: Cnss;
    CnssDeclarationSession: Array<CnssDeclarationSession>;
    State: boolean;
}
