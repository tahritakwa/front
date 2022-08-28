import { Resource } from '../shared/ressource.model';
import { CnssDeclaration } from './cnss-declaration.model';
import { Session } from './session.model';

export class CnssDeclarationSession extends Resource {
    IdSession: number;
    IdCnssDeclaration: number;
    DeletedToken: string;
    IdCnssDeclarationNavigation: CnssDeclaration;
    IdSessionNavigation: Session;
}
